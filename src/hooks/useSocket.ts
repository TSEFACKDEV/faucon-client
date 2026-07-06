'use client';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useDeviceStore } from '@/store/device.store';
import { LivePosition, Alarm } from '@/types';

let socketInstance: Socket | null = null;

export const useSocket = (deviceIds: string[]) => {
  const { updateLivePosition, addAlarm } = useDeviceStore();
  const ref = useRef<Socket | null>(null);

  useEffect(() => {
    if (deviceIds.length === 0) return;

    const connect = () => {
      const token = Cookies.get('faucon_access_token');
      if (!token) return;

      if (socketInstance?.connected) {
        socketInstance.emit('subscribe', deviceIds);
        ref.current = socketInstance;
        return;
      }

      const socket = io(
        process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3000',
        {
          auth: { token },
          transports: ['websocket'],
          reconnection: true,
          reconnectionDelay: 2000,
          reconnectionAttempts: 10,
        }
      );

      socket.on('connect', () => {
        socket.emit('subscribe', deviceIds);
      });

      socket.on('position_update', (data: LivePosition) => {
        updateLivePosition(data);
      });

      socket.on('alarm', (data: Alarm) => {
        addAlarm(data);
      });

      socketInstance = socket;
      ref.current = socket;
    };

    connect();
  }, [deviceIds.join(',')]);

  const disconnect = () => {
    socketInstance?.disconnect();
    socketInstance = null;
  };

  return { disconnect };
};