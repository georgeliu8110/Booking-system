import {formatDateForConfirmation} from '@/app/utility/formatDateForConfirmation';
import {timeSlots} from '@/constants';
import useGetServices from '@/app/_hooks/service-api/useGetServices';
import { useState } from 'react'
import RescheduleAppModal from '@/app/components/RescheduleAppModal';

export default function CustomerProfileAppCard({app, index, user}) {

  const { data: serviceData, error: serviceError, isLoading: serviceLoading } = useGetServices();
  const [ deletedAppId, setDeletedAppId] = useState('');
  const [ appData, setAppData ] = useState(app);
  const [ appStatus, setAppStatus ] = useState('pending')

  if (serviceLoading) {
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

  const cancelHandler = async (id, email) => {

    try {
      const params = new URLSearchParams({id, email})
    const response = await fetch(`/api/appointments?${params}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    setDeletedAppId(result.id);
    setAppStatus('cancelled');
    console.log('Appointment cancelled successfully:', result);
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  }

  return (
    <div className="card bg-gray-200 w-96 shadow-xl mb-5">
      <RescheduleAppModal appData={appData} setAppData={setAppData} setAppStatus={setAppStatus}/>
      <div className="card-body">
        <h2 className="card-title">Appointment #{index+1} <span className="badge badge-neutral">{appStatus}</span></h2>
        <p>Date: {formatDateForConfirmation(appData.date)}</p>
        <p>Service: {findServiceName(appData.serviceId)}</p>
        <p>Time: {timeSlots[appData.timeSlot]}</p>
        { deletedAppId !== appData.confirmationNumber ?
          (<div className="card-actions justify-center mt-3">
            <button className="btn btn-primary px-7" onClick={() => cancelHandler(appData.confirmationNumber, user.email)}>Cancel</button>
            <button className="btn btn-primary" onClick={() => document.getElementById(`my_modal_${appData.confirmationNumber}`).showModal()}>Reschedule</button>
          </div>) :
          (<div className="card-actions justify-center mt-3">
            <button className="btn btn-primary" disabled>Appointment was cancelled!</button>
          </div>)
        }

      </div>
    </div>
  )}