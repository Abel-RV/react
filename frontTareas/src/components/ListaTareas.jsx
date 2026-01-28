import Tarea from "./Tarea";
export function ListaTareas({ tareas=[], borrarTarea }) {
  return (
    <div>
      <ul>
        {tareas.map((tarea) => (
          <li key={tarea.id}>
            <Tarea tarea={tarea} borrarTarea={borrarTarea} />
          </li>
        ))}
      </ul>
    </div>
  );
}
