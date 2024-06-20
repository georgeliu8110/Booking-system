import { timeSlots, statesList } from "@/constants";

export default function AppCustomer({setCustomerInput, customerInput}) {

  const firstNameInputHandler = (e) => {
    setCustomerInput((prev) => ({ ...prev, firstName: e.target.value}));
  };

  const lastNameInputHandler = (e) => {
    setCustomerInput((prev) => ({ ...prev, lastName: e.target.value}));
  };

  const emailInputHandler = (e) => {
    setCustomerInput((prev) => ({ ...prev, email: e.target.value}));
  };

  const phoneInputHandler = (e) => {
    setCustomerInput((prev) => ({ ...prev, phone: e.target.value}));
  };

  const streetInputHandler = (e) => {
    setCustomerInput((prev) => ({ ...prev, street: e.target.value}));
  };

  const aptInputHandler = (e) => {
    setCustomerInput((prev) => ({ ...prev, apt: e.target.value}));
  };

  const stateInputHandler = (e) => {
    setCustomerInput((prev) => ({ ...prev, state: e.target.value}));
  };

  const cityInputHandler = (e) => {
    setCustomerInput((prev) => ({ ...prev, city: e.target.value}));
  };

  const zipInputHandler = (e) => {
    setCustomerInput((prev) => ({ ...prev, zip: e.target.value}));
  };

  return (
    <>
    <h1 className="text-3xl font-bold col-span-2 py-20">CUSTOMER INFORMATION</h1>
    <input
        type="text"
        placeholder="First Name"
        className="input input-bordered w-full input-lg col-span-1"
        onChange={firstNameInputHandler}
      />
      <input
        type="text"
        placeholder="Last Name"
        className="input input-bordered w-full input-lg col-span-1"
        onChange={lastNameInputHandler}
      />
      <input
        type="email"
        placeholder="Email"
        className="input input-bordered w-full input-lg col-span-1"
        onChange={emailInputHandler}
      />
      <input
        type="tel"
        placeholder="Phone Number"
        maxLength="10"
        className="input input-bordered input-lg w-full col-span-1"
        onChange={phoneInputHandler}
      />
      <input
        type="text"
        placeholder="Street"
        className="input input-bordered input-lg w-full col-span-1"
        onChange={streetInputHandler}
      />
      <input
        type="text"
        placeholder="Apt"
        className="input input-bordered input-lg w-full col-span-1"
        onChange={aptInputHandler}
      />
      <select
        className="select select-bordered select-lg w-full"
        onChange={stateInputHandler}>
        <option disabled selected>State</option>
        {statesList.map((state) => (
          <option key={state.abbreviation}>{state.name}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="City"
        className="input input-bordered input-lg w-full"
        onChange={cityInputHandler}
      />
      <input
        type="text"
        placeholder="Zipcode"
        maxLength="5"
        inputMode="numeric"
        className="input input-bordered input-lg w-full"
        onChange={zipInputHandler}
      />

    </>


  );
}
