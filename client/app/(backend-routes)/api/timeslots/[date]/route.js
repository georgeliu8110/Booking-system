import { db } from "@/app/firestore/config";

export const dynamic = "force-dynamic"; // have next js NOT cache this request
export async function GET(request, { params }) {
  request;
  const { date } = params;

  try {
    const querySnapshot = await db.collection("timeSlots").doc(`${date}`).get();
    const data = querySnapshot.data() || {};

    const body = JSON.stringify({ data });

    return new Response(body, {
      status: 200,
    });
  } catch (error) {
    const body = JSON.stringify({
      data: [],
      message: "failed to get timeslot list",
      error: error.message,
    });
    return new Response(body, {
      status: 500,
    });
  }
}

