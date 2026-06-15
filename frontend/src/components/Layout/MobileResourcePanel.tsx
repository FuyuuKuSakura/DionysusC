import { useLayoutStore } from '@/stores/layoutStore'
import SettingsPanel from './SettingsPanel'

interface MobileResourcePanelProps {
  sendMessage: (message: unknown) => boolean
}

export default function MobileResourcePanel({ sendMessage }: MobileResourcePanelProps) {
  const { isResourcePanelOpen, setResourcePanelOpen } = useLayoutStore()

  return (
    <div className="md:hidden">
      <SettingsPanel
        isOpen={isResourcePanelOpen}
        onClose={() => setResourcePanelOpen(false)}
        initialTab="agent"
        sendMessage={sendMessage}
      />
    </div>
  )
}
