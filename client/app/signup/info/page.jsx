'use client';

import AppCustomer from '@/app/components/AppCustomer';
import {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function SignUpInfoPage() {

  const [customerSignUpInfo, setCustomerSignUpInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    apt: "",
    state: "",
    city: "",
    zip: ""
  })

  const router = useRouter();

  const signUpFormSubmitHandler = async (e) => {
    const res = await fetch('/api/customerInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerSignUpInfo)
    })

    console.log('res ====>', res)

    if (!res.ok) {
      console.log('error')
      return
    }
    router.push('/')
  }
  return (
    <div className='flex flex-col'>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
      <AppCustomer setCustomerInput={setCustomerSignUpInfo} customerInput={customerSignUpInfo}/>
      </div>
      <button className='btn my-10 w-full max-w-20' onClick={signUpFormSubmitHandler}>Submit</button>
    </div>
  );
}