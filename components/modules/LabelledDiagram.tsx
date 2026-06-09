// components/modules/LabelledDiagram.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import type { ComponentType } from "react"
import type { DiagramHotspot } from "@/lib/modules/types"

type Props = {
  svg: ComponentType
  hotspots: DiagramHotspot[]
  onComplete: () => void
}

export function LabelledDiagram({ svg: SvgComponent, hotspots, onComplete }: Props) {
  const [visited, setVisited] = useState<Set<string>>(new Set())
  const [active, setActive] = useState<string | null>(null)
  const [pulsedAll, setPulsedAll] = useState(false)

  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (hotspots.length > 0 && visited.size === hotspots.length && !pulsedAll) {
      setPulsedAll(true)
      const t = setTimeout(() => {
        setPulsedAll(false)
        onCompleteRef.current()
      }, 1000)
      return () => clearTimeout(t)
    }
  }, [visited.size, hotspots.length, pulsedAll])

  function tap(id: string) {
    setVisited((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
    setActive((prev) => (prev === id ? null : id))
  }

  const activeHotspot = hotspots.find((h) => h.id === active)
  const allVisited = visited.size === hotspots.length

  return (
    <div className="space-y-3">
      <div className="relative bg-white rounded-2xl ring-1 ring-gray-200 overflow-hidden">
        <SvgComponent />
        {hotspots.map((h) => {
          const isVisited = visited.has(h.id)
          return (
            <button
              key={h.id}
              onClick={() => tap(h.id)}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center"
              aria-label={h.label}
            >
              {(!isVisited || pulsedAll) && (
                <span
                  className={`absolute inline-flex h-5 w-5 rounded-full opacity-60 animate-ping ${
                    pulsedAll ? "bg-green-500" : "bg-green-400"
                  }`}
                />
              )}
              <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-green-500 shadow" />
            </button>
          )
        })}

        {activeHotspot && (
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 animate-fadeIn border-t border-gray-100">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-sm text-gray-900">{activeHotspot.label}</p>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {activeHotspot.description}
                </p>
              </div>
              <button
                onClick={() => setActive(null)}
                className="text-gray-400 hover:text-gray-600 shrink-0 text-lg leading-none"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>

      <p
        className={`text-xs text-right transition-colors ${
          allVisited ? "text-green-600 font-medium" : "text-gray-400"
        }`}
      >
        {allVisited ? "All explored ✓" : `${visited.size} of ${hotspots.length} explored`}
      </p>
    </div>
  )
}
