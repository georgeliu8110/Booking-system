"use client";

import { timeSlots } from "@/constants";
import { formatDate } from "../utility/formatDateUtil";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { app, auth} from "../lib/firebase/config";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {formatDateForConfirmation} from '@/app/utility/formatDateForConfirmation';
import useGetServices from '@/app/_hooks/service-api/useGetServices';
import formatDateToISO from '@/app/utility/formatDateToISO';

export default function AppConfirmation() {
  return (
    <>
    <AppointmentInfo />
    </>
  );
}

function AppointmentInfo() {

  const searchParams = useSearchParams();
  const appointment = searchParams.get("appointment");
  const parsedApp = JSON.parse(appointment);
  const [user] = useAuthState(auth);
  const { data: serviceData, isLoading, error: serviceError } = useGetServices();

  if (isLoading || serviceData.length === 0) {

    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-bars loading-lg">hahahaha</span>
      </div>
    );
  }

  const serviceName = serviceData.find(service => service.id === parsedApp.appointmentTime.serviceId)?.name

  const addEvent = async (eventDetails) => {

    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/addEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(eventDetails),
      });

      const data = await response.json();
      console.log('Event added:', data);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };


  const addAppointmentToCalendarHandler = async () => {

    const startAndEndTime = (timeString) => {
      const time = timeSlots[timeString].split('-');
      const start = time[0].includes('am') ? `${time[0].replace('am', '')}` : String(Number(`${time[0].replace('pm', '')}`) + 12);
      const formattedStartTime = start.length === 1 ? `0${start}:00:00` : `${start}:00:00`;
      const end = time[1].includes('am') ? `${time[1].replace('am', '')}` : String(Number(`${time[1].replace('pm', '')}`) + 12);
      const formattedEndTime = end.length === 1 ? `0${end}:00:00` : `${end}:00:00`;

      return {
        formattedStartTime,
        formattedEndTime,
      }
    }

    const time = startAndEndTime(parsedApp.appointmentTime.timeSlot);
    const startDateTime = formatDateToISO(parsedApp.appointmentTime.date, time.formattedStartTime, '-05:00');
    const endDateTime = formatDateToISO(parsedApp.appointmentTime.date, time.formattedEndTime, '-05:00');

    const eventDetails = {
      summary: 'Plumbing Service',
      description: `Service: ${serviceName}`,
      start: {
        dateTime: startDateTime,
        timeZone: 'America/Chicago',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'America/Chicago',
      },
    };

    await addEvent(eventDetails);
  }


  return (
    <>
    <div className="hero h-full mt-auto mb-auto py-10">
      <div className="hero-content flex-col lg:flex-row">
        <img src="tick.png" className="max-w-sm mr-10 pr-5" />
        <div className='ml-10 pl-10'>
          <h1 className="text-4xl">{`Hi ${parsedApp.customerInfo.name}! Your following appointment is confirmed:`}</h1>
          <br />
          <br />
          <h1 className="text-5xl underline">{`Time:`}</h1>
          <br />
          <h1 className="text-5xl font-bold">{`${formatDateForConfirmation(parsedApp.appointmentTime.date)} ${timeSlots[parsedApp.appointmentTime.timeSlot]}`}</h1>
          <br />
          <br />
          <h1 className="text-5xl underline">{`Service:`}</h1>
          <br />
          <h1 className="text-5xl font-bold">{`${serviceName}`}</h1>
          <br />
          <br />
          <h1 className="text-5xl underline">{`Location:`}</h1>
          <br />
          <h1 className="text-5xl font-bold ">{`${parsedApp.customerInfo.address}`}</h1>
          <br />
          <p className="py-6">You can go to client portal to manage your appointments</p>
          <Link href='/customerProfilePage'><button className="btn btn-primary">View my appointments</button></Link>
          <button className="btn btn-primary ml-6" onClick={addAppointmentToCalendarHandler}>Add to my calendar</button>
        </div>
      </div>
    </div>
    </>
  );
}


