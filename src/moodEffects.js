// Effets rapportés du cycle menstruel sur le cerveau, l'humeur et le bien-être, par phase.
// Sources : synthèse "Le cycle menstruel influe sur le cerveau des femmes", Slate.fr (2018,
// d'après la BBC et les travaux de Pauline Maki, 2002) sur les effets de la fluctuation des
// œstrogènes ; Inserm sur la dysménorrhée et le syndrome prémenstruel ; Manuel MSD sur les
// phases hormonales et le trouble dysphorique prémenstruel ; Sciences pour tous (Université
// Lyon 1) sur le cycle et l'entraînement sportif. Ce sont des tendances générales observées en
// moyenne sur des populations de femmes, pas une prédiction individuelle — les sources elles-
// mêmes mettent en garde contre le fait d'en faire des généralités.
export const BRAIN_MOOD_EFFECTS = {
  règles: {
    positive: [
      {
        text: "Le niveau d'hormones est au plus bas : le corps est généralement plus disposé à bien encaisser un effort physique et à s'adapter à l'entraînement ces jours-là.",
        source: 'Sciences pour tous — Université Lyon 1',
        url: 'https://sciencespourtous.univ-lyon1.fr/mieux-prendre-en-compte-son-cycle-menstruel-sport/',
      },
    ],
    negative: [
      {
        text: 'Anxiété ou irritabilité plus fréquentes avant/pendant les règles pour certaines femmes (pas systématique, varie beaucoup selon les personnes).',
        source: 'Slate.fr',
        url: 'https://www.slate.fr/story/165632/le-cycle-menstruel-influe-sur-le-cerveau-des-femmes',
      },
      {
        text: '90 % des femmes réglées ont des règles douloureuses (dysménorrhée), ce qui pèse aussi sur le moral et la fatigue ressentie ces jours-là.',
        source: 'Inserm',
        url: 'https://presse.inserm.fr/canal-detox/cest-normal-davoir-mal-pendant-les-regles-vraiment/',
      },
    ],
  },
  folliculaire: {
    positive: [
      {
        text: "Conscience de l'espace plus fine juste après les règles (bas niveau d'hormones).",
        source: 'Slate.fr',
        url: 'https://www.slate.fr/story/165632/le-cycle-menstruel-influe-sur-le-cerveau-des-femmes',
      },
      {
        text: "Les œstrogènes remontent progressivement tout au long de cette phase, ce qui accompagne souvent un regain d'énergie et d'humeur.",
        source: 'Manuel MSD',
        url: 'https://www.msdmanuals.com/fr/accueil/probl%C3%A8mes-de-sant%C3%A9-de-la-femme/biologie-de-l-appareil-g%C3%A9nital-f%C3%A9minin/le-cycle-menstruel',
      },
    ],
    negative: [],
  },
  'fenêtre fertile': {
    positive: [
      {
        text: "Imagination, perception, mémoire et habileté sociale dopées par la hausse d'œstrogènes (jours 9-12 du cycle).",
        source: 'Slate.fr',
        url: 'https://www.slate.fr/story/165632/le-cycle-menstruel-influe-sur-le-cerveau-des-femmes',
      },
      {
        text: "Mémoire implicite et aisance verbale accrues au pic d'œstrogènes.",
        source: 'Slate.fr',
        url: 'https://www.slate.fr/story/165632/le-cycle-menstruel-influe-sur-le-cerveau-des-femmes',
      },
      {
        text: 'Libido souvent plus élevée autour de l’ovulation.',
        source: 'Slate.fr',
        url: 'https://www.slate.fr/story/165632/le-cycle-menstruel-influe-sur-le-cerveau-des-femmes',
      },
      {
        text: "L'effet anabolique de la remontée d'œstrogènes pourrait aussi augmenter la force perçue à l'entraînement autour de cette période.",
        source: 'Sciences pour tous — Université Lyon 1',
        url: 'https://sciencespourtous.univ-lyon1.fr/mieux-prendre-en-compte-son-cycle-menstruel-sport/',
      },
    ],
    negative: [
      {
        text: "Repérage dans l'espace moins précis quand le niveau d'hormones est au plus haut.",
        source: 'Slate.fr',
        url: 'https://www.slate.fr/story/165632/le-cycle-menstruel-influe-sur-le-cerveau-des-femmes',
      },
    ],
  },
  lutéale: {
    positive: [
      {
        text: 'Juste après l’ovulation : plus de calme et moins d’anxiété pour certaines.',
        source: 'Slate.fr',
        url: 'https://www.slate.fr/story/165632/le-cycle-menstruel-influe-sur-le-cerveau-des-femmes',
      },
    ],
    negative: [
      {
        text: 'Anxiété, irritabilité ou tristesse plus fréquentes en fin de phase lutéale : c’est le syndrome prémenstruel (SPM), qui toucherait 20 à 40 % des femmes réglées.',
        source: 'Inserm',
        url: 'https://www.inserm.fr/c-est-quoi/payetoncycle-cest-quoi-le-syndrome-premenstruel/',
      },
      {
        text: "Chez 3 à 8 % des femmes, ces symptômes sont sévères et cycliques (dépression, anxiété marquée, troubles du sommeil) : c'est le trouble dysphorique prémenstruel (TDPM), reconnu comme trouble psychiatrique — à signaler à un médecin si c'est le cas.",
        source: 'Manuel MSD',
        url: 'https://www.msdmanuals.com/fr/professional/gyn%C3%A9cologie-et-obst%C3%A9trique/saignement-ut%C3%A9rin-anormal/syndrome-pr%C3%A9menstruel',
      },
    ],
  },
}

export function getMoodEffects(phase) {
  return BRAIN_MOOD_EFFECTS[phase] || null
}
