'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';
import Link from 'next/link';

export default function SlideShow({images}) {

  const slides = [
    { image: '/plumbing1.png', text:'Plumbing Repaires and Maintenance', link:'/companyservices' },
    { image: '/plumbing2.jpeg', text:'Plumbing Installations', link:'/companyservices'},
    { image: '/plumbing3.jpeg', text:'Drain cleaning', link:'/companyservices'},
    { image: '/plumbing4.png', text:'Five Star Services', link:'/companyservices'},
    { image: '/plumbing5.jpeg', text:'Customer Feedbacks', link:'/companyservices'}
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex]); // Add currentIndex as dependency

  return (
    <div className='max-w-[1400px] h-[780px] w-full m-auto py-16 px-4 relative group'>
      <div
        style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
        className='w-full h-full rounded-2xl bg-center bg-cover duration-500 relative flex items-center justify-center'
      >
        <div className='text-center bg-black bg-opacity-30 text-white p-4 rounded-lg'>
          <h2 className='text-5xl mb-2'>{slides[currentIndex].text}</h2>
          <Link href={slides[currentIndex].link} passHref>
            <p className='text-blue-400 underline text-xl'>Learn More</p>
          </Link>
        </div>
      </div>
      {/* Left Arrow */}
      <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
        <BsChevronCompactLeft onClick={prevSlide} size={30} />
      </div>
      {/* Right Arrow */}
      <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
        <BsChevronCompactRight onClick={nextSlide} size={30} />
      </div>
      <div className='flex top-4 justify-center py-2'>
        {slides.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className='text-2xl cursor-pointer'
          >
            <RxDotFilled />
          </div>
        ))}
      </div>
    </div>
  );

}