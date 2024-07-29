import { useState } from 'react';
import AdminAppUnassignedSection from './AdminAppUnassignedSection';
import AdminAppAssignedSection from './AdminAppAssignedSection';

export default function AdminAppActionModal({appointment, appDetail, index}) {

  const [ step, setStep ] = useState(1);

  const { address, appId, date, detail, email, images, name, phoneNumber, serviceId, status, time } = appointment;
  const { timeSlot, service, partsNeeded} = appDetail;


  return (
    <dialog id={`appAction${index}${appointment.appId}`} className="modal min-w-96 w-full">
      <div className="modal-box w-full">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
          {status === "Unassigned" && (
            <AdminAppUnassignedSection appointment={appointment} appDetail={appDetail} index={index}/>
          )}
           {status !== "Unassigned" && (
            <AdminAppAssignedSection appointment={appointment} appDetail={appDetail} index={index} step={step} setStep={setStep}/>
          )}
      </div>
    </dialog>
  )
}