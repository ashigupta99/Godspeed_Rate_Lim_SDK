import { rateLimit } from "../src/sdk";
import jwt from "jsonwebtoken";

// Simulate valid token
const token = jwt.sign(
  { userId: "user123", orgId: "org123" },
  "super-secure-secret-change-this"
); 

async function main() {
  const result = await rateLimit(token, "payment-service");
  console.log("✅ SDK Result:", result);
}

main().catch(console.error);
