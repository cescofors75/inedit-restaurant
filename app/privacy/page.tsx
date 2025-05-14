"use client"

import { useLanguage } from "@/context/language-context"

export default function PrivacyPage() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">POLÍTICA DE PRIVACIDAD</h1>
      
      <div className="space-y-6">
        <p>
          La confidencialidad y la seguridad son valores primordiales de GIDIMA, S.A. y, en consecuencia, 
          asumimos el compromiso de garantizar la privacidad del Usuario en todo momento y de no recabar 
          información innecesaria. A continuación, le proporcionamos toda la información necesaria sobre 
          nuestra Política de Privacidad en relación con los datos personales que recabamos, explicándole:
        </p>
        
        <ul className="list-disc pl-8 space-y-2">
          <li>Quién es el responsable del tratamiento de sus datos.</li>
          <li>Para qué finalidades recabamos los datos que le solicitamos.</li>
          <li>Cuál es la legitimación para su tratamiento.</li>
          <li>Durante cuánto tiempo los conservamos.</li>
          <li>A qué destinatarios se comunican sus datos.</li>
          <li>Cuáles son sus derechos y cómo ejercerlos.</li>
        </ul>
        
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">1. RESPONSABLE</h2>
          <p>
            GIDIMA, S.A. A17402025<br />
            C/Nicolau Font i Maig 2 (17310 Lloret de Mar)<br />
            inedit@ineditrestaurant.com
          </p>
        </section>
        
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">2. FINALIDADES, LEGITIMACIÓN Y CONSERVACIÓN</h2>
          <p className="mb-4">
            de los tratamientos de los datos enviados a través de:
          </p>
          
          <div className="pl-4 space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Formulario de Contacto</h3>
              <div className="space-y-3">
                <p>
                  <strong>Finalidad:</strong> Facilitarle un medio para que pueda ponerse en contacto con nosotros 
                  y contestar a sus solicitudes de información, así como enviarle comunicaciones de nuestros productos, 
                  servicios y actividades, inclusive por medios electrónicos (correo electrónico, SMS, etc.), si marca 
                  la casilla de aceptación.
                </p>
                <p>
                  <strong>Legitimación:</strong> El consentimiento del usuario al solicitarnos información a través de 
                  nuestro formulario de contacto y al marcar la casilla de aceptación de envío de información.
                </p>
                <p>
                  <strong>Conservación:</strong> Una vez resuelta su solicitud por medio de nuestro formulario o contestada 
                  por correo electrónico, si no ha generado un nuevo tratamiento, y en caso de haber aceptado recibir envíos 
                  comerciales, hasta que solicite la baja de los mismos.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Envío de correos electrónicos</h3>
              <div className="space-y-3">
                <p>
                  <strong>Finalidad:</strong> Contestar a sus solicitudes de información, atender sus peticiones y responder 
                  sus consultas o dudas. En caso de recibir su Currículum Vitae, sus datos personales y curriculares podrán 
                  formar parte de nuestras bases de datos para participar en nuestros procesos de selección presentes y futuros.
                </p>
                <p>
                  <strong>Legitimación:</strong> El consentimiento del usuario al solicitarnos información a través de la 
                  dirección de correo electrónico o enviarnos sus datos y CV para participar en nuestros procesos de selección.
                </p>
                <p>
                  <strong>Conservación:</strong> Una vez resulta contestada su petición por correo electrónico, si no ha 
                  generado un nuevo tratamiento. En el caso de recibir su CV, sus datos podrán ser conservados durante un 
                  año máximo para futuros procesos de selección.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <h3 className="text-xl font-semibold">Obligación de facilitarnos sus datos personales y consecuencias de no hacerlo</h3>
            <p>
              El suministro de datos personales requiere una edad mínima de 14 años o, en su caso, la edad mínima que 
              establezca la normativa de protección de datos aplicable y/o disponer de capacidad jurídica suficiente para contratar.
            </p>
            <p>
              Los datos personales solicitados son necesarios para gestionar sus solicitudes, darle de alta como usuario 
              y/o prestarle los servicios que pueda contratar, por lo que, si no nos los facilita, no podremos atenderle 
              correctamente ni prestarle el servicio que ha solicitado.
            </p>
            <p>
              En todo caso, nos reservamos el derecho de decidir sobre la incorporación o no de sus datos personales y 
              demás información a nuestras bases de datos.
            </p>
          </div>
        </section>
        
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">3. DESTINATARIOS DE SUS DATOS</h2>
          <p>
            Sus datos son confidenciales y no se cederán a terceros, salvo que exista obligación legal.
          </p>
        </section>
        
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">4. COOKIES</h2>
          <p>
            Esta página web únicamente utiliza cookies que permiten el funcionamiento y la prestación de los servicios 
            ofrecidos en la misma y en su caso cookies propias con la única finalidad de medir las audiencias de esta y 
            por tanto consideradas exentas de consentimiento. Por ello, no se requiere, de acuerdo con el artículo 22 de la Ley.
          </p>
        </section>
        
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">5. DERECHOS EN RELACIÓN CON SUS DATOS PERSONALES</h2>
          <p className="mb-4">
            Cualquier persona puede retirar su consentimiento en cualquier momento, cuando el mismo se haya otorgado para 
            el tratamiento de sus datos. En ningún caso, la retirada de este consentimiento condiciona la ejecución del 
            contrato de suscripción o las relaciones generadas con anterioridad.
          </p>
          <p className="mb-3">Igualmente, puede ejercer los siguientes derechos:</p>
          
          <ul className="list-disc pl-8 space-y-2 mb-6">
            <li>Solicitar el acceso a sus datos personales o su rectificación cuando sean inexactos.</li>
            <li>Solicitar su supresión cuando, entre otros motivos, los datos ya no sean necesarios para los fines para los que fueron recogidos.</li>
            <li>Solicitar la limitación de su tratamiento en determinadas circunstancias.</li>
            <li>Solicitar la oposición al tratamiento de sus datos por motivos relacionados con su situación particular.</li>
            <li>Solicitar la portabilidad de los datos en los casos previstos en la normativa.</li>
            <li>Otros derechos reconocidos en las normativas aplicables.</li>
          </ul>
          
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Dónde y cómo solicitar sus Derechos</h3>
            <p>
              Mediante un escrito dirigido al responsable a su dirección postal o electrónica (indicadas en el apartado A), 
              indicando la referencia "Datos Personales", especificando el derecho que se quiere ejercer y respecto a qué 
              datos personales.
            </p>
            <p>
              En caso de divergencias con la empresa en relación con el tratamiento de sus datos, puede presentar una 
              reclamación ante la Agencia de Protección de Datos (www.agpd.es).
            </p>
          </div>
        </section>
        
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">6. SEGURIDAD DE SUS DATOS PERSONALES</h2>
          <p>
            Con el objetivo de salvaguardar la seguridad de sus datos personales, le informamos que hemos adoptado todas 
            las medidas de índole técnica y organizativa necesarias para garantizar la seguridad de los datos personales 
            suministrados de su alteración, pérdida y tratamientos o accesos no autorizados.
          </p>
        </section>
        
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">7. ACTUALIZACIÓN DE SUS DATOS</h2>
          <div className="space-y-3">
            <p>
              Es importante que para que podamos mantener sus datos personales actualizados, nos informe siempre que haya 
              habido alguna modificación en ellos, en caso contrario, no respondemos de la veracidad de estos.
            </p>
            <p>
              No nos hacemos responsables de la política de privacidad respecto a los datos personales que pueda facilitar 
              a terceros por medio de los enlaces disponibles en nuestra página web.
            </p>
            <p>
              La presente Política de Privacidad ha sido actualizada en fecha 07/05/2025 y puede ser modificada para adaptarla 
              a los cambios que se produzcan en nuestra web, así como modificaciones legislativas o jurisprudenciales sobre 
              datos personales que vayan apareciendo, por lo que exige su lectura, cada vez que nos facilite sus datos a través 
              de esta Web.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

