import React from 'react'
import { useStore, updateContraception, togglePillDay } from '../store.jsx'
import { todayISO, addDays } from '../cycle.js'
import { METHODS, getMethod, formatInterval, getRenewalInfo, getPillPackInfo } from '../contraception.js'

export default function Contraception() {
  const { state, dispatch } = useStore()
  const contraception = state.contraception
  const today = todayISO()
  const method = getMethod(contraception.method)

  function selectMethod(key) {
    if (key === contraception.method) return
    const m = getMethod(key)
    updateContraception(dispatch, {
      method: key,
      startDate: m?.kind === 'renewal' || m?.kind === 'daily' ? today : null,
      intervalDays: m?.kind === 'renewal' ? m.defaultIntervalDays : null,
      packType: '21-7',
      takenDays: [],
    })
  }

  return (
    <div className="page contraception">
      <div className="day-detail">
        <div className="section-title">Méthode actuelle</div>
        <div className="chip-row">
          {METHODS.map((m) => (
            <button
              key={m.key}
              className={`chip ${contraception.method === m.key ? 'chip-active' : ''}`}
              onClick={() => selectMethod(m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {!method && (
        <div className="empty-hint">Choisis une méthode ci-dessus pour démarrer le suivi.</div>
      )}

      {method?.kind === 'daily' && (
        <PillTracker state={state} dispatch={dispatch} today={today} />
      )}

      {method?.kind === 'renewal' && (
        <RenewalTracker method={method} contraception={contraception} dispatch={dispatch} today={today} />
      )}

      {method?.kind === 'none' && (
        <div className="empty-hint">Pas de suivi nécessaire pour cette méthode.</div>
      )}
    </div>
  )
}

function PillTracker({ state, dispatch, today }) {
  const contraception = state.contraception
  const takenDays = contraception.takenDays || []
  const takenToday = takenDays.includes(today)
  const packInfo = getPillPackInfo(contraception.startDate, contraception.packType, today)

  const last14Days = Array.from({ length: 14 }, (_, i) => addDays(today, -13 + i))

  return (
    <>
      <div className="day-detail">
        <div className="section-title">Plaquette</div>
        <div className="field">
          <div className="field-label">Début de la plaquette actuelle</div>
          <input
            type="date"
            className="date-input"
            value={contraception.startDate || today}
            max={today}
            onChange={(e) => updateContraception(dispatch, { startDate: e.target.value })}
          />
        </div>
        <div className="chip-row" style={{ marginTop: 10 }}>
          <button
            className={`chip ${contraception.packType === '21-7' ? 'chip-active' : ''}`}
            onClick={() => updateContraception(dispatch, { packType: '21-7' })}
          >
            21 jours + 7 de pause
          </button>
          <button
            className={`chip ${contraception.packType === 'continu' ? 'chip-active' : ''}`}
            onClick={() => updateContraception(dispatch, { packType: 'continu' })}
          >
            Continu (sans pause)
          </button>
        </div>
        <button
          className="btn btn-outline btn-small"
          style={{ marginTop: 10 }}
          onClick={() => updateContraception(dispatch, { startDate: today, takenDays: [] })}
        >
          Commencer une nouvelle plaquette aujourd'hui
        </button>
      </div>

      {packInfo && (
        <div className="info-grid">
          <div className="info-tile">
            <div className="info-tile-value">Jour {packInfo.packDay}</div>
            <div className="info-tile-label">de la plaquette</div>
          </div>
          <div className="info-tile">
            <div className="info-tile-value">{packInfo.isPause ? 'Pause' : 'Active'}</div>
            <div className="info-tile-label">{packInfo.isPause ? 'placebo / arrêt' : 'prise en cours'}</div>
          </div>
        </div>
      )}

      <button
        className={takenToday ? 'btn btn-outline' : 'btn btn-primary'}
        onClick={() => togglePillDay(dispatch, today)}
      >
        {takenToday ? "Retirer : pilule non prise aujourd'hui" : "Pilule prise aujourd'hui"}
      </button>

      <div className="day-detail">
        <div className="section-title">14 derniers jours</div>
        <div className="pill-history-row">
          {last14Days.map((date) => {
            const taken = takenDays.includes(date)
            return (
              <button
                key={date}
                className={`pill-day ${taken ? 'pill-day-taken' : ''} ${date === today ? 'pill-day-today' : ''}`}
                onClick={() => togglePillDay(dispatch, date)}
                title={date}
              >
                {Number(date.slice(-2))}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

function RenewalTracker({ method, contraception, dispatch, today }) {
  const renewal = getRenewalInfo(contraception.startDate, contraception.intervalDays, today)

  return (
    <>
      <div className="day-detail">
        <div className="section-title">Pose / changement</div>
        <div className="field">
          <div className="field-label">Date de pose</div>
          <input
            type="date"
            className="date-input"
            value={contraception.startDate || today}
            max={today}
            onChange={(e) => updateContraception(dispatch, { startDate: e.target.value })}
          />
        </div>
        <div className="field" style={{ marginTop: 10 }}>
          <div className="field-label">Durée avant renouvellement (jours)</div>
          <input
            type="number"
            className="date-input"
            min="1"
            value={contraception.intervalDays || ''}
            onChange={(e) => updateContraception(dispatch, { intervalDays: Number(e.target.value) || null })}
          />
          <p className="empty-hint" style={{ textAlign: 'left', padding: '4px 0 0' }}>
            {formatInterval(contraception.intervalDays)} — ajustable selon ton modèle précis de{' '}
            {method.label.toLowerCase()}.
          </p>
        </div>
        <button
          className="btn btn-outline btn-small"
          style={{ marginTop: 10 }}
          onClick={() => updateContraception(dispatch, { startDate: today })}
        >
          Marquer comme renouvelé aujourd'hui
        </button>
      </div>

      {renewal && (
        <div className={`day-detail renewal-status ${renewal.isOverdue ? 'renewal-overdue' : renewal.isSoon ? 'renewal-soon' : ''}`}>
          <div className="section-title">Prochain renouvellement</div>
          <div className="hero-day" style={{ fontSize: 24 }}>{formatShortDate(renewal.dueDate)}</div>
          <div className="hero-sub">
            {renewal.isOverdue
              ? `En retard de ${Math.abs(renewal.daysUntil)} jour${Math.abs(renewal.daysUntil) > 1 ? 's' : ''}`
              : renewal.daysUntil === 0
                ? "Aujourd'hui"
                : `Dans ${renewal.daysUntil} jour${renewal.daysUntil > 1 ? 's' : ''}`}
          </div>
        </div>
      )}
    </>
  )
}

function formatShortDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
