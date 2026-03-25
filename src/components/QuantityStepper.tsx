type Props = {
  value: number
  min?: number
  max?: number
  onChange: (n: number) => void
  disabled?: boolean
}

export function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
  disabled,
}: Props) {
  return (
    <div className="inline-flex items-center rounded-full border border-neutral-300 bg-white p-1">
      <button
        type="button"
        disabled={disabled || value <= min}
        className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
        aria-label="Diminuer la quantité"
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        −
      </button>
      <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        disabled={disabled || value >= max}
        className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
        aria-label="Augmenter la quantité"
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        +
      </button>
    </div>
  )
}
