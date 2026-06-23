import { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

interface StoryVoiceReadyPayload {
  adventureId: string;
  title: string;
  message: string;
}

interface StoryVoiceFailedPayload {
  adventureId: string;
  message: string;
}

interface UseStorySignalRProps {
  onStoryReady?: (data: StoryVoiceReadyPayload) => void;
  onStoryFailed?: (data: StoryVoiceFailedPayload) => void;
}

let globalConnection: signalR.HubConnection | null = null;
let hasConnectingRef = false;

export const useStorySignalR = ({
  onStoryReady,
  onStoryFailed,
}: UseStorySignalRProps): (() => Promise<void>) => {
  const handlersRef = useRef({ onStoryReady, onStoryFailed });

  useEffect(() => {
    handlersRef.current = { onStoryReady, onStoryFailed };
  }, [onStoryReady, onStoryFailed]);

  return async () => {
    try {
      // If already connected, just update handlers
      if (globalConnection?.state === signalR.HubConnectionState.Connected) {
        if (handlersRef.current.onStoryReady) {
          globalConnection.off('StoryVoiceReady');
          globalConnection.on('StoryVoiceReady', handlersRef.current.onStoryReady);
        }
        if (handlersRef.current.onStoryFailed) {
          globalConnection.off('StoryVoiceFailed');
          globalConnection.on('StoryVoiceFailed', handlersRef.current.onStoryFailed);
        }
        return;
      }

      // Prevent multiple simultaneous connection attempts
      if (hasConnectingRef) {
        return;
      }

      hasConnectingRef = true;

      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const connection = new signalR.HubConnectionBuilder()
        .withUrl(`${backendUrl}/storyhub`)
        .withAutomaticReconnect([2000, 5000, 10000])
        .build();

      if (handlersRef.current.onStoryReady) {
        connection.on('StoryVoiceReady', handlersRef.current.onStoryReady);
      }
      if (handlersRef.current.onStoryFailed) {
        connection.on('StoryVoiceFailed', handlersRef.current.onStoryFailed);
      }

      await connection.start();
      console.log('✓ SignalR connected successfully');
      globalConnection = connection;
      hasConnectingRef = false;
    } catch (error) {
      hasConnectingRef = false;
      console.log('Note: SignalR hub not available. Story regeneration notifications may not work.');
    }
  };
};
