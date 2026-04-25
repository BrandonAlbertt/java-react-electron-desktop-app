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
      className="group flex w-full flex-col items-center text-center"
    >
      {/* Contenedor visual que aplica el zoom al pasar el cursor */}
      <div className="w-full max-w-28 overflow-hidden rounded-full transition duration-300 group-hover:scale-110">
        {/* La imagen usa ancho fluido para adaptarse si aumentas columnas */}
        <img
          src={group.image}
          alt={group.name}
          className="aspect-square w-full rounded-full object-cover"
        />
      </div>

      {/* Nombre del grupo debajo de la portada */}
      <p className="mt-3 text-lg text-white transition group-hover:text-fuchsia-400">
        {group.name}
      </p>
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