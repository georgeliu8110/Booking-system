"use client";

import AppScheduleServices from "@/app/components/AppScheduleServices";
import { useState} from "react";
import { auth } from "@/app/lib/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { formatDate } from "@/app/utility/formatDateForConfirmation";

export default function RescheduleAppModal({appData, setAppData, setAppStatus}) {

  const [ customerInput, setCustomerInput ] = useState({
    serviceDate:"",
    appointment: "",
  })

  const [user, loading, error] = useAuthState(auth);
  const [successMessage, setSuccessMessage] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  const handleCloseModal = (e) => {
    setCustomerInput({
      serivceDate:"",
      appointment: "",
    })
    setSuccessMessage(false);
  }

  const rescheduleHandler = async (e) => {
    e.preventDefault();

    if (!customerInput.serviceDate || !customerInput.appointment) {
      setSuccessMessage(false);
    }

    try {
      const params = new URLSearchParams({ date: formatDate(customerInput.serviceDate), timeSlot: customerInput.appointment, email: user.email, id: appData.confirmationNumber});

        const response = await fetch(`/api/appointments?${params}`, {
          method: 'PUT',
        })

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();

        setSuccessMessage(true);
        setAppStatus('rescheduled');

        setTimeout(() => {
          setSuccessMessage(false);
        }, 2000);

        setAppData(prev => ({
          ...prev,
          date: result.date,
          timeSlot: result.timeSlot,
        }))
    } catch (error) {
      console.error('Failed to reschedule appointment:', error);
    }
  }

  return (
    <>
    <dialog id={`my_modal_${appData.confirmationNumber}`} className="modal">
      <div className="modal-box max-w-5xl h-full">
      <div className="h-15 relative">
      <div className={`alert alert-success fixed right-0 bg-green-500 text-white p-2 mt-4 rounded-l-lg shadow-md transition-transform transform ${successMessage ? 'translate-x-0' : 'translate-x-full'}`} role="alert">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Your changes have been!</span>
      </div>
    </div>
        <form method="dialog" className='flex flex-col gap-20 px-20'>
            <AppScheduleServices customerInput={customerInput} setCustomerInput={setCustomerInput}/>
          <button className='btn ring-cyan-400 ring-2' onClick={rescheduleHandler}>Reschedule</button>
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleCloseModal}>✕</button>
        </form>
      </div>
    </dialog>
    </>
  )
}