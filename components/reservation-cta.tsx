"use client"

import { useLanguage } from "@/context/language-context"
import Link from "next/link"

export default function ReservationCTA() {
  const { t } = useLanguage()

  return (
    <section className="py-16 bg-brand text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">{t("reservation.title")}</h2>
        <p className="text-lg max-w-2xl mx-auto mb-8">
        {t("reservation.description")}
        </p>
        <Link
          href="/reservation"
          className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-brand bg-white rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand transition-colors"
        >
          {t("hero.cta")}
        </Link>
      </div>
    </section>
  )
}
