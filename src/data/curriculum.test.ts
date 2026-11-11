import { describe, expect, it } from 'vitest'
import { trails } from './curriculum'
import { getMissionById, getUnitById } from './curriculum'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { legacyCurriculumRoutes } from './legacyCurriculum'

const units = trails.flatMap((trail) => trail.units)
const missions = units.flatMap((unit) => unit.missions)
const specification = readFileSync(resolve('docs/PEDAGOGIA/ESPECIFICACAO-20-MISSOES.md'), 'utf8')
const documentHeadings = [...specification.matchAll(/^### (M\d{2}) — (.+)$/gm)]

describe('Currículo aprovado para implementação', () => {
  it('mantém a distribuição de 3 trilhas, 10 unidades e 20 micromissões', () => {
    expect(trails.map((trail) => trail.units.length)).toEqual([3, 4, 3])
    const units = trails.flatMap((trail) => trail.units)
    expect(units).toHaveLength(10)
    expect(units.every((unit) => unit.missions.length === 2)).toBe(true)
    expect(units.flatMap((unit) => unit.missions)).toHaveLength(20)
  })

  it('possui identificadores únicos e objetivos em todo o currículo', () => {
    const entries = trails.flatMap((trail) => [trail, ...trail.units.flatMap((unit) => [unit, ...unit.missions])])
    expect(new Set(entries.map((item) => item.id)).size).toBe(entries.length)
    for (const mission of trails.flatMap((trail) => trail.units.flatMap((unit) => unit.missions))) {
      expect(mission.objective.trim().length).toBeGreaterThan(0)
    }
  })

  it('possui exatamente três trilhas e ordem pedagógica global contínua', () => {
    expect(trails).toHaveLength(3)
    expect(trails.map((trail) => trail.id)).toEqual(['T01', 'T02', 'T03'])
    expect(trails.map((trail) => trail.order)).toEqual([1, 2, 3])
    expect(units.map((unit) => unit.id)).toEqual(Array.from({ length: 10 }, (_,index) => `U${String(index + 1).padStart(2, '0')}`))
    expect(units.map((unit) => unit.order)).toEqual(Array.from({ length: 10 }, (_,index) => index + 1))
    expect(missions.map((mission) => mission.id)).toEqual(Array.from({ length: 20 }, (_,index) => `M${String(index + 1).padStart(2, '0')}`))
    expect(missions.map((mission) => mission.order)).toEqual(Array.from({ length: 20 }, (_,index) => index + 1))
  })

  it('separa códigos pedagógicos e slugs únicos e semanticamente novos de unidades e missões', () => {
    const entries = [...trails, ...units, ...missions]
    expect(new Set(entries.map((entry) => entry.slug)).size).toBe(33)
    for (const entry of entries) {
      expect(entry.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      expect(entry.slug).not.toBe(entry.id)
    }
    const oldIds = new Set(legacyCurriculumRoutes.map((route) => route.oldId))
    for (const entry of [...units, ...missions]) expect(oldIds.has(entry.slug)).toBe(false)
  })

  it('mantém vínculos válidos de unidade/trilha e o par A/B sem criar execução ou progresso', () => {
    for (const trail of trails) for (const unit of trail.units) {
      expect(unit.trailId).toBe(trail.id)
      expect(unit.missions.map((mission) => mission.mode)).toEqual(['guided', 'application'])
      for (const mission of unit.missions) {
        expect(mission.unitId).toBe(unit.id)
        expect(mission.trailId).toBe(trail.id)
        expect(mission.status).toBe('demonstration')
        expect(getMissionById(mission.id)).toBe(mission)
        expect(getUnitById(mission.unitId)).toBe(unit)
        expect(mission).not.toHaveProperty('progress')
        expect(mission).not.toHaveProperty('completed')
      }
    }
  })

  it('preserva os vinte códigos/títulos e todos os objetivos/cenários das fichas aprovadas, sem perdas', () => {
    expect(documentHeadings).toHaveLength(20)
    expect(missions.map((mission) => [mission.id, mission.title])).toEqual(documentHeadings.map((heading) => [heading[1], heading[2]]))
    for (const [index, heading] of documentHeadings.entries()) {
      const section = specification.slice(heading.index, documentHeadings[index + 1]?.index ?? specification.indexOf('## Depend', heading.index))
      expect(missions[index].objective).toBe(section.match(/^4\. \*\*[^*]+\*\* (.+)$/m)?.[1])
      expect(missions[index].scenario).toBe(section.match(/^5\. \*\*[^*]+\*\* (.+)$/m)?.[1])
      const unit = getUnitById(missions[index].unitId)!
      expect(section).toContain(`${unit.id} — ${unit.title}.`)
    }
  })

  it('mantém os títulos/objetivos das unidades da matriz aprovada', () => {
    const matrix = readFileSync(resolve('docs/PEDAGOGIA/MATRIZ-CURRICULAR.md'), 'utf8')
    const rows = [...matrix.matchAll(/^\| \*\*\d+\. [^*]+\*\* — ([^|]+)\|[^|]+\| \d · (U\d{2}) ([^|]+)\|/gm)]
    expect(rows).toHaveLength(10)
    expect(units.map((unit) => [unit.id, unit.title, unit.description])).toEqual(rows.map((row) => [row[2], row[3].trim(), row[1].trim()]))
  })
})
