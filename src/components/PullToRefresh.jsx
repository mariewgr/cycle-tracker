import React, { useRef, useState } from 'react'

const THRESHOLD = 70
const MAX_PULL = 110

// Tire-pour-actualiser tactile. N'active le suivi que si le conteneur est déjà tout en haut,
// pour ne pas interférer avec un scroll normal vers le bas puis vers le haut.
export default function PullToRefresh({ className, children }) {
  const containerRef = useRef(null)
  const startY = useRef(null)
  const [pull, setPull] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  function handleTouchStart(e) {
    if (refreshing) return
    if (containerRef.current.scrollTop > 0) {
      startY.current = null
      return
    }
    startY.current = e.touches[0].clientY
  }

  function handleTouchMove(e) {
    if (startY.current == null || refreshing) return
    const delta = e.touches[0].clientY - startY.current
    if (delta > 0) {
      setPull(Math.min(delta * 0.5, MAX_PULL))
    }
  }

  function handleTouchEnd() {
    if (startY.current == null || refreshing) return
    startY.current = null
    if (pull >= THRESHOLD) {
      setRefreshing(true)
      setPull(THRESHOLD)
      window.location.reload()
    } else {
      setPull(0)
    }
  }

  return (
    <main
      ref={containerRef}
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="pull-indicator" style={{ height: pull }}>
        {pull > 0 && (refreshing ? 'Actualisation...' : pull >= THRESHOLD ? 'Relâche pour actualiser' : 'Tire pour actualiser')}
      </div>
      {children}
    </main>
  )
}
