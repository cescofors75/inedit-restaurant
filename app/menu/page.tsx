import { Metadata } from "next";
import { Suspense } from "react";
import { generatePageMetadata } from "@/components/page-metadata";
import MenuContent from "./menu-content";

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

export default function MenuPage() {
  // Ahora MenuContent carga sus propios datos
  return (
    <Suspense fallback={<MenuLoading />}>
      <MenuContent />
    </Suspense>
  );
}