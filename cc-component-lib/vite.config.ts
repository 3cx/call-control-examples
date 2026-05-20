import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import tailwind from "tailwindcss";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts", // Specifies the entry point for building the library.
      name: "vite-react-ts-cc", // Sets the name of the generated library.
      fileName: (format) => `index.${format}.js`, // Generates the output file name based on the format.
      formats: ["cjs", "es"], // Specifies the output formats (CommonJS and ES modules).
    },
    rollupOptions: {
      plugins: [
        external(),
        postcss({
          plugins: [tailwind],
          minimize: true,
          extensions: [".css"],
          inject: {
            insertAt: "top",
          },
        }),
      ],
      external: ["react", "react-dom", "tailwindcss"], // Defines external dependencies for Rollup bundling.
      output: {
        globals: {
          tailwindcss: "tailwindcss",
        },
      },
    },
    sourcemap: true, // Generates source maps for debugging.
    emptyOutDir: true, // Clears the output directory before building.
  },
  plugins: [dts(), cssInjectedByJsPlugin()], // Uses the 'vite-plugin-dts' plugin for generating TypeScript declaration files (d.ts).
});
