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
    }
}
