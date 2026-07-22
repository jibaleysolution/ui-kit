import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [
        vue(),
        dts({
            tsconfigPath: './tsconfig.json',
            outDir: 'dist',
            include: ['src'],
        }),
    ],
    build: {
        lib: {
            entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
            formats: ['es'],
        },
        minify: false,
        rollupOptions: {
            external: ['vue', '@inertiajs/vue3', 'reka-ui', '@lucide/vue'],
            output: {
                preserveModules: true,
                preserveModulesRoot: 'src',
                entryFileNames: '[name].js',
            },
        },
    },
});
