import type { OptionItem } from '@/types/protocol'

interface ButtonGroupProps {
  options: OptionItem[]
  disabled: boolean
  onSelect: (optionId: string) => void
}

export default function ButtonGroup({ options, disabled, onSelect }: ButtonGroupProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(option.id)}
          className={`
            rounded-full border px-4 py-2 text-sm font-medium transition-colors
            ${
              disabled
                ? 'cursor-not-allowed border-elaw-border bg-elaw-agent-bubble text-elaw-text-secondary'
                : 'border-elaw-primary bg-elaw-primary/10 text-elaw-text-primary hover:bg-elaw-primary hover:text-white'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
