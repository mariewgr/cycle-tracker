import React, { useRef, useState } from 'react'
import { useStore, importHealthEntries, importHealthSymptoms, restoreBackup } from '../store.jsx'
import { parseAppleHealthExport } from '../healthImport.js'
import { downloadBackup, readBackupFile } from '../backup.js'
import { signIn, signOutUser } from '../sync.js'

export default function Parametres() {
  const { state, dispatch, user, authLoading } = useStore()
  const [healthStatus, setHealthStatus] = useState(null)
  const [healthBusy, setHealthBusy] = useState(false)
  const [backupStatus, setBackupStatus] = useState(null)
  const [syncStatus, setSyncStatus] = useState(null)
  const [syncBusy, setSyncBusy] = useState(false)
  const healthInputRef = useRef(null)
  const backupInputRef = useRef(null)

  async function handleSignIn() {
    setSyncBusy(true)
    setSyncStatus(null)
    try {
      await signIn()
    } catch (err) {
      setSyncStatus({ ok: false, text: err.message || String(err) })
    } finally {
      setSyncBusy(false)
    }
  }

  async function handleSignOut() {
    await signOutUser()
    setSyncStatus(null)
  }

  async function handleHealthFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setHealthBusy(true)
    setHealthStatus(null)
    try {
      const { periodEntries, symptomEntries } = await parseAppleHealthExport(file)
      importHealthEntries(dispatch, periodEntries)
      importHealthSymptoms(dispatch, symptomEntries)
      setHealthStatus({
        ok: true,
        text: `${periodEntries.length} jour(s) de règles et ${symptomEntries.length} jour(s) avec symptômes importés depuis Apple Santé.`,
      })
    } catch (err) {
      setHealthStatus({ ok: false, text: err.message || String(err) })
    } finally {
      setHealthBusy(false)
    }
  }

  function handleDownloadBackup() {
    downloadBackup(state)
    setBackupStatus({ ok: true, text: 'Sauvegarde téléchargée.' })
  }

  async function handleRestoreFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const data = await readBackupFile(file)
      const confirmed = window.confirm(
        `Restaurer cette sauvegarde va remplacer toutes tes données actuelles (${state.periodDays.length} jour(s) de règles enregistrés). Continuer ?`,
      )
      if (!confirmed) return
      restoreBackup(dispatch, data)
      setBackupStatus({ ok: true, text: `Sauvegarde restaurée (${data.periodDays.length} jour(s) de règles).` })
    } catch (err) {
      setBackupStatus({ ok: false, text: err.message || String(err) })
    }
  }

  return (
    <div className="page parametres">
      <div className="day-detail">
        <div className="section-title">Synchronisation</div>
        {authLoading ? (
          <p className="empty-hint" style={{ textAlign: 'left', padding: 0 }}>
            Vérification de la connexion...
          </p>
        ) : user ? (
          <div className="day-editor">
            <p className="empty-hint" style={{ textAlign: 'left', padding: 0 }}>
              Connectée en tant que <strong>{user.email}</strong>. Tes données se synchronisent
              automatiquement entre tous tes appareils connectés à ce compte.
            </p>
            <button className="btn btn-outline" onClick={handleSignOut}>
              Se déconnecter
            </button>
          </div>
        ) : (
          <div className="day-editor">
            <p className="empty-hint" style={{ textAlign: 'left', padding: 0 }}>
              Connecte-toi pour sauvegarder tes données en ligne et les retrouver sur tes autres
              appareils. Sans connexion, tes données restent uniquement sur cet appareil.
            </p>
            <button className="btn btn-primary" disabled={syncBusy} onClick={handleSignIn}>
              {syncBusy ? 'Connexion...' : 'Se connecter avec Google'}
            </button>
            {syncStatus && !syncStatus.ok && (
              <p className="empty-hint" style={{ color: '#c0392b' }}>{syncStatus.text}</p>
            )}
          </div>
        )}
      </div>

      <div className="day-detail">
        <div className="section-title">Importer depuis Apple Santé</div>
        <p className="empty-hint" style={{ textAlign: 'left', padding: 0 }}>
          Sur ton iPhone : app Santé → photo de profil (en haut à droite) → tout en bas,
          <strong> Exporter toutes les données de santé</strong>. Transfère le fichier
          <code> export.zip</code> obtenu sur cet ordinateur (AirDrop, mail, câble...) et
          sélectionne-le ici — pas besoin de le dézipper au préalable.
        </p>
        <div className="day-editor">
          <button
            className="btn btn-primary"
            disabled={healthBusy}
            onClick={() => healthInputRef.current?.click()}
          >
            {healthBusy ? 'Lecture du fichier...' : 'Choisir le fichier Apple Santé (.zip ou .xml)'}
          </button>
          <input
            ref={healthInputRef}
            type="file"
            accept=".zip,.xml,application/zip,text/xml"
            style={{ display: 'none' }}
            onChange={handleHealthFile}
          />
          {healthStatus && (
            <p className="empty-hint" style={{ color: healthStatus.ok ? 'inherit' : '#c0392b' }}>
              {healthStatus.text}
            </p>
          )}
        </div>
      </div>

      <div className="day-detail">
        <div className="section-title">Sauvegarder / restaurer</div>
        <p className="empty-hint" style={{ textAlign: 'left', padding: 0 }}>
          Ce fichier est une sauvegarde de tes données Mon Cycle (pas un format que l'app
          Santé sait réimporter — Apple ne propose pas d'import de fichier dans Santé).
          Utile pour changer d'appareil ou de navigateur.
        </p>
        <div className="day-editor">
          <button className="btn btn-secondary" onClick={handleDownloadBackup}>
            Télécharger une sauvegarde (.json)
          </button>
          <button className="btn btn-outline" onClick={() => backupInputRef.current?.click()}>
            Restaurer une sauvegarde
          </button>
          <input
            ref={backupInputRef}
            type="file"
            accept=".json,application/json"
            style={{ display: 'none' }}
            onChange={handleRestoreFile}
          />
          {backupStatus && (
            <p className="empty-hint" style={{ color: backupStatus.ok ? 'inherit' : '#c0392b' }}>
              {backupStatus.text}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
