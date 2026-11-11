import { Navigate, useParams } from 'react-router-dom'
import { demoUnit, getDemoMission, getOfficialMissionPath } from '../data/demoMissions'
import { NotFoundPage } from './CurriculumPages'

// Compatibilidade dos três acessos anteriores; só há execução na rota oficial.
export function DemoUnitPage() {
  return <Navigate to={demoUnit.path} replace />
}

export function DemoMissionPage() {
  const { demoMissionId } = useParams()
  const definition = getDemoMission(demoMissionId)
  return definition ? <Navigate to={getOfficialMissionPath(definition)} replace /> : <NotFoundPage />
}
