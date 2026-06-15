import { createRequire } from "module";
const require = createRequire(import.meta.url);
const admin = require("firebase-admin");

// ── Debug (remove after Railway confirms working) ─────────────
console.log("RAILWAY admin keys:", Object.keys(admin));
console.log("RAILWAY auth type:", typeof admin.auth);
console.log("RAILWAY credential type:", typeof admin.credential);
console.log("RAILWAY getAuth type:", typeof admin.getAuth);

// Cast once so we don't repeat `as any` everywhere below
const firebaseAdmin = admin;

// ── Credentials from environment variables ───────────────────
const projectId   = process.env.FIREBASE_PROJECT_ID  || process.env.VITE_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey  = process.env.FIREBASE_PRIVATE_KEY;

let initialized = false;

// ── Initialization ────────────────────────────────────────────
if (!firebaseAdmin.getApps().length) {
  if (projectId && clientEmail && privateKey) {
    try {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      });
      initialized = true;
      console.log("🔥 Firebase Admin SDK initialized successfully.");
    } catch (error) {
      console.error("❌ Failed to initialize Firebase Admin SDK:", error);
    }
  } else {
    console.warn(
      "⚠️ WARNING: Firebase Admin credentials are not fully configured in your environment variables (.env).\n" +
      "Protected routes requiring Firebase token verification will fail.\n" +
      "Please set: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
    );
  }
} else {
  initialized = true;
}

export { initialized };
export default firebaseAdmin;