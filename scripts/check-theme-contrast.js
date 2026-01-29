const fs = require('fs')
const path = require('path')

const cssPath = path.join(__dirname, '..', 'app', 'globals.css')
const css = fs.readFileSync(cssPath, 'utf8')

const themeBlockRegex =
  /\[data-theme='([^']+)'\]\[data-mode='(light|dark)'\]\s*\{([\s\S]*?)\}/g

const varRegex = /--([a-z0-9-]+)\s*:\s*oklch\(([^)]+)\)\s*;/gi

const requiredPairs = [
  ['foreground', 'background'],
  ['muted-foreground', 'background'],
  ['muted-foreground', 'muted'],
  ['primary-foreground', 'primary'],
  ['secondary-foreground', 'secondary'],
  ['accent-foreground', 'accent'],
  ['popover-foreground', 'popover'],
  ['roll-positive-foreground', 'roll-positive'],
  ['roll-negative-foreground', 'roll-negative'],
]

const MIN_CONTRAST = 4.5

const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value))

const parseOklch = (raw) => {
  const [components, alphaPart] = raw.split('/').map((part) => part.trim())
  const [l, c, h] = components
    .trim()
    .split(/\s+/)
    .map((value) => Number.parseFloat(value))

  let alpha = 1
  if (alphaPart) {
    alpha = alphaPart.endsWith('%')
      ? Number.parseFloat(alphaPart) / 100
      : Number.parseFloat(alphaPart)
  }

  return { l, c, h, alpha }
}

const oklchToLinearRgb = ({ l, c, h, alpha }) => {
  const hueRad = (h * Math.PI) / 180
  const a = c * Math.cos(hueRad)
  const b = c * Math.sin(hueRad)

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b
  const s_ = l - 0.0894841775 * a - 1.291485548 * b

  const l3 = l_ ** 3
  const m3 = m_ ** 3
  const s3 = s_ ** 3

  const r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3
  const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3
  const b2 = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3

  return {
    r: clamp(r),
    g: clamp(g),
    b: clamp(b2),
    alpha,
  }
}

const relativeLuminance = ({ r, g, b }) =>
  0.2126 * r + 0.7152 * g + 0.0722 * b

const contrastRatio = (fg, bg) => {
  const blend = (front, back) => ({
    r: front.r * front.alpha + back.r * (1 - front.alpha),
    g: front.g * front.alpha + back.g * (1 - front.alpha),
    b: front.b * front.alpha + back.b * (1 - front.alpha),
    alpha: 1,
  })

  const fgLinear = fg.alpha < 1 ? blend(fg, bg) : fg
  const bgLinear = bg
  const l1 = relativeLuminance(fgLinear)
  const l2 = relativeLuminance(bgLinear)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

const themes = []
let match
while ((match = themeBlockRegex.exec(css)) !== null) {
  const [, themeName, mode, block] = match
  const variables = new Map()
  let varMatch
  while ((varMatch = varRegex.exec(block)) !== null) {
    variables.set(varMatch[1], parseOklch(varMatch[2]))
  }
  themes.push({ themeName, mode, variables })
}

if (themes.length === 0) {
  console.error('No theme blocks found in app/globals.css.')
  process.exit(1)
}

const failures = []
const missing = []

for (const theme of themes) {
  for (const [fgToken, bgToken] of requiredPairs) {
    const fg = theme.variables.get(fgToken)
    const bg = theme.variables.get(bgToken)
    if (!fg || !bg) {
      missing.push(
        `${theme.themeName}/${theme.mode} missing ${fgToken} or ${bgToken}`
      )
      continue
    }
    const fgRgb = oklchToLinearRgb(fg)
    const bgRgb = oklchToLinearRgb(bg)
    const ratio = contrastRatio(fgRgb, bgRgb)
    if (ratio < MIN_CONTRAST) {
      failures.push(
        `${theme.themeName}/${theme.mode} ${fgToken} on ${bgToken}: ${ratio.toFixed(
          2
        )}`
      )
    }
  }
}

if (missing.length > 0) {
  console.error('Missing required theme tokens:')
  for (const entry of missing) {
    console.error(`- ${entry}`)
  }
}

if (failures.length > 0) {
  console.error(`Contrast check failed (min ${MIN_CONTRAST}:1):`)
  for (const entry of failures) {
    console.error(`- ${entry}`)
  }
}

if (missing.length > 0 || failures.length > 0) {
  process.exit(1)
}

console.log('Theme contrast check passed.')
