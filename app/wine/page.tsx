"use client"

import { useLanguage } from "@/context/language-context"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function WinePage() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")

  const wineCategories = [
    {
      id: "red",
      label: t("wine.red"),
      wines: [
        {
          name: "Château Margaux 2015",
          region: "Bordeaux, France",
          description: "Elegant and complex with notes of blackcurrant, cedar, and violets.",
          price: "€220",
          glass: "€45",
        },
        {
          name: "Tignanello 2018",
          region: "Tuscany, Italy",
          description: "Full-bodied Super Tuscan with rich dark fruit and spice notes.",
          price: "€180",
          glass: "€38",
        },
        {
          name: "Vega Sicilia Único 2011",
          region: "Ribera del Duero, Spain",
          description: "Powerful yet refined with dark berries, tobacco, and leather.",
          price: "€320",
          glass: null,
        },
        {
          name: "Penfolds Grange 2017",
          region: "South Australia",
          description: "Iconic Australian Shiraz with intense fruit and oak complexity.",
          price: "€450",
          glass: null,
        },
        {
          name: "Muga Reserva 2016",
          region: "Rioja, Spain",
          description: "Traditional Rioja with red fruit, vanilla, and spice notes.",
          price: "€65",
          glass: "€14",
        },
      ],
    },
    {
      id: "white",
      label: t("wine.white"),
      wines: [
        {
          name: "Puligny-Montrachet 1er Cru 2018",
          region: "Burgundy, France",
          description: "Refined Chardonnay with citrus, white flowers, and mineral notes.",
          price: "€160",
          glass: "€32",
        },
        {
          name: "Cloudy Bay Sauvignon Blanc 2021",
          region: "Marlborough, New Zealand",
          description: "Vibrant with grapefruit, passion fruit, and fresh herbs.",
          price: "€55",
          glass: "€12",
        },
        {
          name: "Albariño Do Ferreiro 2020",
          region: "Rías Baixas, Spain",
          description: "Crisp and aromatic with apple, peach, and saline notes.",
          price: "€48",
          glass: "€11",
        },
        {
          name: "Kistler Vineyard Chardonnay 2019",
          region: "Sonoma, California",
          description: "Rich and complex with ripe fruit, butter, and toasted oak.",
          price: "€120",
          glass: "€25",
        },
      ],
    },
    {
      id: "rose",
      label: t("wine.rose"),
      wines: [
        {
          name: "Whispering Angel 2021",
          region: "Provence, France",
          description: "Elegant and dry with delicate red fruit and floral notes.",
          price: "€60",
          glass: "€14",
        },
        {
          name: "Domaines Ott Château Romassan 2020",
          region: "Bandol, France",
          description: "Complex and structured with red berries and Mediterranean herbs.",
          price: "€85",
          glass: "€18",
        },
        {
          name: "Chivite Las Fincas Rosado 2021",
          region: "Navarra, Spain",
          description: "Refined rosé with strawberry, raspberry, and subtle floral hints.",
          price: "€45",
          glass: "€10",
        },
      ],
    },
    {
      id: "sparkling",
      label: t("wine.sparkling"),
      wines: [
        {
          name: "Dom Pérignon 2012",
          region: "Champagne, France",
          description: "Prestigious champagne with citrus, brioche, and mineral complexity.",
          price: "€280",
          glass: null,
        },
        {
          name: "Krug Grande Cuvée",
          region: "Champagne, France",
          description: "Multi-vintage masterpiece with depth, richness, and finesse.",
          price: "€320",
          glass: null,
        },
        {
          name: "Gramona III Lustros Cava 2013",
          region: "Penedès, Spain",
          description: "Premium aged cava with apple, toast, and honey notes.",
          price: "€75",
          glass: "€16",
        },
        {
          name: "Ferrari Perlé 2016",
          region: "Trentino, Italy",
          description: "Elegant Trentodoc with apple, citrus, and almond notes.",
          price: "€65",
          glass: "€14",
        },
      ],
    },
  ]

  const filterWines = (wines: any[]) => {
    if (!searchTerm) return wines
    return wines.filter(
      (wine) =>
        wine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wine.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wine.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  return (
    <div className="pt-20 pb-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{t("wine.title")}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Our carefully curated wine selection complements our cuisine and offers exceptional quality from renowned
            regions around the world.
          </p>

          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search by name, region, or description..."
              className="w-full p-3 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="red">
            <TabsList className="grid w-full grid-cols-4 mb-12">
              {wineCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-lg">
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {wineCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="space-y-6">
                  {filterWines(category.wines).length > 0 ? (
                    filterWines(category.wines).map((wine, index) => (
                      <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-serif font-medium">{wine.name}</h3>
                          <div className="text-right">
                            <div className="text-brand font-medium">{wine.price}</div>
                            {wine.glass && <div className="text-sm text-muted-foreground">Glass: {wine.glass}</div>}
                          </div>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">{wine.region}</p>
                        <p className="text-muted-foreground">{wine.description}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-lg text-muted-foreground">No wines found matching your search.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
