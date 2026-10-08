// Méthodes de contraception et logique de suivi associée (pilule au quotidien,
// méthodes longue durée avec date de renouvellement).
import { addDays, diffDays } from './cycle.js'

export const METHODS = [
  { key: 'pilule', label: 'Pilule', kind: 'daily' },
  { key: 'patch', label: 'Patch', kind: 'renewal', defaultIntervalDays: 7 },
  { key: 'anneau', label: 'Anneau vaginal', kind: 'renewal', defaultIntervalDays: 21 },
  { key: 'diu-hormonal', label: 'Stérilet hormonal (DIU)', kind: 'renewal', defaultIntervalDays: 365 * 5 },
  { key: 'diu-cuivre', label: 'Stérilet au cuivre (DIU)', kind: 'renewal', defaultIntervalDays: 365 * 5 },
  { key: 'implant', label: 'Implant', kind: 'renewal', defaultIntervalDays: 365 * 3 },
  { key: 'injection', label: 'Injection', kind: 'renewal', defaultIntervalDays: 90 },
  { key: 'preservatif', label: 'Préservatif', kind: 'none' },
  { key: 'aucune', label: 'Aucune', kind: 'none' },
]

export function getMethod(key) {
  return METHODS.find((m) => m.key === key) || null
}

// Convertit un nombre de jours en texte lisible (ex. "≈ 3 ans", "≈ 5 mois", "7 jours").
export function formatInterval(days) {
  if (!days) return ''
  if (days % 365 === 0 && days >= 365) {
    const years = days / 365
    return `≈ ${years} an${years > 1 ? 's' : ''}`
  }
  if (days % 30 === 0 && days >= 60) {
    const months = days / 30
    return `≈ ${months} mois`
  }
  return `${days} jour${days > 1 ? 's' : ''}`
}

// Infos de renouvellement pour les méthodes longue durée (DIU, implant, injection, patch, anneau).
export function getRenewalInfo(startDate, intervalDays, today) {
  if (!startDate || !intervalDays) return null
  const dueDate = addDays(startDate, intervalDays)
  const daysUntil = diffDays(dueDate, today)
  return {
    dueDate,
    daysUntil,
    isOverdue: daysUntil < 0,
    isSoon: daysUntil >= 0 && daysUntil <= 30,
  }
}

// Jour de la plaquette pour la pilule. En continu, compte simplement depuis le début de la
// plaquette. En 21/7, boucle sur 28 jours avec une phase de pause/placebo les 7 derniers jours.
export function getPillPackInfo(startDate, packType, today) {
  if (!startDate) return null
  const daysSinceStart = diffDays(today, startDate)
  if (packType === 'continu') {
    return { packDay: daysSinceStart + 1, isPause: false }
  }
  const cycleLength = 28
  const dayInCycle = ((daysSinceStart % cycleLength) + cycleLength) % cycleLength
  const packDay = dayInCycle + 1
  return { packDay, isPause: packDay > 21 }
}
