import { getAuth } from 'firebase-admin/auth';
import { db, admin } from '@/app/lib/firestore/config';
import addEventToGoogleCalendar from '@/app/utility/addEventToGoogleCalendar';
import { getDoc, doc } from 'firebase-admin/firestore';

export async function POST(request) {
  try {
    // Get the user's Firebase ID token from the request headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];

    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Retrieve the OAuth token from Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }
    const userData = userDoc.data();
    if (!userData || !userData.googleOAuthToken) {
      return new Response(JSON.stringify({ error: 'OAuth token not found' }), { status: 404 });
    }
    const token = userData.googleOAuthToken;

    // Extract event details from the request body
    const eventDetails = await request.json();

    // Add event to Google Calendar
    const event = await addEventToGoogleCalendar(token, eventDetails);

    return new Response(JSON.stringify(event), { status: 200 });
  } catch (error) {
    console.error('Error adding event:', error);
    return new Response(JSON.stringify({ error: 'Failed to add event' }), { status: 500 });
  }
}

