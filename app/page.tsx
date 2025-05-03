"use client"

import { useLanguage } from "@/context/language-context"
import HeroSlider from "@/components/hero-slider"
import CuisineSection from "@/components/cuisine-section"
import MenuPreview from "@/components/menu-preview"
import Gallery from "@/components/gallery"
import Testimonials from "@/components/testimonials"
import LocationContact from "@/components/location-contact"
import ReservationCTA from "@/components/reservation-cta"

export default function Home() {
  const { t } = useLanguage()

  return (
    <div className="pt-20">
      <HeroSlider />
      <CuisineSection />
      <MenuPreview />
      <Gallery preview={true} />
      <Testimonials />
      <LocationContact />
      <ReservationCTA />
    </div>
  )
}
