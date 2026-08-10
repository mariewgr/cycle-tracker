import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase.js'
import { pushState, subscribeToState } from './sync.js'

const STORAGE_KEY = 'cycle-tracker-v1'

const initialState = {
  periodDays: [], // dates ISO marquées comme jours de règles
  logs: {}, // { 'YYYY-MM-DD': { flow, symptoms: [], mood: [], notes } }
  savedAt: null,
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw)
    return { ...initialState, ...parsed }
  } catch {
    return initialState
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_PERIOD_DAY': {
      const { date } = action
      const has = state.periodDays.includes(date)
      const periodDays = has
        ? state.periodDays.filter((d) => d !== date)
        : [...state.periodDays, date]
      return { ...state, periodDays, savedAt: new Date().toISOString() }
    }
    case 'SET_LOG': {
      const { date, entry } = action
      const nextLogs = { ...state.logs }
      const isEmpty =
        !entry.flow && (!entry.symptoms || entry.symptoms.length === 0) &&
        (!entry.mood || entry.mood.length === 0) && !entry.notes
      if (isEmpty) {
        delete nextLogs[date]
      } else {
        nextLogs[date] = entry
      }
      return { ...state, logs: nextLogs, savedAt: new Date().toISOString() }
    }
    case 'IMPORT_HEALTH_ENTRIES': {
      const periodDaysSet = new Set(state.periodDays)
      const nextLogs = { ...state.logs }
      for (const entry of action.entries) {
        if (!entry.date) continue
        periodDaysSet.add(entry.date)
        const existing = nextLogs[entry.date] || { flow: null, symptoms: [], mood: [], notes: '' }
        if (!existing.flow && entry.flow) {
          nextLogs[entry.date] = { ...existing, flow: entry.flow }
        }
      }
      return {
        ...state,
        periodDays: [...periodDaysSet].sort(),
        logs: nextLogs,
        savedAt: new Date().toISOString(),
      }
    }
    case 'IMPORT_HEALTH_SYMPTOMS': {
      const nextLogs = { ...state.logs }
      for (const entry of action.entries) {
        if (!entry.date || !entry.symptoms?.length) continue
        const existing = nextLogs[entry.date] || { flow: null, symptoms: [], mood: [], notes: '' }
        const merged = Array.from(new Set([...(existing.symptoms || []), ...entry.symptoms]))
        nextLogs[entry.date] = { ...existing, symptoms: merged }
      }
      return { ...state, logs: nextLogs, savedAt: new Date().toISOString() }
    }
    case 'RESTORE_BACKUP':
      return {
        ...state,
        periodDays: [...action.periodDays].sort(),
        logs: { ...action.logs },
        savedAt: new Date().toISOString(),
      }
    case 'LOAD_STATE':
      return { ...action.state }
    default:
      return state
  }
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  // Garde le dernier savedAt déjà envoyé/reçu, pour éviter une boucle push ↔ pull.
  const lastSyncedAt = useRef(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setAuthLoading(false)
    })
  }, [])

  // Réception des changements distants (ex. un autre appareil connecté au même compte).
  useEffect(() => {
    if (!user) return
    return subscribeToState(user.uid, (remote) => {
      if (!remote || !remote.savedAt) return
      if (remote.savedAt === lastSyncedAt.current) return
      if (state.savedAt && remote.savedAt <= state.savedAt) return
      lastSyncedAt.current = remote.savedAt
      dispatch({ type: 'LOAD_STATE', state: remote })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // Envoi des changements locaux vers Firestore.
  useEffect(() => {
    if (!user) return
    if (state.savedAt === lastSyncedAt.current) return
    lastSyncedAt.current = state.savedAt
    pushState(user.uid, state)
  }, [user, state])

  return (
    <StoreContext.Provider value={{ state, dispatch, user, authLoading }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore doit être utilisé dans un StoreProvider')
  return ctx
}

export function togglePeriodDay(dispatch, date) {
  dispatch({ type: 'TOGGLE_PERIOD_DAY', date })
}

export function setLog(dispatch, date, entry) {
  dispatch({ type: 'SET_LOG', date, entry })
}

export function importHealthEntries(dispatch, entries) {
  dispatch({ type: 'IMPORT_HEALTH_ENTRIES', entries })
}

export function importHealthSymptoms(dispatch, entries) {
  dispatch({ type: 'IMPORT_HEALTH_SYMPTOMS', entries })
}

export function restoreBackup(dispatch, { periodDays, logs }) {
  dispatch({ type: 'RESTORE_BACKUP', periodDays, logs })
}
