import process from "node:process";
import { defineConfig, UserConfig } from "vite";

/**
 * Vite configuration for Streamlit Custom Component v2 development (no React).
 */
export default defineConfig(() => {
  const isProd = process.env.NODE_ENV === "production";
  const isDev = !isProd;

  return {
    base: "./",
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    },
    build: {
      minify: isDev ? false : "oxc",
      outDir: "build",
      sourcemap: isDev,
      lib: {
        entry: "./src/index.ts",
        name: "MyComponent",
        formats: ["es"],
        fileName: "index-[hash]",
      },
      rolldownOptions: {
        output: {
          // One file: the component loads only index-*.js, and deck.gl 9.4 lazy-loads its WebGL adapter.
          inlineDynamicImports: true,
          ...(!isDev && {
            minify: {
              compress: {
                dropConsole: true,
                dropDebugger: true,
              },
            },
          }),
        },
      },
    },
  } satisfies UserConfig;
});


