import { db, FieldValue } from "@/app/lib/firestore/config";

export async function POST (request) {

  const data = await request.json();
  const { email, appId, technician, status } = data;

  try {
    const customerQueryRef = await db.collection('customerInfo').where("email", "=", email);
    const customerQuerySnapshot = await customerQueryRef.get();
    const customerDoc = await customerQuerySnapshot.docs[0];
    const customerDocRef = customerDoc.ref;
    const customerDocData = customerDoc.data();
    const updatedAppointments = customerDocData.appointments.map(appointment => {
      if (appointment.confirmationNumber === appId) {
        return { ...appointment, status, technician};
      }
      return appointment;
    })

    await customerDocRef.update({ appointments: updatedAppointments });

    const body = JSON.stringify({ technician, status });

    return new Response(body, {
      status: 200,
    });
  } catch (error) {
    const body = JSON.stringify({
      data: [],
      message: `failed to update appointment status`,
      error: error?.message,
    });

    return new Response(body, {
      status: 500,
    });
  }
}