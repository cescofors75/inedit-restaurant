import { Metadata } from "next";
import { Suspense } from "react";
import { generatePageMetadata } from "@/components/page-metadata";
import MenuContent from "./menu-content";
import fs from 'fs/promises';
import path from 'path';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({ slug: 'menu' });
}

// Loading fallback component
function MenuLoading() {
  return (
    <div className="pt-20 pb-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="h-10 bg-gray-200 animate-pulse rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3 mx-auto"></div>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-200 animate-pulse rounded w-24"></div>
            ))}
          </div>
          <div className="w-full h-px bg-gray-200 mb-8 mt-2"></div>
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-gray-100 animate-pulse p-6 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Datos del menú directamente incluidos (solo para desarrollo)
const menuData = {
  "categories": [
    {
      "id": "starters",
      "name": {
        "en": "Starters",
        "es": "Entrantes",
        "ca": "Entrants",
        "fr": "Entrées",
        "it": "Antipasti",
        "de": "Vorspeisen",
        "ru": "Закуски"
      },
      "slug": "starters",
      "description": {
        "en": "Begin your culinary journey",
        "es": "Comienza tu viaje culinario",
        "ca": "Comença el teu viatge culinari",
        "fr": "Commencez votre voyage culinaire",
        "it": "Inizia il tuo viaggio culinario",
        "de": "Beginnen Sie Ihre kulinarische Reise",
        "ru": "Начните свое кулинарное путешествие"
      }
    },
    {
      "id": "mains",
      "name": {
        "en": "Main Courses",
        "es": "Platos Principales",
        "ca": "Plats Principals",
        "fr": "Plats Principaux",
        "it": "Piatti Principali",
        "de": "Hauptgerichte",
        "ru": "Основные блюда"
      },
      "slug": "mains",
      "description": {
        "en": "Signature dishes",
        "es": "Platos de autor",
        "ca": "Plats d'autor",
        "fr": "Plats signature",
        "it": "Piatti d'autore",
        "de": "Signature-Gerichte",
        "ru": "Фирменные блюда"
      }
    },
    {
      "id": "desserts",
      "name": {
        "en": "Desserts",
        "es": "Postres",
        "ca": "Postres",
        "fr": "Desserts",
        "it": "Dolci",
        "de": "Desserts",
        "ru": "Десерты"
      },
      "slug": "desserts",
      "description": {
        "en": "Sweet endings",
        "es": "Dulces finales",
        "ca": "Dolços finals",
        "fr": "Douces conclusions",
        "it": "Dolci conclusioni",
        "de": "Süße Abschlüsse",
        "ru": "Сладкие завершения"
      }
    }
  ],
  "items": [
    {
      "id": "tuna-tataki",
      "name": {
        "en": "Tuna Tataki",
        "es": "Tataki de Atún",
        "ca": "Tataki de Tonyina",
        "fr": "Tataki de Thon",
        "it": "Tataki di Tonno",
        "de": "Thunfisch-Tataki",
        "ru": "Татаки из тунца"
      },
      "description": {
        "en": "Lightly seared tuna with sesame crust",
        "es": "Atún ligeramente sellado con costra de sésamo",
        "ca": "Tonyina lleugerament segellada amb crosta de sèsam",
        "fr": "Thon légèrement saisi avec croûte de sésame",
        "it": "Tonno leggermente scottato con crosta di sesamo",
        "de": "Leicht angebratener Thunfisch mit Sesamkruste",
        "ru": "Слегка обжаренный тунец с кунжутной корочкой"
      },
      "price": "18",
      "categoryId": "starters",
      "image": "/images/menu/tuna-tataki.jpg"
    },
    {
      "id": "tomato-salad",
      "name": {
        "en": "Heirloom Tomato Salad",
        "es": "Ensalada de Tomate de Herencia",
        "ca": "Amanida de Tomàquet d'Herència",
        "fr": "Salade de Tomates Anciennes",
        "it": "Insalata di Pomodori Antichi",
        "de": "Alte Tomatensorten-Salat",
        "ru": "Салат из помидоров старинных сортов"
      },
      "description": {
        "en": "With buffalo mozzarella and basil",
        "es": "Con mozzarella de búfala y albahaca",
        "ca": "Amb mozzarella de búfala i alfàbrega",
        "fr": "Avec mozzarella de bufflonne et basilic",
        "it": "Con mozzarella di bufala e basilico",
        "de": "Mit Büffelmozzarella und Basilikum",
        "ru": "С моцареллой из буйволиного молока и базиликом"
      },
      "price": "14",
      "categoryId": "starters"
    },
    {
      "id": "iberian-pork",
      "name": {
        "en": "Iberian Pork",
        "es": "Cerdo Ibérico",
        "ca": "Porc Ibèric",
        "fr": "Porc Ibérique",
        "it": "Maiale Iberico",
        "de": "Iberisches Schwein",
        "ru": "Иберийская свинина"
      },
      "description": {
        "en": "With potato purée and seasonal vegetables",
        "es": "Con puré de patata y verduras de temporada",
        "ca": "Amb puré de patata i verdures de temporada",
        "fr": "Avec purée de pommes de terre et légumes de saison",
        "it": "Con purè di patate e verdure di stagione",
        "de": "Mit Kartoffelpüree und Saisongemüse",
        "ru": "С картофельным пюре и сезонными овощами"
      },
      "price": "24",
      "categoryId": "mains",
      "image": "/images/menu/pork.jpg"
    },
    {
      "id": "seabass",
      "name": {
        "en": "Mediterranean Sea Bass",
        "es": "Lubina Mediterránea",
        "ca": "Llobarro Mediterrani",
        "fr": "Bar Méditerranéen",
        "it": "Spigola Mediterranea",
        "de": "Mediterraner Wolfsbarsch",
        "ru": "Средиземноморский морской окунь"
      },
      "description": {
        "en": "With fennel and citrus",
        "es": "Con hinojo y cítricos",
        "ca": "Amb fonoll i cítrics",
        "fr": "Avec fenouil et agrumes",
        "it": "Con finocchio e agrumi",
        "de": "Mit Fenchel und Zitrusfrüchten",
        "ru": "С фенхелем и цитрусовыми"
      },
      "price": "26",
      "categoryId": "mains"
    },
    {
      "id": "chocolate-souffle",
      "name": {
        "en": "Chocolate Soufflé",
        "es": "Soufflé de Chocolate",
        "ca": "Soufflé de Xocolata",
        "fr": "Soufflé au Chocolat",
        "it": "Soufflé al Cioccolato",
        "de": "Schokoladensoufflé",
        "ru": "Шоколадное суфле"
      },
      "description": {
        "en": "With vanilla ice cream",
        "es": "Con helado de vainilla",
        "ca": "Amb gelat de vainilla",
        "fr": "Avec glace à la vanille",
        "it": "Con gelato alla vaniglia",
        "de": "Mit Vanilleeis",
        "ru": "С ванильным мороженым"
      },
      "price": "12",
      "categoryId": "desserts",
      "image": "/images/menu/chocolate-souffle.jpg"
    },
    {
      "id": "cheesecake",
      "name": {
        "en": "Basque Cheesecake",
        "es": "Pastel de Queso Vasco",
        "ca": "Pastís de Formatge Basc",
        "fr": "Cheesecake Basque",
        "it": "Cheesecake Basco",
        "de": "Baskischer Käsekuchen",
        "ru": "Баскский чизкейк"
      },
      "description": {
        "en": "With berry compote",
        "es": "Con compota de bayas",
        "ca": "Amb compota de baies",
        "fr": "Avec compote de baies",
        "it": "Con composta di bacche",
        "de": "Mit Beerenkompott",
        "ru": "С ягодным компотом"
      },
      "price": "10",
      "categoryId": "desserts"
    }
  ]
};

export default async function MenuPage() {
  // En lugar de tratar de leer el archivo o importarlo, usamos directamente
  // los datos definidos en este archivo
  
  // Si quieres intentar leer el archivo, descomenta este código y asegúrate de que
  // la ruta del archivo sea correcta
  /*
  try {
    // Asegúrate de que esta ruta sea correcta para tu proyecto
    const filePath = path.join(process.cwd(), 'public', 'data', 'menu.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const menuDataFromFile = JSON.parse(fileContents);
    
    return (
      <Suspense fallback={<MenuLoading />}>
        <MenuContent 
          initialCategories={menuDataFromFile.categories} 
          initialItems={menuDataFromFile.items} 
        />
      </Suspense>
    );
  } catch (error) {
    console.error('Error loading menu data:', error);
    // Continuar con los datos de respaldo definidos en el archivo
  }
  */
  
  // Usar los datos definidos directamente en este archivo
  return (
    <Suspense fallback={<MenuLoading />}>
      <MenuContent 
        initialCategories={menuData.categories} 
        initialItems={menuData.items} 
      />
    </Suspense>
  );
}