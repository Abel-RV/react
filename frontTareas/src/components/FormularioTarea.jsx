import { useState } from "react";

export default function FormularioTarea({
  onEnvioFormulario,
  texto,
  setTexto,
}) {
  const [visible, setVisible] = useState(false);

  function interruptorAyuda() {
    setVisible(!visible);
  }
  return (
    <div>
      <form onSubmit={onEnvioFormulario}>
        <label htmlFor="texto">Nueva tarea: </label>
        <input
          id="texto"
          type="text"
          placeholder="Introduce el nombre"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        </form>
        <button type="submit">Añadir</button>
        <button type="button" onClick={interruptorAyuda}>Ayuda</button>

          {visible&&(<p style={{color:"blue"}}>Debeis introducir el nombre de la tarea que quieras crear</p>)}
      
    </div>
  );
}
