import { v4 as uuidv4 } from 'uuid';
import usePostAppointment from "../_hooks/appointments-api/usePostAppointment";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import StepContext from "@/app/context/stepContext";
import {formatDateForConfirmation} from '@/app/utility/formatDateForConfirmation';
import { timeSlots } from "@/constants";

export default function AppSummary({setCustomerInput, customerInput}) {

  const stepCtx = useContext(StepContext);

  const {
    postAppointment,
    error: appointmentPostError,
    isLoading: appointmentPostLoading,
  } = usePostAppointment();
  const router = useRouter();

  const { service, serviceDate, detail, images, appointment, firstName, lastName, email, phone, street, apt, state, city, zip } = customerInput;

  const bookAppointment = async () => {

    const data = {
      appointmentTime: {
        date: formatDate(serviceDate),
        timeSlot: appointment,
        serviceId: service.id,
        status: "Unassigned",
        confirmationNumber: uuidv4(),
        images: images,
        detail: detail,
      },
      customerInfo: {
        address: `${street} ${apt}, ${city}, ${state} ${zip}`,
        name: firstName + " " + lastName,
        phoneNumber: phone,
        email: email,
      },
    };

    try {
      const response = await postAppointment(data);

      await fetch('/api/sendConfirmationEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName,
          date: formatDateForConfirmation(data.appointmentTime.date),
          appointment: timeSlots[appointment],
          address: data.customerInfo.address,
        }),
      });

      //send response data to confirmation page as url param
      const params = new URLSearchParams({
        appointment: JSON.stringify(response),
      });

      router.push(`/appointmentconfirmed?${params}`);

      stepCtx.resetStep();
      setCustomerInput({
        service: "",
        detail: "",
        serivceDate: "",
        appointment: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        street: "",
        apt: "",
        state: "",
        city: "",
        zip: "",
      })
    } catch (error) {
      console.log("error post appointment", error);
    }
  };

  return (

    <div className="flex flex-col items-center mt-6 py-20">
      <div className="w-full max-w-lg border-4 rounded-3xl border-gray-300 shadow-md py-10 h-auto px-8">
        <h1 className="pb-6 font-bold text-3xl">Appointment Summary:</h1>
        <p className="py-2 text-xl">Name: {firstName + " " + lastName}</p>
        <p className="py-2 text-xl">Phone number: {phone}</p>
        <p className="py-2 text-xl">Selected service: {service.name}</p>
        <p className="py-2 text-xl">Selected date: {formatDateToUS(serviceDate)}</p>
        <p className="py-2 text-xl">Selected time: {timeSlots[appointment]}</p>
      </div>
        <button
          className="btn btn-primary mt-8"
          onClick={bookAppointment}>
          Book Appointment
        </button>
    </div>

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
