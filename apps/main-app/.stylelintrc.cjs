module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
    'stylelint-config-prettier',
  ],
  plugins: ['stylelint-order'],
  rules: {
    // 规则示例：禁止空块
    'block-no-empty': true,

    // 属性顺序示例（用 stylelint-order）
    'order/properties-alphabetical-order': true,

    // 禁止重复的属性
    'declaration-block-no-duplicate-properties': true,

    // 颜色使用小写
    'color-hex-case': 'lower',

    // 长度单位限制（例如不允许使用 px 以外的单位）
    // "length-zero-no-unit": true,

    // 根据需要添加更多规则
  },
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
}
