/* eslint-env node */

import {chrome} from "../../.electron-vendors.cache.json";
import {join} from "path";
import {svelte} from "@sveltejs/vite-plugin-svelte";
import {renderer} from "unplugin-auto-expose";

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      "/@/": join(PACKAGE_ROOT, "src") + "/",
    },
  },
  base: "",
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: "dist",
    assetsDir: ".",
    rollupOptions: {
      input: join(PACKAGE_ROOT, "index.html"),
    },
    emptyOutDir: true,
    brotliSize: false,
  },
  plugins: [
    svelte(),
    renderer.vite({
      preloadEntry: join(PACKAGE_ROOT, "../preload/src/index.ts"),
    }),
  ],
  test: {
    environment: "happy-dom",
  },
};

export default config;
