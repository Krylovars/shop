import { useEffect, useRef, useState } from "react";
import {fetchApi} from "@lib/del/fetchApi";

export type UseFetchResult<T> = {
    data: T | undefined;
    loading: boolean;
    error: Error | null;
};
export function useFetch<T>(
    url: string | null,
    requestInit?: RequestInit
): UseFetchResult<T> {
    const [data, setData] = useState<T | undefined>(undefined);
    const [loading, setLoading] = useState(() => Boolean(url));
    const [error, setError] = useState<Error | null>(null);
    const initRef = useRef(requestInit);
    initRef.current = requestInit;

    useEffect(() => {
        console.log('useEffect вызван с url:', url);

        if (!url) {
            setLoading(false);
            setData(undefined);
            setError(null);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);

        fetchApi<T>(url, initRef.current ?? {})
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
            console.log('Cleanup для url:', url);
        };
    }, [url]);
    return { data, loading, error };
}
