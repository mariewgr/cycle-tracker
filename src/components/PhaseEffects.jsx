import React from 'react'

// Affiche une liste d'effets "plutôt favorables" / "plus difficiles" sourcés pour la phase
// de cycle actuelle. Utilisé pour les effets sur le cerveau/l'humeur (Dashboard) et pour les
// symptômes physiques (Journal).
export default function PhaseEffects({ title, intro, effects }) {
  if (!effects || (effects.positive.length === 0 && effects.negative.length === 0)) return null

  return (
    <div className="day-detail">
      <div className="section-title">{title}</div>
      {intro && (
        <p className="empty-hint" style={{ textAlign: 'left', padding: 0 }}>
          {intro}
        </p>
      )}
      {effects.positive.length > 0 && (
        <div className="effect-group effect-positive">
          <div className="effect-group-title">Plutôt favorable</div>
          <ul>
            {effects.positive.map((effect) => (
              <EffectItem key={effect.text} effect={effect} />
            ))}
          </ul>
        </div>
      )}
      {effects.negative.length > 0 && (
        <div className="effect-group effect-negative">
          <div className="effect-group-title">Plus difficile</div>
          <ul>
            {effects.negative.map((effect) => (
              <EffectItem key={effect.text} effect={effect} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function EffectItem({ effect }) {
  return (
    <li>
      {effect.text}
      <a href={effect.url} target="_blank" rel="noopener noreferrer" className="effect-source">
        Source : {effect.source}
      </a>
    </li>
  )
}
