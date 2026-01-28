export default function Tarea({ tarea, borrarTarea }) {
  return (
    <div>
      <li>
        {tarea.texto}
        <button onClick={() => borrarTarea(tarea.id)}>X</button>
      </li>
    </div>
  );
}
