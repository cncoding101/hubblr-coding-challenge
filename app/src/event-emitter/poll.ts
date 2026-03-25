type Listener = (data: string) => void;

const listeners = new Map<string, Set<Listener>>();

export const subscribe = (pollId: string, listener: Listener) => {
	if (!listeners.has(pollId)) {
		listeners.set(pollId, new Set());
	}
	listeners.get(pollId)!.add(listener);

	return () => {
		const set = listeners.get(pollId);
		if (set) {
			set.delete(listener);
			if (set.size === 0) listeners.delete(pollId);
		}
	};
};

export const emit = (pollId: string) => {
	const set = listeners.get(pollId);
	if (!set) return;

	const data = JSON.stringify({ pollId, timestamp: Date.now() });
	for (const listener of set) {
		listener(data);
	}
};
