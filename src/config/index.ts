import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars: string[] = ["JWT_SECRET", "MONGODB_URI"];

function validateEnvVars(requiredVars: string[]): void {
  const missingVars = requiredVars.filter((key) => !process.env[key]);
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(", ")}`);
    process.exit(1);
  }
}

validateEnvVars(requiredEnvVars);

export const config = {
  MONGO_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/club_app",
  PORT: process.env.PORT ? Number(process.env.PORT) : 5000,
  JWT_SECRET: process.env.JWT_SECRET!,
  WEBVIEW_JWT_SECRET: process.env.WEBVIEW_JWT_SECRET!,
  // Firebase config
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
  FIREBASE_SERVICE_ACCOUNT_KEY: process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
};
