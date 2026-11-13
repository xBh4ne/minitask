const API_BASE = "http://localhost:8080/api/tasks";

export async function apiRequest(path = "", options = {}) {
  const method = options.method ?? "GET";
  const startedAt = performance.now();

  try {
    const headers = { ...(options.headers ?? {}) };

    if (options.body) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    const duration = Math.max(1, Math.round(performance.now() - startedAt));
    let data = null;

    if (response.status !== 204) {
      const text = await response.text();

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }
      }
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
      method,
      path: `/api/tasks${path}`,
      duration,
      error: response.ok
        ? null
        : data?.message ?? data?.error ?? `Request failed (HTTP ${response.status})`,
    };
  } catch {
    return {
      ok: false,
      status: 0,
      data: null,
      method,
      path: `/api/tasks${path}`,
      duration: Math.max(1, Math.round(performance.now() - startedAt)),
      error: "Backend unreachable. Start Spring Boot on port 8080.",
    };
  }
}
