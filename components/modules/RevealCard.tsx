// components/modules/RevealCard.tsx
"use client"

import { useState, useEffect, useCallback } from "react"

type Card = { title: string; content: string }

type Props = {
  cards: Card[]
  onComplete: () => void
}

export function RevealCard({ cards, onComplete }: Props) {
  const [opened, setOpened] = useState<Set<number>>(new Set())
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile("ontouchstart" in window)
  }, [])

  const handleComplete = useCallback(onComplete, [onComplete])

  useEffect(() => {
    if (opened.size === cards.length) handleComplete()
  }, [opened.size, cards.length, handleComplete])

  function open(index: number) {
    setOpened((prev) => {
      const next = new Set(prev)
      next.add(index)
      return next
    })
  }

  return (
    <div className="space-y-3">
      {cards.map((card, i) => {
        const isOpen = opened.has(i)
        return (
          <div
            key={i}
            className={`bg-white rounded-2xl ring-1 overflow-hidden transition-all duration-200 ${
              isOpen ? "ring-green-400 border-l-4 border-green-500" : "ring-gray-200"
            }`}
            style={!isMobile ? { animationDelay: `${i * 50}ms` } : undefined}
          >
            <button
              onClick={() => open(i)}
              className="w-full flex items-center justify-between p-5 text-left min-h-[52px]"
            >
              <span className="font-medium text-gray-900 text-sm pr-3">{card.title}</span>
              <span
                className={`text-green-600 font-light text-2xl leading-none shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm text-gray-700 leading-relaxed animate-fadeIn">
                {card.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
