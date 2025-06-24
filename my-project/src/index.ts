// src/index.ts
try {
  if (process.env.OTEL_ENABLED === 'true') {
    require('@godspeedsystems/tracing').initialize();
  }
} catch (error) {
  console.error("OTEL_ENABLED is set, unable to initialize OpenTelemetry tracing.");
  console.error(error);
  process.exit(1);
}

import Godspeed from "@godspeedsystems/core";

// No gsConfig needed unless you're loading non-auth plugins
const app = new Godspeed(); 
app.initialize();
