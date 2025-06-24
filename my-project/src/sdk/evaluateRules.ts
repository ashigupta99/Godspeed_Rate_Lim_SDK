import jexl from "jexl";
import { Context, Rule } from "./types";

export async function evaluateRules(context: Context, rules: Rule[]): Promise<{allowed:boolean;reason?:string}> {
  for (const rule of rules) {
    const result = await jexl.eval(rule.condition, { inputs: { context } });
    console.log(`🔍 Evaluating: ${rule.condition} => ${result}`);

    if (result) {
      console.log(`✅ Matched rule: ${rule.condition} → ${rule.action}`);
      if (rule.action === "deny") return { allowed: false, reason: `Rule denied: ${rule.condition}` };
      if (rule.action === "allow") return { allowed: true, reason: `Rule allowed: ${rule.condition}` };
    }
  }

  // Default fallback (deny by default if no rules matched)
  return { allowed: false, reason: "No matching allow rule" };
}
