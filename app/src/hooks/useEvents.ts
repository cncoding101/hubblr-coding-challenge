import { useEffect, useRef, useState } from 'react';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface PollEventsCallbacks {
	onVote: () => void;
	onError?: (error: string) => void;
}

export const usePollEvents = (pollId: string, callbacks: PollEventsCallbacks) => {
	const [status, setStatus] = useState<ConnectionStatus>('connecting');
	const [error, setError] = useState<string | null>(null);
	const callbacksRef = useRef(callbacks);

	useEffect(() => {
		callbacksRef.current = callbacks;
	});

	useEffect(() => {
		const es = new EventSource(`/api/polls/${pollId}/stream`);

		es.onopen = () => {
			setStatus('connected');
			setError(null);
		};

		es.onmessage = (event) => {
			try {
				JSON.parse(event.data);
				callbacksRef.current.onVote();
			} catch (err) {
				console.error('Failed to parse SSE message:', err);
			}
		};

		es.onerror = () => {
			setStatus('error');
			setError('Connection lost. Reconnecting...');
		};

		return () => {
			es.close();
			setStatus('disconnected');
		};
	}, [pollId]);

	return { status, error };
};
