// Utilitaires de dates et logique de prédiction du cycle.

export const DEFAULT_CYCLE_LENGTH = 28
export const DEFAULT_PERIOD_LENGTH = 5
const LUTEAL_PHASE_LENGTH = 14 // relativement constant d'une femme à l'autre, contrairement à la phase folliculaire

export function toISODate(date) {
  const d = date instanceof Date ? date : new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayISO() {
  return toISODate(new Date())
}

export function addDays(isoDate, n) {
  const d = new Date(isoDate + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return toISODate(d)
}

export function diffDays(isoA, isoB) {
  const a = new Date(isoA + 'T00:00:00')
  const b = new Date(isoB + 'T00:00:00')
  return Math.round((a - b) / 86400000)
}

// Regroupe des jours de règles (dates ISO) en "périodes" : suites de jours consécutifs.
export function groupPeriodDays(periodDays) {
  const sorted = [...periodDays].sort()
  const groups = []
  for (const date of sorted) {
    const last = groups[groups.length - 1]
    if (last && diffDays(date, last[last.length - 1]) === 1) {
      last.push(date)
    } else {
      groups.push([date])
    }
  }
  return groups.map((g) => ({ startDate: g[0], endDate: g[g.length - 1], days: g }))
}

function quantile(sortedValues, q) {
  const pos = (sortedValues.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base
  return sortedValues[base + 1] !== undefined
    ? sortedValues[base] + rest * (sortedValues[base + 1] - sortedValues[base])
    : sortedValues[base]
}

// Écarte les valeurs aberrantes (méthode IQR classique) avant une moyenne —
// un mois sans suivi ou un cycle très inhabituel ne doit pas fausser la
// prédiction. En dessous de 4 valeurs, l'IQR n'est pas fiable : on garde tout.
function withoutOutliers(values) {
  if (values.length < 4) return values
  const sorted = [...values].sort((a, b) => a - b)
  const q1 = quantile(sorted, 0.25)
  const q3 = quantile(sorted, 0.75)
  const iqr = q3 - q1
  if (iqr === 0) return values
  const lower = q1 - 1.5 * iqr
  const upper = q3 + 1.5 * iqr
  const filtered = values.filter((v) => v >= lower && v <= upper)
  return filtered.length > 0 ? filtered : values
}

function average(values) {
  return values.reduce((a, b) => a + b, 0) / values.length
}

export function computeAvgCycleLength(periods, maxCycles = 6) {
  if (periods.length < 2) return DEFAULT_CYCLE_LENGTH
  const starts = periods.map((p) => p.startDate).slice(-maxCycles - 1)
  const lengths = []
  for (let i = 1; i < starts.length; i++) {
    lengths.push(diffDays(starts[i], starts[i - 1]))
  }
  if (lengths.length === 0) return DEFAULT_CYCLE_LENGTH
  return Math.round(average(withoutOutliers(lengths)))
}

export function computeAvgPeriodLength(periods, maxCycles = 6) {
  const complete = periods.slice(-maxCycles)
  if (complete.length === 0) return DEFAULT_PERIOD_LENGTH
  const lengths = complete.map((p) => diffDays(p.endDate, p.startDate) + 1)
  return Math.round(average(withoutOutliers(lengths)))
}

export function getCycleLengths(periods, maxCycles = 6) {
  const starts = periods.map((p) => p.startDate).slice(-maxCycles - 1)
  const lengths = []
  for (let i = 1; i < starts.length; i++) {
    lengths.push(diffDays(starts[i], starts[i - 1]))
  }
  return lengths
}

// Calcule toutes les infos dérivées de l'état actuel (jour du cycle, prédictions...).
export function getCycleInfo(periodDays, today = todayISO()) {
  const periods = groupPeriodDays(periodDays)
  if (periods.length === 0) {
    return {
      hasData: false,
      cycleDay: null,
      phase: 'inconnue',
      lastPeriodStart: null,
      cycleLength: DEFAULT_CYCLE_LENGTH,
      periodLength: DEFAULT_PERIOD_LENGTH,
      predictedNextStart: null,
      predictedOvulation: null,
      fertileWindowStart: null,
      fertileWindowEnd: null,
      daysUntilNextPeriod: null,
      isLate: false,
    }
  }

  const cycleLength = computeAvgCycleLength(periods)
  const periodLength = computeAvgPeriodLength(periods)
  const lastPeriod = periods[periods.length - 1]
  const lastPeriodStart = lastPeriod.startDate

  const cycleDay = diffDays(today, lastPeriodStart) + 1
  const predictedNextStart = addDays(lastPeriodStart, cycleLength)
  const predictedOvulation = addDays(predictedNextStart, -LUTEAL_PHASE_LENGTH)
  const fertileWindowStart = addDays(predictedOvulation, -5)
  const fertileWindowEnd = addDays(predictedOvulation, 1)
  const daysUntilNextPeriod = diffDays(predictedNextStart, today)

  let phase = 'folliculaire'
  const isOnPeriod = today >= lastPeriodStart && cycleDay <= periodLength
  if (isOnPeriod) {
    phase = 'règles'
  } else if (today >= fertileWindowStart && today <= fertileWindowEnd) {
    phase = 'fenêtre fertile'
  } else if (today > predictedOvulation) {
    phase = 'lutéale'
  }

  return {
    hasData: true,
    cycleDay,
    phase,
    lastPeriodStart,
    cycleLength,
    periodLength,
    predictedNextStart,
    predictedOvulation,
    fertileWindowStart,
    fertileWindowEnd,
    daysUntilNextPeriod,
    isLate: daysUntilNextPeriod < 0,
  }
}

export const SYMPTOMS = [
  'Crampes',
  'Maux de tête',
  'Fatigue',
  'Ballonnements',
  'Douleurs dos',
  'Nausées',
  'Acné',
  'Seins sensibles',
]

export const MOODS = ['Heureuse', 'Énergique', 'Calme', 'Irritable', 'Anxieuse', 'Triste']

export const FLOW_LEVELS = ['Spotting', 'Léger', 'Moyen', 'Abondant']

export const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

export const WEEKDAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

// Grille de jours pour un mois donné (year, month 0-indexed), alignée sur lundi, 42 cases.
export function getMonthGrid(year, month) {
  const firstOfMonth = new Date(year, month, 1)
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7 // 0 = lundi
  const start = new Date(year, month, 1 - firstWeekday)
  const days = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    days.push({ date: toISODate(d), inMonth: d.getMonth() === month })
  }
  return days
}
