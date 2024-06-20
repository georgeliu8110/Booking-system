import AppointmentPage from "@/app/components/AppointmentPage";
import stepContext from "@/app/context/stepContext";
import { useContext } from "react";

export default function AppointmentModal() {

  const stepCtx = useContext(stepContext);

  return (
    <>
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box max-w-5xl h-full">
        <form method="dialog" className='relative'>
            <AppointmentPage />
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => stepCtx.resetStep()}>✕</button>
        </form>
      </div>
    </dialog>
    </>
  )
}