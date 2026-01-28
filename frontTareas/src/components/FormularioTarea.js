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
        <button>Añadir</button>
        <p style={{ color: "blue" }}>
          ç<button onClick={interruptorAyuda}>Ayuda</button>
          Debeis introducir el nombre de la tarea que quieras crear
        </p>
      </form>
    </div>
  );
}
