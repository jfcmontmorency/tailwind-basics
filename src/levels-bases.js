// Données de l'étape "Bases" : la liste des niveaux (contenu, classes
// attendues, indices...).

export const levels = [
  {
    topic: "Espacement",
    title: "Margin",
    rules: [
      { syntax: "m-<number>", label: "les marges", docsUrl: "https://tailwindcss.com/docs/margin" }
    ],
    content: "🥷",
    contentClasses: "rounded-lg px-4 py-3 text-4xl text-center bg-secondary inline-flex",
    required: ["m-4"],
    allowExtra: 1,
    hint: "Applique une bonne marge sur tous les côtés."
  },
  {
    topic: "Couleurs",
    title: "Couleur de fond",
    rules: [
      { syntax: "bg-<color>-<shade>", label: "la couleur de fond", docsUrl: "https://tailwindcss.com/docs/background-color" }
    ],
    content: "🥶",
    contentClasses: "rounded-lg px-4 py-3 text-4xl text-center",
    required: ["bg-blue-500"],
    allowExtra: 1,
    hint: "Applique un fond de couleur bleu d'intensité moyenne."
  },
  {
    topic: "Couleurs",
    title: "Couleur du texte",
    rules: [
      { syntax: "bg-<color>-<shade>", label: "la couleur de fond", docsUrl: "https://tailwindcss.com/docs/background-color" },
      { syntax: "text-<color>-<shade>", label: "la couleur du texte", docsUrl: "https://tailwindcss.com/docs/text-color" }
    ],
    content: "Picard",
    contentClasses: "rounded-lg px-4 py-3 font-medium text-black",
    required: ["bg-purple-600", "text-white"],
    allowExtra: 1,
    hint: "Applique une couleur de fond mauve d'intensité moyenne, avec un texte blanc."
  },
  {
    topic: "Typographie",
    title: "Taille du texte",
    rules: [
      { syntax: "text-<size>", label: "la taille du texte", docsUrl: "https://tailwindcss.com/docs/font-size" }
    ],
    content: "Sisko",
    contentClasses: "text-base-content",
    required: ["text-2xl"],
    allowExtra: 1,
    hint: "Applique une taille xx-large."
  },
  {
    topic: "Typographie",
    title: "Graisse du texte",
    rules: [
      { syntax: "text-<size>", label: "la taille du texte", docsUrl: "https://tailwindcss.com/docs/font-size" },
      { syntax: "font-<weight>", label: "la graisse du texte", docsUrl: "https://tailwindcss.com/docs/font-weight" }
    ],
    content: "Janeway",
    contentClasses: "",
    required: ["text-xl", "font-bold"],
    allowExtra: 1,
    hint: "Rends le texte en gras, avec une taille x-large."
  },
  {
    topic: "Bordures",
    title: "Coins arrondis",
    rules: [
      { syntax: "rounded-<size>", label: "les coins arrondis", docsUrl: "https://tailwindcss.com/docs/border-radius" },
      { syntax: "bg-<color>-<shade>", label: "la couleur de fond", docsUrl: "https://tailwindcss.com/docs/background-color" }
    ],
    content: "⛰️",
    contentClasses: "px-5 py-4 text-4xl text-center",
    required: ["rounded-xl", "bg-slate-700"],
    allowExtra: 1,
    hint: "Arrondis bien les coins et applique un fond de couleur gris moyen, aussi appelé « slate » 😉."
  },
  {
    topic: "Bordures",
    title: "Bordure visible",
    rules: [
      { syntax: "border-<width>", label: "l'épaisseur de bordure", docsUrl: "https://tailwindcss.com/docs/border-width" },
      { syntax: "border-<color>-<shade>", label: "la couleur de bordure", docsUrl: "https://tailwindcss.com/docs/border-color" }
    ],
    content: "🧪",
    contentClasses: "dark:bg-white/10 bg-black/10 rounded-lg px-5 py-4 text-4xl text-center",
    required: ["border-5", "border-emerald-500"],
    allowExtra: 1,
    hint: "Ajoute une bordure de couleur verte émeraude."
  },
  {
    topic: "Synthèse",
    title: "Tout combiner",
    rules: [
      { note: "Dernier défi : change la couleur de fond, la couleur du texte, le padding et les coins de cette carte.", label: "Tailwind CSS", docsUrl: "https://tailwindcss.com/docs" }
    ],
    content: "Synthèse 🎉",
    contentClasses: "font-semibold text-black",
    required: ["bg-orange-500", "text-white", "p-6", "rounded-xl"],
    allowExtra: 1,
    hint: "Combine un fond orange, un texte blanc, un padding et des coins arrondis."
  }
];
