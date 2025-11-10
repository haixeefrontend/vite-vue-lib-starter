import { copyFileSync } from 'node:fs'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'

import packageJson from './package.json'

function getPackageName() {
  const { name } = packageJson
  return name
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    dts({
      entryRoot: 'src',
      afterBuild() {
        // Publint requires a .d.cts type definition file
        // https://publint.dev/rules#export_types_invalid_format
        copyFileSync('dist/index.d.ts', 'dist/index.d.cts')
      },
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: getPackageName(),
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    minify: false,
  },
})
