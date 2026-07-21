// Données de l'étape "Layout" : Flexbox, Grid, et un défi de synthèse.
// Contrairement aux niveaux "Bases" (un seul élément à styliser), ces niveaux
// stylisent un CONTENEUR autour de plusieurs "puces" enfants (children), pour
// que les effets flex/grid soient visibles.

const CHIP = "w-10 h-10 bg-secondary text-secondary-content rounded flex items-center justify-center text-xs font-bold";

export const levels = [
  {
    topic: "Flexbox",
    title: "Flexbox",
    rules: [
      { syntax: "flex", label: "l'affichage flex", docsUrl: "https://tailwindcss.com/docs/display" }
    ],
    children: ["1", "2", "3"],
    childClasses: CHIP,
    contentClasses: "",
    required: ["flex"],
    allowExtra: 1,
    hint: "Applique un display flex pour aligner les enfants horizontalement"
  },
  {
    topic: "Flexbox",
    title: "Direction flex",
    rules: [
      { syntax: "flex", label: "l'affichage flex", docsUrl: "https://tailwindcss.com/docs/display" },
      { syntax: "flex-<direction>", label: "la direction flex", docsUrl: "https://tailwindcss.com/docs/flex-direction" }
    ],
    children: ["1", "2", "3"],
    childClasses: CHIP,
    contentClasses: "gap-2",
    required: ["flex", "flex-col"],
    allowExtra: 1,
    hint: "Empile les éléments verticalement avec flex"
  },
  {
    topic: "Flexbox",
    title: "Espacements flex",
    rules: [
      { syntax: "flex", label: "l'affichage flex", docsUrl: "https://tailwindcss.com/docs/display" },
      { syntax: "gap-<number>", label: "l'espacement (gap)", docsUrl: "https://tailwindcss.com/docs/gap" }
    ],
    children: ["1", "2", "3"],
    childClasses: CHIP,
    contentClasses: "",
    required: ["flex", "gap-4"],
    allowExtra: 1,
    hint: "Ajoute flex et de l'espace entre les enfants"
  },
  {
    topic: "Flexbox",
    title: "Justification flex",
    rules: [
      { syntax: "flex", label: "l'affichage flex", docsUrl: "https://tailwindcss.com/docs/display" },
      { syntax: "justify-<value>", label: "la justification", docsUrl: "https://tailwindcss.com/docs/justify-content" }
    ],
    children: ["1", "2", "3"],
    childClasses: CHIP,
    contentClasses: "gap-2",
    required: ["flex", "justify-between"],
    allowExtra: 1,
    hint: "Ajoute flex, puis répartis les éléments sur toute la largeur avec justify-between."
  },
  {
    topic: "Flexbox",
    title: "Alignement flex",
    rules: [
      { syntax: "flex", label: "l'affichage flex", docsUrl: "https://tailwindcss.com/docs/display" },
      { syntax: "items-<value>", label: "l'alignement", docsUrl: "https://tailwindcss.com/docs/align-items" }
    ],
    children: [
      { label: "1", classes: "w-10 h-8 bg-secondary text-secondary-content rounded flex items-center justify-center text-xs font-bold" },
      { label: "2", classes: "w-10 h-12 bg-secondary text-secondary-content rounded flex items-center justify-center text-xs font-bold" },
      { label: "3", classes: "w-10 h-16 bg-secondary text-secondary-content rounded flex items-center justify-center text-xs font-bold" }
    ],
    contentClasses: "gap-2",
    required: ["flex", "items-center"],
    allowExtra: 1,
    hint: "Centre verticalement les enfants"
  },
  {
    topic: "Grid",
    title: "Grille et colonnes",
    rules: [
      { syntax: "grid", label: "l'affichage grid", docsUrl: "https://tailwindcss.com/docs/display" },
      { syntax: "grid-cols-<number>", label: "les colonnes de la grille", docsUrl: "https://tailwindcss.com/docs/grid-template-columns" }
    ],
    children: ["1", "2", "3", "4"],
    childClasses: CHIP,
    contentClasses: "gap-2",
    required: ["grid", "grid-cols-2"],
    allowExtra: 1,
    hint: "Organise les enfants en 2 colonnes"
  },
  {
    topic: "Synthèse",
    title: "Tout combiner",
    rules: [
      { note: "Combine plusieurs classes de layout en même temps sur ce conteneur.", label: "Tailwind CSS", docsUrl: "https://tailwindcss.com/docs" }
    ],
    children: [
      { label: "1", classes: "w-10 h-8 bg-primary text-primary-content rounded flex items-center justify-center text-xs font-bold" },
      { label: "2", classes: "w-10 h-12 bg-primary text-primary-content rounded flex items-center justify-center text-xs font-bold" },
      { label: "3", classes: "w-10 h-16 bg-primary text-primary-content rounded flex items-center justify-center text-xs font-bold" }
    ],
    childClasses: CHIP,
    contentClasses: "gap-2",
    required: ["flex", "justify-around", "items-end"],
    allowExtra: 1,
    hint: "Combine flex, justification et alignement"
  }
];
