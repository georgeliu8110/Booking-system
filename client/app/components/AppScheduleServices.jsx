"use client";

import React, { useState, useEffect } from "react";
import { timeSlots} from "@/constants";
import useGetDayTimeSlots from "../_hooks/timeslot-api/useGetDayTimeSlots";
import { v4 as uuidv4 } from 'uuid';

export default function AppScheduleServices({setCustomerInput, customerInput}) {

  const [startDate, setStartDate] = useState(new Date().toLocaleDateString('en-CA'));
  const dateWithNoHyphens = formatDate(startDate);
  const { data: timeSlotsList, error: timeSlotsListError } =
    useGetDayTimeSlots(dateWithNoHyphens);

  useEffect(() => {
    setCustomerInput((prev) => ({ ...prev, serviceDate: startDate }));
  }, [dateWithNoHyphens])

  const serviceDateHandler = (e) => {
    setStartDate(e.target.value);
  };

  const appointmentInputHandler = (e) => {
    const timeSlotKey = Object.keys(timeSlots).find(
      (timeSlotKey) => timeSlots[timeSlotKey] === e.target.value
    );
    setCustomerInput((prev) => ({ ...prev, appointment: timeSlotKey }));
  };

  return (
    <>
    <h1 className="text-3xl font-bold col-span-2 py-20">SCHEDULE YOUR APPOINTMENT</h1>
    <div className="dropdown col-span-1">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-lg w-full">
          Service Date - {formatDateToUS(startDate)}
        </div>
        <div tabIndex={0} className="dropdown-content z-[1] card card-compact w-64 p-2 shadow bg-gray-500">
          <div className="card-body">
            <h3 className="card-title text-white">Please select the date</h3>
            <input
              type='date'
              className="text-black w-full"
              value={startDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={serviceDateHandler}>
            </input>
          </div>
        </div>
      </div>
      <div className="col-span-1">
        <select
          className="select select-bordered select-lg w-full"
          onChange={appointmentInputHandler}>
          <option disabled selected>Appointment Time Slots</option>
          {!timeSlotsList.TS79 && <option>{timeSlots.TS79}</option>}
          {!timeSlotsList.TS911 && <option>{timeSlots.TS911}</option>}
          {!timeSlotsList.TS111 && <option>{timeSlots.TS111}</option>}
          {!timeSlotsList.TS13 && <option>{timeSlots.TS13}</option>}
          {!timeSlotsList.TS35 && <option>{timeSlots.TS35}</option>}
          {!timeSlotsList.TS57 && <option>{timeSlots.TS57}</option>}
        </select>
      </div>
    </>
  );
}

function formatDate(startDate) {
  const formattedDate = startDate.split("-");

  let [year, month, day] = formattedDate;
  if (month.length === 1 ) {
    month = "0" + month;
  }
  if (day.length === 1) {
    day = "0" + day;
  }
  const dateWithNoHyphens = month + day + year;
  return dateWithNoHyphens;
}

function formatDateToUS(startDate) {

  const formattedDate = startDate.split("-");

  let [year, month, day] = formattedDate;
  if (month.length === 1) {
    month = "0" + month;
  }
  if (day.length === 1) {
    day = "0" + day;
  }
  return `${month}/${day}/${year}`;
}
