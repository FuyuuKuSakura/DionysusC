import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useSettingsStore } from '@/stores/settingsStore'
import Live2DViewer from '../Live2D/Live2DViewer'
import CharacterDialogBox from '../Character/CharacterDialogBox'
import ToolPanel from '../Tools/ToolPanel'

interface MobileCompanionDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileCompanionDrawer({
  isOpen,
  onClose,
}: MobileCompanionDrawerProps) {
  const { live2dEnabled } = useSettingsStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            aria-hidden="true"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-3xl border-t-2 border-elaw-subtle-border bg-elaw-panel-bg shadow-2xl lg:hidden"
            style={{ top: '10%' }}
            role="dialog"
            aria-modal="true"
            aria-label="角色陪伴"
          >
            <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-elaw-subtle-border px-4">
              <h2 className="text-base font-semibold text-elaw-text-primary">
                角色陪伴
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="cel-button p-2 text-elaw-text-secondary"
                aria-label="关闭角色陪伴"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative flex flex-1 flex-col overflow-hidden">
              <CharacterDialogBox />
              <div className="relative min-h-[40%] flex-1">
                <Live2DViewer enabled={live2dEnabled} />
              </div>
              <ToolPanel />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
