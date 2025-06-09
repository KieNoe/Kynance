module.exports = {
  root: true, // 表示这是一个根配置文件
  env: {
    browser: true, // 浏览器全局变量
    node: true, // Node.js 全局变量和 Node.js 作用域
    es2021: true, // 启用 ES2021 语法
  },
  parser: "vue-eslint-parser", // 使用 vue-eslint-parser 解析器
  parserOptions: {
    project: './tsconfig.json', // 确保路径正确
    extraFileExtensions: ['.vue'], // ⭐️ 加上这行
    parser: "@typescript-eslint/parser", // 使用 @typescript-eslint/parser 解析 TypeScript
    ecmaVersion: "latest", // 使用最新的 ECMAScript 版本
    sourceType: "module", // 代码使用 ES 模块
    ecmaFeatures: {
      jsx: false, // 不启用 JSX
    },
  },
  plugins: ["vue", "@typescript-eslint", "prettier", "import"], // 使用的插件
  extends: [
    "eslint:recommended", // 使用 ESLint 推荐的规则
    // "plugin:vue/vue3-recommended", // 使用 Vue 3 推荐的规则
    "plugin:@typescript-eslint/recommended", // 使用 TypeScript 推荐的规则
    "plugin:prettier/recommended", // 使用 Prettier 推荐的规则
    "prettier"
  ],
  rules: {
    // 基础规则
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off", // 生产环境中警告 console
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off", // 生产环境中警告 debugger
    "prettier/prettier": "error", // Prettier 格式错误作为错误处理
    "arrow-body-style":"off",//避免与prettier冲突
    "prefer-arrow-callback":"off",

    // TypeScript 规则
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // 忽略未使用变量
    "@typescript-eslint/no-explicit-any": "off", // 允许使用 any 类型
    "@typescript-eslint/explicit-module-boundary-types": "off", // 关闭显式模块边界类型

    // Vue 相关
    "vue/multi-word-component-names": "off", // 关闭多字组件名检查
    "vue/no-v-html": "off", // 允许使用 v-html
   
    // import 排序
    "import/order": [
      "warn",
      {
        groups: [
          "builtin", // 内置模块
          "external", // 外部模块
          "internal", // 内部模块
          ["parent", "sibling", "index"], // 父级、同级和索引模块
        ],
        pathGroups: [
          {
            pattern: "@/**",
            group: "internal",
          },
        ],
        pathGroupsExcludedImportTypes: ["builtin"],
        "newlines-between": "always", // 导入之间总是有新行
      },
    ],
  },
  overrides: [
    {
      files: ["*.ts", "*.vue"],
      parserOptions: {
        project: "./tsconfig.json", // 使用项目的 tsconfig.json
      },
    },
    {
      files: ["*.vue"],
      rules: {
        "@typescript-eslint/no-unused-vars": "off", // 避免 `<script setup>` 的误报
      },
    },
    {
      files: ["*.test.ts", "*.spec.ts"],
      env: {
        jest: true, // 启用 Jest 全局变量
      },
    },
  ],
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json", // 使用项目的 tsconfig.json
      },
    },
  },
};