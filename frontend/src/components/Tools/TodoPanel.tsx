import { CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useChatStore } from '@/stores/chatStore'

export default function TodoPanel() {
  const todos = useChatStore((state) => state.todos)
  const isStreaming = useChatStore((state) => state.isStreaming)

  if (todos.length === 0 && !isStreaming) {
    return null
  }

  const doneCount = todos.filter((t) => t.done).length
  const progress = todos.length === 0 ? 0 : Math.round((doneCount / todos.length) * 100)

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-b-2 border-elaw-glass-border bg-elaw-glass-bg/60 p-3 dark:backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-elaw-text-primary">
          <span className="rounded-md bg-elaw-primary/15 px-1.5 py-0.5 text-elaw-primary">
            TODO
          </span>
          <span>流程进度</span>
        </div>
        <div className="text-xs text-elaw-text-secondary">
          {doneCount}/{todos.length}
        </div>
      </div>

      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-elaw-glass-border">
        <motion.div
          className="h-full rounded-full bg-elaw-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {todos.length === 0 ? (
        <div className="flex items-center gap-2 text-xs text-elaw-text-secondary">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-elaw-primary" />
          等待任务开始…
        </div>
      ) : (
        <ul className="flex-1 min-h-0 space-y-1.5 overflow-y-auto touch-pan-y scrollbar-thin">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`flex items-center gap-2 text-xs ${
                todo.done
                  ? 'text-elaw-text-secondary line-through'
                  : 'text-elaw-text-primary'
              }`}
            >
              {todo.done ? (
                <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-elaw-success" />
              ) : (
                <Circle className="h-3.5 w-3.5 flex-shrink-0 text-elaw-primary" />
              )}
              <span className="truncate">{todo.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
