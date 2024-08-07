'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useGetAppointments from '@/app/_hooks/appointments-api/useGetAppointments';
import useGetServices from '@/app/_hooks/service-api/useGetServices';
import { timeSlots } from '@/constants';
import { mockData } from '@/app/utility/mockData/mockGetAppointmentsApi';
import { appointmentAttributes } from '@/constants';
import { formatDateWithNoSlash } from '@/app/utility/formatDateWithNoSlash';
import useGetParts from '@/app/_hooks/part-api/useGetParts';
import Link from 'next/link';
import AdminAppDetailModal from '@/app/components/AdminAppDetailModal';
import { FaArrowCircleRight } from "react-icons/fa";
import AdminAppActionModal from '@/app/components/AdminAppActionModal';

export default function AppointmentsPage() {
	const [startDate, setStartDate] = useState(new Date().toLocaleDateString());
	const { data: appointmentsListData, error: appointmentsListError } = useGetAppointments(
		formatDateWithNoSlash(startDate)
	);
	const { data: serviceList, error: serviceListError } = useGetServices();
	const { data: partsData, error: partsError, isLoading: partsIsLoading } = useGetParts();
	const [currentPage, setCurrentPage] = useState(1);
	const appointmentsPerPage = 6;

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};
	const getServicesDataFromCollection = (serviceId) => {
		return serviceList.find((service) => service.id === serviceId);
	};

	const getPartsDataFromCollection = (partsIds) => {
		let parts = partsData?.filter((part) => partsIds?.includes(part.id));
		return parts?.map((part) => part.name).join(', ');
	};
	const indexOfLastAppointment = currentPage * appointmentsPerPage;
	const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
	let currentAppointments = null;
	let totalPages = 0;
	if (appointmentsListData) {
		currentAppointments =
			appointmentsListData.length >= appointmentsPerPage
				? appointmentsListData.slice(indexOfFirstAppointment, indexOfLastAppointment)
				: appointmentsListData;
		totalPages = Math.ceil(appointmentsListData.length / appointmentsPerPage);
	}

	console.log('currentAppointments', currentAppointments);

	return (
		<>
		<div className='h-screen flex flex-col'>
			<div className='date-picker-container pl-4 flex items-center justify-left'>
				<label htmlFor='date-picker' className='text-lg font-bold pr-3'>Select Appointment Date:</label>
				<DatePicker
					selected={startDate}
					onChange={(date) => setStartDate(date.toLocaleDateString())}
					className='bg-white border-black border-2 rounded-lg px-3 py-2 outline-none focus:ring'
				/>
			</div>
			<div className='w-full border-2 border-black m-4 p-6 rounded-xl '>
				<h1 className='text-center pb-6 font-bold'>Appointments for {startDate}</h1>
				<table className='table text-center'>
					<thead>
						<tr className='text-black border-2 border-black rounded-xl'>
							{appointmentAttributes.map((item, index) => (
								<th className='text-gray-500 uppercase' key={index}>
									{item}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{currentAppointments.length !==0 ? (
							currentAppointments.map((appointment, index) => {
								console.log('appointment', appointment)
								const appDetail = {
									timeSlot: timeSlots[appointment.time],
									service: getServicesDataFromCollection(appointment.serviceId)?.name,
									partsNeeded: getPartsDataFromCollection(getServicesDataFromCollection(appointment.serviceId)?.partsNeeded),
								}
								return (
									<>
									<AdminAppDetailModal appointment={appointment} appDetail={appDetail} index={index}/>
									<AdminAppActionModal appointment={appointment} appDetail={appDetail} index={index}/>
									<tr key={index} className='border-gray-300 text-black font-medium dark:text-white'>
										<th>{indexOfFirstAppointment + index + 1}</th>
										<td>{appointment.name}</td>
										<td>{appDetail.timeSlot}</td>
										<td>{appDetail.service}</td>
										<td>
											{appDetail.partsNeeded}
										</td>
										<td>
											{appointment.status}
										</td>
										<td>
											{appointment.technician || 'Not Assigned'}
										</td>
										<td>
											<button className="btn btn-success text-xs" onClick={() => document.getElementById(`${appointment.email}${index}`).showModal()}>See Details</button>
										</td>
										<td>
											<button className="btn btn-link text-3xl" onClick={() => document.getElementById(`appAction${index}${appointment.appId}`).showModal()}><FaArrowCircleRight /></button>
										</td>
									</tr>
									</>
								);
							})
						) : (
							<tr className="hover">
								<td colSpan='8' className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">No appointments for today!</td>
							</tr>
						)}
					</tbody>
				</table>
				<div className='flex items-center justify-between mt-4'>
					<div className='flex-1'>
						{currentPage > 1 && (
							<button
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
								className='mr-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg flex items-center justify-center'
							>
								Previous
							</button>
						)}
					</div>
					<div className='flex flex-1 justify-end'>
						{currentPage < totalPages && (
							<button
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
								className='self-end ml-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg flex justify-center'
							>
								Next
							</button>
						)}
					</div>
				</div>
			</div>
			</div>
		</>
	);
}
