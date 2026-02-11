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
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Credenciales inválidas');
      }
      
      const data = await res.json();
      const token = data.token || data; 
      
      localStorage.setItem('jwt_token', token);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  },

  register: async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        try {
          const jsonErr = JSON.parse(errorText);
          throw new Error(jsonErr.error || jsonErr.message || 'Error al registrarse');
        } catch (e) {
          throw new Error(errorText || 'Error al registrarse');
        }
      }
      return true;
    } catch (err) {
      console.error('Register error:', err);
      throw err;
    }
  },

  get: async (endpoint) => {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, { 
        headers: getHeaders() 
      });
      
      if (res.status === 403 || res.status === 401) {
        localStorage.removeItem('jwt_token');
        window.location.reload();
        return null;
      }
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      // Si la respuesta está vacía (204 No Content), devolver null
      const text = await res.text();
      return text ? JSON.parse(text) : null;
    } catch (err) {
      console.error('GET error:', err);
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
          throw new Error(jsonErr.message || jsonErr.error || `Error ${res.status}`);
        } catch (e) {
          throw new Error(errorText || `Error ${res.status}`);
        }
      }
      return true;
    } catch (err) {
      console.error('Save error:', err);
      throw err;
    }
  },

  delete: async (endpoint) => {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, { 
        method: 'DELETE',
        headers: getHeaders()
      });
      
      if (res.status === 403 || res.status === 401) {
        localStorage.removeItem('jwt_token');
        window.location.reload();
        return false;
      }
      
      return res.ok;
    } catch (err) {
      console.error('Delete error:', err);
      return false;
    }
  }
};