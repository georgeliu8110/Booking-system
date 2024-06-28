'use client';

import { useEffect, useState } from 'react';
import useGetCustomerInfo from '@/app/_hooks/customerInfo-api/useGetCustomerInfo';
import { auth } from "@/app/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import useGetAppointments from '@/app/_hooks/appointments-api/useGetAppointments';
import formatDateForConfirmation from '@/app/utility/formatDateForConfirmation';
import useGetServices from '@/app/_hooks/service-api/useGetServices';
import {timeSlots} from '@/constants';

export default function CustomerProfile() {

  const [user, loading, error] = useAuthState(auth);
  const [enableEdit, setEnableEdit] = useState(false);
  const {data: customerInfoData, error: customerInfoError, isLoading: customerInfoLoading} = useGetCustomerInfo(user.email);
  const { data: appData, error: appError, isLoading: appLoading } = useGetAppointments(null, user.email);
  const { data: serviceData, error: serviceError, isLoading: serviceLoading } = useGetServices();

  const [editCustomerInfo, setEditCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    zip: '',
  });

  useEffect(() => {
    if (customerInfoData && customerInfoData.length > 0) {
      setEditCustomerInfo({
        firstName: customerInfoData[0].firstName,
        lastName: customerInfoData[0].lastName,
        email: customerInfoData[0].email,
        phone: customerInfoData[0].phone,
        street: customerInfoData[0].street,
        city: customerInfoData[0].city,
        state: customerInfoData[0].state,
        zip: customerInfoData[0].zip,
      });
    }
  }, [customerInfoData]);

  if (loading || customerInfoLoading || appLoading || serviceLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  const findServiceName = (serviceId) => {
    if (serviceData && serviceData.length > 0) {
      return serviceData.find(service => service.id === serviceId).name;
    }
  }

  const editProfileHandler = () => {
    if (enableEdit) {
    setEnableEdit(false);
    } else {
    setEnableEdit(true);
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/customerInfo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editCustomerInfo),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log('Customer edit info response', responseData);

    } catch (error) {
      console.error('Error:', error);
    }

    };


  return (
    <>
    <div className="flex w-full pt-10">
    <form className="flex-grow card rounded-box place-items-center gap-8" onSubmit={submitHandler}>
      <div className='col-span-2 py-10'>
        <h1 className='text-center font-bold text-3xl'>My Profile</h1>
      </div>
        <label className="input input-bordered flex items-center gap-2 w-full max-w-sm">
        First Name:
        <input type="text" className="grow" value={editCustomerInfo.firstName} disabled={!enableEdit} onChange={(e) => setEditCustomerInfo((prev) => ({...prev, firstName: e.target.value}))}/>
      </label>
      <label className="input input-bordered flex items-center gap-2 w-full max-w-sm">
        Last Name:
        <input type="text" className="grow" value={editCustomerInfo.lastName} disabled={!enableEdit} onChange={(e) => setEditCustomerInfo((prev) => ({...prev, lastName: e.target.value}))}/>
      </label>
      <label className="input input-bordered flex items-center gap-2 w-full max-w-sm">
        Email
        <input type="text" className="grow" disabled value={editCustomerInfo.email} />
      </label>
      <label className="input input-bordered flex items-center gap-2 w-full max-w-sm">
        Phone:
        <input type="text" className="grow" value={editCustomerInfo.phone} disabled={!enableEdit} onChange={(e) => setEditCustomerInfo((prev) => ({...prev, phone: e.target.value}))}/>
      </label>
      <label className="input input-bordered flex items-center gap-2 w-full max-w-sm">
        Street:
        <input type="text" className="grow" value={editCustomerInfo.street} disabled={!enableEdit} onChange={(e) => setEditCustomerInfo((prev) => ({...prev, street: e.target.value}))}/>
      </label>
      <label className="input input-bordered flex items-center gap-2 w-full max-w-sm">
        City:
        <input type="text" className="grow" value={editCustomerInfo.city} disabled={!enableEdit} onChange={(e) => setEditCustomerInfo((prev) => ({...prev, city: e.target.value}))} />
      </label>
      <label className="input input-bordered flex items-center gap-2 w-full max-w-sm">
        State:
        <input type="text" className="grow" value={editCustomerInfo.state} disabled={!enableEdit} onChange={(e) => setEditCustomerInfo((prev) => ({...prev, state: e.target.value}))}/>
      </label>
      <label className="input input-bordered flex items-center gap-2 w-full max-w-sm">
        Zip:
        <input type="text" className="grow" value={editCustomerInfo.zip} disabled={!enableEdit} onChange={(e) => setEditCustomerInfo((prev) => ({...prev, zip: e.target.value}))}/>
      </label>
      <button type={!enableEdit? 'submit' : 'button'} className="btn ring-2" onClick={editProfileHandler}>{enableEdit ? 'Save' : 'Edit My Profile'}</button>
    </form>
      <div className="divider divider-horizontal"></div>
      <div className="grid card rounded-box place-items-center m-5 px-10">
        <h1 className="text-center font-bold text-3xl">My Appointments</h1>
        {appData.map((app, index) => {
        return (
          <div className="card bg-gray-200 w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Appointment #{index+1}</h2>
              <p>Date: {formatDateForConfirmation(app.date)}</p>
              <p>Service: {findServiceName(app.serviceId)}</p>
              <p>Time: {timeSlots[app.timeSlot]}</p>
              <div className="card-actions justify-center mt-3">
                <button className="btn btn-primary px-7">Cancel</button>
                <button className="btn btn-primary">Reschedule</button>
              </div>
            </div>
          </div>
        )
      })}
      </div>
    </div>
    </>

  )
}