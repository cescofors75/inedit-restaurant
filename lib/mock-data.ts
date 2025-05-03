// lib/mock-data.ts

// Types for our data
export interface Page {
  id: string;
  title: string;
  slug: string;
  content: any;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  updatedAt: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  categoryId: string;
  image?: {
    url: string;
    width: number;
    height: number;
  };
}

export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  image: {
    url: string;
    width: number;
    height: number;
  };
}

export interface RestaurantSettings {
  id: string;
  name: string;
  description?: string;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
  };
  openingHours: Array<{
    day: string;
    open: string;
    close: string;
    closed: boolean;
  }>;
  socialMedia: Array<{
    platform: string;
    url: string;
  }>;
}

// Mock data
const pages: Page[] = [
  {
    id: "home-page",
    title: "INÈDIT Restaurant - Home",
    slug: "home",
    content: {
      welcome: "Welcome to INÈDIT Restaurant",
      description: "Experience exceptional signature cuisine in a unique atmosphere"
    },
    seo: {
      title: "INÈDIT | Signature Cuisine Restaurant",
      description: "Experience exceptional signature cuisine in a unique atmosphere",
      keywords: ["restaurant", "signature cuisine", "gourmet", "fine dining"]
    },
    updatedAt: new Date().toISOString()
  },
  {
    id: "menu-page",
    title: "Our Menu",
    slug: "menu",
    content: {
      intro: "Discover our seasonal menu",
      note: "All dishes are prepared with locally sourced ingredients"
    },
    seo: {
      title: "Menu | INÈDIT Restaurant",
      description: "Explore our seasonal and signature dishes",
      keywords: ["menu", "food", "cuisine", "dishes"]
    },
    updatedAt: new Date().toISOString()
  },
  {
    id: "contact-page",
    title: "Contact Us",
    slug: "contact",
    content: {
      intro: "Get in touch with us",
      details: "We'd love to hear from you and answer any questions you may have"
    },
    seo: {
      title: "Contact | INÈDIT Restaurant",
      description: "Find our location and contact information",
      keywords: ["contact", "location", "reservation", "find us"]
    },
    updatedAt: new Date().toISOString()
  }
];

const menuCategories: MenuCategory[] = [
  {
    id: "starters",
    name: "Starters",
    slug: "starters",
    description: "Begin your culinary journey"
  },
  {
    id: "mains",
    name: "Main Courses",
    slug: "mains",
    description: "Signature dishes"
  },
  {
    id: "desserts",
    name: "Desserts",
    slug: "desserts",
    description: "Sweet endings"
  }
];

const menuItems: MenuItem[] = [
  {
    id: "tuna-tataki",
    name: "Tuna Tataki",
    description: "Lightly seared tuna with sesame crust",
    price: "18",
    categoryId: "starters",
    image: {
      url: "/images/menu/tuna-tataki.jpg",
      width: 800,
      height: 600
    }
  },
  {
    id: "tomato-salad",
    name: "Heirloom Tomato Salad",
    description: "With buffalo mozzarella and basil",
    price: "14",
    categoryId: "starters"
  },
  {
    id: "iberian-pork",
    name: "Iberian Pork",
    description: "With potato purée and seasonal vegetables",
    price: "24",
    categoryId: "mains",
    image: {
      url: "/images/menu/pork.jpg",
      width: 800,
      height: 600
    }
  },
  {
    id: "seabass",
    name: "Mediterranean Sea Bass",
    description: "With fennel and citrus",
    price: "26",
    categoryId: "mains"
  },
  {
    id: "chocolate-souffle",
    name: "Chocolate Soufflé",
    description: "With vanilla ice cream",
    price: "12",
    categoryId: "desserts",
    image: {
      url: "/images/menu/chocolate-souffle.jpg",
      width: 800,
      height: 600
    }
  },
  {
    id: "cheesecake",
    name: "Basque Cheesecake",
    description: "With berry compote",
    price: "10",
    categoryId: "desserts"
  }
];

const galleryImages: GalleryImage[] = [
  {
    id: "gallery-1",
    title: "Restaurant Interior",
    description: "The elegant dining room",
    image: {
      url: "/images/gallery/interior.jpg",
      width: 1200,
      height: 800
    }
  },
  {
    id: "gallery-2",
    title: "Signature Dish",
    description: "Our chef's special creation",
    image: {
      url: "/images/gallery/dish.jpg",
      width: 1200,
      height: 800
    }
  },
  {
    id: "gallery-3",
    title: "Bar Area",
    description: "Enjoy a pre-dinner drink",
    image: {
      url: "/images/gallery/bar.jpg",
      width: 1200,
      height: 800
    }
  }
];

