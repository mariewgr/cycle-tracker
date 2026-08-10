// Conseils sport/alimentation par phase du cycle, sourcés.
// Sources : Manuel MSD (édition grand public) sur les crampes menstruelles et le syndrome
// prémenstruel ; Ameli.fr (Assurance Maladie) sur les besoins en fer ; Puy de Sciences
// (Université Clermont Auvergne) sur le cycle menstruel et la pratique sportive. Ce sont des
// tendances générales, pas des prescriptions médicales — demande conseil à un professionnel
// de santé pour un suivi personnalisé.
export const PHASE_ADVICE = {
  règles: {
    sport: [
      {
        text: "Une activité physique régulière — même douce — fait partie des mesures qui aident à soulager les crampes de règles, avec un bon sommeil et l'application de chaleur sur le bas-ventre.",
        source: 'Manuel MSD — édition grand public',
        url: 'https://www.msdmanuals.com/fr/accueil/probl%C3%A8mes-de-sant%C3%A9-de-la-femme/troubles-menstruels-et-saignements-ut%C3%A9rins-anormaux/crampes-menstruelles',
      },
    ],
    alimentation: [
      {
        text: "Les règles sont la période où les besoins en fer sont les plus sollicités, surtout si le flux est abondant : privilégier viande, légumineuses et légumes verts, associés à de la vitamine C (agrumes) qui améliore l'absorption du fer.",
        source: 'Ameli.fr — Assurance Maladie',
        url: 'https://www.ameli.fr/assure/sante/themes/anemie-par-carence-en-fer/couvrir-besoins-fer-age',
      },
    ],
  },
  folliculaire: {
    sport: [],
    alimentation: [],
  },
  'fenêtre fertile': {
    sport: [
      {
        text: "La hausse d'œstrogènes autour de l'ovulation aurait un effet anabolique qui pourrait augmenter la force perçue à l'entraînement — mais la recherche manque encore de consensus pour en tirer des recommandations précises selon la phase du cycle.",
        source: 'Puy de Sciences — Université Clermont Auvergne',
        url: 'https://puydesciences.uca.fr/le-media/articles/cycle-menstruel-et-contraception-hormonale-quel-impact-sur-les-sportives',
      },
    ],
    alimentation: [],
  },
  lutéale: {
    sport: [
      {
        text: 'Une activité physique régulière et des activités relaxantes font partie des mesures qui aident à atténuer les symptômes du syndrome prémenstruel.',
        source: 'Manuel MSD — édition grand public',
        url: 'https://www.msdmanuals.com/fr/accueil/probl%C3%A8mes-de-sant%C3%A9-de-la-femme/troubles-menstruels-et-anomalies-du-saignement-vaginal/syndrome-pr%C3%A9menstruel-spm',
      },
    ],
    alimentation: [
      {
        text: 'Réduire le sucre, le sel et la caféine, et privilégier les protéines et les glucides complexes en repas plus légers et plus fréquents peut aider à atténuer les symptômes du SPM.',
        source: 'Manuel MSD — édition grand public',
        url: 'https://www.msdmanuals.com/fr/accueil/probl%C3%A8mes-de-sant%C3%A9-de-la-femme/troubles-menstruels-et-anomalies-du-saignement-vaginal/syndrome-pr%C3%A9menstruel-spm',
      },
      {
        text: 'Une carence en magnésium ou en calcium est soupçonnée dans le SPM ; un supplément de magnésium associé à de la vitamine B6 pourrait aider — mieux vaut en parler avec un professionnel de santé avant de se supplémenter.',
        source: 'Manuel MSD — édition grand public',
        url: 'https://www.msdmanuals.com/fr/accueil/probl%C3%A8mes-de-sant%C3%A9-de-la-femme/troubles-menstruels-et-anomalies-du-saignement-vaginal/syndrome-pr%C3%A9menstruel-spm',
      },
    ],
  },
}

export function getPhaseAdvice(phase) {
  return PHASE_ADVICE[phase] || null
}
