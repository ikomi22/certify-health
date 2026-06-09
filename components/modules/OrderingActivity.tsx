// components/modules/OrderingActivity.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import type { OrderingItem } from "@/lib/modules/types"

type Props = {
  items: OrderingItem[]
  correctOrder: string[]
  onComplete: () => void
}

type ItemState = {
  id: string
  text: string
  state: "default" | "correct" | "incorrect"
  correctPosition?: number
}

export function OrderingActivity({ items, correctOrder, onComplete }: Props) {
  const [isMobile, setIsMobile] = useState(false)
  const [order, setOrder] = useState<OrderingItem[]>(items)
  const [checked, setChecked] = useState(false)
  const [hasReordered, setHasReordered] = useState(false)
  const [itemStates, setItemStates] = useState<ItemState[]>([])
  const [complete, setComplete] = useState(false)

  const dragIndex = useRef<number | null>(null)

  useEffect(() => {
    setIsMobile("ontouchstart" in window)
  }, [])

  function moveUp(index: number) {
    if (index === 0) return
    const next = [...order]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    setOrder(next)
    setHasReordered(true)
  }

  function moveDown(index: number) {
    if (index === order.length - 1) return
    const next = [...order]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    setOrder(next)
    setHasReordered(true)
  }

  function onDragStart(index: number) {
    dragIndex.current = index
  }

  function onDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    if (dragIndex.current === null || dragIndex.current === index) return
    const next = [...order]
    const dragged = next.splice(dragIndex.current, 1)[0]
    next.splice(index, 0, dragged)
    dragIndex.current = index
    setOrder(next)
    setHasReordered(true)
  }

  function checkOrder() {
    const states: ItemState[] = order.map((item, i) => {
      const isCorrect = item.id === correctOrder[i]
      const correctPos = correctOrder.indexOf(item.id) + 1
      return {
        id: item.id,
        text: item.text,
        state: isCorrect ? "correct" : "incorrect",
        correctPosition: isCorrect ? undefined : correctPos,
      }
    })
    setItemStates(states)
    setChecked(true)

    const allCorrect = states.every((s) => s.state === "correct")
    if (allCorrect) {
      setComplete(true)
      onComplete()
    }
  }

  function showAnswer() {
    const correct = correctOrder.map((id) => order.find((o) => o.id === id)!)
    setOrder(correct)
    setItemStates(
      correct.map((item) => ({ id: item.id, text: item.text, state: "correct" }))
    )
    setChecked(true)
    setComplete(true)
    onComplete()
  }

  const displayItems = checked
    ? itemStates.map((s) => order.find((o) => o.id === s.id) ?? order[0])
    : order

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {displayItems.map((item, i) => {
          const state = checked ? itemStates[i]?.state ?? "default" : "default"
          return (
            <div
              key={item.id}
              draggable={!isMobile && !checked}
              onDragStart={() => onDragStart(i)}
              onDragOver={(e) => !checked && onDragOver(e, i)}
              className={`flex items-center gap-3 bg-white rounded-xl ring-1 p-4 transition-all ${
                state === "correct"
                  ? "ring-green-400 bg-green-50 animate-fadeIn"
                  : state === "incorrect"
                  ? "ring-red-400 bg-red-50"
                  : "ring-gray-200 cursor-grab active:cursor-grabbing"
              }`}
            >
              {!isMobile && !checked && (
                <span className="text-gray-300 text-lg select-none">≡</span>
              )}
              <span className="text-sm text-gray-800 flex-1 leading-snug">{item.text}</span>
              {isMobile && !checked && (
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    className="w-11 h-11 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveDown(i)}
                    disabled={i === displayItems.length - 1}
                    className="w-11 h-11 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                  >
                    ↓
                  </button>
                </div>
              )}
              {state === "correct" && (
                <span className="text-green-600 text-sm font-bold animate-scaleIn">✓</span>
              )}
              {state === "incorrect" && (
                <span className="text-red-500 text-xs shrink-0">✗</span>
              )}
            </div>
          )
        })}
      </div>

      {checked && itemStates.some((s) => s.state === "incorrect") && (
        <div className="space-y-1 animate-fadeIn">
          {itemStates
            .filter((s) => s.state === "incorrect")
            .map((s) => (
              <p key={s.id} className="text-xs text-red-600 px-1">
                &quot;{s.text.substring(0, 40)}...&quot; — should be position {s.correctPosition}
              </p>
            ))}
        </div>
      )}

      {!complete && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={checkOrder}
            disabled={!hasReordered}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
              hasReordered
                ? "border border-green-600 text-green-700 hover:bg-green-50"
                : "border border-gray-200 text-gray-300 cursor-not-allowed"
            }`}
          >
            Check Order
          </button>
          {checked && (
            <button
              onClick={showAnswer}
              className="py-3 px-4 rounded-xl text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Show answer
            </button>
          )}
        </div>
      )}
    </div>
  )
}
