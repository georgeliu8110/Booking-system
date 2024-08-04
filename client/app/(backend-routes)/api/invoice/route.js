import { storage } from '@/app/lib/firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db } from '@/app/lib/firestore/config';

export async function POST(request) {
  const invoiceData = await request.formData();
  const invoice = invoiceData.get('invoice');
  const appId = invoiceData.get('appId');
  const email = invoiceData.get('email');
  const invoiceBalance = invoiceData.get('invoiceBalance');

  try {
    const storageRef = ref(storage, `invoices/${appId.slice(0, 8)}.pdf`);
    const uploadTask = uploadBytesResumable(storageRef, invoice, { contentType: 'application/pdf' });

    const downloadURL = await new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Failed to upload invoice', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });

    const appointmentsRef = db.collection('customerInfo');
    const appointmentQuery = await appointmentsRef.where('email', '==', email).get();
    const appointmentData = appointmentQuery.docs.map(doc => doc.data());
    const appointment = appointmentData[0].appointments.find(appointment => appointment.confirmationNumber === appId);
    appointment.invoice = downloadURL;
    appointment.invoiceBalance = invoiceBalance;
    appointment.invoiceNumber = appId.slice(0, 8);

    await appointmentsRef.doc(appointmentQuery.docs[0].id).set({ appointments: appointmentData[0].appointments }, { merge: true });

    const body = JSON.stringify({ data: downloadURL });

    return new Response(body, {
      status: 200,
    });
  } catch (error) {
    const body = JSON.stringify({
      data: {},
      message: 'Failed to save invoice',
      error: error.message,
    });

    return new Response(body, {
      status: 500,
    });
  }
}