
"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue) {
      try {
        setValue(JSON.parse(storedValue));
      } catch (error) {
        console.error("Error parsing localStorage key:", key, error);
      }
    }
  }, [key]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  }, [key, value])

  return [value, setValue]
}
