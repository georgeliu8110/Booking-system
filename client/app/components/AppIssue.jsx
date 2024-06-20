import useGetServices from "../_hooks/service-api/useGetServices";

export default function AppIssue({setCustomerInput, customerInput}) {

  const { data: serviceList, error: serviceListError } = useGetServices();

  const serviceInputHandler = (e) => {
    const selectedService = serviceList.find((item) => item.name === e.target.value);
    setCustomerInput((prev) => ({ ...prev, service: selectedService}));
  };

  return (
    <>
    <h1 className="text-3xl font-bold py-20">WHAT CAN WE DO FOR YOU?</h1>
    <select
      className="select select-bordered select-lg min-w-full"
      onChange={serviceInputHandler}>
      <option disabled selected >Please Select Services</option>
      {serviceList.map((service) => (
        <option key={service.id}>{service.name}</option>
      ))}
    </select>
    </>
  );
}

