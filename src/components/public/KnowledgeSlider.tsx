"use client";

import { useState, useEffect } from 'react';
import type { KnowledgeSlide } from '@prisma/client';

export default function KnowledgeSlider({ slides }: { slides: KnowledgeSlide[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg bg-[var(--primary-green)] text-white aspect-[16/9] md:aspect-[21/9]">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 transform ${
            index === currentSlide ? 'opacity-100 visible scale-100 z-20' : 'opacity-0 invisible scale-105 z-10'
          }`}
        >
          <div className="absolute inset-[-50%] w-[200%] h-[200%] opacity-20 pointer-events-none" 
               style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 60%)', animation: 'spin 30s linear infinite' }}></div>
          <div className={`relative z-30 text-center px-10 sm:px-20 transition-all duration-700 transform ${
            index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h3 className="text-3xl sm:text-4xl font-bold mb-6 drop-shadow-md">{slide.title}</h3>
            <p className="text-lg sm:text-xl text-white leading-relaxed drop-shadow">{slide.content}</p>
          </div>
        </div>
      ))}
      
      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/40 rounded-full transition"
            aria-label="Previous Slide"
          >
            ❯
          </button>
          <button 
            onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/40 rounded-full transition"
            aria-label="Next Slide"
          >
            ❮
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-0 right-0 z-40 flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
