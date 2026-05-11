type ApiRequestInit = RequestInit & {
  params?: Record<string, string | number>;
};

export async function apiFetch<T>(
  endpoint: string,
  options: ApiRequestInit = {}
): Promise<T> {
  const { params, ...init } = options;
  
  let url = endpoint.startsWith("http") 
    ? endpoint 
    : `${process.env.NEXT_PUBLIC_API_URL || ""}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || "Failed to fetch");
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(endpoint: string, options?: ApiRequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, body: any, options?: ApiRequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: any, options?: ApiRequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: ApiRequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
};
