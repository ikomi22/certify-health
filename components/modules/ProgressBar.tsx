// components/modules/ProgressBar.tsx
"use client"

type Props = {
  currentSection: number
  totalSections: number
  moduleName: string
}

export function ProgressBar({ currentSection, totalSections, moduleName }: Props) {
  const pct = Math.round((currentSection / totalSections) * 100)

  return (
    <div className="bg-white border-b border-gray-100 px-4 py-2.5">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500 truncate max-w-[55%]">{moduleName}</p>
          <p className="text-xs text-gray-500 shrink-0">
            Section {currentSection} of {totalSections}
          </p>
        </div>
        <div className="flex gap-1 mb-1.5">
          {Array.from({ length: totalSections }).map((_, i) => {
            const n = i + 1
            return (
              <div
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  n < currentSection
                    ? "bg-green-500"
                    : n === currentSection
                    ? "bg-green-500 animate-pulse"
                    : "bg-gray-200"
                }`}
              />
            )
          })}
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}
