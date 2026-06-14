import type { OptionItem } from '@/types/protocol'

interface CardListProps {
  options: OptionItem[]
  disabled: boolean
  onSelect: (optionId: string) => void
}

export default function CardList({ options, disabled, onSelect }: CardListProps) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(option.id)}
          className={`
            flex w-full flex-col items-start rounded-xl border px-4 py-3 text-left transition-colors
            ${
              disabled
                ? 'cursor-not-allowed border-elaw-border bg-elaw-agent-bubble opacity-60'
                : 'border-elaw-border bg-elaw-chat-bg hover:border-elaw-primary hover:bg-elaw-primary/5'
            }
          `}
        >
          <span className="font-medium text-elaw-text-primary">{option.label}</span>
          {option.description && (
            <span className="mt-1 text-sm text-elaw-text-secondary">{option.description}</span>
          )}
        </button>
      ))}
    </div>
  )
}
