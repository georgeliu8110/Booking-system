"use client";

import { timeSlots } from "@/constants";
import { formatDate } from "../utility/formatDateUtil";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { app } from "../firebase/config";
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
          <Link href='/customerProfilePage'><button className="btn btn-primary">View my appointment</button></Link>
        </div>
      </div>
    </div>
    </>
  );
}


