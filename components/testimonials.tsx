"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonials = [
    {
      name: "Maria Peña",
      role: "Food Critic",
      quote:
        "INÈDIT offers one of the most refined dining experiences I've had in years. The attention to detail in both presentation and flavor is remarkable.",
      rating: 5,
    },
    {
      name: "Jean-Pierre Dubois",
      role: "Culinary Enthusiast",
      quote:
        "A true gastronomic journey that combines innovation with respect for traditional techniques. Each dish tells a story of passion and creativity.",
      rating: 5,
    },
    {
      name: "Sarah Johnson",
      role: "Travel Blogger",
      quote:
        "The ambiance, service, and cuisine at INÈDIT create a perfect harmony. It's a must-visit destination for anyone seeking an exceptional dining experience.",
      rating: 5,
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
    }, 6000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <section className="py-12 bg-brand text-white">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6">What Our Guests Say</h2>

          <div className="relative h-[200px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 flex flex-col items-center ${
                  index === activeIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current text-white" />
                  ))}
                </div>
                <blockquote className="text-base md:text-lg italic mb-4">"{testimonial.quote}"</blockquote>
                <div>
                  <p className="font-medium text-lg">{testimonial.name}</p>
                  <p className="text-white/80">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === activeIndex ? "bg-white w-8" : "bg-white/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
