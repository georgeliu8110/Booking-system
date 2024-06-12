// import { mockData } from "@/app/utility/mockData/mockAppointmentApi";
// import { mockPartsData } from "@/app/utility/mockData/mockGetPartsApi";
import { db } from "@/app/firestore/config";

const API_URL = process.env.API_URL;
const LOC = "/api/parts/";

export const dynamic = "force-dynamic"; // have next js NOT cache this request

export async function GET(request) {

  try {
    const querySnapshot = await db.collection("parts").get();

    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const body = JSON.stringify(data);

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    const body = JSON.stringify({
      data: [],
      message: "Failed to get parts list",
      error: error.message,
    });
    return new Response(body, {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

//request body:{partid,name,quantity,threshold }
export async function PUT(request) {
  const part = await request.json();

  try {
    setTimeout;
    const data = await updatePart(part);
    const body = JSON.stringify({ data });

    return new Response(body, {
      status: 200,
    });
  } catch (error) {
    const body = JSON.stringify({
      data: {},
      message: "failed to update part",
      error: error.message,
    });
    return new Response(body, {
      status: 500,
    });
  }
}

//request body:{partid,name,quantity,threshold }
export async function POST(request) {
  const part = await request.json();
  try {
    const data = await createPart(part);
    const body = JSON.stringify({ data });

    return new Response(body, {
      status: 200,
    });
  } catch (error) {
    const body = JSON.stringify({
      data: {},
      message: "failed to update part",
      error: error.message,
    });
    return new Response(body, {
      status: 500,
    });
  }
}

// part:{partid,name,quantity,threshold }
async function createPart(part) {
  try {
    const partsRef = db.collection("parts").doc(part.id);
    const partsDocSnapshot = await partsRef.get();

    if (partsDocSnapshot.exists) {
      throw new Error("Part already exists!");
    }
    const response = await partsRef.add({

      part
    });
    return { message: "Part updated successfully" };
  } catch (error) {
    throw new Error(`Failed to update part: ${error.message}`);
  }
}

// part:{partid,name,quantity,threshold }
async function updatePart(part) {
  console.log("part", part);

  try {
    const partsRef = db.collection("parts").doc(part.id);
    const partsDocSnapshot = await partsRef.get();

    if (!partsDocSnapshot.exists) {
      throw new Error("Part not found");
    }
    const response = await partsRef.update({
      quantity: part.quantity,
    });
    return { message: "Part updated successfully" };
  } catch (error) {
    throw new Error(`Failed to update part: ${error.message}`);
  }
}
