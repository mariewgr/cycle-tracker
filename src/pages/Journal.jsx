import React, { useState } from 'react'
import { useStore } from '../store.jsx'
import { getCycleInfo, todayISO } from '../cycle.js'
import { getPhysicalEffects } from '../physicalEffects.js'
import DayEditor from '../components/DayEditor.jsx'
import PhaseEffects from '../components/PhaseEffects.jsx'

export default function Journal() {
  const { state } = useStore()
  const today = todayISO()
  const [selectedDate, setSelectedDate] = useState(today)

  const pastDates = Object.keys(state.logs).sort().reverse()
  const info = getCycleInfo(state.periodDays, selectedDate)
  const physicalEffects = info.hasData ? getPhysicalEffects(info.phase) : null

  return (
    <div className="page journal">
      <div className="field">
        <div className="field-label">Date</div>
        <input
          type="date"
          className="date-input"
          value={selectedDate}
          max={today}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <DayEditor date={selectedDate} />

      <PhaseEffects
        title="Symptômes physiques possibles à cette phase"
        intro="Tendances générales observées en moyenne — pas une prédiction individuelle, ça varie beaucoup d'une personne à l'autre."
        effects={physicalEffects}
      />

      <div className="journal-history">
        <div className="field-label">Historique</div>
        {pastDates.length === 0 && <div className="empty-hint">Aucune entrée pour le moment.</div>}
        {pastDates.map((date) => (
          <button
            key={date}
            className={`history-row ${date === selectedDate ? 'history-row-active' : ''}`}
            onClick={() => setSelectedDate(date)}
          >
            <span className="history-date">{formatDate(date)}</span>
            <span className="history-summary">{summarize(state.logs[date])}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function summarize(entry) {
  const parts = []
  if (entry.flow) parts.push(entry.flow)
  if (entry.symptoms?.length) parts.push(`${entry.symptoms.length} symptôme${entry.symptoms.length > 1 ? 's' : ''}`)
  if (entry.mood?.length) parts.push(entry.mood.join(', '))
  return parts.length ? parts.join(' · ') : 'Note'
}

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}
