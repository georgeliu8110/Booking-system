"use client";

import { timeSlots } from "@/constants";
import { formatDate } from "../utility/formatDateUtil";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { app } from "../firebase/config";

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

function formatDateForConfirmation(dateString) {

  const month = parseInt(dateString.slice(0, 2), 10);
  const day = parseInt(dateString.slice(2, 4), 10);
  const year = parseInt(dateString.slice(4, 8), 10);

  // Create a new Date object
  const date = new Date(year, month - 1, day);

  // Define arrays for days and months
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Get the formatted parts of the date
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dateNum = date.getDate();
  const yearNum = date.getFullYear();

  // Return the formatted date string
  return `${dayName} ${monthName} ${dateNum}, ${yearNum}`;
}


