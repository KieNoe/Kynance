<script setup lang="ts">
import { useData } from 'vitepress';
// 从 VitePress 获取当前页面数据（比如当前是否是暗黑模式）

import DefaultTheme from 'vitepress/theme';
// 引入 VitePress 默认主题（主要为了用它的 Layout）

import { nextTick, provide } from 'vue';
// Vue API：nextTick 是等待 DOM 更新完成，provide 是依赖注入用的

const { isDark } = useData();
// 获取当前是否是暗色模式的响应式引用 isDark

/**
 * 判断是否启用视图切换动画的条件：
 * - 浏览器支持 `startViewTransition` API
 * - 用户没有开启“减少动画”偏好设置（更符合无障碍设计）
 */
const enableTransitions = () =>
  'startViewTransition' in document && window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

/**
 * 提供一个全局注入方法 `toggle-appearance`，用于从外部触发主题切换
 * 参数是鼠标事件，用于确定动画起始的点击位置（x, y）
 */
provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  // 如果当前不支持动画或者用户偏好关闭动画，直接切换 isDark 值
  if (!enableTransitions()) {
    isDark.value = !isDark.value;
    return;
  }

  /**
   * 构建 clip-path 动画路径：
   * - 起始：从点击位置的 0 半径圆开始
   * - 终点：扩展为足以覆盖整个屏幕的圆形
   */
  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x), // x 方向离边界最远距离
      Math.max(y, innerHeight - y), // y 方向离边界最远距离
    )}px at ${x}px ${y}px)`,
  ];

  /**
   * 使用 View Transition API 创建视图切换
   * - 内部异步函数中切换暗黑模式
   * - 等待 DOM 完整更新后再继续动画
   */
  await document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    await nextTick(); // 确保 DOM 更新完成后再做动画
  }).ready;

  /**
   * 使用 Web Animation API 对页面应用动画效果
   * - 动画目标是页面根元素（document.documentElement）
   * - 动画属性是 clipPath 从小圆扩散到大圆（或反之）
   * - 使用 View Transition 伪元素进行动画控制（`::view-transition-old` 或 `new`）
   */
  document.documentElement.animate(
    {
      // 动画路径：如果切换到暗色模式，需要把路径反过来（大 -> 小）
      clipPath: isDark.value ? clipPath.reverse() : clipPath,
    },
    {
      duration: 500, // 动画时长 500ms
      easing: 'ease-in', // 动画曲线为 ease-in（慢慢开始）
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`,
      // 选择使用的虚拟元素（旧的视图 or 新的视图）作为动画应用目标
    },
  );
});
</script>

<template>
  <DefaultTheme.Layout />
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}
</style>
