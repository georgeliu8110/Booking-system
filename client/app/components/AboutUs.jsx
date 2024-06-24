export default function AboutUs() {
  return (
    <div className="hero min-h-full bg-base-200">
      <div className="hero-content flex-col lg:flex-row">
        <img src="plumberAboutUs.jpeg" className="max-w-sm rounded-lg shadow-2xl" />
        <div className='px-5'>
          <h1 className="text-3xl font-bold">About Us</h1>
          <p className="py-6">{`Welcome to Broken Pipe Plumbing, your trusted partner for all plumbing needs. With years of experience and a team of dedicated professionals, we pride ourselves on delivering reliable, efficient, and top-notch plumbing services. From minor repairs to major installations, our commitment to quality and customer satisfaction sets us apart.`}< br/>< br/>
          {`At Broken Pipe Plumbing, we understand the importance of timely and effective solutions, ensuring your home or business runs smoothly without the hassle of plumbing issues. Choose us for unparalleled expertise and a promise of excellence in every job we undertake.`}</p>
          <button className="btn btn-primary" onClick={()=>document.getElementById('my_modal_3').showModal()}>Get Started</button>
        </div>
      </div>
    </div>
  )
}