import { registrarVisita } from "@/lib/visitas";

const PILARES = [
  {
    titulo: "Calidad",
    texto:
      "Elegimos calidad para acompañar por más tiempo. Buscamos buenos materiales, terminaciones cuidadas y productos pensados para durar.",
  },
  {
    titulo: "Funcionalidad",
    texto:
      "Cada producto tiene un propósito: facilitar el día a día, entregar comodidad y aportar al crecimiento y desarrollo de los niños.",
  },
  {
    titulo: "Diseño atemporal",
    texto:
      "Una estética calma, simple y atemporal, capaz de acompañar distintas edades, espacios y momentos, más allá de las tendencias.",
  },
  {
    titulo: "Descubrimiento",
    texto:
      "Experiencias simples y significativas que invitan a tocar, explorar, jugar e imaginar en cada etapa del crecimiento.",
  },
];

export default async function NosotrasPage() {
  await registrarVisita("/nosotras");

  return (
    <section className="py-14">
      <div className="font-script text-2xl text-terracotta">nuestra historia</div>
      <h1 className="mt-2 max-w-[16ch] font-serif text-4xl leading-[1.1] text-olive-deep">
        Pequeños momentos, grandes descubrimientos
      </h1>

      <div className="mt-10 max-w-[62ch] space-y-5 text-[16px] leading-relaxed text-ink/85">
        <p>
          Mapii nace desde nuestra propia experiencia como mamás. Desde que
          nacieron nuestros hijos, comenzamos a mirar de otra manera los
          productos que elegíamos para ellos. Ya no bastaba con que algo
          fuera lindo — empezamos a preguntarnos si realmente era útil, si
          era cómodo, si tenía una buena calidad y si tenía sentido
          incorporarlo a nuestro día a día.
        </p>
        <p>
          Así nació Mapii: de las ganas de crear y seleccionar aquellos
          productos que nosotras mismas elegiríamos para nuestros hijos.
          Productos donde calidad, funcionalidad y diseño convivan, pensados
          para durar, acompañar distintas etapas y aportar a esos pequeños
          momentos que forman parte de la infancia.
        </p>
      </div>

      <div className="mt-16 grid gap-10 border-t border-line pt-12 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-xl text-olive-deep">Antonia Vial</h2>
          <p className="mt-1 text-sm text-olive">Mamá de dos niños y profesora</p>
          <p className="mt-3 max-w-[46ch] text-[15px] text-ink/80">
            Aporta a Mapii su conocimiento sobre infancia, aprendizaje y
            estimulación, con una mirada enfocada en el desarrollo de los
            niños y en cómo transformar situaciones cotidianas en
            oportunidades para explorar y aprender.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-xl text-olive-deep">Antonia Garcés</h2>
          <p className="mt-1 text-sm text-olive">
            Mamá de un niño y administradora de servicios
          </p>
          <p className="mt-3 max-w-[46ch] text-[15px] text-ink/80">
            Aporta a Mapii una mirada estratégica, comercial y de gestión,
            conectada con las necesidades reales que aparecen en el día a
            día de las familias.
          </p>
        </div>
      </div>

      <div className="mt-16 border-t border-line pt-12">
        <h2 className="font-serif text-2xl text-olive-deep">Nuestros pilares</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {PILARES.map((pilar) => (
            <div key={pilar.titulo}>
              <h3 className="text-[15px] font-medium text-terracotta-deep">
                {pilar.titulo}
              </h3>
              <p className="mt-2 max-w-[42ch] text-[15px] text-ink/80">
                {pilar.texto}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
