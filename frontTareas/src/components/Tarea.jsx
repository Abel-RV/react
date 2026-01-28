export default function Tarea({ tarea, borrarTarea }) {
  return (
    <li> 
        {tarea.texto+" "}
        <input type="checkbox" name="che" id="che" checked="false" />
        <button onClick={() => borrarTarea(tarea.id)}>X</button>
    </li>
  );
}
