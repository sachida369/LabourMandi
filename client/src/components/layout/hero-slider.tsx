import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SlideData {
  id: number;
  image: string;
  alt: string;
  title: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    image: "/hero-images/construction-labour-india.jpg",
    alt: "Construction Labour - Masonry and Shuttering Work in India | LabourMandi",
    title: "Construction Labour",
  },
  {
    id: 2,
    image: "/hero-images/electrician-india.jpg",
    alt: "Professional Electrician and Plumber Services in India | LabourMandi Technician",
    title: "Electricians & Plumbers",
  },
  {
    id: 3,
    image: "/hero-images/tile-marble-worker-india.jpg",
    alt: "Expert Tile, Marble and POP Finishing Workers in India | LabourMandi",
    title: "Tile & Marble Specialists",
  },
  {
    id: 4,
    image: "/hero-images/painter-india.jpg",
    alt: "Professional Painters and Interior Finishing Services in India | LabourMandi",
    title: "Painters & Interior Finishers",
  },
  {
    id: 5,
    image: "/hero-images/heavy-machinery-india.jpg",
    alt: "Heavy Machinery Operators and Contractors for Construction in India | LabourMandi",
    title: "Heavy Machinery & Contractors",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
            {/* Subtle overlay for better image visibility */}
            <div className="absolute inset-0 bg-black/20" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/70 w-2"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
