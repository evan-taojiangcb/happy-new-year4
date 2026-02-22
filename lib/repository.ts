import { randomUUID } from "crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { THIRTY_DAYS_SECONDS } from "@/lib/constants";
import type { CreateWishInput, ListWishesResult, Wish } from "@/lib/types";

type WishRepository = {
  listActive: (limit: number, nextToken?: string) => Promise<ListWishesResult>;
  countActiveByUser: (userId: string) => Promise<number>;
  create: (input: CreateWishInput) => Promise<Wish>;
  releaseAll: () => Promise<number>;
};

const inMemoryWishes: Wish[] = [];

function encodeToken(lastIndex: number): string {
  return Buffer.from(String(lastIndex)).toString("base64");
}

function decodeToken(token?: string): number {
  if (!token) {
    return 0;
  }

  const parsed = Number(Buffer.from(token, "base64").toString("utf8"));
  return Number.isNaN(parsed) ? 0 : parsed;
}

const memoryRepository: WishRepository = {
  async listActive(limit, nextToken) {
    const offset = decodeToken(nextToken);
    const active = inMemoryWishes
      .filter((w) => w.status === "active")
      .sort((a, b) => b.createdAt - a.createdAt);
    const slice = active.slice(offset, offset + limit);
    const hasMore = offset + limit < active.length;
    return {
      wishes: slice,
      nextToken: hasMore ? encodeToken(offset + limit) : null
    };
  },

  async countActiveByUser(userId) {
    return inMemoryWishes.filter((w) => w.userId === userId && w.status === "active").length;
  },

  async create(input) {
    const createdAt = Date.now();
    const wish: Wish = {
      wishId: randomUUID(),
      userId: input.userId,
      nickname: input.nickname,
      content: input.content,
      contact: input.contact,
      gender: input.gender,
      createdAt,
      status: "active",
      ttl: Math.floor(createdAt / 1000) + THIRTY_DAYS_SECONDS
    };
    inMemoryWishes.push(wish);
    return wish;
  },

  async releaseAll() {
    let count = 0;
    inMemoryWishes.forEach((wish) => {
      if (wish.status === "active") {
        wish.status = "released";
        count += 1;
      }
    });
    return count;
  }
};

function getDynamoRepository(): WishRepository {
  const tableName = process.env.DYNAMODB_TABLE ?? "Wishes";
  const client = new DynamoDBClient({ region: process.env.REGION ?? "ap-northeast-1" });
  const docClient = DynamoDBDocumentClient.from(client);

  return {
    async listActive(limit, nextToken) {
      const startKey = nextToken ? JSON.parse(Buffer.from(nextToken, "base64").toString("utf8")) : undefined;
      const result = await docClient.send(
        new QueryCommand({
          TableName: tableName,
          IndexName: "StatusCreatedAtIndex",
          KeyConditionExpression: "#status = :status",
          ExpressionAttributeNames: { "#status": "status" },
          ExpressionAttributeValues: { ":status": "active" },
          ScanIndexForward: false,
          Limit: limit,
          ExclusiveStartKey: startKey
        })
      );

      return {
        wishes: (result.Items as Wish[]) ?? [],
        nextToken: result.LastEvaluatedKey
          ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString("base64")
          : null
      };
    },

    async countActiveByUser(userId) {
      const result = await docClient.send(
        new QueryCommand({
          TableName: tableName,
          IndexName: "UserIdIndex",
          KeyConditionExpression: "userId = :userId",
          FilterExpression: "#status = :status",
          ExpressionAttributeNames: { "#status": "status" },
          ExpressionAttributeValues: { ":userId": userId, ":status": "active" },
          Select: "COUNT"
        })
      );
      return result.Count ?? 0;
    },

    async create(input) {
      const createdAt = Date.now();
      const wish: Wish = {
        wishId: randomUUID(),
        userId: input.userId,
        nickname: input.nickname,
        content: input.content,
        contact: input.contact,
        gender: input.gender,
        createdAt,
        status: "active",
        ttl: Math.floor(createdAt / 1000) + THIRTY_DAYS_SECONDS
      };

      await docClient.send(
        new PutCommand({
          TableName: tableName,
          Item: wish
        })
      );
      return wish;
    },

    async releaseAll() {
      const all = await this.listActive(200);
      await Promise.all(
        all.wishes.map((wish) =>
          docClient.send(
            new UpdateCommand({
              TableName: tableName,
              Key: { wishId: wish.wishId },
              UpdateExpression: "SET #status = :released",
              ExpressionAttributeNames: { "#status": "status" },
              ExpressionAttributeValues: { ":released": "released" }
            })
          )
        )
      );
      return all.wishes.length;
    }
  };
}

const useMemory = process.env.USE_IN_MEMORY_DB !== "false";

export function getWishRepository(): WishRepository {
  if (useMemory) {
    return memoryRepository;
  }
  return getDynamoRepository();
}

export function __resetInMemoryWishesForTest(): void {
  inMemoryWishes.length = 0;
}
