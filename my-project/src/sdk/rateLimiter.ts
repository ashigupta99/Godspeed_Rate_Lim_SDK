import jwt from "jsonwebtoken";
import axios from "axios";
import { evaluateRules } from "./evaluateRules";
import { getCache, setCache } from "./cache";
import { Context, Rule, TokenPayload } from "./types";

const ADMIN_URL = "http://localhost:3100/admin";
const JWT_SECRET = "super-secure-secret-change-this";

/**
 * Main SDK function to evaluate rate limit.
 */
export async function rateLimit(token: string, service: string): Promise<{
  allowed: boolean;
  context?: Context;
  reason?: string;
}> {
  let decoded: TokenPayload;

  // 1. Decode JWT token
  try {
    decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return { allowed: false, reason: "Invalid token" };
  }

  setCache(`${decoded.orgId}:${service}`, null, 0);

  const cacheKey = `${decoded.orgId}:${service}`;

  // 2. Try to get rules from cache
  let rules: Rule[] | null = getCache(cacheKey);
  console.log("✅ Parsed rules (from cache):", rules);

  // 3. If not in cache, fetch from backend
  if (!rules) {
    try {
      const res = await axios.get(`${ADMIN_URL}/rules`, {
        params: { orgId: decoded.orgId, service }
      });

      console.log("🔍 Rules response1 (full):", res.data);

      // Pick the correct line based on your actual response structure
      rules = res.data?.rules; // Use this if rules are at top-level
      // rules = res.data?.data?.rules; // Uncomment this if rules are nested in `.data`

      console.log("✅ Extracted rules:", rules);

      if (!Array.isArray(rules)) {
        console.error("❌ Malformed rules response:", res.data);
        return { allowed: false, reason: "Rules not found from admin server" };
      }

      setCache(cacheKey, rules, 60000); // Cache rules for 60s
    } catch (err) {
      return { allowed: false, reason: "Could not fetch rules" };
    }
  }

  // 4. Fetch context
  let context: Context;
  try {
    const res = await axios.get(`${ADMIN_URL}/context`, {
      params: {
        userId: decoded.userId,
        orgId: decoded.orgId,
        service
      }
    });

    console.log("📦 Raw context response:", res.data);
    context = res.data;

    if (!context || typeof context !== "object") {
      console.error("❌ Invalid context response");
      return { allowed: false, reason: "No context data returned" };
    }

    console.log("📊 Fetched context:", context);
  } catch {
    return { allowed: false, reason: "Could not fetch context" };
  }

  // 5. Evaluate rules
  const {allowed,reason} = await evaluateRules(context, rules);
  return {
    allowed,
    context,
    reason,
  };
}
