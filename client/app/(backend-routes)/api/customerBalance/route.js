import { db } from '@/app/lib/firestore/config';

export async function GET(request) {

  const params = request.nextUrl.searchParams;
  const email = params.get('email');

  try {
    const customerRef = db.collection('customerInfo');
    const customerQuery = await customerRef.where('email', '==', email).get();
    const customerData = customerQuery.docs.map(doc => doc.data());
    const appointmentsInvoiced = customerData[0].appointments.filter(appointment => appointment.status === 'Invoiced');
    const customerBalance = appointmentsInvoiced.reduce((acc, appointment) => {
      acc += Number(appointment.invoiceBalance);
      return acc;
    }, 0);

    const body = JSON.stringify({ appointmentsInvoiced, customerBalance });

    console.log('Customer balance retrieved successfully', body)

    return new Response(body, {
      status: 200,
    });
  } catch (error) {
    const body = JSON.stringify({
      data: {},
      message: 'Failed to get customer balance',
      error: error.message,
    });

    return new Response(body, {
      status: 500,
    });
  }

}