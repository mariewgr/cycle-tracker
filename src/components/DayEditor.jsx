import React from 'react'
import { useStore, setLog, togglePeriodDay } from '../store.jsx'
import { FLOW_LEVELS, MOODS, SYMPTOMS } from '../cycle.js'

export default function DayEditor({ date }) {
  const { state, dispatch } = useStore()
  const entry = state.logs[date] || { flow: null, symptoms: [], mood: [], notes: '' }
  const isPeriodDay = state.periodDays.includes(date)

  function update(partial) {
    setLog(dispatch, date, { ...entry, ...partial })
  }

  function toggleItem(list, item) {
    return list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
  }

  return (
    <div className="day-editor">
      <button
        className={isPeriodDay ? 'btn btn-outline btn-small' : 'btn btn-primary btn-small'}
        onClick={() => togglePeriodDay(dispatch, date)}
      >
        {isPeriodDay ? 'Retirer le jour de règles' : 'Marquer comme jour de règles'}
      </button>

      <div className="field">
        <div className="field-label">Flux</div>
        <div className="chip-row">
          {FLOW_LEVELS.map((level) => (
            <button
              key={level}
              className={`chip ${entry.flow === level ? 'chip-active' : ''}`}
              onClick={() => update({ flow: entry.flow === level ? null : level })}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <div className="field-label">Symptômes</div>
        <div className="chip-row">
          {SYMPTOMS.map((symptom) => (
            <button
              key={symptom}
              className={`chip ${entry.symptoms.includes(symptom) ? 'chip-active' : ''}`}
              onClick={() => update({ symptoms: toggleItem(entry.symptoms, symptom) })}
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <div className="field-label">Humeur</div>
        <div className="chip-row">
          {MOODS.map((mood) => (
            <button
              key={mood}
              className={`chip ${entry.mood.includes(mood) ? 'chip-active' : ''}`}
              onClick={() => update({ mood: toggleItem(entry.mood, mood) })}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <div className="field-label">Notes</div>
        <textarea
          className="notes-input"
          value={entry.notes}
          onChange={(e) => update({ notes: e.target.value })}
          placeholder="Ajouter une note..."
          rows={3}
        />
      </div>
    </div>
  )
}
