"use client";

import AppointmentPage from "@/app/components/AppointmentPage";
import stepContext from "@/app/context/stepContext";
import { useContext, useState} from "react";

export default function AppointmentModal() {

  const stepCtx = useContext(stepContext);

  const [ customerInput, setCustomerInput ] = useState({
    service: "",
    detail: "",
    images: [],
    serivceDate:"",
    appointment: "",
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
  const [errorInputMessage, setErrorInputMessage] = useState('');

  const handleCloseModal = () => {
    stepCtx.resetStep();
    setCustomerInput({
      service: "",
      detail: "",
      images: [],
      serivceDate:"",
      appointment: "",
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
    setErrorInputMessage('')
  }

  return (
    <>
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box max-w-5xl h-full">
        <form method="dialog" className='relative'>
            <AppointmentPage customerInput={customerInput} setCustomerInput={setCustomerInput} errorInputMessage={errorInputMessage} setErrorInputMessage={setErrorInputMessage}/>
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleCloseModal}>✕</button>
        </form>
      </div>
    </dialog>
    </>
  )
}