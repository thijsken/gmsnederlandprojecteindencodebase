import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://gmsnederlandatabase-default-rtdb.europe-west1.firebasedatabase.app'
  });

  console.log('✅ Firebase Admin SDK initialized.');
}

const db = admin.database();
export { db };
