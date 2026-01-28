import { useEffect, useState } from "react";
import "./App.css";
import FormularioTarea from "./components/FormularioTarea";
import { ListaTareas } from "./components/ListaTareas";
import "./components/Tarea";
import { fetchTareas} from "./api/tareasApi";

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
  function agregarTarea(event) {
    event.preventDefault(); //Evita que se envie el formulario y recargue la pagina
    setTareas([
      ...tareas,
      {
        id: crypto.randomUUID(), //Añade un identificador unico a cada elemento
        texto,
      },
    ]);
    setTexto("");
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
