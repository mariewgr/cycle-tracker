// Symptômes physiques rapportés du cycle menstruel, par phase.
// Sources : Ameli.fr (Assurance Maladie) sur la dysménorrhée, la migraine cataméniale et
// l'anémie par carence en fer ; Manuel MSD (édition grand public) sur le syndrome
// prémenstruel et les douleurs pelviennes/d'ovulation. Ce sont des tendances générales
// observées en moyenne sur des populations de femmes, pas une prédiction individuelle —
// ça varie beaucoup d'une personne à l'autre.
export const PHYSICAL_EFFECTS = {
  règles: {
    positive: [],
    negative: [
      {
        text: 'Crampes (dysménorrhée) : 90 % des femmes réglées de 18 à 49 ans en souffrent, en général dès le premier ou le deuxième jour des règles.',
        source: 'Ameli.fr — Assurance Maladie',
        url: 'https://www.ameli.fr/assure/sante/themes/regles-douloureuses/douleurs-regles',
      },
      {
        text: 'Douleurs dans le bas du dos, souvent associées aux crampes de règles.',
        source: 'Ameli.fr — Assurance Maladie',
        url: 'https://www.ameli.fr/assure/sante/themes/regles-douloureuses/douleurs-regles',
      },
      {
        text: "Maux de tête : la chute brutale des œstrogènes en fin de phase lutéale et en début de règles peut déclencher une migraine dite « cataméniale », de 2 jours avant à 3 jours après le début des règles.",
        source: 'Ameli.fr — Assurance Maladie',
        url: 'https://www.ameli.fr/assure/sante/themes/migraine/symptomes-facteurs-declenchants-evolution',
      },
      {
        text: "Fatigue : les règles sont la cause la plus fréquente de carence en fer chez les femmes réglées, surtout si le flux est abondant — 25 % des femmes non ménopausées en France présentent un déficit en fer.",
        source: 'Ameli.fr — Assurance Maladie',
        url: 'https://www.ameli.fr/assure/sante/themes/anemie-par-carence-en-fer/symptomes-diagnostic',
      },
    ],
  },
  folliculaire: {
    positive: [
      {
        text: "Les symptômes du syndrome prémenstruel (ballonnements, tension mammaire, etc.) disparaissent généralement quelques heures après le début des règles : c'est souvent la phase la plus légère sur le plan physique.",
        source: 'Manuel MSD — édition grand public',
        url: 'https://www.msdmanuals.com/fr/accueil/probl%C3%A8mes-de-sant%C3%A9-de-la-femme/troubles-menstruels-et-saignements-ut%C3%A9rins-anormaux/syndrome-pr%C3%A9menstruel-spm',
      },
    ],
    negative: [],
  },
  'fenêtre fertile': {
    positive: [],
    negative: [
      {
        text: "Crampes ou douleur unilatérale en milieu de cycle (« mittelschmerz »), ressenties du côté de l'ovaire qui libère l'ovule, durant de quelques minutes à quelques heures.",
        source: 'Manuel MSD — édition grand public',
        url: 'https://www.msdmanuals.com/fr/accueil/probl%C3%A8mes-de-sant%C3%A9-de-la-femme/sympt%C3%B4mes-des-maladies-gyn%C3%A9cologiques/douleurs-pelviennes-chez-la-femme',
      },
    ],
  },
  lutéale: {
    positive: [],
    negative: [
      {
        text: 'Ballonnements, gonflement des mains/pieds et prise de poids temporaire par rétention d’eau.',
        source: 'Manuel MSD — édition grand public',
        url: 'https://www.msdmanuals.com/fr/accueil/probl%C3%A8mes-de-sant%C3%A9-de-la-femme/troubles-menstruels-et-saignements-ut%C3%A9rins-anormaux/syndrome-pr%C3%A9menstruel-spm',
      },
      {
        text: 'Seins sensibles, gonflés et douloureux (tension mammaire prémenstruelle).',
        source: 'Manuel MSD — édition grand public',
        url: 'https://www.msdmanuals.com/fr/accueil/probl%C3%A8mes-de-sant%C3%A9-de-la-femme/troubles-menstruels-et-saignements-ut%C3%A9rins-anormaux/syndrome-pr%C3%A9menstruel-spm',
      },
      {
        text: "Poussées d'acné, surtout sur le bas du visage et la mâchoire, dans les jours qui précèdent les règles.",
        source: 'Manuel MSD — édition grand public',
        url: 'https://www.msdmanuals.com/fr/accueil/probl%C3%A8mes-de-sant%C3%A9-de-la-femme/troubles-menstruels-et-saignements-ut%C3%A9rins-anormaux/syndrome-pr%C3%A9menstruel-spm',
      },
      {
        text: 'Maux de tête et parfois nausées, également décrits parmi les symptômes physiques du syndrome prémenstruel.',
        source: 'Manuel MSD — édition grand public',
        url: 'https://www.msdmanuals.com/fr/accueil/probl%C3%A8mes-de-sant%C3%A9-de-la-femme/troubles-menstruels-et-saignements-ut%C3%A9rins-anormaux/syndrome-pr%C3%A9menstruel-spm',
      },
    ],
  },
}

export function getPhysicalEffects(phase) {
  return PHYSICAL_EFFECTS[phase] || null
}
