// Données de l'étape "Responsive" : breakpoints sm/md/lg/xl.
// Chaque niveau a un champ `breakpoint` (le seuil "desktop" simulé). Comme un
// vrai media query ne réagit qu'à la largeur RÉELLE du navigateur (pas à la
// largeur d'une petite boîte de preview), l'effet est rendu via un vrai
// <iframe> redimensionnable (voir renderResponsiveIframe() dans main.js).

const CHIP = "w-10 h-10 bg-white text-primary-content rounded flex items-center justify-center text-xs font-bold";

export const levels = [
  {
    topic: "Typographie",
    title: "Taille de texte responsive",
    rules: [
      { syntax: "text-<size>", label: "la taille du texte", docsUrl: "https://tailwindcss.com/docs/font-size" },
      { syntax: "<breakpoint>:text-<size>", label: "Taille de texte responsive", docsUrl: "https://tailwindcss.com/docs/font-size#responsive-design" }
    ],
    content: "Titre",
    contentClasses: "font-bold",
    required: ["text-sm", "md:text-2xl"],
    breakpoint: "md",
    hint: "Le texte est petit par défaut. Il devient 2xl à partir du breakpoint md"
  },
  {
    topic: "Espacement",
    title: "Padding responsive",
    rules: [
      { syntax: "<breakpoint>:p-<number>", label: "Padding responsive", docsUrl: "https://tailwindcss.com/docs/padding#responsive-design" }
    ],
    content: "🍊",
    contentClasses: "bg-white text-white rounded font-medium inline-block text-7xl",
    required: ["p-2", "sm:p-6"],
    breakpoint: "sm",
    hint: "Petit padding par défaut, mais plus généreux à partir du breakpoint sm"
  },
  {
    topic: "Affichage conditionnel",
    title: "Display responsive",
    rules: [
      { syntax: "<breakpoint>:<display>", label: "Display responsive", docsUrl: "https://tailwindcss.com/docs/display#responsive-design" }
    ],
    content: "<div class='flex justify-between items-center'><div><svg height='30' width='30' viewBox='0 0 640 640' xmlns='http://www.w3.org/2000/svg'><path d='m201.4 297.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-137.4-137.4 137.3-137.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z'/></svg></div><div><svg height='40' viewBox='0 0 32 32' width='40' xmlns='http://www.w3.org/2000/svg'><path d='m22.3 8.4c-.8 0-1.4.6-1.4 1.4s.6 1.4 1.4 1.4 1.4-.6 1.4-1.4-.6-1.4-1.4-1.4z'/><path d='m16 10.2c-3.3 0-5.9 2.7-5.9 5.9s2.7 5.9 5.9 5.9 5.9-2.7 5.9-5.9-2.6-5.9-5.9-5.9zm0 9.7c-2.1 0-3.8-1.7-3.8-3.8s1.7-3.8 3.8-3.8 3.8 1.7 3.8 3.8-1.7 3.8-3.8 3.8z'/><path d='m20.8 4h-9.5c-4.1 0-7.3 3.2-7.3 7.2v9.5c0 4 3.2 7.2 7.2 7.2h9.5c4 0 7.2-3.2 7.2-7.2v-9.5c.1-4-3.1-7.2-7.1-7.2zm4.9 16.8c0 2.7-2.2 5-5 5h-9.5c-2.7 0-5-2.2-5-5v-9.5c0-2.7 2.2-5 5-5h9.5c2.7 0 5 2.2 5 5z'/></svg></div><div><svg height='30' width='30' viewBox='0 0 640 640' xmlns='http://www.w3.org/2000/svg'><path d='m96 320c0-30.9 25.1-56 56-56s56 25.1 56 56-25.1 56-56 56-56-25.1-56-56zm168 0c0-30.9 25.1-56 56-56s56 25.1 56 56-25.1 56-56 56-56-25.1-56-56zm224-56c30.9 0 56 25.1 56 56s-25.1 56-56 56-56-25.1-56-56 25.1-56 56-56z'/></svg></div></div>",
    contentClasses: "bg-white text-primary-content rounded px-4 py-2 font-medium",
    required: ["hidden", "md:block"],
    breakpoint: "md",
    hint: "Caché par défaut, mais s'affiche en block à partir du breakpoint md"
  },
  {
    topic: "Layout responsive",
    title: "Direction flex responsive",
    rules: [
      { syntax: "<breakpoint>:flex-<direction>", label: "Direction flex responsive", docsUrl: "https://tailwindcss.com/docs/flex-direction#responsive-design" }
    ],
    children: ["1", "2", "3"],
    childClasses: CHIP,
    contentClasses: "flex gap-2",
    required: ["flex-col", "lg:flex-row"],
    breakpoint: "lg",
    hint: "Flexbox orienté en colonne par défaut, mais se change en ligne à partir du breakpoint lg"
  },
  {
    topic: "Synthèse",
    title: "Tout combiner",
    rules: [
      { syntax: "<breakpoint>:<display>", label: "Display responsive", docsUrl: "https://tailwindcss.com/docs/display#responsive-design" },
      { syntax: "<breakpoint>:grid-cols-<number>", label: "Colonnes de la grille", docsUrl: "https://tailwindcss.com/docs/grid-template-columns#responsive-design" }
    ],
    children: ["1", "2", "3"],
    childClasses: CHIP,
    contentClasses: "gap-2",
    required: ["flex", "sm:block", "lg:grid", "lg:grid-cols-3"],
    breakpoint: "lg",
    hint: "Affichage flex par défaut, puis passe en block à partir de sm, enfin en grille à 3 colonnes à partir de lg."
  }
];
