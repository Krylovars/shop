const rawBase = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly body?: unknown
    ) {
        super(message);
        this.name = "ApiError";
    }
}

function buildUrl(url: string): URL {
    if (!rawBase) {
        throw new Error("NEXT_PUBLIC_API_URL is not set");
    }
    const base = rawBase.replace(/\/$/, "");
    const path = url.startsWith("/") ? url : `/${url}`;
    return new URL(`${base}${path}`);
}

function messageFromBody(data: unknown): string | null {
    if (!data || typeof data !== "object") return null;
    const o = data as Record<string, unknown>;
    if (typeof o.message === "string") return o.message;
    if (typeof o.error === "string") return o.error;
    return null;
}

export async function apiFetch<T = unknown>(
    url: string,
    options_all: RequestInit = {}
): Promise<T> {
    const urlBase = buildUrl(url);

    const { headers: initHeaders, body, ...options } = options_all;
    const headers = new Headers(initHeaders);

    if (!headers.has("Accept")) {
        headers.set("Accept", "application/json");
    }

    let res: Response;
    try {
        res = await fetch(urlBase, {
            headers,
            ...options,
            body,
        });
    } catch (e) {
        const message = e instanceof Error ? e.message : "Network error";
        throw new Error(message);
    }

    const text = await res.text();
    let data: unknown = null;
    if (text) {
        try {
            data = JSON.parse(text) as unknown;
        } catch {
            if (!res.ok) {
                throw new ApiError(text || res.statusText, res.status, text);
            }
            throw new Error("Invalid JSON response");
        }
    }

    if (!res.ok) {
        const msg =
            messageFromBody(data) ?? `HTTP ${res.status} ${res.statusText}`;
        throw new ApiError(msg, res.status, data);
    }

    return data as T;
}
