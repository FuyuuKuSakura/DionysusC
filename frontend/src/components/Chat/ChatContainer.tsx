import { useEffect, useRef } from 'react'
import { useChatStore } from '@/stores/chatStore'
import MessageStream from './MessageStream'
import StreamingStatusBox from './StreamingStatusBox'
import OptionsRenderer from '../Options/OptionsRenderer'

interface ChatContainerProps {
  sendMessage?: (message: unknown) => boolean
}

export default function ChatContainer({ sendMessage }: ChatContainerProps) {
  const messages = useChatStore((state) => state.messages)
  const isStreaming = useChatStore((state) => state.isStreaming)
  const streamingStatus = useChatStore((state) => state.streamingStatus)
  const currentOptions = useChatStore((state) => state.currentOptions)
  const currentOptionsUiType = useChatStore((state) => state.currentOptionsUiType)
  const optionDisabled = useChatStore((state) => state.optionDisabled)
  const selectOption = useChatStore((state) => state.selectOption)
  const scrollRef = useRef<HTMLDivElement>(null)

  const lastIsStreaming =
    messages.length > 0 &&
    messages[messages.length - 1].role === 'agent' &&
    messages[messages.length - 1].status === 'streaming'

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, isStreaming, streamingStatus, currentOptions])

  const handleOptionSelect = (optionId: string) => {
    const option = currentOptions?.find((o) => o.id === optionId)
    if (!option) return
    selectOption(option)
    sendMessage?.({
      type: 'option_selected',
      payload: {
        selected_id: option.id,
        selected_label: option.label,
      },
    })
  }

  return (
    <div
      ref={scrollRef}
      className="flex flex-1 flex-col overflow-y-auto bg-dionysus-glass-bg scrollbar-thin dark:backdrop-blur-xl"
    >
      {messages.length === 0 && !isStreaming && (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center text-dionysus-text-secondary">
          <div className="mb-4 text-4xl">👋</div>
          <h2 className="mb-2 text-lg font-semibold text-dionysus-text-primary">欢迎来到 Dionysus</h2>
          <p className="max-w-md text-sm">
            我是能天使，你的本地 Coding Agent 助手。在下方输入框发送消息，我会通过 Kimi Code CLI 帮你解决问题。
          </p>
        </div>
      )}
      <MessageStream messages={messages} />

      {isStreaming && !lastIsStreaming && (
        <div className="px-4 pb-4">
          <StreamingStatusBox
            status={streamingStatus?.status}
            detail={streamingStatus?.detail}
          />
        </div>
      )}

      {currentOptions && currentOptions.length > 0 && !optionDisabled && (
        <div className="px-4 pb-4">
          <OptionsRenderer
            options={currentOptions}
            uiType={currentOptionsUiType ?? 'button_group'}
            disabled={optionDisabled}
            onSelect={handleOptionSelect}
          />
        </div>
      )}
    </div>
  )
}
