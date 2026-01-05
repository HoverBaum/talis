'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { d6Mapping } from '@/utils/dice-constants'
import type { Theme } from '@/components/ThemeProvider'

const themes: Theme[] = ['default', 'shadowrun', 'nature', 'spm']

// Sample dice roll result - same for all themes
const sampleRoll = {
  results: [5, 6, 3, 5, 1, 2],
  hits: 3,
  isGlitch: true,
  isCriticalGlitch: false,
}

// Color definitions to showcase
const colorVariables = [
  { name: 'Background', var: '--background' },
  { name: 'Foreground', var: '--foreground' },
  { name: 'Primary', var: '--primary' },
  { name: 'Primary Foreground', var: '--primary-foreground' },
  { name: 'Secondary', var: '--secondary' },
  { name: 'Secondary Foreground', var: '--secondary-foreground' },
  { name: 'Accent', var: '--accent' },
  { name: 'Accent Foreground', var: '--accent-foreground' },
  { name: 'Muted', var: '--muted' },
  { name: 'Muted Foreground', var: '--muted-foreground' },
  { name: 'Card', var: '--card' },
  { name: 'Card Foreground', var: '--card-foreground' },
  { name: 'Border', var: '--border' },
  { name: 'Destructive', var: '--destructive' },
  { name: 'Roll Positive', var: '--roll-positive' },
  { name: 'Roll Positive Foreground', var: '--roll-positive-foreground' },
  { name: 'Roll Negative', var: '--roll-negative' },
  { name: 'Roll Negative Foreground', var: '--roll-negative-foreground' },
]

function ThemeShowcase({ theme, mode }: { theme: Theme; mode: 'light' | 'dark' }) {
  return (
    <div
      data-theme={theme}
      data-mode={mode}
      className="p-6 rounded-lg border bg-background text-foreground"
    >
      <div className="space-y-6">
        {/* Theme Header */}
        <div>
          <h3 className="text-2xl font-bold capitalize mb-1">
            {theme} - {mode}
          </h3>
          <p className="text-sm text-muted-foreground">
            Theme colors and component showcase
          </p>
        </div>

        {/* Sample Dice Roll */}
        <Card>
          <CardHeader>
            <CardTitle>Sample Dice Roll</CardTitle>
            <CardDescription>Shadowrun-style roll result</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-xl font-bold">{sampleRoll.hits} hits</span>
                {sampleRoll.isGlitch && (
                  <Badge
                    variant="outline"
                    className="ml-2 bg-roll-negative text-roll-negative-foreground"
                  >
                    Glitch
                  </Badge>
                )}
              </div>
              <div className="text-4xl flex flex-wrap font-emoji">
                {sampleRoll.results.map((result, i) => {
                  const isHit = result >= 5
                  const isOne = result === 1
                  const colorClass = isHit
                    ? 'text-roll-positive'
                    : isOne
                      ? 'text-roll-negative'
                      : 'text-muted-foreground'

                  return (
                    <span key={i} className={`mr-1 ${colorClass}`}>
                      {d6Mapping[result as 1 | 2 | 3 | 4 | 5 | 6]}
                    </span>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Component Showcase */}
        <Card>
          <CardHeader>
            <CardTitle>Components</CardTitle>
            <CardDescription>Common UI elements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>Theme color variables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {colorVariables.map((color) => (
                <div key={color.var} className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded border"
                    style={{
                      backgroundColor: `oklch(var(${color.var}))`,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{color.name}</div>
                    <div className="text-xs text-muted-foreground">{color.var}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ThemesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Theme Showcase</h1>
        <p className="text-muted-foreground">
          View all available themes in both light and dark modes. Each theme displays the same
          dice roll result for comparison.
        </p>
      </div>

      <div className="space-y-12">
        {themes.map((theme) => (
          <div key={theme} className="space-y-6">
            <h2 className="text-3xl font-bold capitalize">{theme} Theme</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ThemeShowcase theme={theme} mode="light" />
              <ThemeShowcase theme={theme} mode="dark" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
