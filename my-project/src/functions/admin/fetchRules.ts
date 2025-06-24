// Specific rules for a orgid:service else fallback rules
// 💡💡💡💡💡 use orgid: org123 and service: payment-service


console.log("💡 THIS IS THE FETCHRULES FILE IN USE");
console.log("🚨🚨 USING LATEST fetchRules HANDLER 🚨🚨");

import { GSContext, GSStatus } from "@godspeedsystems/core";

export const handler = getRules;

export default async function getRules(ctx: GSContext) {
  const { orgId, service } = ctx.inputs.data?.query || {};

  console.log("🟩 [fetchRules] called with:", orgId, service);

  if (!orgId || !service) {
    return new GSStatus(false, 400, "Missing orgId or service");
  }

  const rules = rulesDB[`${orgId}:${service}`] || [
    {
      condition: "inputs.context.currentUsage < 100",
      action: "allow",
      // condition: "inputs.context.userTier == 'free'",
      // action: "deny",
    },
  ];

  console.log("🟦 [fetchRules] Fetched rules:", rules);

  return new GSStatus(true, 200, "Rules fetched", { rules });
}

// Mock DB for rules
const rulesDB: { [key: string]: any[] } = {
  "org123:payment-service": [
    {
      // ❌ Block during peak time
      condition: "inputs.context.peakTime == true",
      action: "deny",
    },
    {
      // ❌ Block if usage ≥ 500 for anyone
      condition: "inputs.context.currentUsage >= 500",
      action: "deny",
    },
    {
      // ✅ Allow premium users below 300 usage
      condition: "inputs.context.userTier == 'premium' && inputs.context.currentUsage < 300",
      action: "allow",
    },
    {
      // ✅ Allow free users below 100 usage
      condition: "inputs.context.userTier == 'free' && inputs.context.currentUsage < 100",
      action: "allow",
    }
  ],
};




// 💡💡💡💡💡💡(no rules for a particular organisation code below)


// console.log("💡 THIS IS THE FETCHRULES FILE IN USE");
// console.log("🚨🚨 USING UNIFIED fetchRules HANDLER FOR ALL ORGS 🚨🚨");

// import { GSContext, GSStatus } from "@godspeedsystems/core";

// export const handler = getRules;

// export default async function getRules(ctx: GSContext) {
//   const { orgId, service } = ctx.inputs.data?.query || {};

//   console.log("🟩 [fetchRules] called with:", orgId, service);

//   if (!orgId || !service) {
//     return new GSStatus(false, 400, "Missing orgId or service");
//   }

//   const rules = [
//     {
//       // ❌ Block during peak time
//       condition: "inputs.context.peakTime == true",
//       action: "deny",
//     },
//     {
//       // ❌ Block if usage ≥ 500 for anyone
//       condition: "inputs.context.currentUsage >= 500",
//       action: "deny",
//     },
//     {
//       // ✅ Allow premium users below 300 usage
//       condition: "inputs.context.userTier == 'premium' && inputs.context.currentUsage < 300",
//       action: "allow",
//     },
//     {
//       // ✅ Allow free users below 100 usage
//       condition: "inputs.context.userTier == 'free' && inputs.context.currentUsage < 100",
//       action: "allow",
//     },
//     {
//       // ❌ Fallback deny rule
//       condition: "true",
//       action: "deny",
//     },
//   ];

//   console.log("🟦 [fetchRules] Fetched rules:", rules);

//   return new GSStatus(true, 200, "Rules fetched", { rules });
// }
