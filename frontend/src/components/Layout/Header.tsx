import { useEffect, useState } from 'react'
import { Menu, Settings, Download, PanelLeft, PanelLeftClose, Check, Sparkles, Bot } from 'lucide-react'
import { useChatStore } from '@/stores/chatStore'
import { useAdapterStore } from '@/stores/adapterStore'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<{ outcome: 'accepted' | 'dismissed' }>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface HeaderProps {
  onMenuClick: () => void
  onToggleSidebar: () => void
  onSettingsClick: () => void
  onCompanionClick?: () => void
  sidebarCollapsed?: boolean
  connected?: boolean
}

export default function Header({
  onMenuClick,
  onToggleSidebar,
  onSettingsClick,
  onCompanionClick,
  sidebarCollapsed = false,
  connected = false,
}: HeaderProps) {
  const currentSession = useChatStore((state) =>
    state.sessions.find((s) => s.id === state.currentSessionId),
  )
  const { currentAdapter, availableAdapters, fetchAdapters } = useAdapterStore()

  useEffect(() => {
    fetchAdapters()
  }, [fetchAdapters])

  const currentAdapterLabel =
    availableAdapters.find((a) => a.adapter_id === currentAdapter)?.adapter_id ?? currentAdapter

  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }
    const handleAppInstalled = () => {
      setInstalled(true)
      setInstallPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallPWA = async () => {
    if (!installPrompt) {
      alert('当前浏览器不支持 PWA 安装，或已安装。')
      return
    }
    const result = await installPrompt.prompt()
    if (result.outcome === 'accepted') {
      setInstalled(true)
    }
    setInstallPrompt(null)
  }

  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-elaw-glass-border bg-elaw-glass-bg px-4 dark:backdrop-blur-xl">
      <div className="flex items-center gap-1 lg:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="cel-button p-2 text-elaw-text-secondary lg:hidden"
          aria-label="打开侧边栏"
        >
          <Menu className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onToggleSidebar}
          className="cel-button hidden p-2 text-elaw-text-secondary lg:flex"
          aria-label={sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
          title={sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          {sidebarCollapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </div>

      <h1 className="truncate px-2 text-base font-semibold text-elaw-text-primary sm:text-lg">
        {currentSession?.title ?? 'ELAW'}
      </h1>

      <div className="flex items-center gap-1 sm:gap-2">
        {currentAdapter && (
          <div
            className="cel-button flex items-center gap-1.5 rounded-full border border-elaw-subtle-border bg-elaw-glass-highlight px-2.5 py-1 text-xs text-elaw-text-secondary"
            title="当前 Agent"
          >
            <Bot className="h-3 w-3" />
            <span className="hidden sm:inline">{currentAdapterLabel}</span>
          </div>
        )}
        <div
          className="cel-button flex items-center gap-1.5 rounded-full border border-elaw-subtle-border bg-elaw-glass-highlight px-2.5 py-1 text-xs text-elaw-text-secondary"
          title={connected ? '已连接' : '未连接'}
        >
          <span
            className={`h-2 w-2 rounded-full ${connected ? 'bg-elaw-status-online' : 'bg-elaw-system'}`}
          />
          <span className="hidden sm:inline">{connected ? '已连接' : '未连接'}</span>
        </div>
        <button
          type="button"
          onClick={handleInstallPWA}
          className="cel-button p-2 text-elaw-text-secondary"
          aria-label="安装 PWA"
          title={installed ? '已安装' : '安装 PWA'}
        >
          {installed ? <Check className="h-5 w-5 text-elaw-success" /> : <Download className="h-5 w-5" />}
        </button>
        <button
          type="button"
          onClick={onCompanionClick}
          className="cel-button p-2 text-elaw-text-secondary lg:hidden"
          aria-label="角色陪伴"
          title="角色陪伴"
        >
          <Sparkles className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onSettingsClick}
          className="cel-button p-2 text-elaw-text-secondary"
          aria-label="设置"
          title="设置"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
