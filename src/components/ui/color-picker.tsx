
"use client"

import * as React from "react"
import { Paintbrush } from "lucide-react"

import { cn } from "@/lib/utils"
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
}

export function ColorPicker({
  color,
  setColor,
  className,
}: ColorPickerProps) {
  const background = `hsl(${color})`

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[140px] justify-start text-left font-normal",
            !color && "text-muted-foreground",
            className
          )}
        >
          <div className="flex w-full items-center gap-2">
            {color ? (
              <div
                className="h-4 w-4 rounded-full border"
                style={{ backgroundColor: background }}
              />
            ) : (
              <Paintbrush className="h-4 w-4" />
            )}
            <div className="flex-1 truncate">{color ? color : "Pick a color"}</div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="flex items-center space-x-2">
          <div
            className="h-8 w-8 rounded-md border"
            style={{ backgroundColor: background }}
          />
          <Input
            id="color"
            value={color}
            onChange={(e) => setColor(e.currentTarget.value)}
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

    