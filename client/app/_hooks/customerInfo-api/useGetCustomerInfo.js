import { useState, useEffect } from 'react';

export default function useGetCustomerInfo(email) {
	const [data, setData] = useState([]);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const controller = new AbortController();

		setError(null);
		const fetchData = async () => {
			try {
				setIsLoading(true);

				const res = await fetchCustomberData({
          email,
					signal: controller.signal,
				});

				setError(null);
				setData(res.data);
				// if (res.data?.status === 500) {
				// 	setError(res.data.error);
				// 	setData(null);
				// } else {
				// 	setData(res.data);
				// 	setError(null);
				// }

			} catch (error) {

				setData([]);
				setError({ message: 'failed to fetch appointment Data', error });
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

async function fetchCustomberData({ email, signal }) {

	const params = new URLSearchParams({ email });
	const response = await fetch(`/api/customerInfo?${params}`, { signal });
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}
	const data = await response.json();

	return data;
}
