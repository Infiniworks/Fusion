import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import electron from 'vite-plugin-electron'

const production = !process.env.IS_DEV;

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.IS_DEV !== 'true' ? './' : '',
  build: {
    outDir: 'dist',
  },
  plugins: [
    svelte(),
    {
      name: 'custom-hmr',
      enforce: 'post',
      handleHotUpdate({ file, server }) {
        if (file.endsWith('.svelte')) {
          console.log('reloading svelte file...');
          server.ws.send({
            type: 'full-reload', path: '*' 
          });
        }
      },
    },
    // electron({
    //   main: {
    //     entry: 'electron/index.js',
    //   }
    // }),
  ],
});