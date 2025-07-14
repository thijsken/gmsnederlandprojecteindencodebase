import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!serviceAccountJson) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is niet ingesteld.');
  }

  const serviceAccount = JSON.parse(serviceAccountJson);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://gmsnederlandatabase-default-rtdb.europe-west1.firebasedatabase.app',
  });

  console.log('✅ Firebase Admin SDK succesvol geladen.');
}

const db = admin.database();
export { db };
