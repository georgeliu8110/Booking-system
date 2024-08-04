'use client';

import { useEffect, useState, Suspense, lazy} from 'react';
import useGetCustomerInfo from '@/app/_hooks/customerInfo-api/useGetCustomerInfo';
import { auth } from "@/app/lib/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import useGetAppointments from '@/app/_hooks/appointments-api/useGetAppointments';
import RescheduleAppModal from '@/app/components/RescheduleAppModal';
import useGetCustomerBalance from '@/app/_hooks/customerInfo-api/useGetCustomerBalance';
import useGetServices from '@/app/_hooks/service-api/useGetServices';

const CustomerProfileAppCard = lazy(() => import('@/app/components/CustomerProfileAppCard'));

export default function CustomerProfile() {

  const [user, loading, error] = useAuthState(auth);
  const [enableEdit, setEnableEdit] = useState(false);
  const {data: customerInfoData, error: customerInfoError, isLoading: customerInfoLoading} = useGetCustomerInfo(user.email);
  const { data: appData, error: appError, isLoading: appLoading } = useGetAppointments(null, user.email);
  const { data: customerBalanceData, error: customerBalanceError, isLoading: customerBalanceLoading } = useGetCustomerBalance(user.email);
  const { data: serviceList, error: serviceListError, isLoading: serviceListLoading} = useGetServices();
  console.log('serviceList', serviceList)
  console.log('customerBalanceData', customerBalanceData)

  const [editCustomerInfo, setEditCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    zip: '',
  });
  const [successMessage, setSuccessMessage] = useState(false);

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

  if (loading || customerInfoLoading || appLoading || customerBalanceLoading || serviceListLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
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

      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
      }, 3000)

    } catch (error) {
      console.error('Error:', error);
    }

    };

  return (
    <>
    <div className="h-15 relative">
      <div className={`alert alert-success fixed right-0 bg-green-500 text-white p-4 rounded-l-lg shadow-md transition-transform transform ${successMessage ? 'translate-x-0' : 'translate-x-full'}`} role="alert">
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
        <span>Your changes have been saved!</span>
      </div>
    </div>
    <div className="flex pt-10">

    <div className="flex flex-col mx-8 w-1/2">
      <div className="card rounded-box grid place-items-center">
        <form className="flex-grow grid card rounded-box place-items-center gap-8 h-full " onSubmit={submitHandler}>
          <div className='col-span-2 py-10'>
            <h1 className='text-center font-bold text-3xl'>My Profile</h1>
          </div>
            <label className="input input-bordered flex items-center gap-2 w-full max-w-sm">
            First Name:
            <input type="text" name='first_name' className="grow" value={editCustomerInfo.firstName} disabled={!enableEdit} onChange={(e) => setEditCustomerInfo((prev) => ({...prev, firstName: e.target.value}))}/>
          </label>
          <label className="input input-bordered flex items-center gap-2 w-full max-w-sm">
            Last Name:
            <input type="text" name='last_name' className="grow" value={editCustomerInfo.lastName} disabled={!enableEdit} onChange={(e) => setEditCustomerInfo((prev) => ({...prev, lastName: e.target.value}))}/>
          </label>
          <label className="input input-bordered flex items-center gap-2 w-full max-w-sm">
            Email
            <input type="text" name='email' className="grow" disabled value={editCustomerInfo.email} />
          </label>
          <label className="input input-bordered flex items-center gap-2 w-full max-w-sm">
            Phone:
            <input type="text" name='phone' className="grow" value={editCustomerInfo.phone} disabled={!enableEdit} onChange={(e) => setEditCustomerInfo((prev) => ({...prev, phone: e.target.value}))}/>
          </label>
          <label className="input input-bordered flex items-center gap-2 w-full max-w-sm">
            Street:
            <input type="text" name='street' className="grow" value={editCustomerInfo.street} disabled={!enableEdit} onChange={(e) => setEditCustomerInfo((prev) => ({...prev, street: e.target.value}))}/>
          </label>
          <label className="input input-bordered flex items-center gap-2 w-full max-w-sm">
            City:
            <input type="text" name='city' className="grow" value={editCustomerInfo.city} disabled={!enableEdit} onChange={(e) => setEditCustomerInfo((prev) => ({...prev, city: e.target.value}))} />
          </label>
          <label className="input input-bordered flex items-center gap-2 w-full max-w-sm">
            State:
            <input type="text" name='state' className="grow" value={editCustomerInfo.state} disabled={!enableEdit} onChange={(e) => setEditCustomerInfo((prev) => ({...prev, state: e.target.value}))}/>
          </label>
          <label className="input input-bordered flex items-center gap-2 w-full max-w-sm">
            Zip:
            <input type="text" name='zip' className="grow" value={editCustomerInfo.zip} disabled={!enableEdit} onChange={(e) => setEditCustomerInfo((prev) => ({...prev, zip: e.target.value}))}/>
          </label>
          <div className="col-span-2 flex justify-center w-full">
            <button type={!enableEdit? 'submit' : 'button'} className="btn ring-2 w-56" onClick={editProfileHandler}>
              {enableEdit ? 'Save' : 'Edit My Profile'}
            </button>
          </div>
        </form>
      </div>
      <div className="divider"></div>
      <div className="card rounded-box grid h-20 place-items-center">
      <h1 className='text-center font-bold text-3xl'>Account Balance</h1>
      <div className='my-8'>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr className='text-2xl'>
              <th></th>
              <th>Invoice # </th>
              <th>Job</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {customerBalanceData && customerBalanceData.appointmentsInvoiced.map((app, index) => {
              return (
                <tr key={index} className='text-lg'>
                  <td>{index + 1}</td>
                  <td>{app.invoiceNumber}</td>
                  <td>{(serviceList.find(service => service.id === app.serviceId))?.name}</td>
                  <td>${app.invoiceBalance}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      </div>

      <div className="stats text-primary-content my-8">
        <div className="stat flex items-center ">
          <div className="stat-title font-bold text-2xl">Current balance:</div>
          <div className="stat-value text-blue-700">${`${customerBalanceData?.customerBalance}`}</div>
          <div className="stat-actions mb-3">
            <button className="btn btn-sm btn-success">Pay Balance</button>
          </div>
        </div>
      </div>

      </div>
    </div>
      <div className="divider divider-horizontal"></div>
      <div>
        <h1 className="text-center font-bold text-3xl my-10 ">My Appointments</h1>
        <div className="grid grid-cols-2 gap-3 card rounded-box place-items-center mx-10 px-20 h-[820px] overflow-y-auto">
          {appData.map((app, index) => {
          return (
            <>
            <Suspense fallback={<span className="loading loading-dots loading-md"></span>}>
               <CustomerProfileAppCard app={app} index={index} user={user}/>
            </Suspense>
            </>
          )
        })}
        </div>
      </div>
    </div>
    </>

  )
}