
"use client"

import * as React from "react"
import { Paintbrush } from "lucide-react"

import { cn } from "@/lib/utils"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ColorPickerProps extends React.HTMLAttributes<HTMLDivElement> {
  color: string
  setColor: (color: string) => void
  onColorChange?: (color: string) => void
}

export function ColorPicker({
  color,
  setColor,
  onColorChange,
  className,
}: ColorPickerProps) {
  const [_, setStoredColor] = useLocalStorage("color", color)

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    setStoredColor(newColor)
    if (onColorChange) {
      onColorChange(newColor)
    }
  }

  const background = color.startsWith("hsl") ? color : "hsl(0 0% 100%)"

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[220px] justify-start text-left font-normal",
            !color && "text-muted-foreground",
            className
          )}
        >
          <div className="flex w-full items-center gap-2">
            <div
              className="h-4 w-4 rounded-full border"
              style={{ backgroundColor: background }}
            />
            <div className="flex-1 truncate">{color}</div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="flex items-center space-x-2">
          <Input
            id="color"
            value={color}
            onChange={(e) => handleColorChange(e.currentTarget.value)}
            className="h-8"
          />
        </div>
        <p className="pt-2 text-xs text-muted-foreground">
          Enter a valid HSL color. e.g. 262 80% 58%
        </p>
      </PopoverContent>
    </Popover>
  )
}
