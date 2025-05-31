import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';




const features = [
  {
    icon: '📍',
    title: 'Real-Time Availability',
    desc: <>Instantly view <strong>available units</strong> and <strong>verified owners</strong> nearby for fast booking.</>,
  },
  {
    icon: '📢',
    title: 'Smart Reminders & Penalties',
    desc: <>Automated <strong>return reminders</strong> and <strong>late penalties</strong> ensure timely returns and protect owner time.</>,
  },
  {
    icon: '💸',
    title: 'Transparent Pricing & Filters',
    desc: <>Easily filter by <strong>unit type</strong>, <strong>rental duration</strong>, and <strong>budget</strong> — all with clear, upfront pricing.</>,
  }
];

const bikes = [
  {
    id: 1,
    name: 'Yamaha NMAX',
    image: '/nmax.jpg',
    specs: '155cc, Scooter, Automatic',
    price: '₱150/hour',
    location: 'Bislig City',
    preferredUnit: 'Scooter',
  },
  {
    id: 2,
    name: 'Yamaha AEROX',
    image: '/aerox.jpg',
    specs: '155cc, Sport Scooter, Automatic',
    price: '₱150/hour',
    location: 'Davao City',
    preferredUnit: 'Sport Scooter',
  },
  {
    id: 3,
    name: 'Suzuki Raider',
    image: '/raider.jpg',
    specs: '150cc, Underbone, Manual',
    price: '₱150/hour',
    location: 'Bislig City',
    preferredUnit: 'Underbone',
  },
];

const faqs = [
  { question: 'How do I book a motorcycle?', answer: 'Simply create an account, select your preferred bike, choose dates, and complete payment.' },
  { question: 'What are the payment methods?', answer: 'We accept credit/debit cards, GCash, PayMaya, and bank transfers.' },
  { question: 'Do you provide helmets and gear?', answer: 'Yes, helmets and safety gear are included with every booking.' },
];

const testimonials = [
  {
    name: 'Kylamarie Teriote',
    text: 'Renting through this platform was seamless. The bike was in perfect condition and the booking process was quick.',
    city: 'Bislig City',
  },
  {
    name: 'Sarsar Longanilla',
    text: 'I loved the transparent pricing and the reminder system helped me return the bike on time. Highly recommend!',
    city: 'Davao City',
  },
  {
    name: 'Brix Calib',
    text: 'The customer support is fantastic. I felt safe knowing the owners are verified. Will definitely rent again.',
    city: 'Bislig City',
  },
];

// Fade-in animation for features
const FeatureCard = ({ icon, title, desc, textRed }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div
      className={`p-8 rounded-3xl shadow-xl text-center cursor-pointer transition-shadow duration-600 transform hover:scale-105
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
            bg-white text-black hover:shadow-2xl hover:shadow-red-300`}
      style={{ transitionProperty: 'opacity, transform' }}
    >
      <div className={`text-7xl mb-6 ${textRed} drop-shadow-md`}>{icon}</div>
      <h3 className={`text-3xl font-extrabold mb-4 text-red-700 tracking-wide`}>{title}</h3>
      <p className="text-gray-700 text-lg leading-relaxed">{desc}</p>
    </div>
  );
};

