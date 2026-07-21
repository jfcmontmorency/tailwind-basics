# Apprendre Tailwind

Un jeu interactif en français pour apprendre **Tailwind CSS 4**. Chaque niveau présente une carte "cible" à reproduire en écrivant les bonnes classes Tailwind.

![](https://github.com/user-attachments/assets/5ba0d13e-c821-4a44-a00b-e8e40dbfbe85)

## Parcours

Le jeu est découpé en 3 étapes :

1. **Bases** - espacement, couleurs, typographie, bordures
2. **Layout** - Flexbox, Grid, alignement
3. **Responsive** - breakpoints (`sm`/`md`/`lg`/`xl`), avec un vrai `<iframe>` redimensionnable pour observer les media queries en conditions réelles

La progression est sauvegardée dans le `localStorage` du navigateur.

## Stack technique

- [Vite](https://vitejs.dev/) - build tool avec hot reload
- [Tailwind CSS 4](https://tailwindcss.com/) - compilé au build via `@tailwindcss/vite` (pas de JIT au runtime)
- [daisyUI 5](https://daisyui.com/) - composants et thèmes (`light` / `dracula`)

## Développement

```bash
npm install
npm run dev       # serveur de dev avec hot reload
npm run build     # build de production dans dist/
npm run preview   # sert le build de production localement
```

## Licence

[MIT](LICENSE)
