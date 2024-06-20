import { v4 as uuidv4 } from 'uuid';
import usePostAppointment from "../_hooks/appointments-api/usePostAppointment";
import { useRouter } from "next/navigation";

export default function AppSummary({setCustomerInput, customerInput}) {

  const {
    postAppointment,
    error: appointmentPostError,
    isLoading: appointmentPostLoading,
  } = usePostAppointment();
  const router = useRouter();

  const { service, serviceDate, detail, appointment, firstName, lastName, email, phone, street, apt, state, city, zip } = customerInput;

  const bookAppointment = async () => {

    const data = {
      appointmentTime: {
        date: formatDate(serviceDate),
        timeSlot: appointment,
        serviceId: service.id,
        status: "pending",
        confirmationNumber: uuidv4()
      },
      customerInfo: {
        address: street + " " + apt,
        name: firstName + " " + lastName,
        phoneNumber: phone,
        email: email,
      },
    };

    try {
      const response = await postAppointment(data);

      //send response data to confirmation page as url param
      const params = new URLSearchParams({
        appointment: JSON.stringify(response),
      });
      // console.log("response", response);
      router.push(`/appointmentconfirmed?${params}`);
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
        <p className="py-2 text-xl">Selected date: {serviceDate}</p>
        <p className="py-2 text-xl">Selected time: {appointment}</p>
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

  console.log("formattedDate", formattedDate)

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
  console.log("startDate", startDate)
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
