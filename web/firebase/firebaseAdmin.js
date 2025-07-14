const admin = require('firebase-admin');

console.log('🔍 Start loading Firebase service account from environment variables...');

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // zet \n om naar echte newlines
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

console.log('📝 Service account partial info (private key hidden):');
console.log({
  type: serviceAccount.type,
  project_id: serviceAccount.project_id,
  private_key_id: serviceAccount.private_key_id,
  private_key_present: !!serviceAccount.private_key,
  client_email: serviceAccount.client_email,
});

// Extra check: print first 50 chars van private key, om te zien of de newline vervangen is
if (serviceAccount.private_key) {
  console.log('🔑 Private key starts with:', serviceAccount.private_key.substring(0, 50).replace(/\n/g, '\\n'));
} else {
  console.error('❌ ERROR: Firebase private_key is missing!');
}

// Check of de tijd op de server klopt (UTC timestamp)
console.log('⏰ Server local time:', new Date().toString());
console.log('⏰ Server UTC time:', new Date().toUTCString());

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://gmsnederland-default-rtdb.europe-west1.firebasedatabase.app',
    });
    console.log('✅ Firebase admin initialized successfully.');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase admin:', error);
  }
}

const db = admin.database();

module.exports = { db };
