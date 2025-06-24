import { GSContext, GSStatus } from "@godspeedsystems/core";

export default function (ctx: GSContext) {
  const user = ctx.inputs.data.user;
  const name = ctx.inputs.data.query?.name || "guest";
  if (!user) {
    return new GSStatus(false, 401, "Unauthorized or token missing");
  }
  return new GSStatus(true, 200, `Hello ${name}`, { user });
}

