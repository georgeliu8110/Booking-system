import { useState, useEffect } from 'react';

export default function useGetCustomerBalance(email) {

  console.log('herererer????')
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const controller = new AbortController();
    setIsLoading(true);

    console.log('isLoading', isLoading)

		setError(null);
		const fetchData = async () => {
			try {
				const res = await fetchCustomerBalance({
          email,
					signal: controller.signal,
				});


        console.log('balance data', res)

				setError(null);
				setData(res);

			} catch (error) {

				setData(null);
				setError({ message: 'failed to fetch customer balance Data', error });
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();

		return () => {
			controller.abort();
		};
	}, [email]);
	return { data, error, isLoading };
}

async function fetchCustomerBalance({ email, signal }) {

	const params = new URLSearchParams({ email });
	const response = await fetch(`/api/customerBalance?${params}`, { signal });
  console.log('response', response)
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}
	const data = await response.json();

	return data;
}
