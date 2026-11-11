import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve('src/styles/tokens.css'), 'utf8')
const colors = Object.fromEntries([...css.matchAll(/--color-([\w-]+):\s*(#[\da-f]{6});/gi)].map((match) => [match[1], match[2]]))
function luminance(hex: string) {
  const rgb = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .map((value) => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722
}
function contrast(first: string, second: string) {
  const values = [luminance(colors[first]), luminance(colors[second])].sort((a, b) => b - a)
  return (values[0] + .05) / (values[1] + .05)
}

describe('Contraste matemático dos pares de tokens (não verifica renderização)', () => {
  it.each([
    ['text', 'background'], ['text', 'surface'], ['text', 'soft'],
    ['muted', 'surface'], ['muted', 'soft'], ['primary', 'surface'], ['primary', 'soft'],
    ['surface', 'primary'], ['surface', 'primary-hover'],
    ['info-text', 'info-bg'], ['success-text', 'success-bg'], ['error-text', 'error-bg'],
    ['trail-green', 'trail-green-bg'], ['trail-clay', 'trail-clay-bg'], ['trail-blue', 'trail-blue-bg'],
  ])('mantém ao menos 4,5:1 para texto em %s / %s', (foreground, background) => {
    expect(contrast(foreground, background)).toBeGreaterThanOrEqual(4.5)
  })
  it.each([['control', 'surface'], ['control', 'soft'], ['focus', 'surface'], ['focus', 'soft'], ['focus', 'background']])('mantém ao menos 3:1 para %s / %s', (foreground, background) => {
    expect(contrast(foreground, background)).toBeGreaterThanOrEqual(3)
  })
})
