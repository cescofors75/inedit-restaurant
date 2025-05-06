"use client"

import { useLanguage } from "@/context/language-context"

import { useEffect } from "react"

// Add type definition for iFrameResize
declare global {
  interface Window {
    iFrameResize?: Function;
  }
}

export default function ReservationCTA() {
  const { t } = useLanguage()

  useEffect(() => {
    // Cargar el script de iFrameResize
    const script = document.createElement("script")
    script.src = "https://www.covermanager.com/js/iframeResizer.min.js"
    script.async = true
    script.onload = () => {
      // Una vez cargado el script, inicializar iFrameResize si existe
      if (window.iFrameResize) {
        window.iFrameResize()
      }
    }
    document.body.appendChild(script)

    // Limpieza al desmontar el componente
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return (
    <section className="py-16 ">
      <div className="container mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">{t("reservation.title")}</h2>
        {/*  <p className="text-lg max-w-2xl mx-auto mb-8">
          {t("reservation.description")}
        </p>*/}
        
        {/* CoverManager iframe */}
        <div className="max-w-4xl mx-auto">
          <iframe
            id="restaurante-inedit"
            title="Reservas"
            src="https://www.covermanager.com/reserve/module_restaurant/restaurante-inedit/spanish"
            allow="payment"
            frameBorder="0"
            height="550"
            width="100%"
            className="mx-auto"
          />
        </div>


      </div>
    </section>
  )
}