import { useEffect, useState } from 'react'
import { useWindowsSize } from './useWindowSize'

type DiceSelectWheelProps = {
  max: number
  current: number
  onChange: (value: number) => void
}

let timeout: any = null

// A horizontal wheel of dice numbers that can be selected.
// The user can spin throught he wheel to select a number.
export const DiceSelectWheel = ({
  max,
  current,
  onChange,
}: DiceSelectWheelProps) => {
  const diceNumberChoices = Array.from(Array(max).keys()).map((i) => i + 1)
  const [height, setHeight] = useState(0)
  const { height: windowHeight, lastHeight: lastWindowHeight } =
    useWindowsSize()

  // Fix the height of wheel container to it's parents height.
  useEffect(() => {
    const updateHeight = () => {
      const wheelContainer = document.getElementById('wheelContainer')
      if (wheelContainer) {
        const newHeight = wheelContainer.parentElement?.clientHeight || 0
        setHeight(newHeight)
      }
    }
    if (windowHeight < lastWindowHeight) {
      // We take on a slight flicker because the container first needs to shrink.
      // This allows the parent to take up it's natural space again.
      // After that we can set the proper height according to the parent.
      setTimeout(updateHeight, 0)
      return setHeight(0)
    }
    updateHeight()
  }, [setHeight, windowHeight, lastWindowHeight])

  // Scroll the wheel to right position when current or height changes.
  useEffect(() => {
    if (height === 0 || current === 0) return
    const wheelContainer = document.getElementById('wheelContainer')
    if (wheelContainer) {
      // Position of currently selected element relative to wheel container.
      const currentElement = document.getElementById(`number-${current}`)
      const currentElementPosition = currentElement?.offsetTop || 0
      // We want the current element to be positioned in the middle.
      const newScrollPosition = currentElementPosition - height / 2
      wheelContainer.scrollTo({ top: newScrollPosition, behavior: 'smooth' })
      // wheelContainer.scrollTop = newScrollPosition
    }
  }, [current, height])

  // Setup scroll listeners for wheel container.
  useEffect(() => {
    const findCurrentEvent = (container: HTMLElement) => {
      // Find the element currently scrolled into the center of the wheel.
      // We look at all elements and find the one in the center using the scrollTop of the container.
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
      // If we found an element, trigger change event.
      if (closestElement as HTMLDivElement | null) {
        const number = Number(closestElement!.dataset.number)
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
      <div className="divider absolute left-0 w-full top-1/2 -translate-y-12"></div>
      <div className="divider absolute left-0 w-full top-1/2"></div>
      <div
        id="wheelContainer"
        className="overflow-y-scroll no-scrollbar relative snap-y snap-mandatory"
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
            className="snap-center my-4 flex-grow flex justify-center items-center cursor-pointer"
            onClick={() => onChange(number)}
          >
            {number}
          </div>
        ))}
      </div>
    </>
  )
}
