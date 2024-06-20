import {Suspense} from "react";
import AppointmentPage from "@/app/components/AppointmentPage";


export default function CustomerAppointmentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppointmentPage />
    </Suspense>
  );
}
