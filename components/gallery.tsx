"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/context/language-context"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface GalleryProps {
  preview?: boolean
}

export default function Gallery({ preview = false }: GalleryProps) {
  const { t } = useLanguage()
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const images = [
    {
      src: "/images/gallery1.jpg",
      alt: "Elegant plant decor at INÈDIT",
    },
    {
      src: "/images/gallery2.jpg",
      alt: "Fine dining table setting",
    },
    {
      src: "/images/gallery3.jpg",
      alt: "Atmospheric wicker lighting",
    },
    {
      src: "/images/gallery4.jpg",
      alt: "Cozy restaurant interior with plants",
    },
    {
      src: "/images/gallery5.jpg",
      alt: "Comfortable dining experience",
    },
    {
      src: "/images/slider1.jpg",
      alt: "Signature dish presentation",
    },
    {
      src: "/images/slider2.jpg",
      alt: "Chef's finishing touch",
    },
    {
      src: "/images/slider3.jpg",
      alt: "Culinary artistry in action",
    },
  ]

  const displayImages = preview ? images.slice(0, 4) : images

  const navigateImage = (direction: "next" | "prev") => {
    if (selectedImage === null) return

    if (direction === "next") {
      setSelectedImage((selectedImage + 1) % displayImages.length)
    } else {
      setSelectedImage((selectedImage - 1 + displayImages.length) % displayImages.length)
    }
  }

  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{t("gallery.title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the ambiance, culinary creations, and experiences that define INÈDIT.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayImages.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-medium">View</span>
              </div>
            </div>
          ))}
        </div>

        {preview && (
          <div className="text-center mt-12">
            <Link href="/gallery" className="btn-secondary">
              View Full Gallery
            </Link>
          </div>
        )}

        {/* Lightbox with navigation controls */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-8 w-8" />
            </button>

            {/* Previous button */}
            <button
              className="absolute left-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => navigateImage("prev")}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-10 w-10" />
            </button>

            <div className="relative w-full max-w-4xl h-[80vh]">
              <Image
                src={displayImages[selectedImage].src || "/placeholder.svg"}
                alt={displayImages[selectedImage].alt}
                fill
                className="object-contain"
              />
            </div>

            {/* Next button */}
            <button
              className="absolute right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => navigateImage("next")}
              aria-label="Next image"
            >
              <ChevronRight className="h-10 w-10" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
