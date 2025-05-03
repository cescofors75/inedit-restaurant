"use client"

import { useLanguage } from "@/context/language-context"

export default function CuisineSection() {
  const { t } = useLanguage()

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">{t("cuisine.title")}</h2>

          <p className="text-lg text-muted-foreground mb-6">
            At INÈDIT, we blend traditional techniques with innovative approaches to create unforgettable dining
            experiences. Our menu changes with the seasons, always featuring the finest local ingredients sourced from
            trusted producers throughout Catalonia and the Mediterranean coast.
          </p>

          <p className="text-lg text-muted-foreground">
            Each dish is a reflection of our passion for culinary excellence, combining respect for tradition with
            creative flair. We invite you to embark on a gastronomic journey that celebrates the rich flavors and
            cultural heritage of our region, reimagined through our unique perspective.
          </p>
        </div>
      </div>
    </section>
  )
}
