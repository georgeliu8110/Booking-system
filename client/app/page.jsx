'use client';

import Link from 'next/link';
import Image from 'next/image';
import SlideShow from '@/app/components/SlideShow';
import AboutUs from '@/app/components/AboutUs';
import FAQ from '@/app/components/FAQ';
import WhyUs from '@/app/components/WhyUs';

export default function Home() {
	return (
		<>
			<main className='flex flex-col justify-center items-center w-full min-h-screen dark:bg-black'>
				<div className='flex flex-col justify-center items-center w-full dark:bg-black mb-auto mt-20 pt-20'>
					<h1 className='text-6xl font-bold leading-tight mb-4 w-1/2 text-center'>
					Your trusted choice for all plumbing works.
				 </h1>
				<p className='text-lg text-gray-600 mb-6 font-semibold'>Reliable. Professional. Unmatched</p>

					<button className='text-xl text-blue-500 hover:text-blue-700 ' onClick={()=>document.getElementById('my_modal_3').showModal()}>{`Let's fix your problem >`}</button>

				</div>
        <div className='flex justify-center w-full mb-auto mt-10'>
          <SlideShow />
        </div>
				<div className='w-full max-w-7xl mt-10 px-4 h-full'>
				  <AboutUs />
				</div>
				<div className='w-full max-w-7xl mt-10 px-4'>
				  <WhyUs />
				</div>
				<div className='w-full max-w-7xl mt-10 px-4'>
				<FAQ />
				</div>
			</main>
		</>
	);
}
