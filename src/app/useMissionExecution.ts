import { useReducer } from 'react'
import { createExecution, reduceExecution } from '../domain/missions/execution'
import type { ExecutionAction, ExecutionState, MissionDefinition } from '../domain/missions/types'

/** O componente proprietário deve ser remontado quando a definição mudar. */
export function useMissionExecution(definition: MissionDefinition) {
  return useReducer((state: ExecutionState, action: ExecutionAction) => reduceExecution(state, action, definition), definition, createExecution)
}
