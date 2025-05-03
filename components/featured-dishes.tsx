"use client"

import { useState } from "react"
import Image from "next/image"

export default function FeaturedDishes() {
  const [activeIndex, setActiveIndex] = useState(0)

  const dishes = [
    {
      name: "Raviolis de rabo de toro",
      description:
        "Delicate ravioli filled with slow-cooked oxtail stewed in the traditional style, topped with aged pecorino cheese and a rich reduction.",
      image: "/images/raviolis.jpg",
      price: "€18",
    },
    {
      name: "Paletilla de cordero",
      description:
        "Tender lamb shoulder served with a refreshing lettuce heart and spring onion salad, accompanied by wood-roasted peppers.",
      image: "/images/paletilla-cordero.jpg",
      price: "€26",
    },
    {
      name: "Merluza a la donostiarra",
      description:
        "Fresh hake prepared in the traditional Donostia style, served with a creamy Mahón cheese parmentier and seasonal vegetables.",
      image: "/images/merluza.jpg",
      price: "€24",
    },
  ]

  // Apply updates to the dishes array
  dishes[1].image = "/images/paletilla-cordero.jpg"
  dishes[2].image = "/images/merluza-donostiarra.jpg"

  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Featured Dishes</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our chef's selection of signature dishes that showcase our culinary philosophy and seasonal ingredients.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-[500px] w-full">
            {dishes.map((dish, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === activeIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={dish.image || "/placeholder.svg"}
                  alt={dish.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>

          <div>
            <div className="space-y-8">
              {dishes.map((dish, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg cursor-pointer transition-all ${
                    index === activeIndex ? "bg-brand text-white shadow-lg" : "bg-background hover:bg-muted"
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-serif font-medium">{dish.name}</h3>
                    <span className={`font-medium ${index === activeIndex ? "text-white" : "text-brand"}`}>
                      {dish.price}
                    </span>
                  </div>
                  <p className={index === activeIndex ? "text-white/90" : "text-muted-foreground"}>
                    {dish.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
