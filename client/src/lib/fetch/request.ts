export function request<TResponse>(url: string, config: RequestInit = {}) {
  return fetch(url, config)
    .then((response) => response.json())
    .then((data) => data as TResponse);
}
