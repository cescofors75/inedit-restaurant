"use client"

import type React from "react"

import { useLanguage } from "@/context/language-context"
import { useState } from "react"

import { Phone, Mail, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  const { t } = useLanguage()
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, this would send the form data to a server
    setFormSubmitted(true)
  }

  return (
    <div className="pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-4xl font-serif font-bold mb-4">{t("nav.contact")}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("contact.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-serif font-medium mb-6"></h2>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <MapPin className="h-6 w-6 text-brand mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">
                      Passeig Jacint Verdaguer, 9<br />
                      17310 Lloret de Mar
                      <br />
                      Girona, Spain
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Phone className="h-6 w-6 text-brand mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">{t("contact.phone")}</p>
                    <p className="text-muted-foreground">+34 972 365 245</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Mail className="h-6 w-6 text-brand mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">{t("contact.email")}</p>
                    <p className="text-muted-foreground">inedit@ineditrestaurant.com</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock className="h-6 w-6 text-brand mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">{t("location.hours")}</p>
                    <p className="text-muted-foreground">{t("location.days")}: 13:00 - 16:00</p>
                    <p className="text-muted-foreground">{t("location.days")}: 19:00 - 23:00</p>
                  </div>
                </li>
              </ul>
            </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
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
            </div>
         

          <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-serif font-medium mb-6">Private Events</h2>
              <p className="text-muted-foreground mb-4">
                INÈDIT offers elegant spaces for private dining and special events. Our team will work with you to
                create a memorable experience.
              </p>
              <p className="text-muted-foreground">
                For private event inquiries, please contact us at:
                <br />
                <a href="mailto:inedit@ineditrestaurant.com" className="text-brand hover:underline">
                  inedit@ineditrestaurant.com
                </a>
              </p>
            {/*formSubmitted ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-serif font-bold mb-4">Thank You!</h2>
                <p className="text-lg mb-6">
                  Your message has been received. We will get back to you as soon as possible.
                </p>
                <Button onClick={() => setFormSubmitted(false)} variant="outline">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-serif font-medium mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <textarea id="message" className="w-full min-h-[150px] p-3 border rounded-md" required></textarea>
                  </div>

                  <Button type="submit" className="w-full bg-brand hover:bg-brand/90 text-white">
                    Send Message
                  </Button>
                </form>
              </>
            )*/}
          </div>
        </div>
      </div>
    </div>
  )
}
