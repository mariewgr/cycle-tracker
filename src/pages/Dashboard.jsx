import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, togglePeriodDay } from '../store.jsx'
import { getCycleInfo, todayISO } from '../cycle.js'
import { ARTICLES } from '../resources.js'
import { getMoodEffects } from '../moodEffects.js'
import { getPhysicalEffects } from '../physicalEffects.js'
import { FACTS } from '../facts.js'
import { getPhaseAdvice } from '../phaseAdvice.js'
import PhaseEffects from '../components/PhaseEffects.jsx'
import PhaseAdvice from '../components/PhaseAdvice.jsx'

export default function Dashboard() {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const today = todayISO()
  const info = getCycleInfo(state.periodDays, today)
  const isTodayPeriod = state.periodDays.includes(today)
  const effects = info.hasData ? getMoodEffects(info.phase) : null
  const physicalEffects = info.hasData ? getPhysicalEffects(info.phase) : null
  const advice = info.hasData ? getPhaseAdvice(info.phase) : null

  return (
    <div className="page dashboard">
      <div className="hero-card">
        {info.hasData ? (
          <>
            <div className="hero-day">Jour {info.cycleDay}</div>
            <div className="hero-phase">{capitalize(info.phase)}</div>
            <div className="hero-sub">{nextPeriodMessage(info)}</div>
          </>
        ) : (
          <>
            <div className="hero-phase">Pas encore de données</div>
            <div className="hero-sub">
              Marque le premier jour de tes dernières règles pour démarrer le suivi.
            </div>
          </>
        )}
      </div>

      <button
        className={isTodayPeriod ? 'btn btn-outline' : 'btn btn-primary'}
        onClick={() => togglePeriodDay(dispatch, today)}
      >
        {isTodayPeriod ? "Retirer : aujourd'hui n'est pas un jour de règles" : "Mes règles ont commencé aujourd'hui"}
      </button>

      {info.hasData && (
        <div className="info-grid">
          <InfoTile label="Durée moyenne du cycle" value={`${info.cycleLength} j`} />
          <InfoTile label="Durée moyenne des règles" value={`${info.periodLength} j`} />
          <InfoTile
            label="Ovulation estimée"
            value={formatShortDate(info.predictedOvulation)}
          />
          <InfoTile
            label="Fenêtre de fertilité"
            value={`${formatShortDate(info.fertileWindowStart)} → ${formatShortDate(info.fertileWindowEnd)}`}
          />
        </div>
      )}

      <button className="btn btn-secondary" onClick={() => navigate('/journal')}>
        Ajouter un symptôme aujourd'hui
      </button>

      <PhaseEffects
        title="Effets possibles sur le cerveau et l'humeur"
        intro="Tendances générales observées en moyenne — pas une prédiction individuelle, ça varie beaucoup d'une femme à l'autre."
        effects={effects}
      />

      <PhaseEffects
        title="Symptômes physiques possibles à cette phase"
        intro="Tendances générales observées en moyenne — pas une prédiction individuelle, ça varie beaucoup d'une personne à l'autre."
        effects={physicalEffects}
      />

      <PhaseAdvice advice={advice} />

      <div className="day-detail">
        <div className="section-title">Le sais-tu ?</div>
        <div className="fact-list">
          {FACTS.map((fact) => (
            <div key={fact.text} className="fact-item">
              <p className="fact-text">{fact.text}</p>
              <a href={fact.url} target="_blank" rel="noopener noreferrer" className="fact-source">
                Source : {fact.source}
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="day-detail">
        <div className="section-title">Pour en savoir plus</div>
        <div className="article-list">
          {ARTICLES.map((article) => (
            <a
              key={article.url}
              className="article-link"
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="article-title">{article.title}</div>
              <div className="article-source">{article.source}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

function InfoTile({ label, value }) {
  return (
    <div className="info-tile">
      <div className="info-tile-value">{value}</div>
      <div className="info-tile-label">{label}</div>
    </div>
  )
}

function nextPeriodMessage(info) {
  if (info.phase === 'règles') return 'Tu es dans tes règles.'
  if (info.isLate) {
    const late = Math.abs(info.daysUntilNextPeriod)
    return `Règles en retard de ${late} jour${late > 1 ? 's' : ''}.`
  }
  if (info.daysUntilNextPeriod === 0) return 'Règles prévues aujourd\'hui.'
  return `Règles prévues dans ${info.daysUntilNextPeriod} jour${info.daysUntilNextPeriod > 1 ? 's' : ''}.`
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function formatShortDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}
