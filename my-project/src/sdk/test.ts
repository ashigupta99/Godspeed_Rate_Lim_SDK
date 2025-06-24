import jwt from "jsonwebtoken";
import axios from "axios";
import { getCache, setCache } from "./cache";
import { evaluateRules } from "./evaluateRules";
import { Context, Rule, TokenPayload } from "./types";

// 🔐 Config
const ADMIN_URL = "http://localhost:3100/admin";
const JWT_SECRET = "super-secure-secret-change-this";

// 🧪 Simulated Request
const token = jwt.sign({ userId: "user123", orgId: "org123" }, JWT_SECRET);
const service = "payment-service";

// 🔄 Decode JWT
const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
const cacheKey = `${decoded.orgId}:${service}`;

async function main() {
  let rules: Rule[] | null = getCache(cacheKey);

  if (!rules) {
    console.log("🔄 No cache found. Fetching fresh rules...");
    const res = await axios.get(`${ADMIN_URL}/rules`, {
      params: { orgId: decoded.orgId, service }
    });
    rules = res.data.rules;

    // 💾 Cache rules
    setCache(cacheKey, rules, 60000);
  } else {
    console.log("📦 Using cached rules:", rules);
  }

  // ✅ Type guard: Tell TypeScript `rules` is now definitely Rule[]
  if (!rules) {
    throw new Error("❌ Rules still not found after fetching");
  }

  // 📊 Step 2: Fetch Context (always fresh)
  const contextRes = await axios.get(`${ADMIN_URL}/context`, {
    params: {
      orgId: decoded.orgId,
      userId: decoded.userId,
      service
    }
  });
  const context: Context = contextRes.data.data;
  console.log("📊 Fetched context:", context);

  // ✅ Step 3: Evaluate Rules
  const allowed = await evaluateRules(context, rules); // now guaranteed Rule[]
  console.log("🚦 Request allowed:", allowed);
}

main().catch(console.error);