'use client';

import { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { toast } from 'sonner';

let globalConnection: signalR.HubConnection | null = null;

export default function SignalRProvider({ children }: { children: React.ReactNode }) {
  const connectionRef = useRef(false);

  useEffect(() => {
    if (connectionRef.current) return;
    connectionRef.current = true;

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://go-kid.runasp.net/api';
    const hubUrl = apiBaseUrl.replace('/api', '') + '/hubs/notifications';

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect([2000, 5000, 10000])
      .build();

    connection.on('StoryVoiceReady', (data) => {
      console.log('🔥 StoryVoiceReady:', data);
      toast.success(data.message, {
        description: data.title,
        duration: 8000,
        action: {
          label: 'View Story',
          onClick: () => window.location.href = `/adventures/${data.adventureId}/story`,
        },
      });
    });

    connection.on('StoryVoiceFailed', (data) => {
      console.log('🔥 StoryVoiceFailed:', data);
      toast.error(data.message);
    });

    connection.onreconnected(async () => {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      if (user?.id) await connection.invoke("JoinUserGroup", user.id);
    });

    connection.start()
      .then(async () => {
        console.log('✓ SignalR connected globally');
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        if (user?.id) {
          await connection.invoke("JoinUserGroup", user.id);
          console.log('✓ Joined group:', user.id);
        }
        globalConnection = connection;
      })
      .catch((err) => console.error('SignalR error:', err));

    return () => {
      connection.stop();
      globalConnection = null;
      connectionRef.current = false;
    };
  }, []);

  return <>{children}</>;
}