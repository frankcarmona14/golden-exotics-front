"use client"

import { useRef } from "react"
import {
  motion,
  MotionConfig,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion"

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

function useRevealState() {
  const reduceMotion = useReducedMotion()
  return Boolean(reduceMotion)
}

export function FadeUp({
  children,
  delay = 0,
  duration = 0.6,
  className,
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const reduceMotion = useRevealState()
  const hidden = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }

  return (
    <motion.div
      ref={ref}
      data-motion=""
      initial={hidden}
      animate={isInView || reduceMotion ? { opacity: 1, y: 0 } : hidden}
      transition={{ duration: reduceMotion ? 0 : duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  initialDelay = 0,
}: {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  initialDelay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const reduceMotion = useRevealState()

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : staggerDelay,
        delayChildren: reduceMotion ? 0 : initialDelay,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      data-motion=""
      variants={containerVariants}
      initial="hidden"
      animate={isInView || reduceMotion ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const reduceMotion = useRevealState()
  const itemVariants: Variants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.5,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  }

  return (
    <motion.div data-motion="" variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}

export function ScaleIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const reduceMotion = useRevealState()
  const hidden = reduceMotion
    ? { opacity: 1, scale: 1 }
    : { opacity: 0, scale: 0.92 }

  return (
    <motion.div
      ref={ref}
      data-motion=""
      initial={hidden}
      animate={isInView || reduceMotion ? { opacity: 1, scale: 1 } : hidden}
      transition={{
        duration: reduceMotion ? 0 : 0.5,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function ParallaxSection({
  children,
  className,
  speed = 0.3,
}: {
  children: React.ReactNode
  className?: string
  speed?: number
}) {
  const ref = useRef(null)
  const reduceMotion = useRevealState()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, speed * -100]
  )

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

export function SlideIn({
  children,
  direction = "left",
  delay = 0,
  className,
}: {
  children: React.ReactNode
  direction?: "left" | "right"
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const reduceMotion = useRevealState()
  const x = direction === "left" ? -40 : 40
  const hidden = reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x }

  return (
    <motion.div
      ref={ref}
      data-motion=""
      initial={hidden}
      animate={isInView || reduceMotion ? { opacity: 1, x: 0 } : hidden}
      transition={{
        duration: reduceMotion ? 0 : 0.6,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  className,
}: {
  value: number
  suffix?: string
  prefix?: string
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.span
      ref={ref}
      data-motion=""
      initial={{ opacity: 1 }}
      className={className}
    >
      {prefix}
      {isInView ? value : 0}
      {suffix}
    </motion.span>
  )
}
