// ── Firebase Admin SDK ───────────────────────────────────────
// firebase-admin has a CJS/ESM mismatch — its types say one thing
// but the runtime exports differ depending on Node version.
// Using `* as admin` and casting to `any` is the safest workaround
// for Node 20+ with ESM ("type": "module" in package.json).
import * as admin from "firebase-admin";

// Cast once so we don't repeat `as any` everywhere below
const firebaseAdmin = admin as any;

// ── Credentials from environment variables ───────────────────
// FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
// must be set in .env (backend) and Railway (production).
// VITE_ prefixed vars are frontend-only — falling back to them
// here is only for convenience during local dev.
const projectId   = process.env.FIREBASE_PROJECT_ID  || process.env.VITE_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey  = process.env.FIREBASE_PRIVATE_KEY;

let initialized = false;

// ── Initialization ────────────────────────────────────────────
// Guard against re-initializing if the module is hot-reloaded
// (e.g. by nodemon). apps is the list of active Firebase app
// instances — if it's non-empty, the SDK is already running.
if (!firebaseAdmin.apps.length) {
  if (projectId && clientEmail && privateKey) {
    try {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert({
          projectId,
          clientEmail,
          // Railway and .env store \n as a literal backslash-n —
          // replace them with real newlines so the PEM key parses correctly.
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
  // App already initialized (e.g. hot reload) — skip re-init
  initialized = true;
}

export { initialized };
export default firebaseAdmin;
