const fs = require('fs');
const path = require('path');

function getDirNames(base) {
  return fs
    .readdirSync(path.resolve(__dirname, base), { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

const packageScopes = getDirNames('packages');
const appScopes = getDirNames('apps');

const scopes = [...packageScopes, ...appScopes];

/** @type {import('cz-git').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  prompt: {
    scopes,
    customScopesAlign: 'top-bottom',
    allowEmptyIssuePrefixs: false,
    allowCustomIssuePrefixs: false,
  },
  useEmoji: true,
  emojiAlign: "left",
  scopes: ["chart-core", "strategy-engine", "providers", "types","utils"],
  types: [
    { value: "feat", name: "feat:     新功能", emoji: "✨" },
    { value: "fix", name: "fix:      修复 bug", emoji: "🐛" },
    { value: "docs", name: "docs:     文档变更", emoji: "📝" },
    { value: "style", name: "style:    代码格式（不影响功能）", emoji: "💄" },
    { value: "refactor", name: "refactor: 代码重构", emoji: "♻️" },
    { value: "test", name: "test:     添加测试", emoji: "✅" },
    { value: "chore", name: "chore:    构建/工程配置", emoji: "🔧" },
    { value: "revert", name: "revert:   回退提交", emoji: "⏪" },
  ],
};
