import { useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

interface OverlayPageProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onBeforeClose?: () => boolean
}

export default function OverlayPage({
  isOpen,
  onClose,
  title,
  children,
  onBeforeClose,
}: OverlayPageProps) {
  const handleClose = useCallback(() => {
    if (onBeforeClose && !onBeforeClose()) return
    onClose()
  }, [onBeforeClose, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="absolute inset-0 z-40 flex flex-col overflow-hidden border-l border-dionysus-subtle-border bg-dionysus-glass-bg backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-dionysus-subtle-border px-4">
            <h2 className="text-base font-semibold text-dionysus-text-primary">{title}</h2>
            <button
              type="button"
              onClick={handleClose}
              className="cel-button p-2 text-dionysus-text-secondary"
              aria-label="关闭"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
