import { BookOpen, House, Award } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export function ParticipantNavigation() {
  return <nav className="participant-navigation" aria-label="Navegação principal">
    <NavLink end to="/"><House size={23} aria-hidden="true" /><span>Início</span></NavLink>
    <NavLink to="/trilhas"><BookOpen size={23} aria-hidden="true" /><span>Trilhas</span></NavLink>
    <NavLink to="/conquistas"><Award size={23} aria-hidden="true" /><span>Conquistas</span></NavLink>
  </nav>
}
