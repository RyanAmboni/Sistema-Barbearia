const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = Object.assign({}, options.headers || {});
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(API_BASE + path, Object.assign({}, options, { headers }));
  const text = await res.text();
  let data = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;
  if (!res.ok) {
    const err = (data && data.message) ? data : { message: res.statusText || 'Request failed' };
    throw err;
  }
  return data;
}

export const api = {
  get: (path, opts) => request(path, Object.assign({ method: 'GET' }, opts)),
  post: (path, body, opts) => request(path, Object.assign({ method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }, opts)),
  put: (path, body, opts) => request(path, Object.assign({ method: 'PUT', body: body instanceof FormData ? body : JSON.stringify(body) }, opts)),
  del: (path, opts) => request(path, Object.assign({ method: 'DELETE' }, opts)),
};

export default api;
