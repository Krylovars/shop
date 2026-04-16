
import { useEffect, useState } from 'react';

type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

export function useApiRequest<T>(requestFn: () => Promise<T>) {
    const [data, setData] = useState<T | null>(null);
    const [status, setStatus] = useState<ApiStatus>('idle');
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setStatus('loading');
            setError(null);

            try {
                const result = await requestFn();
                if (cancelled) return;
                setData(result);
                setStatus('success');
            } catch (e) {
                if (cancelled) return;
                setError(e as Error);
                setStatus('error');
            }
        }

        run();

        return () => {
            cancelled = true;
        };
    }, []);

    return { data, error, loading: status === 'loading' };
}