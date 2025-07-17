import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  base: "/streamline/",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [
    vue({
      include: [/\.vue$/],
      template: {
        compilerOptions: {},
      },
    }),

    Components({
      dirs: ["src/components", "src/layouts"],
      extensions: ["vue", "md", "mjs.map"],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.js$/],
    }),
  ],
});
