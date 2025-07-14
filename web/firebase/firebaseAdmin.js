const admin = require('firebase-admin');

if (!admin.apps.length) {
  console.log('🔐 Initializing Firebase Admin SDK...');

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });

  console.log('✅ Firebase Admin initialized.');
} else {
  console.log('ℹ️ Firebase Admin already initialized.');
}

const db = admin.database();

module.exports = db;
