import type { Mission, Trail, Unit, UnitId } from './curriculum'

export const pathUnitAnchor = (id: UnitId) => `percurso-${id.toLowerCase()}`

export const trailPath = (trail: Pick<Trail, 'slug'>) => `/trilhas/${trail.slug}`
export const unitPath = (trail: Pick<Trail, 'slug'>, unit: Pick<Unit, 'slug'>) => `${trailPath(trail)}/unidades/${unit.slug}`
export const missionPath = (trail: Pick<Trail, 'slug'>, unit: Pick<Unit, 'slug'>, mission: Pick<Mission, 'slug'>) => `${unitPath(trail, unit)}/missoes/${mission.slug}`
