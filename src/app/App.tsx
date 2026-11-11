import { Route, Routes } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { TrailPage, UnitPage, MissionPage, NotFoundPage } from '../pages/CurriculumPages'
import { AppLayout } from '../components/AppLayout'
import { DemoMissionPage, DemoUnitPage } from '../pages/DemoMissionPages'
import { TrailsPage, AchievementsPage } from '../pages/ParticipantPages'

export function App() {
  return <AppLayout><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/trilhas" element={<TrailsPage />} />
    <Route path="/conquistas" element={<AchievementsPage />} />
    <Route path="/desenvolvimento/u01" element={<DemoUnitPage />} />
    <Route path="/desenvolvimento/u01/:demoMissionId" element={<DemoMissionPage />} />
    <Route path="/trilhas/:trailSlug" element={<TrailPage />} />
    <Route path="/trilhas/:trailSlug/unidades/:unitSlug" element={<UnitPage />} />
    <Route path="/trilhas/:trailSlug/unidades/:unitSlug/missoes/:missionSlug" element={<MissionPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes></AppLayout>
}
