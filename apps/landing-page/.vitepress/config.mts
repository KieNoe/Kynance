import { defineConfig } from "vitepress";
import llmstxt from "vitepress-plugin-llms";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Kynance",
  description: "A professional stock data visualization analysis platform",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/docs/markdown-examples" },
    ],

    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/docs/markdown-examples" },
          { text: "Runtime API Examples", link: "/docs/api-examples" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/vuejs/vitepress" }],
  },
  vite: {
    plugins: [
      llmstxt({
        generateLLMsFullTxt: false, //禁用文件的生成llms-full.txt
        ignoreFiles: ["sponsors/*"],
        customLLMsTxtTemplate: `# {title}\n\n{foo}`,
        title: "Kynance",
        customTemplateVariables: {
          foo: "bar",
        }, //使用文件的自定义模板llms.txt
        experimental: {
          depth: 2, // 在根目录和所有第一级子目录中生成llms.txt和文件，每个目录仅包含来自该特定目录及其子目录的文件
        },
      }) as any,
    ],
  },
});
