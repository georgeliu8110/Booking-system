"use client";

import { timeSlots } from "@/constants";
import { formatDate } from "../utility/formatDateUtil";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { app } from "../firebase/config";
import formatDateForConfirmation from '@/app/utility/formatDateForConfirmation';

export default function AppConfirmation() {
  return (
    <Suspense fallback={<p>Loading ... </p>}>
      <AppointmentInfo />
    </Suspense>
  );
}

function AppointmentInfo() {
  const searchParams = useSearchParams();
  console.log("searchParams", searchParams)
  const appointment = searchParams.get("appointment");
  console.log("appointment", appointment);

  const parsedApp = JSON.parse(appointment);
  console.log("parsedApp", parsedApp)

  return (
    <>
    <div className="hero h-full mt-auto mb-auto py-10">
      <div className="hero-content flex-col lg:flex-row">
        <img src="tick.png" className="max-w-sm " />
        <div className='ml-10'>
          <h1 className="text-4xl">{`Hi ${parsedApp.customerInfo.name}! Your following appointment is confirmed:`}</h1>
          <br />
          <br />
          <h1 className="text-5xl font-bold">{`Time: ${formatDateForConfirmation(parsedApp.appointmentTime.date)} at ${timeSlots[parsedApp.appointmentTime.timeSlot]}`}</h1>
          <br />
          <h1 className="text-5xl font-bold">{`Service location: ${parsedApp.customerInfo.address}`}</h1>
          <p className="py-6">You can go to client portal to manage your appointments</p>
          <button className="btn btn-primary">Get Started</button>
        </div>
      </div>
    </div>
    </>
  );
}


