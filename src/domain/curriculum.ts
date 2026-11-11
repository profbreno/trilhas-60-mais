export type TrailId = 'T01' | 'T02' | 'T03'
export type UnitId = 'U01' | 'U02' | 'U03' | 'U04' | 'U05' | 'U06' | 'U07' | 'U08' | 'U09' | 'U10'
export type MissionId = 'M01' | 'M02' | 'M03' | 'M04' | 'M05' | 'M06' | 'M07' | 'M08' | 'M09' | 'M10' | 'M11' | 'M12' | 'M13' | 'M14' | 'M15' | 'M16' | 'M17' | 'M18' | 'M19' | 'M20'

export interface Mission {
  id: MissionId
  slug: string
  order: number
  unitId: UnitId
  trailId: TrailId
  mode: 'guided' | 'application'
  status: 'demonstration'
  title: string
  objective: string
  scenario: string
}

export interface Unit {
  id: UnitId
  slug: string
  order: number
  trailId: TrailId
  title: string
  description: string
  missions: readonly Mission[]
}

export interface Trail {
  id: TrailId
  slug: string
  order: number
  number: string
  title: string
  description: string
  theme: 'green' | 'clay' | 'blue'
  units: readonly Unit[]
}
