import { useEffect, useRef, useState } from 'react'
import { QrCode, X } from 'lucide-react'

export default function QRCodeButton() {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!open) return
    fetch('/api/server/info')
      .then((r) => r.json())
      .then((data) => {
        const serverUrl = data.url || window.location.origin
        setUrl(serverUrl)
      })
      .catch(() => setError('无法获取服务地址'))
  }, [open])

  useEffect(() => {
    if (!open || !url || !canvasRef.current) return
    import('qrcode')
      .then((QRCode) => {
        QRCode.toCanvas(canvasRef.current, url, { width: 180, margin: 2 }, (err: Error | null | undefined) => {
          if (err) setError('二维码生成失败')
        })
      })
      .catch(() => setError('二维码模块加载失败'))
  }, [open, url])

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="连接二维码"
        className="flex h-11 w-11 items-center justify-center rounded-xl text-dionysus-text-secondary transition-colors hover:bg-dionysus-glass-highlight hover:text-dionysus-primary"
      >
        <QrCode className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-64 rounded-2xl border border-dionysus-glass-border bg-dionysus-glass-bg p-4 shadow-xl backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-dionysus-text-primary">扫码连接</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 text-dionysus-text-secondary hover:bg-dionysus-glass-highlight hover:text-dionysus-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {error ? (
            <div className="text-xs text-dionysus-danger">{error}</div>
          ) : url ? (
            <>
              <canvas ref={canvasRef} className="mx-auto rounded-lg" />
              <div className="mt-2 break-all text-center text-xs text-dionysus-text-secondary">
                {url}
              </div>
            </>
          ) : (
            <div className="py-4 text-center text-xs text-dionysus-text-secondary">加载中…</div>
          )}
        </div>
      )}
    </div>
  )
}
