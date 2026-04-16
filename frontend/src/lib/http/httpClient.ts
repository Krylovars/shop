const rawBase = process.env.NEXT_PUBLIC_API_URL;
export async function httpClient<T>(url: string, options?: RequestInit) {
    // const fullUrl = rawBase + url
    const fullUrl =  url

    const res = await fetch(fullUrl, {
        ...options,
        headers: {
            ...(options?.headers || {}),
        },
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        console.error('HTTP error', res.status, text);
        throw new Error(`Request failed with status ${res.status}`);
    }
    const data = await res.json();
    return data as T;
}