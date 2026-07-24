import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwind from '@tailwindcss/vite';

// Dev-only playground. Renders the kit from source (aliased) so edits are live.
// Not part of the published package (excluded by package.json "files").
export default defineConfig({
    root: fileURLToPath(new URL('.', import.meta.url)),
    plugins: [vue(), tailwind()],
    resolve: {
        alias: {
            '@jibaleysolution/ui': fileURLToPath(new URL('../src/index.ts', import.meta.url)),
        },
    },
    server: { port: 6006 },
});
