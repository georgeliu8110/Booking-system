'use client';

import CustomerProfile from '@/app/components/CustomerProfile';
import { auth } from "@/app/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import {redirect} from 'next/navigation';

export default function CustomerProfilePage() {

  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  if (error) {
    console.log(error);
  }

  if (!user) {
    redirect('/login');
  }


  return (
    <div>
      <CustomerProfile />
    </div>
  );
}