import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";

// https://vite.dev/config/
export default defineConfig({
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