const settings: RestaurantSettings = {
  id: "settings",
  name: "INÈDIT Restaurant",
  description: "Signature cuisine in a unique atmosphere",
  contactInfo: {
    address: "Carrer Exemple 123, 08001 Barcelona",
    phone: "+34 932 123 456",
    email: "info@inedit-restaurant.com"
  },
  openingHours: [
    { day: "monday", open: "12:00", close: "23:00", closed: false },
    { day: "tuesday", open: "12:00", close: "23:00", closed: false },
    { day: "wednesday", open: "12:00", close: "23:00", closed: false },
    { day: "thursday", open: "12:00", close: "23:00", closed: false },
    { day: "friday", open: "12:00", close: "00:00", closed: false },
    { day: "saturday", open: "12:00", close: "00:00", closed: false },
    { day: "sunday", open: "12:00", close: "22:00", closed: false }
  ],
  socialMedia: [
    { platform: "instagram", url: "https://instagram.com/inedit" },
    { platform: "facebook", url: "https://facebook.com/inedit" },
    { platform: "twitter", url: "https://twitter.com/inedit" }
  ]
};

const translations: Record<string, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.menu": "Menu",
    "nav.gallery": "Gallery",
    "nav.contact": "Contact",
    "hero.title": "Signature Cuisine",
    "hero.subtitle": "An unforgettable dining experience",
    "hero.cta": "Book a Table",
    "menu.title": "Our Menu",
    "menu.subtitle": "Crafted with passion",
    "contact.address": "Address",
    "contact.phone": "Phone",
    "contact.email": "Email",
    "footer.copyright": "All rights reserved"
  },
  es: {
    "nav.home": "Inicio",
    "nav.menu": "Carta",
    "nav.gallery": "Galería",
    "nav.contact": "Contacto",
    "hero.title": "Cocina de Autor",
    "hero.subtitle": "Una experiencia gastronómica inolvidable",
    "hero.cta": "Reservar Mesa",
    "menu.title": "Nuestra Carta",
    "menu.subtitle": "Elaborada con pasión",
    "contact.address": "Dirección",
    "contact.phone": "Teléfono",
    "contact.email": "Correo",
    "footer.copyright": "Todos los derechos reservados"
  },
  ca: {
    "nav.home": "Inici",
    "nav.menu": "Carta",
    "nav.gallery": "Galeria",
    "nav.contact": "Contacte",
    "hero.title": "Cuina d'Autor",
    "hero.subtitle": "Una experiència gastronòmica inoblidable",
    "hero.cta": "Reservar Taula",
    "menu.title": "La Nostra Carta",
    "menu.subtitle": "Elaborada amb passió",
    "contact.address": "Adreça",
    "contact.phone": "Telèfon",
    "contact.email": "Correu",
    "footer.copyright": "Tots els drets reservats"
  }
};

// API-like methods
export async function getPageBySlug(slug: string, locale = 'es'): Promise<Page | null> {
  const page = pages.find(p => p.slug === slug);
  return page ? { ...page } : null;
}

export async function getAllPages(): Promise<Page[]> {
  return [...pages];
}

export async function getMenuCategories(): Promise<MenuCategory[]> {
  return [...menuCategories];
}

export async function getMenuItems(): Promise<MenuItem[]> {
  return [...menuItems];
}

export async function getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
  return menuItems.filter(item => item.categoryId === categoryId);
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  return [...galleryImages];
}

export async function getRestaurantSettings(): Promise<RestaurantSettings> {
  return { ...settings };
}

export async function getTranslations(locale: string): Promise<Record<string, string>> {
  return translations[locale] || translations.en;
}

// Update methods (these just simulate API calls and don't actually persist data)
export async function updatePage(pageId: string, updateData: Partial<Page>): Promise<Page | null> {
  const pageIndex = pages.findIndex(p => p.id === pageId);
  if (pageIndex === -1) return null;
  
  const updatedPage = {
    ...pages[pageIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  // In a real app, this would persist the changes
  console.log('Updated page:', updatedPage);
  
  return updatedPage;
}

export async function updateSettings(updateData: Partial<RestaurantSettings>): Promise<RestaurantSettings> {
  const updatedSettings = {
    ...settings,
    ...updateData
  };
  
  // In a real app, this would persist the changes
  console.log('Updated settings:', updatedSettings);
  
  return updatedSettings;
}

