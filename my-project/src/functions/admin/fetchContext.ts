// 💡💡💡💡💡 random context generation--


console.log("💡 THIS IS THE FETCHCONTEXT FILE IN USE");
console.log("🚨🚨 USING LATEST fetchContext HANDLER 🚨🚨");

import { GSContext, GSStatus } from "@godspeedsystems/core";

export const handler = getContext;
export default async function getContext(ctx: GSContext) {
  const { userId, orgId, service } = ctx.inputs.data?.query || {};

  console.log("🟩 [fetchContext] called with:", userId, orgId, service);

  if (!userId || !orgId || !service) {
    return new GSStatus(false, 400, "Missing userId, orgId, or service");
  }

  const userTiers = ["free", "premium"];
  const currentUsage = Math.floor(Math.random() * 600); // 0–599
  const peakTime = Math.random() < 0.5;
  const userTier = userTiers[Math.floor(Math.random() * userTiers.length)];
  const quotaLimit = 500;

  const contextData = {
    userId,
    orgId,
    service,
    userTier,
    currentUsage,
    quotaLimit,
    peakTime,
  };

  console.log("🟦 [fetchContext] Fetched context:", contextData);

  return new GSStatus(true, 200, "Context fetched", contextData);
}







// 💡💡💡💡💡💡 preset context

// import { GSContext, GSStatus } from "@godspeedsystems/core";

// export const handler = getContext;

// export default async function getContext(ctx: GSContext) {
//   const { userId, orgId, service } = ctx.inputs.data?.query || {};

//   if (!userId || !orgId || !service) {
//     return new GSStatus(false, 400, "Missing userId, orgId or service");
//   }

//   const key = `${userId}:${orgId}:${service}`;
//   const usage = usageDB[key] || 0;

//   return new GSStatus(true, 200, "Context fetched", {
//     userId,
//     orgId,
//     service,
//     userTier: "premium",
//     currentUsage: usage,
//     quotaLimit: 500,
//     peakTime: false,
//   });
// }

// // Mock DB for usage
// const usageDB: { [key: string]: number } = {
//   "user123:org123:payment-service": 502,
// };