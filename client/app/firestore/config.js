const { initializeApp, applicationDefault, cert, getApps } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const serviceAccount = require('/Users/zheliu/Desktop/Booking-system/client/app/firestore/dsd-cohort-2024-c9d62ba8cd0b.json');

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();

export { db, Timestamp, FieldValue, Filter }