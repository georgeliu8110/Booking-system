import {db} from '@/app/lib/firestore/config.js';

export async function POST (request) {
  const customerInfo = await request.json();
  console.log('customerInfo', customerInfo)
  try {
    const data = await createCustomer(customerInfo);
    const body = JSON.stringify({ data });
    return new Response(body, {
      status: 200,
    });
  } catch (error) {
    const body = JSON.stringify({
      data: {},
      message: "failed to create customer",
      error: error.message,
    });
    return new Response(body, {
      status: 500,
    });
  }
}

export async function GET (request) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email");
  console.log('email', email)
  try {
    const querySnapshot = await db.collection('customer').where('email', '==', email).get();
    const data = querySnapshot.docs.map(doc => doc.data());
    const body = JSON.stringify({ data });
    return new Response(body, {
      status: 200,
    });
  } catch (error) {
    const body = JSON.stringify({
      data: [],
      message: 'failed to get customer list',
      error: error.message,
    });
    return new Response(body, {
      status: 500,
    });
  }
}

export async function PUT (request) {
  const customerInfo = await request.json();

  try {
    const data = await updateCustomer(customerInfo);
    const body = JSON.stringify({ data });
    return new Response(body, {
      status: 200,
    });
  } catch (error) {
    const body = JSON.stringify({
      data: {},
      message: 'failed to update customer',
      error: error.message,
    });
    return new Response(body, {
      status: 500,
    });
  }
}


async function createCustomer(customerInfo) {
  const { firstName, lastName, email, phone, street, apt, state, city, zip } = customerInfo;
  try {
    const customerRef = db.collection('customer');
    const customerQuery = await customerRef.where('address', '==', street).get();
    if (customerQuery.empty) {
      const newCustomer = await customerRef.add({
        firstName,
        lastName,
        email,
        phone,
        street,
        apt,
        state,
        city,
        zip
      });
      return { id: newCustomer.id, ...customerInfo };
    } else {
      return { message: 'customer already exists' };
    }
  } catch (error) {
    throw new Error(error);
  }
}

async function updateCustomer(customerInfo) {
  const { firstName, lastName, email, phone, street, city, state, zip } = customerInfo;
  try {
    const customerQuerySnapshot = await db.collection('customer').where('email', '==', email).get();

    // Check if the document exists
    if (!customerQuerySnapshot.empty) {
      // Iterate over the found documents and update them
      customerQuerySnapshot.forEach(async (doc) => {
        await doc.ref.update({
          firstName,
          lastName,
          email,
          phone,
          street,
          city,
          state,
          zip
        });
      });

      return { ...customerInfo };
    }
  } catch (error) {
    throw new Error(error);
  }
}