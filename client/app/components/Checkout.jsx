'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useState, useEffect} from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TiCancel } from "react-icons/ti";
import { FaCheck } from "react-icons/fa6";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Checkout({ amount, customerEmail, appIds }) {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get('status');

  useEffect(() => {
    if (status === 'success') {
      document.getElementById('success-modal').showModal();
    } else if (status === 'cancel') {
      document.getElementById('cancel-modal').showModal();
    }
  }, [])


  const handleClick = async () => {
    setLoading(true);
    const response = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, customerEmail, appIds}),
    });

    const session = await response.json();
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId: session.id });

    if (error) {
      console.error('Error redirecting to checkout:', error);
      setLoading(false);
    }
  };

  return (
    <>
     <button onClick={handleClick} disabled={loading || amount === '0'} className='btn btn-primary'>
      {loading ? 'Loading...' : 'Pay Now'}
     </button>
      <dialog id="success-modal" className="modal">
        <div className="modal-box">
          <div className='flex items-center'>
            <FaCheck className='size-8 text-green-600'/><h3 className="font-bold text-lg text-black">Payment Successful</h3>
          </div>
          <p className="py-4 text-black">Thank you for your payment! Your transaction was successful.</p>
          <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn" >Close</button>
          </form>
          </div>
        </div>
      </dialog>
      <dialog id="cancel-modal" className="modal">
        <div className="modal-box">
          <div className='flex items-center'>
          <TiCancel className='size-8 text-red-600'/><h3 className="font-bold text-lg text-black">Payment Cancelled</h3>
          </div>
          <p className="py-4 text-black">Your payment was Cancelled!</p>
          <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn" >Close</button>
          </form>
          </div>
        </div>
      </dialog>
    </>

  );
}
