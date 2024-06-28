"use client";
import { useState } from "react";
import AppIssue from "./AppIssue";
import AppDetails from "./AppDetails";
import AppCustomer from "./AppCustomer";
import AppScheduleServices from "./AppScheduleServices";
import AppSummary from "./AppSummary";
import { useContext } from "react";
import StepContext from '@/app/context/stepContext';

export default function AppointmentPage({ customerInput, setCustomerInput, errorInputMessage, setErrorInputMessage}) {

  console.log('customerInput ====>', customerInput)

  const stepCtx = useContext(StepContext);
  const step = stepCtx.currentStep;

  const handleContinue = (e) => {
    e.preventDefault();
    if (step === 1 && !customerInput.service) {
      setErrorInputMessage("Please select a service");
      return;
    }
    if (step === 3 && (!customerInput.serviceDate || !customerInput.appointment)) {
      setErrorInputMessage("Please select a date and time");
      return;
    }

    if (step === 4 && (!customerInput.firstName || !customerInput.lastName || !customerInput.email || !customerInput.phone || !customerInput.street || !customerInput.state || !customerInput.city || !customerInput.zip)) {
      setErrorInputMessage("Please fill out all fields");
      return;
    }

    if (step === 4 && customerInput.phone.length !== 10) {
      setErrorInputMessage("Please enter a valid phone number");
      return;
    }

    if (step === 4 && /\D/.test(customerInput.phone)) {
      setErrorInputMessage("Please only enter numbers for phone number");
      return
    }

     if (step === 4 && customerInput.zip.length !== 5) {
      setErrorInputMessage("Please enter a valid zip code");
      return;
    }

    if (step === 4 && /\D/.test(customerInput.zip)) {
      setErrorInputMessage("Please only enter numbers for zip code");
      return
    }

    const validateEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    if (step === 4 && !validateEmail(customerInput.email)) {
      setErrorInputMessage("Please enter a valid email");
      return;
    }

    stepCtx.goToNextStep();
    setErrorInputMessage('')
  }

  const handleGoBack = (e) => {
    e.preventDefault();

    if (step === 2) {
      setCustomerInput((prev) => ({ ...prev, service: "" }));
    }

    if (step === 3) {
      setCustomerInput((prev) => ({ ...prev, detail: "" }));
    }

    if (step === 4) {
      setCustomerInput((prev) => ({ ...prev, serviceDate: "", appointment: "" }));
    }

    if (step === 5) {
      setCustomerInput((prev) => ({ ...prev, firstName: "", lastName: "", email: "", phone: "", street: "", apt: "", state: "", city: "", zip: "" }));
    }

    setErrorInputMessage('');

    stepCtx.goToPreviousStep();
  }

  return (
    <div className="flex flex-col min-h-screen p-4">
    <div className='text-center'>
      <ul className="steps mb-4">
        <li className={`step ${ step >= 1 ? 'step-primary' : ''}`}>ISSUE</li>
        <li className={`step ${ step >= 2 ? 'step-primary' : ''}`}>DETAILS</li>
        <li className={`step ${ step >= 3 ? 'step-primary' : ''}`}>SCHEDULE</li>
        <li className={`step ${ step >= 4 ? 'step-primary' : ''}`}>CUSTOMER</li>
        <li className={`step ${ step >= 5 ? 'step-primary' : ''}`}>CONFIRM</li>
      </ul>
    </div>
    <div className='h-16 mb-4 relative'>
      <div role="alert" className={`alert alert-error fixed right-0 text-white p-4 rounded-l-lg shadow-md transition-transform transform ${errorInputMessage ? 'translate-x-0' : 'translate-x-full'} `}>
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>{errorInputMessage}</span>
    </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
      <div className="col-span-2">
       { step === 1 && <AppIssue customerInput={customerInput} setCustomerInput={setCustomerInput}/>}
      </div>
      <div className="col-span-2">
       { step === 2 && <AppDetails customerInput={customerInput} setCustomerInput={setCustomerInput}/>}
      </div>
      { step === 3 && <AppScheduleServices customerInput={customerInput} setCustomerInput={setCustomerInput}/>}
      { step === 4 && <AppCustomer customerInput={customerInput} setCustomerInput={setCustomerInput}/>}
    </div>
    {step === 5 && <AppSummary customerInput={customerInput} setCustomerInput={setCustomerInput}/>}
    <div className='flex-grow flex items-end justify-between pb-60 mb-20'>
        { step !== 1 ? (<button className="btn" onClick={handleGoBack}>
              <svg className='h-6 w-6' clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m10.978 14.999v3.251c0 .412-.335.75-.752.75-.188 0-.375-.071-.518-.206-1.775-1.685-4.945-4.692-6.396-6.069-.2-.189-.312-.452-.312-.725 0-.274.112-.536.312-.725 1.451-1.377 4.621-4.385 6.396-6.068.143-.136.33-.207.518-.207.417 0 .752.337.752.75v3.251h9.02c.531 0 1.002.47 1.002 1v3.998c0 .53-.471 1-1.002 1z" fill-rule="nonzero"/></svg>
             <span>Go back</span>
        </button>) : <div></div>}
        { step !== 5 && <button className="btn" onClick={handleContinue}>
              Continue
              <svg className='h-6 w-6' clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m13.022 14.999v3.251c0 .412.335.75.752.75.188 0 .375-.071.518-.206 1.775-1.685 4.945-4.692 6.396-6.069.2-.189.312-.452.312-.725 0-.274-.112-.536-.312-.725-1.451-1.377-4.621-4.385-6.396-6.068-.143-.136-.33-.207-.518-.207-.417 0-.752.337-.752.75v3.251h-9.02c-.531 0-1.002.47-1.002 1v3.998c0 .53.471 1 1.002 1z" fill-rule="nonzero"/></svg>
        </button>}
    </div>
  </div>
  );
}
