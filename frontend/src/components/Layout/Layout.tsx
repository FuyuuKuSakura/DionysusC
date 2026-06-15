import { useEffect, useState } from 'react'
import { useThemeStore } from '@/stores/themeStore'
import { useLayoutStore } from '@/stores/layoutStore'
import { loadAllThemes } from '@/lib/theme'
import NavSidebar from './NavSidebar'
import SessionList from './SessionList'
import RightPanel from './RightPanel'
import Header from './Header'
import MobileCompanionDrawer from './MobileCompanionDrawer'
import MobileCompanionBar from './MobileCompanionBar'
import MobileResourcePanel from './MobileResourcePanel'
import ChatContainer from '../Chat/ChatContainer'
import ChatInput from '../Input/ChatInput'
import ToolHUD from '../Tools/ToolHUD'
import SettingsPanel from './SettingsPanel'
import ThemeStudio from './ThemeStudio'

interface LayoutProps {
  sendMessage: (message: unknown) => boolean
  connected?: boolean
}

export default function Layout({ sendMessage, connected = false }: LayoutProps) {
  const { setAvailableThemes } = useThemeStore()
  const { mobileView } = useLayoutStore()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isThemeStudioOpen, setIsThemeStudioOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState<'appearance' | 'persona' | 'agent' | 'session'>('appearance')

  useEffect(() => {
    loadAllThemes().then(setAvailableThemes).catch(() => {
      // Fallback: keep default theme
    })
  }, [setAvailableThemes])

  return (
    <div className="flex h-full w-full overflow-hidden bg-dionysus-background">
      {/* Desktop / tablet: leftmost navigation */}
      <div className="hidden md:flex">
        <NavSidebar
          onOpenSettings={(tab) => {
            setSettingsTab(tab)
            setIsSettingsOpen(true)
          }}
          onOpenThemeStudio={() => setIsThemeStudioOpen(true)}
        />
      </div>

      {/* Desktop layout */}
      <div className="hidden flex-1 md:flex">
        <SessionList sendMessage={sendMessage} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header
            connected={connected}
            onSettingsClick={() => {
              setSettingsTab('appearance')
              setIsSettingsOpen(true)
            }}
          />
          <main className="relative flex flex-1 flex-col overflow-hidden">
            <ChatContainer sendMessage={sendMessage} />
            <ToolHUD />
            <ChatInput sendMessage={sendMessage} />
          </main>
        </div>
        <RightPanel />
      </div>

      {/* Mobile layout */}
      <div className="flex flex-1 md:hidden">
        {mobileView === 'session-list' ? (
          <SessionList sendMessage={sendMessage} />
        ) : (
          <div className="flex min-w-0 flex-1 flex-col">
            <Header
              connected={connected}
              showBack
              onSettingsClick={() => {
                setSettingsTab('appearance')
                setIsSettingsOpen(true)
              }}
            />
            <MobileCompanionBar />
            <main className="relative flex flex-1 flex-col overflow-hidden">
              <ChatContainer sendMessage={sendMessage} />
              <ToolHUD />
              <ChatInput sendMessage={sendMessage} />
            </main>
          </div>
        )}
      </div>

      {/* Mobile overlays */}
      <MobileCompanionDrawer />
      <MobileResourcePanel sendMessage={sendMessage} />

      {/* Global settings / theme studio modals */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialTab={settingsTab}
        onOpenThemeStudio={() => {
          setIsSettingsOpen(false)
          setIsThemeStudioOpen(true)
        }}
        sendMessage={sendMessage}
      />
      <ThemeStudio isOpen={isThemeStudioOpen} onClose={() => setIsThemeStudioOpen(false)} />
    </div>
  )
}
