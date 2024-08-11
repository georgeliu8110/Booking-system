import { db, FieldValue } from "@/app/lib/firestore/config";

export async function POST(request) {
  const appointmentData = await request.json();
  const { email, appId, status } = appointmentData;

  try {
    const customerQueryRef = db.collection('customerInfo').where("email", "=", email).limit(1);
    const customerQuerySnapshot = await customerQueryRef.get();

    if (customerQuerySnapshot.empty) {
      return new Response(JSON.stringify({
        message: 'No customer found with the provided email',
      }), { status: 404 });
    }

    const customerDoc = customerQuerySnapshot.docs[0];
    const customerDocRef = customerDoc.ref;

    await db.runTransaction(async (transaction) => {
      const customerDocSnapshot = await transaction.get(customerDocRef);

      if (!customerDocSnapshot.exists) {
        throw new Error("Customer document does not exist.");
      }

      const customerDocData = customerDocSnapshot.data();
      const updatedAppointments = customerDocData.appointments.map(appointment => {
        if (appointment.confirmationNumber === appId) {
          return { ...appointment, status };
        }
        return appointment;
      });

      transaction.update(customerDocRef, { appointments: updatedAppointments });
    });

    const body = JSON.stringify({ status });
    return new Response(body, { status: 200 });

  } catch (error) {
    console.error("Failed to update appointment status:", error.message);

    const body = JSON.stringify({
      data: [],
      message: 'Failed to update appointment status',
      error: error.message,
    });

    return new Response(body, { status: 500 });
  }
}
