const API_URL = "http://localhost:8080/api/tareas";

export async function fetchTareas() {
    try {
        const response = await fetch(API_URL);
        if(!response.ok){
            throw new Error("Error al obtener las tareas");
        }

        const data = await response.json();
        return data;
    }catch (error) {
        console.error("Error fetching tareas:", error);
        return [];
    }

    
}
export async function crearTarea(tarea) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tarea),
        });

        if (!response.ok) {
            throw new Error("Error al crear la tarea");
        }

        return await response.json(); // Devuelve la tarea creada (con su ID real de la BD)
    } catch (error) {
        console.error("Error creating tarea:", error);
        return null;
    }
}
