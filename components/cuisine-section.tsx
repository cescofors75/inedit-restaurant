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
            {t("cuisine.description")}
           
          </p>

          <p className="text-lg text-muted-foreground">
            {t("cuisine.description2")}
      
          </p>
        </div>
      </div>
    </section>
  )
}
