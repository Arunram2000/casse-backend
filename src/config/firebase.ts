import admin, { ServiceAccount } from "firebase-admin";
import { config } from "./index";

const serviceAccount = config.FIREBASE_SERVICE_ACCOUNT_KEY 
  ? JSON.parse(config.FIREBASE_SERVICE_ACCOUNT_KEY) as ServiceAccount
  : {
      projectId: config.FIREBASE_PROJECT_ID,
      clientEmail: config.FIREBASE_CLIENT_EMAIL,
      privateKey: config.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    } as ServiceAccount;

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "casse-e3fb8.firebasestorage.app"
  });

export const bucket = admin.storage().bucket();
export default admin;
