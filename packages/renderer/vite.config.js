/* eslint-env node */

import {chrome} from "../../.electron-vendors.cache.json";
import {join} from "path";
import {svelte} from "@sveltejs/vite-plugin-svelte";
import {renderer} from "unplugin-auto-expose";

const PACKAGE_ROOT = __dirname;
const ROOT = join(PACKAGE_ROOT, "src") + "/";
const DOCU_ROOT = PACKAGE_ROOT + "/";

const getPath = (ROOT, path_from_root) => {
  return join(ROOT, path_from_root)+ "/";
};

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      "@/": DOCU_ROOT,
      "$/": ROOT,
      "$lib/": getPath(ROOT, "lib"),
      "$comps/": getPath(ROOT, "components"),
      "$data/": getPath(ROOT, "lib/data"),
      "$imgs/": getPath(DOCU_ROOT, "images"),
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
