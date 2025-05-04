"use client"

import { useLanguage } from "@/context/language-context"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export default function LocationContact() {
  const { t } = useLanguage()

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{t("location.title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("location.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[400px] lg:h-full rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2987.0458956441473!2d2.8435863!3d41.7006389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12bb16e5a5262c45%3A0x44b0fb3a3c6c3a0!2sPasseig%20Jacint%20Verdaguer%2C%209%2C%2017310%20Lloret%20de%20Mar%2C%20Girona!5e0!3m2!1sen!2ses!4v1682500000000!5m2!1sen!2ses"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="INÈDIT Restaurant Location"
            ></iframe>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-serif font-medium mb-4">Contact Information</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <MapPin className="h-5 w-5 text-brand mr-2 mt-0.5" />
                    <span>
                      Passeig Jacint Verdaguer, 9<br />
                      17310 Lloret de Mar
                      <br />
                      Girona, Spain
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Phone className="h-5 w-5 text-brand mr-2 mt-0.5" />
                    <span>+34 972 365 245</span>
                  </li>
                  <li className="flex items-start">
                    <Mail className="h-5 w-5 text-brand mr-2 mt-0.5" />
                    <span>inedit@ineditrestaurant.com</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-serif font-medium mb-4">{t("location.hours")}</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Clock className="h-5 w-5 text-brand mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Monday - Sunday</p>
                      <p className="text-muted-foreground">13:00 - 16:00</p>
                      <p className="text-muted-foreground">19:00 - 23:00</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
