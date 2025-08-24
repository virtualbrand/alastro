import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { type Variants } from 'framer-motion'

type AnimationDirection = 'bottom' | 'left' | 'right' | 'top' | 'fade'

interface UseScrollAnimationProps {
  direction?: AnimationDirection
  once?: boolean
  amount?: number
}

export const useScrollAnimation = ({
  direction = 'bottom',
  once = true,
  amount = 0.3
}: UseScrollAnimationProps = {}) => {
  const ref = useRef<any>(null)
  const isInView = useInView(ref, { once, amount })

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === 'bottom' ? 50 : direction === 'top' ? -80 : 0,
      x: direction === 'left' ? -80 : direction === 'right' ? 80 : 0,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.17, 0.55, 0.55, 1]
      }
    }
  }

  const animate = isInView ? 'visible' : 'hidden'

  return {
    ref,
    variants,
    initial: 'hidden',
    animate,
  }
}
