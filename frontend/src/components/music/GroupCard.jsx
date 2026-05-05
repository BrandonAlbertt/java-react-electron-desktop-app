/*
  GroupCard.jsx

  Este componente representa una tarjeta individual de un grupo musical
  dentro del panel de exploración.

  Funcionalidades principales:
  - Mostrar la portada del grupo en forma circular
  - Mostrar el nombre del grupo debajo de la imagen
  - Aplicar efecto visual al pasar el mouse (zoom y cambio de color)
  - Permitir seleccionar un grupo mediante clic

  Comportamiento:
  - Al hacer clic, notifica al componente padre (ExplorePanel)
    para cambiar a la pestaña de canciones y filtrar por ese grupo

  Props que recibe:
  - group → objeto con información del grupo (nombre, imagen, canciones)
  - onClick → función para manejar la selección del grupo

  Componentes que necesita:
  - Este componente no depende de otros componentes, es reutilizable y autónomo

  Notas:
  - Diseñado para usarse dentro de un grid
  - Mantiene proporciones fijas para evitar deformaciones
*/

export default function GroupCard({ group, onClick }) {
  return (
    <button
      onClick={() => onClick?.(group)}
      className="group relative h-36 w-full overflow-hidden rounded-3xl border border-white/10 bg-[#111118] text-left transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-500/40 hover:shadow-[0_0_25px_rgba(217,70,239,0.25)]"
    >
      {/* Imagen del grupo */}
      <img
        src={group.image}
        alt={group.name}
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
      />

      {/* Oscurecido elegante */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

      {/* Brillo suave */}
      <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-violet-500/10" />

      {/* Nombre */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="line-clamp-2 text-base font-semibold leading-tight text-white drop-shadow">
          {group.name}
        </p>
      </div>
    </button>
  );
}




/*
  Uso rapido en un componente padre:

  import GroupCard from "./GroupCard";

  <GroupCard
    group={grupo}
    onClick={handleGroupClick}
  />

  Condiciones minimas:
  - group debe incluir al menos: name e image
  - onClick debe ser una funcion para recibir el grupo seleccionado
*/