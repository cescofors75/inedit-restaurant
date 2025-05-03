"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/context/language-context"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function HeroSlider() {
  const { t } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      type: "image",
      image: "/images/slider1.jpg",
      title: t("hero.title"),
      subtitle: t("hero.subtitle"),
    },
    {
      type: "image",
      image: "/images/slider2.jpg",
      title: "Exquisite Flavors",
      subtitle: "Discover our seasonal menu crafted with passion",
    },
    {
      type: "image",
      image: "/images/slider3.jpg",
      title: "Elegant Atmosphere",
      subtitle: "The perfect setting for memorable dining experiences",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0">
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={`INÈDIT - ${slide.title}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 max-w-3xl">{slide.title}</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">{slide.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/reservation" className="btn-primary">
                {t("hero.cta")}
              </Link>
              <Link href="/menu" className="btn-secondary bg-white/20 text-white border-white hover:bg-white/30">
                Ver Carta
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-2 rounded-full transition-all ${index === currentSlide ? "bg-white w-8" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
