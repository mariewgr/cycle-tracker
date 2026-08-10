import React from 'react'

// Affiche des conseils sport/alimentation sourcés pour la phase de cycle actuelle.
export default function PhaseAdvice({ advice }) {
  if (!advice || (advice.sport.length === 0 && advice.alimentation.length === 0)) return null

  return (
    <div className="day-detail">
      <div className="section-title">Conseils pour cette phase</div>
      {advice.sport.length > 0 && (
        <div className="advice-group">
          <div className="advice-group-title">Sport</div>
          <div className="fact-list">
            {advice.sport.map((item) => (
              <AdviceItem key={item.text} item={item} />
            ))}
          </div>
        </div>
      )}
      {advice.alimentation.length > 0 && (
        <div className="advice-group">
          <div className="advice-group-title">Alimentation</div>
          <div className="fact-list">
            {advice.alimentation.map((item) => (
              <AdviceItem key={item.text} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function AdviceItem({ item }) {
  return (
    <div className="fact-item">
      <p className="fact-text">{item.text}</p>
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="fact-source">
        Source : {item.source}
      </a>
    </div>
  )
}
