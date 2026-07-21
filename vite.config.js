import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Chemins relatifs dans le build : dist/index.html fonctionne peu importe
  // le sous-dossier depuis lequel il est servi (ex: Live Server servant tout
  // le dossier du projet, avec dist/ en sous-chemin plutôt qu'à la racine).
  base: './',
  plugins: [tailwindcss()],
});
