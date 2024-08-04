import { headers } from "next/headers";
import { db, FieldValue } from "@/app/lib/firestore/config";

export const dynamic = "force-dynamic"; // have next js NOT cache this request

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get("date")
  const email = searchParams.get("email");

  try {
    if (date && date !== 'null') {
      const querySnapshot = await db.collection("customerInfo").get();
      const queryData = querySnapshot.docs.map(doc => doc.data())


      const data = queryData.reduce((acc, customer) => {
      const appointmentsForSelectedDate = customer.appointments.filter(appointment => appointment.date === date)
      if (appointmentsForSelectedDate.length > 0) {
        appointmentsForSelectedDate.forEach(appointmentForSelectedDate => {
        acc.push({
          name: customer.name,
          address: customer.address,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          date: appointmentForSelectedDate.date,
          time: appointmentForSelectedDate.timeSlot,
          serviceId: appointmentForSelectedDate.serviceId,
          status: appointmentForSelectedDate.status,
          appId: appointmentForSelectedDate.confirmationNumber,
          detail: appointmentForSelectedDate.detail,
          images: appointmentForSelectedDate.images,
          signature: appointmentForSelectedDate.signature,
          technician: appointmentForSelectedDate.technician,
          inovice: appointmentForSelectedDate.invoice,
          })
      })
    }
    return acc
  }, [])

    const body = JSON.stringify({ data });
    return new Response(body, {
      status: 200,
    });
    } else if (email) {
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

    await addAppointment(appointmentData);

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

export async function DELETE(request) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const email = searchParams.get('email');

  try {
    const response = await deleteAppointment(id, email);

    const body = JSON.stringify({id, email});

    return new Response( body , {
      status: 200,
    })
  } catch (error) {
    const body = JSON.stringify({
      data: [],
      message: `failed to delete appointment with id: ${id}`,
      error: error?.message,
    });

    return new Response(body, {
      status: 500,
    });
  }
}

export async function PUT(request) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const email = searchParams.get('email');
  const date = searchParams.get('date');
  const timeSlot = searchParams.get('timeSlot');

  try {
    await updateAppointment(id, email, date, timeSlot);

    const body = JSON.stringify({id, email, date, timeSlot});

    return new Response(body, {
      status: 200,
    })

  } catch (error) {
    const body = JSON.stringify({
      data: [],
      message: `failed to update appointment with id: ${id}`,
      error: error?.message,
    });

    return new Response(body, {
      status: 500,
    });
  }
}


async function addAppointment(appointmentData) {
  const { customerInfo, appointmentTime } = appointmentData;

  try {
    const customerRef = db.collection('customerInfo');
    const customerQuery = await customerRef.where('email', '==', customerInfo.email);
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

async function deleteAppointment(id, email) {

  try {
    const customerQuerySnapshot = await db.collection('customerInfo').where('email', '==', email).get();

    if (customerQuerySnapshot.empty) {
      console.log('No matching documents.');
      return;
    }

    const customerDoc = customerQuerySnapshot.docs[0]
    const customerDocData = await customerQuerySnapshot.docs.map(doc => doc.data())[0];
    const customerDocRef = await customerDoc.ref;
    const appTobeDeleted = customerDocData.appointments.find(appointment => appointment.confirmationNumber === id);
    await customerDocRef.update({
      appointments: FieldValue.arrayRemove(appTobeDeleted)
    })
  } catch (error) {
    console.error('Error deleting appointment:', error);
  }
}

async function updateAppointment(id, email, date, timeSlot) {
  const customerRef = db.collection('customerInfo').where('email', '==', email);
  const customerQuerySnapshot = await customerRef.get();

  if (customerQuerySnapshot.empty) {
    console.log('No matching documents.');
    return;
  }

  const customerDoc = customerQuerySnapshot.docs[0];
  const customerDocRef = customerDoc.ref;

  try {
    await db.runTransaction(async (transaction) => {
      // Read the customer document
      const customerDocSnapshot = await transaction.get(customerDocRef);

      if (!customerDocSnapshot.exists) {
        throw "Document does not exist!";
      }

      const customerData = customerDocSnapshot.data();

      // Update specific fields in the nested appointment object
      const updatedAppointments = customerData.appointments.map((appointment) => {
        if (appointment.confirmationNumber === id) {
          return {
            ...appointment,
            date: date,
            timeSlot: timeSlot
          };
        }
        return appointment;
      });

      // Commit the transaction with the updated appointments array
      transaction.update(customerDocRef, { appointments: updatedAppointments });
    });

    console.log('Appointment fields updated successfully.');
  } catch (error) {
    console.error('Error updating appointment:', error);
  }
}
