import { useEffect, useRef, useState } from "react";
import { ApiRequest } from "@lib/ApiRequest";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export function useApiRequest<T>(
    url: string,
    method: HttpMethod = "GET",
    options?: RequestInit
) {
    const [data, setData] = useState<T | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const optionsRef = useRef<RequestInit | undefined>(options);
    optionsRef.current = options;

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            setLoading(true);
            setError(null);

            try {
                const result = await ApiRequest<T>(url, method, optionsRef.current);
                if (!cancelled) setData(result.data);
            } catch (e) {
                if (!cancelled) {
                    setError(e as Error);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void run();

        return () => {
            cancelled = true;
        };
    }, [url, method]);

    return { data, loading, error };
}