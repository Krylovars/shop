const rawBase = process.env.NEXT_PUBLIC_API_URL;

function buildUrl(url: string): URL {
    if (!rawBase) {
        throw new Error("NEXT_PUBLIC_API_URL is not set");
    }
    return new URL(`${rawBase}${url}`);
}
export async function fetchApi<T = unknown>(
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

            }
            throw new Error("Invalid JSON response");
        }
    }

    if (!res.ok) {
        console.error(data);
    }

    return data as T;
}
