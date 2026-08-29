import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
    const isUmd = mode === 'umd';

    return {
        build: {
            emptyOutDir: !isUmd,
            lib: {
                entry: 'src/index.js',
                name: 'fQuery',
            },
            minify: false,
            outDir: 'dist',
            rolldownOptions: {
                external: isUmd ? [] : ['@fr0st/core'],
                output: isUmd ? [
                    {
                        entryFileNames: 'fquery.js',
                        format: 'umd',
                        minify: false,
                        name: 'fQuery',
                    },
                    {
                        entryFileNames: 'fquery.min.js',
                        format: 'umd',
                        minify: true,
                        name: 'fQuery',
                    },
                ] : [
                    {
                        entryFileNames: 'fquery.esm.js',
                        format: 'es',
                        minify: false,
                    },
                    {
                        entryFileNames: 'fquery.esm.min.js',
                        format: 'es',
                        minify: true,
                    },
                ],
            },
            sourcemap: true,
            target: 'baseline-widely-available',
        },
    };
});
