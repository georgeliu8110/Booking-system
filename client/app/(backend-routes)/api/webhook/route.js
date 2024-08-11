import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/app/lib/firestore/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const sig = request.headers.get('stripe-signature');
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return NextResponse.json({ error: 'Webhook Error: ' + err.message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const appIds = JSON.parse(event.data.object.metadata.appIds);

    // Wrap each fetch with await and handle errors
    const updateStatusPromises = appIds.map(async appId => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/updateStatus`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: event.data.object.customer_email,
            appId: appId,
            status: 'Paid',
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update status for appId: ${appId}`);
        }

        return response.json();
      } catch (error) {
        console.error('Error updating status:', error);
        return null; // Return null or handle the error case appropriately
      }
    });

    try {
      const results = await Promise.all(updateStatusPromises);
      console.log('All statuses updated:', results);
    } catch (error) {
      console.error('Error in updating statuses:', error);
    }
  }

  return NextResponse.json({ received: true });
}
