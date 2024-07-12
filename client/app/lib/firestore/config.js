import admin from 'firebase-admin';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = getFirestore();

export { admin, db, Timestamp, FieldValue, Filter};
