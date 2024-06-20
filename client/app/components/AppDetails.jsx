export default function AppDetails({setCustomerInput, customerInput}) {

  const detailInputHandler = (e) => {
    setCustomerInput((prev) => ({ ...prev, detail: e.target.value}));
  }

  return (
    <>
    <h1 className="text-3xl font-bold py-20">TELL US MORE</h1>
    <textarea className="textarea textarea-bordered min-w-full pb-10" placeholder="Please tell us more about your plumbing issues (optional)" onChange={detailInputHandler} value={customerInput.detail}></textarea>
    <input type="file" className="file-input file-input-bordered w-full max-w-xs" />
    </>

  )
}