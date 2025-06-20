// 引入 Node.js 的内置模块 fs（文件系统）和 path（路径处理）
const fs = require('fs');
const path = require('path');

/**
 * 获取指定目录下的所有子目录名称
 * @param {string} base - 相对当前文件的基础目录路径
 * @returns {string[]} 子目录名称数组
 */
function getDirNames(base) {
  return fs
    .readdirSync(path.resolve(__dirname, base), { withFileTypes: true }) // 同步读取目录内容，并包含文件类型信息
    .filter((dirent) => dirent.isDirectory()) // 仅保留目录项
    .map((dirent) => dirent.name); // 提取目录名称
}

// 获取 packages 和 apps 目录下的所有子目录名作为 scope
const packageScopes = getDirNames('packages');
const appScopes = getDirNames('apps');

// 合并所有可用的 scope（用于 commit message 提示）
const scopes = [...packageScopes, ...appScopes];

/**
 * @type {import('cz-git').UserConfig}
 * cz-git 提交规范配置，用于自定义提交信息交互体验
 */
module.exports = {
  // 使用 commitlint 的标准配置（遵循 conventional commit）
  extends: ['@commitlint/config-conventional'],

  // 提交信息交互提示设置
  prompt: {
    scopes, // 自动生成的 scope 列表
    customScopesAlign: 'top-bottom', // 自定义 scope 的位置（上/下）
    allowEmptyIssuePrefixs: false, // 不允许 issue 前缀为空
    allowCustomIssuePrefixs: false, // 不允许自定义 issue 前缀
  },
};
