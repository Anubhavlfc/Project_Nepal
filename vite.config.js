import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// A relative base keeps every asset URL working wherever GitHub Pages serves
// the site (https://<user>.github.io/<repo>/ or a custom domain), with no
// repository name hard-coded. The site is a single page, so there is no
// client-side routing for a relative base to break.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
  },
});
