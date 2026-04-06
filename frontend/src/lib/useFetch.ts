import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch } from "@lib/api";

export type UseFetchResult<T> = {
    data: T | undefined;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
};

export function useFetch<T>(
    url: string | null,
    requestInit?: RequestInit
): UseFetchResult<T> {
    const [data, setData] = useState<T | undefined>(undefined);
    const [loading, setLoading] = useState(() => Boolean(url));
    const [error, setError] = useState<Error | null>(null);
    const [version, setVersion] = useState(0);
    const initRef = useRef(requestInit);
    initRef.current = requestInit;

    const refetch = useCallback(() => {
        setVersion((v) => v + 1);
    }, []);

    useEffect(() => {
        if (!url) {
            setLoading(false);
            setData(undefined);
            setError(null);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);

        apiFetch<T>(url, initRef.current ?? {})
            .then((res) => {
                if (!cancelled) setData(res);
            })
            .catch((e) => {
                if (!cancelled) {
                    setError(e instanceof Error ? e : new Error(String(e)));
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [url, version]);

    return { data, loading, error, refetch };
}
