"use client"

import { useLanguage } from "@/context/language-context"

export default function LegalPage() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">AVISO LEGAL</h1>
      
      <div className="space-y-6">
        <p>
          Esta página Web es propiedad de GIDIMA, S.A., con NIF nº A17402025 y domicilio en C/Nicolau Font i Maig 2 (17310 Lloret de Mar) 
          e Inscrita en el Registro Mercantil de Girona en el Tomo 674 Folio 145 Hoja nº GI-12.953
        </p>
        
        <p>
          Para cualquier consulta o propuesta, contáctenos llamando al teléfono + 34 972 365 245 o en el e-mail inedit@ineditrestaurant.com.
        </p>
        
        <p>
          Esta página Web se rige por la normativa exclusivamente aplicable en España, quedando sometida a ella, tanto nacionales como 
          extranjeros que utilicen esta Web.
        </p>
        
        <p>
          El acceso a nuestra página Web por parte de la PERSONA USUARIA es gratuito y su uso se rige por las condiciones de uso vigentes 
          en el momento del acceso, que rogamos lea detenidamente. Si la PERSONA USUARIA no estuviere de acuerdo con las presentes condiciones 
          de uso, deberá abstenerse de utilizar este portal y operar por medio de este, pudiendo contactar con nosotros para que le resolvamos 
          cualquier duda en relación con las mismas.
        </p>
        
        <p>
          El suministro de datos personales y la compra de productos a través de nuestro portal requiere una edad mínima de 14 años, o en su caso, 
          disponer de capacidad jurídica suficiente para contratar.
        </p>
        
        <p>
          En cualquier momento podremos modificar la presentación y configuración de nuestra Web, ampliar o reducir servicios, e incluso suprimirla 
          de la Red, así como los servicios y contenidos prestados.
        </p>
        
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">A. PROPIEDAD INTELECTUAL</h2>
          <div className="space-y-4">
            <p>
              Todos los contenidos, textos, imágenes, y códigos fuente son propiedad de GIDIMA, S.A. o de terceros a los que se han adquirido sus 
              derechos de explotación, y están protegidos por los derechos de Propiedad Intelectual e Industrial.
            </p>
            
            <p>
              La PERSONA USUARIA únicamente tiene derecho a un uso privado de los mismos, sin ánimo de lucro, y necesita autorización expresa 
              para modificarlos, reproducirlos, explotarlos, distribuirlos o ejercer cualquier derecho perteneciente a su titular.
            </p>
            
            <p>
              GIDIMA, S.A. es una marca registrada, y está prohibida su reproducción, imitación, utilización o inserción de estas marcas sin 
              nuestra debida autorización.
            </p>
            
            <p>
              El establecimiento de enlaces a nuestro portal no confiere ningún derecho sobre el mismo. Asimismo, el simple hecho de establecer 
              un enlace a nuestra página web no da derecho a otorgarse la categoría de colaborador o socio.
            </p>
            
            <p>
              GIDIMA, S.A. queda exonerado de responsabilidad por cualquier reclamación respecto a los derechos de propiedad intelectual de los 
              artículos e imágenes publicadas por terceros en su portal.
            </p>
            
            <p>
              Está absolutamente prohibida la imitación ya sea total o parcial de nuestro portal o el establecimiento de enlaces a nuestra página 
              web sin la autorización previa de GIDIMA, S.A.
            </p>
          </div>
        </section>
        
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">B. CONDICIONES DE ACCESO Y USO</h2>
          <div className="space-y-4">
            <p>
              El acceso a nuestra página Web es gratuito y no exige suscripción o registro previo. Sin embargo, determinados servicios son 
              de acceso restringido a determinadas PERSONAS USUARIAS y requieren haber realizado un proceso de registro y/o la identificación 
              mediante contraseñas. Estos servicios quedarán debidamente identificados en la Web.
            </p>
            
            <p>
              El envío de datos personales implica la aceptación expresa por parte de la PERSONA USUARIA de nuestra política de privacidad.
            </p>
            
            <p>
              La PERSONA USUARIA debe acceder a nuestra página Web conforme a la buena fe, las normas de orden público y a las presentes 
              Condiciones Generales de uso. El acceso a nuestro sitio Web se realiza bajo la propia y exclusiva responsabilidad de la PERSONA 
              USUARIA, que responderá en todo caso de los daños y perjuicios que pueda causar a terceros o a nosotros mismos.
            </p>
            
            <p>
              La PERSONA USUARIA tiene expresamente prohibida la utilización y obtención de los servicios, productos y contenidos ofrecidos en 
              la presente página web, por procedimientos distintos a los estipulados en las presentes condiciones de uso y, en su caso, en las 
              condiciones particulares que regulen la adquisición de determinados productos.
            </p>
            
            <p>
              La PERSONA USUARIA tiene prohibido cualquier tipo de acción sobre nuestro portal que origine una excesiva sobrecarga de 
              funcionamiento a nuestros sistemas informáticos, así como la introducción de virus, o instalación de robots, o software que 
              altere el normal funcionamiento de nuestra web, o en definitiva pueda causar daños a nuestros sistemas informáticos.
            </p>
            
            <p>
              Teniendo en cuenta la dificultad de control respecto a la información, contenidos y servicios que contengan páginas web de 
              terceros disponibles desde nuestra página web, le comunicamos que GIDIMA, S.A., no se hace responsable de los mismos, sin 
              perjuicio de que intentará, en la medida de lo posible, velar por su legalidad.
            </p>
            
            <p>
              GIDIMA, S.A. se reserva el derecho a dar de baja a cualquier PERSONA USUARIA que la organización entienda que ha vulnerado 
              las condiciones que rigen el uso de nuestra página web. Asimismo, se reserva el derecho de ejercitar las acciones legales 
              oportunas contra aquellos que vulneren las presentes condiciones generales de uso.
            </p>
          </div>
        </section>
        
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">C. POLÍTICA DE PRIVACIDAD</h2>
          <div className="space-y-4">
            <p>
              La confidencialidad y la seguridad son valores primordiales de GIDIMA, S.A. y, en consecuencia, asumimos el compromiso de 
              garantizar la privacidad de la PERSONA USUARIA en todo momento y de no recabar información innecesaria.
            </p>
            
            <p>
              El suministro de datos personales a través de nuestro portal requiere una edad mínima de 14 años y la aceptación expresa 
              de nuestra Política de Privacidad.
            </p>
          </div>
        </section>
        
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">D. RESPONSABILIDADES</h2>
          <div className="space-y-4">
            <p>
              Al poner a disposición de la PERSONA USUARIA esta página Web queremos ofrecerle un servicio de calidad, utilizando la máxima 
              diligencia en la prestación de este, así como en los medios tecnológicos utilizados. No obstante, GIDIMA, S.A. no garantiza 
              que la disponibilidad del servicio sea continua e ininterrumpida, por circunstancias originadas por problemas en la red de 
              Internet, averías en los dispositivos informáticos u otras circunstancias imprevisibles, de manera que la PERSONA USUARIA 
              acepta soportar dentro de unos límites razonables estas circunstancias.
            </p>
            
            <p>
              Esta página web, salvo lo regulado, en su caso, por algunas condiciones de uso específicas, es puramente informativa y de 
              presentación corporativa de nuestros productos y servicios, por lo que GIDIMA, S.A. no se responsabiliza por las expectativas 
              de cualquier tipo que pueda generar a la PERSONA USUARIA.
            </p>
            
            <p>
              Todo lo referente a nuestra página web, se rige exclusivamente por las leyes españolas. En el caso de que se produzca cualquier 
              tipo de discrepancia o diferencia entre las partes en relación con la interpretación y contenido de la presente página web, 
              todas las partes se someten a los Juzgados y Tribunales que legalmente correspondan.
            </p>
          </div>
        </section>
        
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">E. VIGENCIA DE LAS CONDICIONES GENERALES DE ACCESO A LA WEB</h2>
          <div className="space-y-4">
            <p>
              Las presentes Condiciones Generales de Uso han sido modificadas con fecha 07/05/2025. En cualquier momento podemos proceder 
              a su modificación: por favor, compruebe la fecha de emisión en cada ocasión en que se conecte a nuestra página Web y así 
              tendrá la certeza de que no se ha producido modificación alguna que le afecte.
            </p>
            
            <p>
              Para cualquier cuestión respecto a las Condiciones de Uso de nuestra página web, puede ponerse en contacto con nosotros en 
              los datos arriba indicados, o con Lant Abogados en info@lant-abogados.com o en https://www.lant-abogados.com/.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

