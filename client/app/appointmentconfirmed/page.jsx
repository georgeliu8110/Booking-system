import AppConfirmation from "@/app/components/AppConfirmation";
import { Suspense } from "react";

export default function AppointmentConfirmationPage() {
  return (
    <Suspense fallback={<p>Loading ... </p>}>
      <AppConfirmation />
    </Suspense>
  );
}

