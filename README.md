# 许愿墙 Web App

基于 Next.js (App Router) + Tailwind + Jotai + AWS (Lambda/API Gateway/DynamoDB) 的除夕许愿墙应用。

## 功能

- 瀑布流许愿墙 + 无限滚动
- 发布愿望（昵称、内容、联系方式、性别）
- 每个用户最多 3 条愿望（前端 + 后端限制）
- 距离 2026-02-16 23:59:59 (北京时间) 的全局倒计时
- 2026-02-17 00:00 (北京时间) 触发卡片放飞动画
- `/api/wishes/release` 批量放飞接口（可配 API Key）

## 本地开发

```bash
npm install
npm run dev
```

默认使用内存存储（`USE_IN_MEMORY_DB=true`）。

## 环境变量

复制 `.env.example` 后配置：

```env
DYNAMODB_TABLE=Wishes
REGION=ap-northeast-1
ALLOWED_ORIGIN=http://localhost:3000
RELEASE_API_KEY=
USE_IN_MEMORY_DB=true
```

## 测试

```bash
npm test
npm run test:e2e
```

## API

- `GET /api/wishes?limit=20&nextToken=`
- `POST /api/wishes`
- `POST /api/wishes/release` (header: `x-release-key`)

## 部署

仓库内包含 `serverless.yml`，可基于 Serverless Framework 部署到 AWS。
