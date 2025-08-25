
"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window !== "undefined") {
      const storedValue = window.localStorage.getItem(key)
      if (storedValue) {
        try {
          return JSON.parse(storedValue)
        } catch (error) {
            console.error("Error parsing localStorage key:", key, error);
            return defaultValue;
        }
      }
    }
    return defaultValue
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  }, [key, value])

  return [value, setValue]
}
