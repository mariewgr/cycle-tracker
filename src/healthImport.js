import { unzipSync } from 'fflate'

// Correspondance entre les identifiants HealthKit trouvés dans export.xml
// (Réglages Santé → photo de profil → Exporter toutes les données de santé)
// et les libellés utilisés dans Mon Cycle.
const SYMPTOM_TYPES = {
  HKCategoryTypeIdentifierAbdominalCramps: 'Crampes',
  HKCategoryTypeIdentifierHeadache: 'Maux de tête',
  HKCategoryTypeIdentifierFatigue: 'Fatigue',
  HKCategoryTypeIdentifierBloating: 'Ballonnements',
  HKCategoryTypeIdentifierLowerBackPain: 'Douleurs dos',
  HKCategoryTypeIdentifierNausea: 'Nausées',
  HKCategoryTypeIdentifierAcne: 'Acné',
  HKCategoryTypeIdentifierBreastPain: 'Seins sensibles',
}

// iOS 18 a renommé les valeurs HKCategoryValueMenstrualFlow* en
// HKCategoryValueVaginalBleeding* (même identifiant de type). On gère les deux.
const FLOW_SUFFIX_RE = /(?:MenstrualFlow|VaginalBleeding)(\w+)$/
const FLOW_LABELS = { Light: 'Léger', Medium: 'Moyen', Heavy: 'Abondant' }

// On ne matche que la balise ouvrante : un <Record> peut être soit auto-fermant
// (<Record .../>), soit contenir des <MetadataEntry> enfants (<Record ...>...
// </Record>) — dans les deux cas, tout ce qu'il nous faut (type, date, valeur)
// est dans les attributs de cette balise ouvrante.
const RECORD_RE = /<Record\b[^>]*>/g
const TYPE_RE = /\btype="([^"]*)"/
const START_DATE_RE = /\bstartDate="(\d{4}-\d{2}-\d{2})/
const VALUE_RE = /\bvalue="([^"]*)"/

async function readExportXmlText(file) {
  const name = file.name.toLowerCase()
  if (name.endsWith('.zip')) {
    const buf = new Uint8Array(await file.arrayBuffer())
    const unzipped = unzipSync(buf, {
      filter: (entry) => entry.name.endsWith('export.xml'),
    })
    const xmlBytes = Object.values(unzipped)[0]
    if (!xmlBytes) {
      throw new Error("export.xml introuvable dans l'archive (structure inattendue)")
    }
    return new TextDecoder('utf-8').decode(xmlBytes)
  }
  return file.text()
}

// Extrait les jours de règles (avec flux si connu) et les symptômes depuis
// l'export Apple Santé. Ne charge en mémoire que le texte de export.xml, pas
// un DOM complet — l'export peut faire plusieurs centaines de Mo chez les
// gros utilisateurs d'Apple Watch.
export async function parseAppleHealthExport(file) {
  const xml = await readExportXmlText(file)

  const periodEntries = []
  const symptomsByDate = {}

  RECORD_RE.lastIndex = 0
  let match
  while ((match = RECORD_RE.exec(xml))) {
    const tag = match[0]
    const typeMatch = TYPE_RE.exec(tag)
    if (!typeMatch) continue
    const type = typeMatch[1]

    if (type === 'HKCategoryTypeIdentifierMenstrualFlow') {
      const dateMatch = START_DATE_RE.exec(tag)
      if (!dateMatch) continue
      const valueMatch = VALUE_RE.exec(tag)
      const suffix = valueMatch ? FLOW_SUFFIX_RE.exec(valueMatch[1])?.[1] : null
      // "None" = explicitement pas de flux ce jour-là (pas un jour de règles)
      if (suffix === 'None') continue
      periodEntries.push({ date: dateMatch[1], flow: FLOW_LABELS[suffix] || null })
      continue
    }

    const label = SYMPTOM_TYPES[type]
    if (!label) continue
    const dateMatch = START_DATE_RE.exec(tag)
    if (!dateMatch) continue
    const date = dateMatch[1]
    if (!symptomsByDate[date]) symptomsByDate[date] = []
    if (!symptomsByDate[date].includes(label)) symptomsByDate[date].push(label)
  }

  const symptomEntries = Object.entries(symptomsByDate).map(([date, symptoms]) => ({ date, symptoms }))

  if (periodEntries.length === 0 && symptomEntries.length === 0) {
    throw new Error(
      "Aucune donnée de règles ou de symptôme trouvée dans ce fichier. Vérifie qu'il s'agit bien de l'export Apple Santé (export.xml ou le .zip qui le contient).",
    )
  }

  return { periodEntries, symptomEntries }
}
