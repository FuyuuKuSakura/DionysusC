import { Search, User } from 'lucide-react'

interface MobileSessionListHeaderProps {
  connected?: boolean
}

export default function MobileSessionListHeader({ connected = false }: MobileSessionListHeaderProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-elaw-subtle-border bg-elaw-panel-bg p-4 md:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-elaw-primary text-sm font-bold text-white">
            <User className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-elaw-text-primary">ELAW</div>
            <div className="flex items-center gap-1.5 text-xs text-elaw-text-secondary">
              <span
                className={`h-2 w-2 rounded-full ${connected ? 'bg-elaw-status-online' : 'bg-elaw-system'}`}
              />
              {connected ? '在线' : '未连接'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-elaw-subtle-border bg-elaw-glass-highlight px-3 py-2">
        <Search className="h-4 w-4 text-elaw-text-secondary" />
        <input
          type="text"
          placeholder="搜索会话..."
          className="flex-1 bg-transparent text-sm text-elaw-text-primary placeholder:text-elaw-text-secondary/60 outline-none"
        />
      </div>
    </div>
  )
}
