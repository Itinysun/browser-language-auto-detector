import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
      tsconfigPath: './tsconfig.json',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: format => {
        if (format === 'es') return 'index.js'
        if (format === 'cjs') return 'index.cjs'
        return `index.${format}.js`
      },
    },
    rollupOptions: {
      external: ['@babel/runtime'],
      output: {
        globals: {
          '@babel/runtime': 'BabelRuntime',
        },
      },
    },
    outDir: 'lib',
    emptyOutDir: true,
    sourcemap: true,
  },
})
