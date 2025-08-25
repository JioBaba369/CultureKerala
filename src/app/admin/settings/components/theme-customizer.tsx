
"use client"

import * as React from "react"
import { Palette, Check } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { themes } from "@/config/theme"
import { Label } from "@/components/ui/label"
import { ColorPicker } from "@/components/ui/color-picker"
import { Skeleton } from "@/components/ui/skeleton"

export function ThemeCustomizer() {
  const [config, setConfig] = useConfig()
  const { theme: mode } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
        <CardDescription>
          Customize the appearance of your site.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label>Color Scheme</Label>
            <div className="grid grid-cols-3 gap-2">
            {themes.map((t) => (
                <Button
                key={t.name}
                variant={"outline"}
                size="sm"
                onClick={() =>
                    setConfig({
                    ...config,
                    theme: t.name,
                    })
                }
                className={cn(
                    "justify-start",
                    config.theme === t.name && "border-2 border-primary"
                )}
                >
                <span
                    className={cn(
                    "mr-2 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full"
                    )}
                >
                    <span
                    className={cn(
                        "flex h-3 w-3 items-center justify-center rounded-full",
                        `bg-${t.name}-primary`
                    )}
                    />
                </span>
                {t.label}
                </Button>
            ))}
            </div>
        </div>

        <div className="space-y-2">
          <Label>Colors</Label>
           <div className="grid grid-cols-1 gap-4">
            {!mounted || !mode ? (
                <div className="space-y-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            ) : (
                <>
                <div className="flex items-center justify-between">
                    <Label className="text-sm">Primary</Label>
                    <ColorPicker
                    color={config.colors[mode as keyof typeof config.colors].primary}
                    setColor={(color) =>
                        setConfig({
                        ...config,
                        colors: {
                            ...config.colors,
                            [mode as keyof typeof config.colors]: {
                            ...config.colors[mode as keyof typeof config.colors],
                            primary: color,
                            },
                        },
                        })
                    }
                    />
                </div>
                 <div className="flex items-center justify-between">
                    <Label className="text-sm">Background</Label>
                    <ColorPicker
                    color={config.colors[mode as keyof typeof config.colors].background}
                    setColor={(color) =>
                        setConfig({
                        ...config,
                        colors: {
                            ...config.colors,
                            [mode as keyof typeof config.colors]: {
                            ...config.colors[mode as keyof typeof config.colors],
                            background: color,
                            },
                        },
                        })
                    }
                    />
                </div>
                 <div className="flex items-center justify-between">
                    <Label className="text-sm">Accent</Label>
                    <ColorPicker
                    color={config.colors[mode as keyof typeof config.colors].accent}
                    setColor={(color) =>
                        setConfig({
                        ...config,
                        colors: {
                            ...config.colors,
                            [mode as keyof typeof config.colors]: {
                            ...config.colors[mode as keyof typeof config.colors],
                            accent: color,
                            },
                        },
                        })
                    }
                    />
                </div>
                </>
            )}
            </div>
        </div>
      </CardContent>
    </Card>
  )
}
