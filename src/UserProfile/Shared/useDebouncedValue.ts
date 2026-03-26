import { useEffect, useState } from 'react'

export const useDebouncedValue = <T>(value: T, delay = 160): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => window.clearTimeout(timer)
  }, [delay, value])

  return debouncedValue
}
