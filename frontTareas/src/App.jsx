import { useEffect, useState } from "react";
import "./App.css";
import FormularioTarea from "./components/FormularioTarea";
import { ListaTareas } from "./components/ListaTareas";
import "./components/Tarea";
import { fetchTareas} from "./api/tareasApi";
import { crearTarea } from "./api/tareasApi";

export default function App() {
  //Crea los estados
  const [tareas, setTareas] = useState([
    { id: 1, texto: "Estudiar react" },
    { id: 2, texto: "Hacer ejercicios" },
    { id: 3, texto: "Descansar" },
    { id: 4, texto: "Algo" },
  ]);

  const [texto, setTexto] = useState("");

  useEffect(() => {
    const cargarTareas = async () => {
      const tareas = await fetchTareas();
      setTareas(tareas);
    };
    cargarTareas();
  }, []);

  function borrarTarea(id) {
    setTareas(tareas.filter((tarea) => tarea.id !== id));
  }
  async function agregarTarea(event) {
    event.preventDefault(); 

    if (!texto.trim()) return; // Evitar enviar tareas vacías

    // Creamos el objeto a enviar. Normalmente no enviamos ID, la BD lo crea.
    const nuevaTarea = { texto: texto };

    // 3. LLAMADA A LA API
    const tareaGuardada = await crearTarea(nuevaTarea);

    if (tareaGuardada) {
      // 4. Si se guardó bien, actualizamos la lista con lo que devolvió el servidor
      setTareas([...tareas, tareaGuardada]);
      setTexto("");
    } else {
      alert("Error al guardar la tarea");
    }
  }
  return (
    <div>
      <ListaTareas tareas={tareas} borrarTarea={borrarTarea} />

      <FormularioTarea
        onEnvioFormulario={agregarTarea}
        texto={texto}
        setTexto={setTexto}
      />

      <p>Texto del input: {texto}</p>
    </div>
  );
}
