import ReactPlayer from 'react-player'

export default function WhyUs() {
  return (
    <div className="hero bg-base-200 ">
      <div className="hero-content flex-col lg:flex-row-reverse">
          <ReactPlayer url='https://www.youtube.com/watch?v=gqaxFOYcl3M' playing={false} controls={true}/>
        <div className='w-9/12'>
          <h1 className="text-3xl font-bold my-5 px-3">Why Us?</h1>
          <p className="py-3">
          <label className="swap swap-flip text-9xl">
            {/* this hidden checkbox controls the state */}
            <input type="checkbox" />

            <div className="swap-on">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Expertise and Reliability</h2>
                <div className="card-actions justify-end">
                </div>
              </div>
            </div>
            </div>
            <div className="swap-off">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <p className='text-sm'>At Broken Pipe Plumbing, we bring years of professional experience and a team of skilled plumbers dedicated to providing top-notch services. Our commitment to quality and reliability ensures that your plumbing issues are resolved efficiently and effectively, giving you peace of mind.</p>
                <div className="card-actions justify-end">
                </div>
              </div>
            </div>
            </div>
          </label>
          <label className="swap swap-flip text-9xl">
            {/* this hidden checkbox controls the state */}
            <input type="checkbox" />

            <div className="swap-on">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Customer-Centric Approach</h2>
                <div className="card-actions justify-end">
                </div>
              </div>
            </div>
            </div>
            <div className="swap-off">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <p className='text-sm'>We prioritize our customers by offering personalized solutions tailored to your specific needs. Our friendly and knowledgeable team is always ready to assist, ensuring a seamless and satisfactory experience from start to finish. Your satisfaction is our highest priority.</p>
                <div className="card-actions justify-end">
                </div>
              </div>
            </div>
            </div>
          </label>
          <label className="swap swap-flip text-9xl">
            {/* this hidden checkbox controls the state */}
            <input type="checkbox" />

            <div className="swap-on">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Comprehensive Plumbing Services</h2>
                <div className="card-actions justify-end">
                </div>
              </div>
            </div>
            </div>
            <div className="swap-off">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <p className='text-sm'>From minor repairs to major installations, Broken Pipe Plumbing covers all your plumbing needs. We use the latest tools and techniques to deliver prompt and precise services, ensuring your home or business runs smoothly without any plumbing disruptions. Trust us for comprehensive and professional plumbing solutions.</p>
                <div className="card-actions justify-end">
                </div>
              </div>
            </div>
            </div>
          </label>
          </p>
        </div>
      </div>
    </div>
  )
}