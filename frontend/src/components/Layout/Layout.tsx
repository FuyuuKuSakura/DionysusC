import { useState, useEffect } from 'react'
import { useThemeStore } from '@/stores/themeStore'
import { loadAllThemes } from '@/lib/theme'
import Header from './Header'
import Sidebar from './Sidebar'
import SettingsPanel from './SettingsPanel'
import ThemeStudio from './ThemeStudio'
import RightPanel from './RightPanel'
import MobileCompanionDrawer from './MobileCompanionDrawer'
import ChatContainer from '../Chat/ChatContainer'
import ChatInput from '../Input/ChatInput'
import ToolHUD from '../Tools/ToolHUD'

interface LayoutProps {
  sendMessage: (message: unknown) => boolean
  connected?: boolean
}

const SIDEBAR_COLLAPSED_KEY = 'elaw-sidebar-collapsed'

export default function Layout({ sendMessage, connected = false }: LayoutProps) {
  const { setAvailableThemes } = useThemeStore()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isThemeStudioOpen, setIsThemeStudioOpen] = useState(false)
  const [isMobileCompanionOpen, setIsMobileCompanionOpen] = useState(false)

  useEffect(() => {
    loadAllThemes().then(setAvailableThemes).catch(() => {
      // Fallback: keep default theme
    })
  }, [setAvailableThemes])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
      if (saved) {
        setIsSidebarCollapsed(saved === 'true')
      }
    } catch {
      // ignore storage errors
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isSidebarCollapsed))
    } catch {
      // ignore storage errors
    }
  }, [isSidebarCollapsed])

  return (
    <div className="flex h-full w-full overflow-hidden bg-elaw-background">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        collapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((c) => !c)}
        sendMessage={sendMessage}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          onToggleSidebar={() => setIsSidebarCollapsed((c) => !c)}
          onSettingsClick={() => setIsSettingsOpen(true)}
          onCompanionClick={() => setIsMobileCompanionOpen(true)}
          sidebarCollapsed={isSidebarCollapsed}
          connected={connected}
        />
        <main className="relative flex flex-1 flex-col overflow-hidden rounded-tl-2xl bg-elaw-panel-bg backdrop-blur-xl md:m-2 md:rounded-2xl md:border md:border-elaw-subtle-border">
          <ChatContainer sendMessage={sendMessage} />
          <ToolHUD />
          <ChatInput sendMessage={sendMessage} />
        </main>
      </div>
      <RightPanel />
      <MobileCompanionDrawer
        isOpen={isMobileCompanionOpen}
        onClose={() => setIsMobileCompanionOpen(false)}
      />
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenThemeStudio={() => {
          setIsSettingsOpen(false)
          setIsThemeStudioOpen(true)
        }}
      />
      <ThemeStudio isOpen={isThemeStudioOpen} onClose={() => setIsThemeStudioOpen(false)} />
    </div>
  )
}
