/**
 * Isomorphic fetch wrapper around the NestJS backend.
 *
 * - Base URL from `NEXT_PUBLIC_API_URL`.
 * - Always sends credentials (`access_token` cookie). In the browser that means
 *   `credentials: "include"`; on the server we forward the incoming request's
 *   cookies via `next/headers`.
 * - Throws a typed {@link ApiError} on any non-2xx response, carrying the
 *   backend's error message.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

interface BackendErrorShape {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

function messageFromBody(body: unknown, fallback: string): string {
  if (body && typeof body === "object") {
    const shape = body as BackendErrorShape;
    if (Array.isArray(shape.message)) {
      return shape.message.join(", ");
    }
    if (typeof shape.message === "string") {
      return shape.message;
    }
    if (typeof shape.error === "string") {
      return shape.error;
    }
  }
  return fallback;
}

export type QueryParams = Record<string, unknown>;

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  /** Plain object — JSON-encoded automatically. */
  json?: unknown;
  /** Query params appended to the path (values are stringified; empty skipped). */
  query?: QueryParams;
}

async function serverCookieHeader(): Promise<string> {
  // Dynamically imported so this module stays usable in client components.
  const { cookies } = await import("next/headers");
  const store = await cookies();
  return store.toString();
}

function buildUrl(path: string, query?: QueryParams): string {
  const url = new URL(path.startsWith("/") ? path : `/${path}`, BASE_URL);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

export async function apiFetch<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { json, query, headers, ...rest } = options;
  const isServer = typeof window === "undefined";

  const finalHeaders = new Headers(headers);
  if (json !== undefined) {
    finalHeaders.set("Content-Type", "application/json");
  }
  if (isServer) {
    const cookie = await serverCookieHeader();
    if (cookie) {
      finalHeaders.set("cookie", cookie);
    }
  }

  const response = await fetch(buildUrl(path, query), {
    credentials: "include",
    cache: "no-store",
    ...rest,
    headers: finalHeaders,
    body: json !== undefined ? JSON.stringify(json) : undefined,
  });

  const text = await response.text();
  const parsed: unknown = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    throw new ApiError(
      response.status,
      messageFromBody(parsed, `Request failed (${response.status})`),
      parsed,
    );
  }

  return parsed as T;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
