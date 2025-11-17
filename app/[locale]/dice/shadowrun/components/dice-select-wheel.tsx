'use client'

import { useEffect, useState } from 'react'
import { useWindowSize } from '../hooks/use-window-size'

type DiceSelectWheelProps = {
  max: number
  current: number
  onChange: (value: number) => void
}

let timeout: NodeJS.Timeout | null = null

export function DiceSelectWheel({
  max,
  current,
  onChange,
}: DiceSelectWheelProps) {
  const diceNumberChoices = Array.from(Array(max).keys()).map((i) => i + 1)
  const [height, setHeight] = useState(0)
  const { height: windowHeight, lastHeight: lastWindowHeight } = useWindowSize()

  useEffect(() => {
    const updateHeight = () => {
      const wheelContainer = document.getElementById('wheelContainer')
      if (wheelContainer) {
        const newHeight = wheelContainer.parentElement?.clientHeight || 0
        setHeight(newHeight)
      }
    }
    if (windowHeight < lastWindowHeight) {
      setTimeout(updateHeight, 0)
      return setHeight(0)
    }
    updateHeight()
  }, [setHeight, windowHeight, lastWindowHeight])

  useEffect(() => {
    if (height === 0 || current === 0) return
    const wheelContainer = document.getElementById('wheelContainer')
    if (wheelContainer) {
      const currentElement = document.getElementById(`number-${current}`)
      const currentElementPosition = currentElement?.offsetTop || 0
      const newScrollPosition = currentElementPosition - height / 2
      wheelContainer.scrollTo({ top: newScrollPosition, behavior: 'smooth' })
    }
  }, [current, height])

  useEffect(() => {
    const findCurrentEvent = (container: HTMLElement) => {
      const elements =
        document.querySelectorAll<HTMLDivElement>('[data-number]')
      const center = container.scrollTop + height / 2
      let closestElement: HTMLDivElement | null = null
      let closestDistance = Number.MAX_SAFE_INTEGER
      elements.forEach((element) => {
        const distance = Math.abs(center - element.offsetTop)
        if (distance < closestDistance) {
          closestElement = element
          closestDistance = distance
        }
      })
      if (closestElement) {
        const number = Number(closestElement.dataset.number)
        onChange(number)
      }
    }

    const scrollListener = () => {
      timeout && clearTimeout(timeout)
      timeout = setTimeout(() => {
        const wheelContainer = document.getElementById('wheelContainer')
        if (wheelContainer) {
          findCurrentEvent(wheelContainer)
        }
      }, 100)
    }

    const wheelContainer = document.getElementById('wheelContainer')
    if (wheelContainer) {
      wheelContainer.addEventListener('scroll', scrollListener)

      return () => {
        wheelContainer.removeEventListener('scroll', scrollListener)
      }
    }
  }, [height, onChange])

  return (
    <>
      <div className="absolute left-0 w-full top-1/2 -translate-y-12 border-t"></div>
      <div className="absolute left-0 w-full top-1/2 border-t"></div>
      <div
        id="wheelContainer"
        className="overflow-y-scroll scrollbar-none relative snap-y snap-mandatory"
        style={{
          height: `${height}px`,
          paddingTop: `${height / 2}px`,
          paddingBottom: `${height / 2}px`,
        }}
      >
        {diceNumberChoices.map((number) => (
          <div
            key={number}
            id={`number-${number}`}
            data-number={number}
            className="snap-center my-4 flex-grow flex justify-center items-center cursor-pointer text-2xl"
            onClick={() => onChange(number)}
          >
            {number}
          </div>
        ))}
      </div>
    </>
  )
}
