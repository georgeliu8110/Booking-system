import { db } from "@/app/lib/firestore/config";

export const dynamic = "force-dynamic"; // have next js NOT cache this request
export async function GET(request, { params }) {
  try {
    const querySnapshot = await db.collection("services").get();
    const data = querySnapshot.docs.map(doc => doc.data())

    const body = JSON.stringify({ data });
    return new Response(body, {
      status: 200,
    });
  } catch (error) {
    const body = JSON.stringify({
      data: [],
      message: "failed to get services list",
      error: error?.message,
    });

    return new Response(body, {
      status: 500,
    });
  }
}