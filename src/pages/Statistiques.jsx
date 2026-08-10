import React, { useMemo } from 'react'
import { useStore } from '../store.jsx'
import { computeAvgCycleLength, computeAvgPeriodLength, getCycleLengths, groupPeriodDays } from '../cycle.js'

export default function Statistiques() {
  const { state } = useStore()

  const periods = useMemo(() => groupPeriodDays(state.periodDays), [state.periodDays])
  const cycleLengths = useMemo(() => getCycleLengths(periods), [periods])
  const avgCycle = computeAvgCycleLength(periods)
  const avgPeriod = computeAvgPeriodLength(periods)
  const regularity = cycleLengths.length
    ? Math.max(...cycleLengths) - Math.min(...cycleLengths)
    : null

  const { symptomCounts, moodCounts } = useMemo(() => tallyLogs(state.logs), [state.logs])

  if (periods.length === 0) {
    return (
      <div className="page stats">
        <div className="empty-hint">
          Pas encore assez de données. Marque tes jours de règles pour voir apparaître des statistiques.
        </div>
      </div>
    )
  }

  return (
    <div className="page stats">
      <div className="info-grid">
        <StatTile label="Cycle moyen" value={`${avgCycle} j`} />
        <StatTile label="Règles moyennes" value={`${avgPeriod} j`} />
        <StatTile
          label="Régularité"
          value={regularity === null ? '—' : regularity <= 3 ? 'Régulier' : `± ${regularity} j`}
        />
        <StatTile label="Cycles suivis" value={periods.length} />
      </div>

      {cycleLengths.length > 0 && (
        <section className="stats-section">
          <h2>Longueur des derniers cycles</h2>
          <BarChart values={cycleLengths} />
        </section>
      )}

      {Object.keys(symptomCounts).length > 0 && (
        <section className="stats-section">
          <h2>Symptômes les plus fréquents</h2>
          <FrequencyList counts={symptomCounts} />
        </section>
      )}

      {Object.keys(moodCounts).length > 0 && (
        <section className="stats-section">
          <h2>Humeurs les plus fréquentes</h2>
          <FrequencyList counts={moodCounts} />
        </section>
      )}
    </div>
  )
}

function StatTile({ label, value }) {
  return (
    <div className="info-tile">
      <div className="info-tile-value">{value}</div>
      <div className="info-tile-label">{label}</div>
    </div>
  )
}

function BarChart({ values }) {
  const max = Math.max(...values, 1)
  return (
    <div className="bar-chart">
      {values.map((v, i) => (
        <div key={i} className="bar-col">
          <div className="bar" style={{ height: `${(v / max) * 100}%` }} />
          <div className="bar-label">{v}j</div>
        </div>
      ))}
    </div>
  )
}

function FrequencyList({ counts }) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
  const max = entries[0]?.[1] || 1
  return (
    <div className="freq-list">
      {entries.map(([label, count]) => (
        <div key={label} className="freq-row">
          <div className="freq-label">{label}</div>
          <div className="freq-bar-track">
            <div className="freq-bar" style={{ width: `${(count / max) * 100}%` }} />
          </div>
          <div className="freq-count">{count}</div>
        </div>
      ))}
    </div>
  )
}

function tallyLogs(logs) {
  const symptomCounts = {}
  const moodCounts = {}
  for (const entry of Object.values(logs)) {
    for (const s of entry.symptoms || []) symptomCounts[s] = (symptomCounts[s] || 0) + 1
    for (const m of entry.mood || []) moodCounts[m] = (moodCounts[m] || 0) + 1
  }
  return { symptomCounts, moodCounts }
}
