import { useState, useEffect } from 'react';
import AdminAppCustomerAgreement from './AdminAppCustomerAgreement';
import ImageUpload from './ImageUpload';
import AdminAppSignature from './AdminAppSignature';
import AdminAppInvoice from './AdminAppInvoice';
import { PDFViewer } from '@react-pdf/renderer';
import PdfCard from "./PdfCard";

export default function AdminAppAssignedSection({appointment, appDetail, index, step, setStep}) {

  const [ loading, setLoading ] = useState(false);
  const [ success, setSuccess ] = useState(false);


  const { address, appId, date, detail, email, images, name, phoneNumber, serviceId, status, time } = appointment;
  const { timeSlot, service, partsNeeded} = appDetail;

  useEffect(() => {
    if (status === "Assigned") {
      setStep(1);
    }
    if (status === "Complete") {
      setStep(2);
    }
    if (status === "Invoiced") {
      setStep(5);
    }
  }, [])

  const workCompleteHandler = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/updateStatus', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
              body: JSON.stringify({
                email: email,
                appId: appId,
                status: "Complete",
              }),
          })
          if (!response.ok) {
            throw Error('Failed to assign technician');
          }
      const data = await response.json();
      setLoading(false);
      setSuccess(true);
      console.log('Technician assigned successfully', data)
    } catch (error) {
      console.error('Failed to assign technician', error);
    } finally {
      setLoading(false);
    }
  }

  const saveSingatureHandler = async (blob) => {
    setLoading(true);

    const formData = new FormData();
    formData.append('signature', blob);
    formData.append('appId', appId);
    formData.append('email', email);

    try {
      const response = await fetch('/api/saveSignature', {
            method: 'POST',
            body: formData,
          })
          if (!response.ok) {
            throw Error('Failed to save signature');
          }
      const data = await response.json();
      setLoading(false);
      setSuccess(true);
      console.log('Signature was saved successfully', data)
    } catch (error) {
      console.error('Failed to save signature', error);
    } finally {
      setLoading(false)
  }
}

  const nextStepHandler = () => {
    setStep(prev => prev + 1);
  }

  const cards = {  maxWidth: "2000px", margin: "0 auto", display: "flex", gap: "1rem", padding : '20px', justifyContent: 'center', alignItems: 'center'}

  return <div className='w-full max-w-full'>
    <ul className="steps mb-3">
      <li className={`step ${ step >= 1 ? 'step-primary': ''}`}>Status Update</li>
      <li className={`step ${ step >= 2 ? 'step-primary': ''}`}>Proof of Completion</li>
      <li className={`step ${ step >= 3 ? 'step-primary': ''}`}>Customer Agreement</li>
      <li className={`step ${ step >= 4 ? 'step-primary': ''}`}>Invoice</li>
    </ul>

    {step === 1 && (
      <>
      <div className='my-5'>
        {!success ? <div role="alert" className="alert alert-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Please click the below buttom to update status to complete if the work is complete</span>
            <button className="btn btn-active btn-primary w-40 h-12 flex items-center justify-center relative" onClick={workCompleteHandler}>{!loading ? 'Work Is Complete' : <span className="loading loading-dots loading-lg"></span>}</button>
          </div> :
          <div role="alert" className="alert alert-success">
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
          <span>The status of this appointment has been updated to "Complete" successfully! Please go to next step</span>
        </div>
        }
      </div>

      <div className='h-5 mb-10'>
        {success && <button className="btn btn-active btn-primary" onClick={nextStepHandler}>Next Step</button>}
      </div>
      </>
    )}
    { step === 2 && (
      <>
      <div role="alert" className="alert alert-info my-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="h-6 w-6 shrink-0 stroke-current">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Please upload photos of the completed work as proof of completion</span>
      </div>
       <ImageUpload />
       <button className="btn btn-active btn-primary" onClick={nextStepHandler}>Next Step</button>
      </>
    )}
    {step === 3 && (
      <div className='flex-col'>
       <button className="btn my-5" onClick={()=>document.getElementById('customerAgreement').showModal()}>View Customer Agreement</button>
        <dialog id="customerAgreement" className="modal w-full">
          <div className="modal-box w-full max-w-4xl">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <div className='items-center w-full'>
              <AdminAppCustomerAgreement />
            </div>
          </div>
        </dialog>
        <p className='my-3 font-bold'>Customer Signature:</p>
        <AdminAppSignature saveSingatureHandler={saveSingatureHandler} loading={loading} success={success}/>
        <div>
          <button className="btn btn-active btn-primary mt-5" onClick={nextStepHandler}>Next Step</button>
        </div>
      </div>
    )}
    {step === 4 && (
      <div className='w-full max-w-screen-lg'>
          <div className='flex justify-center items-center h-full my-10'>
            <PdfCard title="Plumbing service Invoice" appointment={appointment} appDetail={appDetail}/>
          </div>
      </div>

    )}
    {step === 5 && (
      <PdfCard title="Plumbing service Invoice" appointment={appointment} appDetail={appDetail}/>
    )}
  </div>
}