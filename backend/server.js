import createApp from "./src/app.js";
import connectDB from "./src/config/db.config.js";
import { PORT } from "./src/config/env.config.js";

async function startServer() {
  const app = createApp();
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("failed to start server", error.message);
  process.exit(1);
});
