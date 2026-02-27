const API_BASE = import.meta.env.VITE_API_BASE;

export const request = async (method, path, body) => {
  const resp = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || `Request failed: ${resp.status}`);
  }

  if (resp.status === 204) return null;

  const text = await resp.text();
  return text ? JSON.parse(text) : null;
};

export const service = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
};
