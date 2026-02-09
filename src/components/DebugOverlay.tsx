// src/components/DebugOverlay.tsx
import React, { useEffect, useState } from 'react'

const shouldShow = () => {
  if (typeof window === 'undefined') return false
  const url = new URL(window.location.href)
  return url.searchParams.get('debug') === '1'
}

export default function DebugOverlay() {
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    if (!shouldShow()) return
    const push = (type: string, args: any[]) => {
      const msg = `[${type}] ${args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ')}`
      setLogs((prev) => [...prev, msg].slice(-200))
    }

    const origLog = console.log
    const origErr = console.error
    const origWarn = console.warn

    console.log = (...a) => {
      push('log', a)
      origLog(...a)
    }
    console.error = (...a) => {
      push('error', a)
      origErr(...a)
    }
    console.warn = (...a) => {
      push('warn', a)
      origWarn(...a)
    }

    const onUnhandled = (e: any) => push('unhandled', [e?.message || e])
    window.addEventListener('error', onUnhandled)
    window.addEventListener('unhandledrejection', onUnhandled as any)

    return () => {
      console.log = origLog
      console.error = origErr
      console.warn = origWarn
      window.removeEventListener('error', onUnhandled)
      window.removeEventListener('unhandledrejection', onUnhandled as any)
    }
  }, [])

  if (!shouldShow()) return null
  return (
    <div
      style={{
        position: 'fixed',
        left: 8,
        right: 8,
        bottom: 8,
        maxHeight: '40vh',
        overflow: 'auto',
        padding: 8,
        fontFamily: 'monospace',
        fontSize: 12,
        color: '#fff',
        background: 'rgba(0,0,0,0.75)',
        borderRadius: 8,
        zIndex: 99999,
      }}
    >
      {logs.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  )
}
