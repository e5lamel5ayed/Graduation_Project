'use client';

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

const isDev = process.env.NODE_ENV !== 'production';
const devLog = (...args: unknown[]) => {
    if (isDev) console.log(...args);
};

export const useStorySignalR = ({
    onStoryReady,
    onStoryFailed,
}: UseStorySignalRProps) => {
    // عشان نحتفظ بآخر نسخة من الـ handlers من غير ما نعيد connect
    const handlersRef = useRef({ onStoryReady, onStoryFailed });

    useEffect(() => {
        handlersRef.current = { onStoryReady, onStoryFailed };
    }, [onStoryReady, onStoryFailed]);

    useEffect(() => {
        // لو في connection قايمة، سجل الـ handlers عليها بس
        if (globalConnection?.state === signalR.HubConnectionState.Connected) {
            globalConnection.off('StoryVoiceReady');
            globalConnection.off('StoryVoiceFailed');
            globalConnection.on('StoryVoiceReady', (data) => handlersRef.current.onStoryReady?.(data));
            globalConnection.on('StoryVoiceFailed', (data) => handlersRef.current.onStoryFailed?.(data));
            return;
        }

        // لو في connection بتتعمل، استنى
        if (globalConnection?.state === signalR.HubConnectionState.Connecting) return;

        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://go-kid.runasp.net/api';
        const hubUrl = apiBaseUrl.replace('/api', '') + '/hubs/notifications';

        devLog('SignalR connecting to:', hubUrl);

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl, {
                skipNegotiation: false,
                transport: signalR.HttpTransportType.WebSockets,
            })
            .withAutomaticReconnect([2000, 5000, 10000])
            .build();

        // سجل الـ handlers عن طريق الـ ref عشان دايماً آخر نسخة
        connection.on('StoryVoiceReady', (data) => {
            devLog('🔥 StoryVoiceReady:', data);
            handlersRef.current.onStoryReady?.(data);
        });

        connection.on('StoryVoiceFailed', (data) => {
            devLog('🔥 StoryVoiceFailed:', data);
            handlersRef.current.onStoryFailed?.(data);
        });

        connection.onclose((err) => devLog('SignalR closed', err));
        connection.onreconnecting((err) => devLog('SignalR reconnecting', err));
        connection.onreconnected((id) => devLog('SignalR reconnected', id));

        globalConnection = connection;
        connection.start()
            .then(async () => {
                devLog('✓ SignalR connected');

                // جيب الـ userId من localStorage
                const userStr = localStorage.getItem('user');
                const user = userStr ? JSON.parse(userStr) : null;
                const userId = user?.id;

                if (userId) {
                    await connection.invoke("JoinUserGroup", userId);
                    devLog('✓ Joined group:', userId);
                } else {
                    console.warn('No userId found!');
                }
            })
            .catch((err) => {
                console.error('SignalR error:', err);
                globalConnection = null;
            });
        // cleanup لما الـ component يتشال
        return () => {
            connection.off('StoryVoiceReady');
            connection.off('StoryVoiceFailed');
        };
    }, []); // بيتنادى مرة واحدة بس
};