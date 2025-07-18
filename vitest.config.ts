import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.test.ts'], // 避免根目录直接跑测试
    workspace: ['packages/*', 'apps/*'],
  },
});
