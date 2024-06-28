import { headers } from "next/headers";
import { db, FieldValue } from "@/app/firestore/config";

export const dynamic = "force-dynamic"; // have next js NOT cache this request

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  console.log('searchParams', searchParams  )
  const date = searchParams.get("date")
  const email = searchParams.get("email");

  console.log('date', date)
  console.log('email', email)

  try {
    if (date && date !== 'null') {
      console.log('date gogogog!!!!!', date)
      const querySnapshot = await db.collection("customerInfo").get();
      const queryData = querySnapshot.docs.map(doc => doc.data())


      const data = queryData.reduce((acc, customer) => {
      const appointmentForSelectedDate = customer.appointments.find(appointment => appointment.date === date)
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
    } else if (email) {
      console.log('email gogogog!!!!!', email)
      const customerRef = db.collection('customerInfo');
      const customerQuery = await customerRef.where('email', '==', email).get();
      const customerData = customerQuery.docs.map(doc => doc.data())
      const data = customerData[0].appointments;

      const body = JSON.stringify({ data });
      return new Response(body, {
        status: 200,
      });
    }
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

  try {

    await addOrUpdateAppointment(appointmentData);

    const body = await JSON.stringify(appointmentData);
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

      await customerDocRef.update({
        appointments: FieldValue.arrayUnion(appointmentTime)
      });
    } else {
      // Customer does not exist, create a new document
      const newCustomerRef = customerRef.doc();

      await newCustomerRef.set({
        ...customerInfo,
        appointments: [appointmentTime]
      });

    }
  } catch (error) {
    console.error('Error adding or updating appointment:', error);
  }
}
