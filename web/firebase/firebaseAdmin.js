import admin from "firebase-admin";

if (!admin.apps.length) {
  console.log("[firebaseAdmin] Start initialisatie...");

  const serviceAccountJSON = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!serviceAccountJSON) {
    throw new Error("[firebaseAdmin] FIREBASE_SERVICE_ACCOUNT_JSON environment variable ontbreekt.");
  }

  console.log("[firebaseAdmin] Service account JSON gevonden.");

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountJSON);
    console.log("[firebaseAdmin] Service account JSON succesvol geparsed.");
  } catch (error) {
    console.error("[firebaseAdmin] Fout bij het parsen van service account JSON:", error);
    throw error;
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gmsnederlandatabase-default-rtdb.europe-west1.firebasedatabase.app"
  });

  console.log("[firebaseAdmin] Firebase Admin succesvol geïnitialiseerd.");
}

const db = admin.database();

console.log("[firebaseAdmin.js] Firebase database object aangemaakt");

export { db };
