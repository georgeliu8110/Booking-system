import { headers } from "next/headers";
import { db, FieldValue } from "@/app/firestore/config";

export const dynamic = "force-dynamic"; // have next js NOT cache this request

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get("date");

  try {
    const querySnapshot = await db.collection("customerInfo").get();
    const queryData = querySnapshot.docs.map(doc => doc.data())

    const data = queryData.reduce((acc, customer) => {
      const appointmentForSelectedDate = customer.appointments.find(appointment => appointment.date === date)
      console.log("appointmentForSelectedDate", appointmentForSelectedDate)
      if (appointmentForSelectedDate) {
        acc.push({
          name: customer.name,
          time: appointmentForSelectedDate.timeSlot,
          serviceId: appointmentForSelectedDate.serviceId,
          status: appointmentForSelectedDate.status
         })
      }
      return acc
    }, [])

    const body = JSON.stringify({ data });
    return new Response(body, {
      status: 200,
    });
  } catch (error) {
    const body = JSON.stringify({
      data: [],
      message: `failed to get appointments list for day: ${date}`,
      error: error?.message,
    });

    return new Response(body, {
      status: 500,
    });
  }
}

export async function POST(request) {
  const appointmentData = await request.json();
  console.log("appointmentData", appointmentData)

  try {

    await addOrUpdateAppointment(appointmentData);

    const body = await JSON.stringify(appointmentData.appointmentTime);
    return new Response(body, {
      status: 200,
    });
  } catch (error) {
    const body = JSON.stringify({
      data: [],
      message: { message: `failed to create appointment`, appointmentData },
      error: error?.message,
    });

    return new Response(body, {
      status: 500,
    });
  }
}


async function addOrUpdateAppointment(appointmentData) {
  const { customerInfo, appointmentTime } = appointmentData;

  try {
    const customerRef = db.collection('customerInfo');
    const customerQuery = await customerRef.where('address', '==', customerInfo.address);
    const customerSnapshot = await customerQuery.get();
    const customerData = customerSnapshot.docs.map(doc => doc.data())

    if (!customerSnapshot.empty) {
      // Customer exists, add appointment to the existing document
      const customerDoc = customerSnapshot.docs[0];
      const customerDocRef = customerDoc.ref;
      console.log('Updating existing customer:', customerDoc.id);

      console.log('appointmentTime:', appointmentTime )

      await customerDocRef.update({
        appointments: FieldValue.arrayUnion(appointmentTime)
      });
      console.log('Appointment added to existing customer');
    } else {
      // Customer does not exist, create a new document
      const newCustomerRef = customerRef.doc();
      console.log('Creating new customer document:', newCustomerRef.id);

      await newCustomerRef.set({
        ...customerInfo,
        appointments: [appointmentTime]
      });
      console.log('New customer created and appointment added');
    }
  } catch (error) {
    console.error('Error adding or updating appointment:', error);
  }
}
