import { useState, useEffect } from 'react';

export function useSSE(url: string) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    console.log('Connecting to SSE endpoint:', url);
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      console.log('SSE connection opened');
    };

    eventSource.onmessage = (event) => {
      console.log('Received SSE event:', event.data);
      setData(JSON.parse(event.data));
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    return () => {
      console.log('Closing SSE connection');
      eventSource.close();
    };
  }, [url]);

  return data;
}