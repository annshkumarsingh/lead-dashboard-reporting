import { app } from "./app";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";

async function bootstrap() {
  await connectDatabase();
  app.listen(env.port, () => {
    console.log(`🚀 Backend running on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("❌ Failed to start server", error);
  process.exit(1);
});
