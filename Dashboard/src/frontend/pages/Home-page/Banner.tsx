import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerImages = [
    "/images/Herbalife-Banner.jpg",
    "/images/Home-1-computer.jpg",
    "/images/New-Herbalife-Sport-DKP.jpg",
  ];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full max-w-full mx-auto mb-8 overflow-hidden rounded-2xl shadow-2xl">
      {/* Slides container */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {bannerImages.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0 relative">
            <img
              src={image}
              alt={`Banner ${index + 1}`}
              className="w-full h-[60vh] md:h-[80vh] object-cover"
            />

            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

            {/* Centered content with better styling */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 md:px-16">
              {/* Main heading with better typography */}
              <h2 className="text-3xl md:text-6xl font-bold text-white max-w-3xl leading-tight mb-6 drop-shadow-2xl">
                Welcome To <br />
                <span className="text-amber-400">AB Shop</span>
              </h2>
              
              {/* Optional subtitle */}
              <p className="text-white text-lg md:text-xl mb-8 max-w-2xl drop-shadow-lg opacity-90">
                Transform your health with science-backed nutrition and wellness products
              </p>

              {/* Enhanced Shop Now button */}
              <Link
                to="/products"
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:scale-105 transition-all duration-300 shadow-2xl border-2 border-amber-400"
              >
                Shop Now →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-amber-400 scale-125 shadow-lg"
                : "bg-white/60 hover:bg-white/80 hover:scale-110"
            }`}
          />
        ))}
      </div>

      {/* Optional: Navigation Arrows */}
      <button
        onClick={() => goToSlide((currentSlide - 1 + bannerImages.length) % bannerImages.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => goToSlide((currentSlide + 1) % bannerImages.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Banner;