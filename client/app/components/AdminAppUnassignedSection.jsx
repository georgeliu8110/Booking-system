import { useState } from 'react';

export default function AdminAppUnassignedSection({appointment, appDetail, index}) {

  const [ technician, setTechnician ] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ success, setSuccess ] = useState(false);

  const { address, appId, date, detail, email, images, name, phoneNumber, serviceId, status, time } = appointment;
  const { timeSlot, service, partsNeeded} = appDetail;

  const assignHandler = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/assignTechnician', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
              body: JSON.stringify({
                email: email,
                appId: appId,
                technician: technician,
                status: "Assigned",
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

  return (
            <>
            { !success ? <div role="alert" className="alert alert-warning mb-10 mt-5">
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
              <span>This appointment has not been assigned yet, please assign it to one of the below technicians:</span>
            </div> :
            <div role="alert" className="alert alert-success mb-10 mt-5">
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
            <span> This appointment has been assigned to selected technician successfully!</span>
          </div>
            }
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Assign one technician to this appointment</span>
              </div>
              <div className='flex'>
                <select className="select select-bordered" onChange={(e) => setTechnician(e.target.value)}>
                  <option disabled selected>Technician List</option>
                  <option>Ron Weasley</option>
                  <option>Harry Potter</option>
                  <option>Severus Snape</option>
                  <option>Sirius Black</option>
                  <option>Luna Lovegood</option>
                </select>
              <button className="btn btn-primary ml-10 w-40" onClick={assignHandler}>{loading ? <span className="loading loading-dots loading-md"></span> : 'Confirm'}</button>
              </div>

            </label>
            </>
  )
}