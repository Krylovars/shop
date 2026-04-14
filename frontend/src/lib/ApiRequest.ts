const rawBase = process.env.NEXT_PUBLIC_API_URL;

function buildUrl(url: string): URL {
    if (!rawBase) {
        throw new Error("NEXT_PUBLIC_API_URL is not set");
    }
    return new URL(`${rawBase}${url}`);
}

export async function ApiRequest<T>(
    url: string,
    method: string,
    options: RequestInit = {}
): Promise<{ msg: string; data: T }> {
    const urlBase = buildUrl(url);

    let response: Response;
    try {
        response = await fetch(urlBase, { method, ...options });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Network error";
        throw new Error(message);
    }

    if (!response.ok) {
        const text = response.statusText;
        throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const data = (await response.json()) as T;
    return { msg: "", data };
}