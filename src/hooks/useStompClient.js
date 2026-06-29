import { Client } from '@stomp/stompjs';
import { useCallback, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';

const WS_URL = import.meta.env.VITE_API_WS_URL;

/**
 * @param {object}   options
 * @param {string}   options.token    - JWT (without "Bearer " prefix)
 * @param {function} options.onUpdate - called with { ticketId, action, ticket }
 */
export function useTicketSocket({ token, onUpdate }) {
  const clientRef = useRef(null);
  const callbackRef = useRef(onUpdate);

  useEffect(() => {
    callbackRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    if (!token) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {        
        client.subscribe('/topic/inbox-updates', (frame) => {
          try {
            const payload = JSON.parse(frame.body);
            // payload example: { ticketId: 123, action: "ADD" } or { ticketId: 123, action: "REMOVE" }
            callbackRef.current?.(payload);
          } catch (e) {
            console.error('[WS] Failed to parse message', e);
          }
        });
      },

      onDisconnect: () => console.log('[WS] Disconnected'),
      onStompError: (frame) => console.error('[WS] STOMP error', frame.headers?.message, frame.body),
      onWebSocketError: (event) => console.error('[WS] WebSocket error', event)
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [token]);

  const claimTicket = useCallback((ticketId) => {
    if (!clientRef.current?.connected) return;
    clientRef.current.publish({
      destination: '/app/tickets/claim',
      body: JSON.stringify({ ticketId })
    });
  }, []);

  return { claimTicket };
}
