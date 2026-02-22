export async function handler() {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Use EventBridge + /api/wishes/release for release orchestration." })
  };
}
