import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import User from "../src/model/user.model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const testEmailPatterns = [
  /@test\.com$/i,
  /@example\.com$/i,
];

const testNames = [
  "Test User",
  "New User",
  "Test Browser User",
  "Proxy Test",
  "Cors Test",
];

const isTestUser = (user) =>
  testEmailPatterns.some((pattern) => pattern.test(user.email)) ||
  testNames.includes(user.fullName);

const run = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  const users = await User.find();
  const testUsers = users.filter(isTestUser);

  if (testUsers.length === 0) {
    console.log("No test users found.");
    process.exit(0);
  }

  console.log("Removing test users:");
  for (const user of testUsers) {
    console.log(`- ${user.fullName} (${user.email})`);
  }

  await User.deleteMany({ _id: { $in: testUsers.map((user) => user._id) } });
  console.log(`Removed ${testUsers.length} test user(s).`);
  process.exit(0);
};

run().catch((error) => {
  console.error("Cleanup failed:", error.message);
  process.exit(1);
});
