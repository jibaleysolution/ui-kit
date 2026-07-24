import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwind from '@tailwindcss/vite';

// Playground: renders the kit from source (aliased) so edits are live in dev,
// and builds to a static site for GitHub Pages. Not part of the published npm
// package (excluded by package.json "files").
export default defineConfig({
    root: fileURLToPath(new URL('.', import.meta.url)),
    // Relative base so the built site works under a project-pages subpath
    // (jibaleysolution.github.io/ui-kit/) and locally alike.
    base: './',
    plugins: [vue(), tailwind()],
    resolve: {
        alias: {
            '@jibaleysolution/ui': fileURLToPath(new URL('../src/index.ts', import.meta.url)),
        },
    },
    server: { port: 6006 },
    build: {
        outDir: fileURLToPath(new URL('../dist-play', import.meta.url)),
        emptyOutDir: true,
    },
});