// Simple Carousel for bikes with arrows and auto-slide
const BikeCarousel = ({ bikes, textRed, cardBg }) => {
  const [current, setCurrent] = useState(0);
  const length = bikes.length;
  const timeoutRef = useRef(null);

  useEffect(() => {
    const next = (current + 1) % length;
    timeoutRef.current = setTimeout(() => setCurrent(next), 6000);
    return () => clearTimeout(timeoutRef.current);
  }, [current, length]);

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent((current + 1) % length);
  };

  if (!Array.isArray(bikes) || length === 0) return null;

  return (
    <div className="relative max-w-5xl mx-auto">
      <div className="overflow-hidden rounded-3xl shadow-2xl border border-gray-200">
        {bikes.map((bike, index) => (
          <div
            key={bike.id}
            className={`transition-transform duration-800 ease-in-out
                        ${index === current ? 'translate-x-0 opacity-100 relative z-10' : 'translate-x-full opacity-0 absolute top-0 left-0 w-full'}
                        `}
            style={{ minHeight: '380px' }}
          >
            {index === current && (
              <div className={`${cardBg} p-8 flex flex-col md:flex-row items-center gap-8`}>
                <img
                  src={bike.image}
                  alt={bike.name}
                  className="w-full md:w-1/2 lg:w-2/5 rounded-xl shadow-lg object-cover border border-gray-300"
                  loading="lazy"
                />
                <div className="flex-grow">
                  <h3 className={`text-4xl font-extrabold mb-3 ${textRed} drop-shadow-md`}>{bike.name}</h3>
                  <p className="text-gray-800 text-lg font-medium">{bike.specs}</p>
                  <p className={`mt-3 text-2xl font-extrabold ${textRed}`}>{bike.price}</p>
                  <p className="text-gray-600 mt-1 text-sm">{bike.location}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={prevSlide}
        aria-label="Previous Bike"
        className={`absolute top-1/2 left-4 transform -translate-y-1/2 bg-red-700 rounded-full p-3 text-white shadow-lg hover:bg-red-800 transition`}
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next Bike"
        className={`absolute top-1/2 right-4 transform -translate-y-1/2 bg-red-700 rounded-full p-3 text-white shadow-lg hover:bg-red-800 transition`}
      >
        &#10095;
      </button>
    </div>
  );
};

// Testimonial Slide with fade-in
const TestimonialSlide = ({ testimonial, textRed }) => {
  return (
    <div className="p-8 rounded-3xl shadow-xl max-w-xl mx-auto bg-white text-black border border-gray-200">
      <p className="italic mb-6 text-gray-700 text-lg leading-relaxed">“{testimonial.text}”</p>
      <h4 className={`font-bold ${textRed} text-xl`}>{testimonial.name}</h4>
      <p className="text-gray-500 text-sm">{testimonial.city}</p>
    </div>
  );
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [unitFilter, setUnitFilter] = useState('');
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Auto slide testimonials every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const filteredBikes = bikes.filter((bike) => {
    const matchesSearch = bike.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter ? bike.location.toLowerCase() === locationFilter.toLowerCase() : true;
    const matchesUnit = unitFilter ? bike.preferredUnit.toLowerCase() === unitFilter.toLowerCase() : true;
    return matchesSearch && matchesLocation && matchesUnit;
  });

  const locations = [...new Set(bikes.map(bike => bike.location))];
  const units = [...new Set(bikes.map(bike => bike.preferredUnit))];

  const bgMain = 'bg-white text-black';
  const sectionBg = 'bg-gray-50';
  const cardBg = 'bg-white text-black';
  const borderRed = 'border-red-600';
  const textRed = 'text-red-600';
  const textRedHover = 'hover:bg-red-600';

  return (
    <div className={`min-h-screen flex flex-col ${bgMain} transition-colors duration-700 font-sans`}>
      <div className="flex justify-end p-6 max-w-7xl mx-auto w-full" />
      <section
        className="relative flex flex-col md:flex-row items-center justify-between w-full max-w-full rounded-3xl overflow-hidden shadow-2xl mx-auto px-6 md:px-16"
        style={{ minHeight: '420px' }}
      >
        {/* Left Content: Text */}
        <div className="relative z-10 flex-grow max-w-7xl py-12 text-center md:text-left">
          <h1 className="text-left leading-tight space-y-4 max-w-xl mx-auto md:mx-0">
            <span className="text-gray-900 text-4xl md:text-5xl font-extrabold drop-shadow-md block">Rent a Motorbike</span>
            <span className="text-red-600 text-7xl md:text-8xl font-extrabold drop-shadow-xl block">Drive the motorbike</span>
            <span className="text-blue-600 text-7xl md:text-8xl font-extrabold drop-shadow-xl block">You want</span>
          </h1>

          <div className="mt-10 flex gap-6 flex-wrap justify-center md:justify-start">
            <Link
              to="/login"
              className="bg-gradient-to-r from-red-500 to-red-700 text-white font-bold py-4 px-12 rounded-full shadow-xl transition transform hover:scale-105 hover:from-red-600 hover:to-red-800"
            >
              Book Now
            </Link>
            <Link
              to="/bikes"
              className="border-4 border-red-600 text-red-700 font-bold py-4 px-12 rounded-full shadow-md transition transform hover:bg-red-600 hover:text-white hover:shadow-lg"
            >
              Explore Bikes
            </Link>
          </div>
        </div>

        {/* Right Content: Image with Plain Background */}
        <div className="flex-shrink-0 w-full md:w-auto">
          <img
            src="/bgmotor2.png"
            alt="Motorcycle"
            className="w-[800px] max-h-[800px] object-contain"
            loading="lazy"
            style={{ display: 'block', marginLeft: 'auto' }}
          />
        </div>
      </section>

      <section className={`py-20 px-8 max-w-7xl mx-auto w-full`}>
        <h2 className={`text-4xl font-extrabold mb-16 text-center tracking-wide ${textRed}`}>Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto">
          {features.map(({ icon, title, desc }) => (
            <FeatureCard key={title} icon={icon} title={title} desc={desc} textRed={textRed} />
          ))}
        </div>
      </section>

      {/* Bike Carousel */}
      <section className={`py-20 px-8 max-w-7xl mx-auto w-full ${sectionBg} rounded-3xl shadow-2xl mt-20 border border-gray-200`}>
        <h2 className={`text-4xl font-extrabold mb-16 text-center tracking-wide ${textRed}`}>Featured Bikes</h2>
        <BikeCarousel bikes={filteredBikes.length > 0 ? filteredBikes : bikes} textRed={textRed} cardBg={cardBg} />
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          <select
            aria-label="Filter by Location"
            className={`px-5 py-3 rounded-3xl border ${borderRed} text-black font-semibold shadow-sm focus:ring-2 focus:ring-red-400 outline-none transition`}
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <select
            aria-label="Filter by Unit Type"
            className={`px-5 py-3 rounded-3xl border ${borderRed} text-black font-semibold shadow-sm focus:ring-2 focus:ring-red-400 outline-none transition`}
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
          >
            <option value="">All Unit Types</option>
            {units.map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
          <input
            aria-label="Search Bikes"
            type="search"
            placeholder="Search bikes..."
            className={`px-6 py-3 rounded-3xl border ${borderRed} flex-grow min-w-[220px] text-black font-semibold shadow-sm focus:ring-2 focus:ring-red-400 outline-none transition`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => { setSearchTerm(''); setLocationFilter(''); setUnitFilter(''); }}
            className={`bg-red-600 text-white px-6 py-3 rounded-3xl font-semibold shadow-lg hover:bg-red-700 transition`}
            aria-label="Clear Filters"
          >
            Clear
          </button>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`py-20 px-8 max-w-7xl mx-auto w-full ${sectionBg} rounded-3xl shadow-2xl mt-20 border border-gray-200`}>
        <h2 className={`text-4xl font-extrabold mb-16 text-center tracking-wide ${textRed}`}>What Our Customers Say</h2>
        <div
          key={testimonialIndex}
          className="transition-opacity duration-1000"
          style={{ opacity: 1 }}
        >
          <TestimonialSlide testimonial={testimonials[testimonialIndex]} textRed={textRed} />
        </div>
        <div className="mt-8 flex justify-center gap-4">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Show testimonial ${idx + 1}`}
              onClick={() => setTestimonialIndex(idx)}
              className={`w-5 h-5 rounded-full focus:outline-none
                                ${idx === testimonialIndex ? `${textRed} bg-red-200` : 'bg-gray-300'}
                                hover:bg-red-400 transition shadow-md`}
            />
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-20 px-8 max-w-7xl mx-auto w-full`}>
        <h2 className={`text-4xl font-extrabold mb-16 text-center tracking-wide ${textRed}`}>Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-8">
          {faqs.map(({ question, answer }, i) => (
            <details
              key={i}
              className={`p-6 rounded-3xl border border-gray-300 bg-white shadow-md cursor-pointer transition-all hover:shadow-lg`}
            >
              <summary className={`font-semibold text-lg text-gray-900`}>{question}</summary>
              <p className="mt-4 text-gray-700 leading-relaxed">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="py-12 text-center text-sm text-gray-500 tracking-wide">
        &copy; 2025 MotorBike Rental Service. All rights reserved.
      </footer>
    </div>
  );
}
