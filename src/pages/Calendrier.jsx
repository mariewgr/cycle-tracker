import React, { useMemo, useState } from 'react'
import { useStore } from '../store.jsx'
import { getCycleInfo, getMonthGrid, MONTH_NAMES, WEEKDAY_LABELS, todayISO } from '../cycle.js'
import DayEditor from '../components/DayEditor.jsx'

const FLOW_SLUGS = {
  Spotting: 'spotting',
  Léger: 'leger',
  Moyen: 'moyen',
  Abondant: 'abondant',
}

export default function Calendrier() {
  const { state } = useStore()
  const today = todayISO()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState(today)

  const info = useMemo(() => getCycleInfo(state.periodDays, today), [state.periodDays, today])
  const grid = useMemo(() => getMonthGrid(year, month), [year, month])

  function changeMonth(delta) {
    let m = month + delta
    let y = year
    if (m < 0) { m = 11; y -= 1 }
    if (m > 11) { m = 0; y += 1 }
    setMonth(m)
    setYear(y)
  }

  function classesFor(date) {
    const classes = ['day-cell']
    const day = grid.find((d) => d.date === date)
    if (day && !day.inMonth) classes.push('out-month')
    if (date === today) classes.push('today')
    if (date === selectedDate) classes.push('selected')
    if (state.periodDays.includes(date)) {
      const flow = state.logs[date]?.flow
      const slug = flow && FLOW_SLUGS[flow]
      classes.push(slug ? `flow-${slug}` : 'period')
    } else if (info.hasData && date >= info.predictedNextStart && date < addDays(info.predictedNextStart, info.periodLength)) {
      classes.push('predicted-period')
    }
    if (info.hasData && date === info.predictedOvulation) classes.push('ovulation')
    else if (info.hasData && date >= info.fertileWindowStart && date <= info.fertileWindowEnd) classes.push('fertile')
    if (state.logs[date]) classes.push('has-log')
    return classes.join(' ')
  }

  return (
    <div className="page calendrier">
      <div className="month-nav">
        <button className="btn-icon" onClick={() => changeMonth(-1)}>‹</button>
        <div className="month-label">{MONTH_NAMES[month]} {year}</div>
        <button className="btn-icon" onClick={() => changeMonth(1)}>›</button>
      </div>

      <div className="weekday-row">
        {WEEKDAY_LABELS.map((w, i) => (
          <div key={i} className="weekday-label">{w}</div>
        ))}
      </div>

      <div className="month-grid">
        {grid.map((d) => (
          <button
            key={d.date}
            className={classesFor(d.date)}
            onClick={() => setSelectedDate(d.date)}
          >
            {Number(d.date.slice(-2))}
          </button>
        ))}
      </div>

      <div className="legend">
        <LegendItem className="flow-spotting" label="Spotting" />
        <LegendItem className="flow-leger" label="Flux léger" />
        <LegendItem className="flow-moyen" label="Flux moyen" />
        <LegendItem className="flow-abondant" label="Flux abondant" />
        <LegendItem className="predicted-period" label="Règles prévues" />
        <LegendItem className="fertile" label="Fenêtre fertile" />
        <LegendItem className="ovulation" label="Ovulation" />
      </div>

      <div className="day-detail">
        <div className="day-detail-title">{formatLongDate(selectedDate)}</div>
        <DayEditor date={selectedDate} />
      </div>
    </div>
  )
}

function LegendItem({ className, label }) {
  return (
    <div className="legend-item">
      <span className={`legend-swatch ${className}`} />
      <span>{label}</span>
    </div>
  )
}

function addDays(iso, n) {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

function formatLongDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}
