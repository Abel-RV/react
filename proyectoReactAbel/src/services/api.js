const API_URL = 'http://localhost:8080';

const getHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Login específico (es público, no lleva token)
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!res.ok) throw new Error('Credenciales inválidas');
      
      // Asumimos que el backend devuelve { "token": "..." } o el string directo
      const data = await res.json();
      const token = data.token || data; // Ajuste según tu DTO de respuesta
      
      localStorage.setItem('jwt_token', token);
      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  get: async (endpoint) => {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, { headers: getHeaders() });
      if (res.status === 403 || res.status === 401) {
        localStorage.removeItem('jwt_token');
        window.location.reload(); // Forzar logout si el token caduca
        return null;
      }
      if (!res.ok) throw new Error(`Error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  save: async (endpoint, body, id = null) => {
    const url = id ? `${API_URL}${endpoint}/${id}` : `${API_URL}${endpoint}`;
    const method = id ? 'PUT' : 'POST';
    
    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(body)
      });
      
      if (res.status === 403 || res.status === 401) {
        localStorage.removeItem('jwt_token');
        window.location.reload();
        return false;
      }
      
      if (!res.ok) {
        const errorText = await res.text();
        try {
            const jsonErr = JSON.parse(errorText);
            throw new Error(jsonErr.message || jsonErr.error || 'Error en la petición');
        } catch (e) {
            throw new Error(errorText || 'Error desconocido');
        }
      }
      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  delete: async (endpoint) => {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, { 
        method: 'DELETE',
        headers: getHeaders()
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  }
};