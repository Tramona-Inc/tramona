import { useState, useEffect, useRef } from "react";

export function useInterval<T>(callback: () => T, delay: number | null) {
	const savedCallback = useRef<(() => T) | null>(null);
	const [isStopped, setIsStopped] = useState(false);

	// Remember the latest callback.
	useEffect(() => {
		savedCallback.current = callback;
	});

	// Set up the interval.
	useEffect(() => {
		if (isStopped || delay === null) return;

		function tick() {
			if (savedCallback.current !== null) {
				savedCallback.current();
			}
		}
		const id = setInterval(tick, delay);
		return () => clearInterval(id);
	}, [delay, isStopped]);

	return () => setIsStopped(true);
}
