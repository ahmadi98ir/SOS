import { useEffect, useRef, useState } from "react";

// هوک اتصال به WebSocket (ws://localhost:3001)
export function useSocket(url: string) {
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);
    ws.onmessage = (event) => {
      try {
        setMessage(JSON.parse(event.data));
      } catch {
        setMessage(event.data);
      }
    };
    return () => {
      ws.close();
    };
  }, [url]);

  return { ws: wsRef.current, connected, message };
}
