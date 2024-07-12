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

export default function AppConfirmation() {
  return (
    <Suspense fallback={<p>Loading ... </p>}>
      <AppointmentInfo />
    </Suspense>
  );
}

function AppointmentInfo() {

  const searchParams = useSearchParams();
  const appointment = searchParams.get("appointment");
  const parsedApp = JSON.parse(appointment);
  const [user] = useAuthState(auth);

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
    const eventDetails = {
      summary: 'Meeting with Bob',
      description: 'Discuss project updates',
      start: {
        dateTime: '2024-07-08T10:00:00-07:00',
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: '2024-07-08T11:00:00-07:00',
        timeZone: 'America/Los_Angeles',
      },
    };

    await addEvent(eventDetails);
  }


  return (
    <>
    <div className="hero h-full mt-auto mb-auto py-10">
      <div className="hero-content flex-col lg:flex-row">
        <img src="tick.png" className="max-w-sm " />
        <div className='ml-10'>
          <h1 className="text-4xl">{`Hi ${parsedApp.customerInfo.name}! Your following appointment is confirmed:`}</h1>
          <br />
          <br />
          <h1 className="text-5xl">{`Time:`}</h1>
          <br />
          <h1 className="text-5xl font-bold underline">{`${formatDateForConfirmation(parsedApp.appointmentTime.date)} ${timeSlots[parsedApp.appointmentTime.timeSlot]}`}</h1>
          <br />
          <br />
          <h1 className="text-5xl">{`Service location:`}</h1>
          <br />
          <h1 className="text-5xl font-bold underline">{`${parsedApp.customerInfo.address}`}</h1>
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


