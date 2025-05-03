"use client"

import type React from "react"

import { useLanguage } from "@/context/language-context"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

export default function ReservationPage() {
  const { t } = useLanguage()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, this would send the reservation data to a server
    setFormSubmitted(true)
  }

  const timeSlots = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"]

  return (
    <div className="pt-20 pb-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-brand text-white p-8">
            <h1 className="text-3xl font-serif font-bold">{t("reservation.title")}</h1>
            <p className="mt-2">
              Complete the form below to reserve your table at INÈDIT. We look forward to welcoming you.
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-8 text-center">
              <h2 className="text-2xl font-serif font-bold mb-4">Thank You!</h2>
              <p className="text-lg mb-6">
                Your reservation request has been received. We will confirm your reservation shortly via email or phone.
              </p>
              <Button onClick={() => setFormSubmitted(false)} variant="outline">
                Make Another Reservation
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("reservation.name")}</Label>
                  <Input id="name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t("reservation.contact")}</Label>
                  <Input id="phone" type="tel" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guests">{t("reservation.guests")}</Label>
                  <Select required>
                    <SelectTrigger id="guests">
                      <SelectValue placeholder="Select number of guests" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Guest" : "Guests"}
                        </SelectItem>
                      ))}
                      <SelectItem value="9+">9+ Guests (Large Party)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("reservation.date")}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">{t("reservation.time")}</Label>
                  <Select required>
                    <SelectTrigger id="time">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="special-requests">Special Requests (Optional)</Label>
                <textarea
                  id="special-requests"
                  className="w-full min-h-[100px] p-3 border rounded-md"
                  placeholder="Please let us know if you have any special requests or dietary requirements."
                ></textarea>
              </div>

              <Button type="submit" className="w-full bg-brand hover:bg-brand/90 text-white">
                {t("reservation.submit")}
              </Button>

              <p className="text-sm text-muted-foreground text-center mt-4">
                By making a reservation, you agree to our reservation policy. We hold tables for 15 minutes past the
                reservation time.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
