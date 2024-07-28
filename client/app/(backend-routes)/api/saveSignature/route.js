import { storage } from '@/app/lib/firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db } from '@/app/lib/firestore/config';

export async function POST(request) {
  const data = await request.formData();
  const signature = data.get('signature');
  const appId = data.get('appId');
  const email = data.get('email');

  try {
    const storageRef = ref(storage, `signatures/${appId}.png`);
    const uploadTask = uploadBytesResumable(storageRef, signature, { contentType: 'image/png' });

    const downloadURL = await new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Failed to upload signature', error);
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

    // Update Firestore with the download URL
    const appointmentsRef = db.collection('customerInfo');
    const appointmentsQuery = await appointmentsRef.where('email', '==', email).get();
    const appointmentsData = appointmentsQuery.docs.map(doc => doc.data());
    const appointment = appointmentsData[0].appointments.find(appointment => appointment.confirmationNumber === appId);

    appointment.signature = downloadURL;

    await appointmentsRef.doc(appointmentsQuery.docs[0].id).set({ appointments: appointmentsData[0].appointments }, { merge: true });

    const body = JSON.stringify({ data: downloadURL });
    return new Response(body, {
      status: 200,
    });
  } catch (error) {
    const body = JSON.stringify({
      data: {},
      message: 'Failed to save signature',
      error: error.message,
    });
    return new Response(body, {
      status: 500,
    });
  }
}
