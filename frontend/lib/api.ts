const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const json = await response.json();
  return json.data;
}

export async function apiJson<T = unknown>(
  path: string,
  method: string,
  body?: unknown
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      data?.message || `Request failed with status ${response.status}`
    ) as Error & {
      status?: number;
      code?: string;
      duplicateFields?: string[];
    };

    error.status = response.status;
    error.code = data?.code;
    error.duplicateFields = data?.duplicateFields;

    throw error;
  }

  return data;
}

export function buildQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  return query.toString();
}

export const apiBaseUrl = API_BASE_URL;
