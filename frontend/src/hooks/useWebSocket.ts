import { useEffect, useRef, useState, useCallback } from 'react'
import { ELAWWebSocketClient, type ELAWWebSocketClientCallbacks } from '@/services/websocket'

export interface UseWebSocketResult {
  sendMessage: (message: unknown) => boolean
  connected: boolean
  reconnect: () => void
}

export function useWebSocket(url: string, callbacks?: ELAWWebSocketClientCallbacks): UseWebSocketResult {
  const clientRef = useRef<ELAWWebSocketClient | null>(null)
  const callbacksRef = useRef(callbacks)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    callbacksRef.current = callbacks
  }, [callbacks])

  useEffect(() => {
    const client = new ELAWWebSocketClient(url, {
      onOpen: (event) => {
        setConnected(true)
        callbacksRef.current?.onOpen?.(event)
      },
      onClose: (event) => {
        setConnected(false)
        callbacksRef.current?.onClose?.(event)
      },
      onError: (event) => {
        setConnected(false)
        callbacksRef.current?.onError?.(event)
      },
      onMessage: (data) => {
        callbacksRef.current?.onMessage?.(data)
      },
    })
    clientRef.current = client
    client.connect()

    return () => {
      client.disconnect()
      clientRef.current = null
    }
  }, [url])

  const sendMessage = useCallback((message: unknown): boolean => {
    return clientRef.current?.send(message) ?? false
  }, [])

  const reconnect = useCallback(() => {
    clientRef.current?.disconnect()
    clientRef.current?.connect()
  }, [])

  return { sendMessage, connected, reconnect }
}
