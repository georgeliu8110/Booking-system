import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const { amount, customerEmail, appIds} = await request.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Account Balance Payment',
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    customer_email: customerEmail,
    metadata: {
      appIds: JSON.stringify(appIds)
    },
    success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/customerProfilePage?status=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/customerProfilePage?status=cancel`,
  });

  return NextResponse.json({ id: session.id });
}
