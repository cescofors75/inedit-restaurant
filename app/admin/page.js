// src/app/admin/page.js
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Panel de Administración
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Gestiona el menú y las bebidas de tu restaurante
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
            <div className="px-6 py-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.38a48.474 48.474 0 0 0-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Zm-3 0a.375.375 0 1 1-.53 0L9 2.845l.265.265Zm6 0a.375.375 0 1 1-.53 0L15 2.845l.265.265Z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Gestión del Menú</h3>
                  <p className="text-sm text-gray-500">
                    Administra los platos, categorías y precios del menú del restaurante
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50">
              <Link 
                href="/admin/food"
                className="text-base font-medium text-indigo-600 hover:text-indigo-800"
              >
                Acceder al menú &rarr;
              </Link>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
            <div className="px-6 py-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Gestión de Vinos y Bebidas</h3>
                  <p className="text-sm text-gray-500">
                    Administra la carta de vinos y otras bebidas
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50">
              <Link 
                href="/admin/drinks"
                className="text-base font-medium text-purple-600 hover:text-purple-800"
              >
                Acceder a bebidas &rarr;
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          <div className="px-6 py-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
                </svg>
              </div>
              <div className="ml-5">
                <h3 className="text-lg font-medium text-gray-900">Archivos JSON</h3>
                <p className="text-sm text-gray-500">
                  Enlaces directos a los archivos JSON para copiar o exportar
                </p>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex flex-col space-y-2">
              <a 
                href="/data/menu.json" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-base font-medium text-green-600 hover:text-green-800"
              >
                Ver archivo menu.json &rarr;
              </a>
              <a 
                href="/data/beverages.json" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-base font-medium text-green-600 hover:text-green-800"
              >
                Ver archivo beverages.json &rarr;
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Todos los cambios se guardan automáticamente en los archivos JSON correspondientes.
          </p>
        </div>
      </div>
    </div>
  );
}