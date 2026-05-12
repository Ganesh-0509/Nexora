import { db } from "../src/server/db";
import { redis } from "../src/server/cache/redis";

async function verifySetup() {
  console.log("🔍 Starting Setup Verification...\n");

  // 1. Test Database
  try {
    await db.$connect();
    console.log("✅ Database: Connection Successful!");
    const userCount = await db.user.count();
    console.log(`📊 Database: Found ${userCount} users.\n`);
  } catch (error) {
    console.error("❌ Database: Connection Failed!", error);
  }

  // 2. Test Redis
  try {
    await redis.set("test-key", "Nexora-Success", "EX", 10);
    const value = await redis.get("test-key");
    if (value === "Nexora-Success") {
      console.log("✅ Redis: Connection & Write Successful!");
    } else {
      console.log("⚠️ Redis: Connected, but write failed.");
    }
  } catch (error) {
    console.error("❌ Redis: Connection Failed!", error);
  }

  process.exit();
}

verifySetup();
