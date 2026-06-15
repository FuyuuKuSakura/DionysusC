interface SystemStatusProps {
  content: string
}

export default function SystemStatus({ content }: SystemStatusProps) {
  return (
    <div className="flex justify-center">
      <p className="max-w-4/5 text-center text-xs text-dionysus-system sm:text-sm">
        {content}
      </p>
    </div>
  )
}
