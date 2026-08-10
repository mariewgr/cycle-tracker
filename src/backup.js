import { todayISO } from './cycle.js'

const BACKUP_VERSION = 1

// Exporte les données de l'app (pas un format que l'app Santé sait importer —
// Apple Santé n'a pas de fonction "Importer un fichier", uniquement "Exporter").
// Ce JSON sert de sauvegarde / portabilité pour Mon Cycle lui-même.
export function downloadBackup(state) {
  const payload = {
    app: 'mon-cycle',
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    periodDays: state.periodDays,
    logs: state.logs,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mon-cycle-sauvegarde-${todayISO()}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export async function readBackupFile(file) {
  const text = await file.text()
  const data = JSON.parse(text)
  if (data.app !== 'mon-cycle' || !Array.isArray(data.periodDays) || typeof data.logs !== 'object') {
    throw new Error("Ce fichier ne ressemble pas à une sauvegarde Mon Cycle.")
  }
  return { periodDays: data.periodDays, logs: data.logs }
}
