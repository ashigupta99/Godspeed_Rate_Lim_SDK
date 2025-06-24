import { GSContext, GSStatus } from "@godspeedsystems/core";
import jwt from "jsonwebtoken";

export default function (ctx: GSContext) {
  const {
    inputs: {
      data: { body },
    },
  } = ctx;

  const { username, password } = body;

  // Dummy auth logic (replace with real DB or service check)
  if (username === "aashi" && password === "aash123") {
    const token = jwt.sign(
      { sub: "user-123", username, role: "admin" },
      "mysecret", // match with http.yaml -> secretOrKey
      {
        issuer: "mycompany",     // match with http.yaml
        audience: "mycompany",   // match with http.yaml
        expiresIn: "1h",
      }
    );

    return new GSStatus(true, 200, "Login Successful", { token });
  }

  return new GSStatus(false, 401, "Invalid credentials");
}
