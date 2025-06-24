import { GSContext, GSStatus } from "@godspeedsystems/core";
import { evaluateRules } from "../../sdk/evaluateRules";
import { handler as fetchContext } from "../admin/fetchContext";
import { handler as fetchRules } from "../admin/fetchRules";

export const handler = evaluateAccess;

export default async function evaluateAccess(ctx: GSContext) {
  const { userId, orgId, service } = ctx.inputs.data?.query || {};

  if (!userId || !orgId || !service) {
    return new GSStatus(false, 400, "Missing userId, orgId or service");
  }

  // ✅ Create minimal context object to avoid cloneWithNewData error
  const baseInputs = { ...ctx.inputs };

  const mockCtx = {
    inputs: {
      ...baseInputs,
      data: { query: { userId, orgId, service } },
    },
  } as unknown as GSContext;

  const contextRes = await fetchContext(mockCtx);
  if (!contextRes.success) return contextRes;

  const context = contextRes.data;

  const rulesRes = await fetchRules(mockCtx);
  if (!rulesRes.success) return rulesRes;

  const rawRules = rulesRes.data;
  const rules = Array.isArray(rawRules) ? rawRules : rawRules?.rules || [];

  console.log("🧠 [evaluateAccess] Rules fetched:", rules);
  
  const allowed = await evaluateRules(context, rules);

  return new GSStatus(true, 200, "Evaluation complete", {
    allowed,
    context,
    rules,
  });
}
