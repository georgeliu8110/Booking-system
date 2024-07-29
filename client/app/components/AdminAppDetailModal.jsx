import { formatDateForConfirmation } from '@/app/utility/formatDateForConfirmation';
import GoogleMapSection from '@/app/components/GoogleMapSection';
import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminAppDetailModal({appointment, appDetail}) {

  const [ status, setStatus ] = useState(appointment.status);
  const [ updateLoading, setUpdateLoading ] = useState(false);
  const displayedStatus = status === appointment.status ? appointment.status : status;
  const statusRef = useRef();

  async function updateStatus(e) {
    e.preventDefault();
    setUpdateLoading(true);
    const response = await fetch('/api/updateStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: appointment.email,
        appId: appointment.appId,
        status: statusRef.current.value,
      }),
    })

    if (!response.ok) {
      console.error('Failed to update status');
    }

    const data = await response.json();

    setStatus(data.status);
    setUpdateLoading(false);
  }

  function handleContactCustomer() {
    const mailToLink = `mailto:${appointment.email}`;
    window.location.href = mailToLink;
  }

  return (
    <dialog id={`${appointment.email}`} className="modal">
      <div className="modal-box w-full max-w-4xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div className="flex w-full space-x-4">
          <div className="card rounded-box grid flex-grow place-items-start p-3">
              <table className="table">
                <thead>
                  <tr>
                    <th colSpan='3' className='text-center font-bold text-lg'>Customer Details:</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover">
                    <th>1</th>
                    <td>Customer Name:</td>
                    <td>{appointment.name}</td>
                  </tr>
                  <tr className="hover">
                    <th>2</th>
                    <td>Customer Address:</td>
                    <td>{appointment.address}</td>
                  </tr>
                  <tr className="hover">
                    <th>3</th>
                    <td>Customer Email:</td>
                    <td>{appointment.email}</td>
                  </tr>
                  <tr className="hover">
                    <th>4</th>
                    <td>Customer Phone Number:</td>
                    <td>{appointment.phoneNumber}</td>
                  </tr>
                </tbody>
              </table>
            <div className="overflow-x-auto mt-10">
              <table className="table">
                <thead>
                  <tr>
                    <th colSpan='3' className='text-center font-bold text-lg'>Appointment Details:</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover">
                    <th>1</th>
                    <td>Appointment Date:</td>
                    <td>{formatDateForConfirmation(appointment.date)}</td>
                  </tr>
                  <tr className="hover">
                    <th>2</th>
                    <td>Appointment Service:</td>
                    <td>{appDetail.service}</td>
                  </tr>
                  <tr className="hover">
                    <th>3</th>
                    <td>Appointment timeSlot:</td>
                    <td>{appDetail.timeSlot}</td>
                  </tr>
                  <tr className="hover">
                    <th>4</th>
                    <td>Appointment Status:</td>
                    <td>{displayedStatus}</td>
                  </tr>
                  <tr className="hover">
                    <th>5</th>
                    <td>Parts Needed:</td>
                    <td>{appDetail.partsNeeded}</td>
                  </tr>
                  <tr className="hover">
                    <th>6</th>
                    <td>Technician:</td>
                    <td>{appointment.technician}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="divider divider-horizontal"></div>
          <div className="card rounded-box flex-grow p-3 w-full">
            <div className="w-full h-96">
              <GoogleMapSection address={appointment.address}/>
            </div>
            <div className="mt-10">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text text-start">Customer Uploaded Photos</span>
              </div>
              <div className='flex space-x-1'>
                {appointment.images.map((image, index) => (
                <>
                  <button onClick={()=>document.getElementById(`customer_photo_${index}`).showModal()}>
                    <Image src={image} alt='customer photo' width='24' height='24' className="w-24 h-24"/>
                  </button>
                    <dialog id={`customer_photo_${index}`} className="modal">
                      <div className="modal-box">
                        <Image src={image} alt='customer photo' width='5000' height='5000'/>
                      </div>
                      <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                      </form>
                    </dialog>
                </>
              ))}
              </div>

            </label>
            </div>
            <div className="mt-5">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text text-start">Customer Additonal Notes</span>
              </div>
              <textarea className="textarea h-24 textarea-bordered" placeholder="Customer notes" value={appointment.detail} readOnly></textarea>
            </label>
            </div>
            <div className='mt-5'>
              <Link href='/admin/inventory'>
              <button className="btn btn-primary">Check Inventory</button>
              </Link>
              <button className="btn btn-primary ml-5" onClick={handleContactCustomer}>Contact Customer</button>
            </div>
            {/* <div className="mt-5">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Update appointment status</span>
              </div>
              <div className='flex items-center space-x-2'>
                <select className="select select-bordered flex-grow" ref={statusRef}>
                  <option disabled selected>Change appointment status</option>
                  <option>Unasigned</option>
                  <option>Asigned</option>
                  <option>Complete</option>
                  <option>Invoiced</option>
                </select>
              <button class="btn btn-active btn-primary ml-3 w-40" onClick={updateStatus}>{ updateLoading ? <span className="loading loading-dots loading-md"></span> :'Update Status'}</button>
              </div>
            </label>

            </div> */}
            {/* <div className="mt-5">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text text-start">Create invoice if appointment status is complete</span>
              </div>
              <button className="btn btn-active btn-primary">Generate Invoice</button>
            </label>
            </div> */}
          </div>
        </div>
      </div>
    </dialog>

  )
}