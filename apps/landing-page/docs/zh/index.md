---
layout: home
title: Kynance - 专业级量化交易分析平台
hero:
  name: 'Kynance'
  text: '一个专业级的股票数据可视化分析平台'
  tagline: 高性能 · 实时数据 · 策略回测 · 专业分析
  actions:
    - theme: brand
      text: 立即体验
      link: https://www.kynance.cn/app
    - theme: alt
      text: 技术亮点
      link: /technical
    - theme: alt
      text: GitHub
      link: https://github.com/kienoe/kynance

features:
  - title: 📊专业图表分析
    details: 支持多种图表类型，包括K线、折线、柱状图和饼图，提供丰富的技术指标和自定义组合能力。
    link: /feature
    linkText: 了解更多

  - title: ⚡实时数据更新
    details: 通过WebSocket技术实现毫秒级数据更新，确保您始终获取最新市场动态，支持断层数据智能处理。
    link: /feature
    linkText: 了解更多

  - title: 🔍多维度数据分析
    details: 强大的筛选器和对比分析工具，支持跨维度指标比对，鼠标悬停即可查看详细数据信息。
    link: /feature
    linkText: 了解更多

  - title: 🧪策略回测系统
    details: 专业的策略编辑器和回测引擎，支持自定义参数组，提供全面的回测结果可视化分析。
    link: /feature
    linkText: 了解更多

  - title: 📱响应式设计
    details: 完美适配各种设备屏幕，统一使用rem单位实现响应式布局，支持日夜间模式和主题自定义。
    link: /feature
    linkText: 了解更多

  - title: 🚀高性能大数据处理
    details: 采用虚拟渲染技术，流畅展示百万级历史数据，支持离线缓存和快速复现分析结果。
    link: /feature
    linkText: 了解更多
---

<br><br>

# 为什么选择 Kynance?

## 专为专业交易者设计

Kynance 是一款面向专业交易者和量化分析师的高级分析平台，提供全面的市场数据分析和策略回测能力。无论您是日内交易者、摇摆交易者还是长期投资者，Kynance 都能满足您的专业需求。

## 核心优势

<div class="features-grid">
  <div class="feature-card">
    <h3>高性能图表引擎</h3>
    <p>基于WebGL加速的专业图表引擎，支持流畅处理百万级数据点，提供丰富的交互体验。</p>
  </div>

  <div class="feature-card">
    <h3>强大的策略开发环境</h3>
    <p>内置代码编辑器支持语法高亮和智能提示，预设策略模板让您快速开始，安全沙箱确保代码执行安全。</p>
  </div>

  <div class="feature-card">
    <h3>全面的数据分析工具</h3>
    <p>多维度筛选和对比分析工具，支持导出PDF报告，帮助您发现市场机会和优化交易策略。</p>
  </div>

  <div class="feature-card">
    <h3>企业级安全与性能</h3>
    <p>采用最新Web技术栈，确保数据安全和系统稳定性，支持离线功能和大数据处理。</p>
  </div>
</div>

## 适用场景

- **量化交易团队**：共享策略、协作分析、统一管理
- **个人交易者**：技术分析、策略回测、绩效评估
- **投资研究机构**：市场研究、数据挖掘、模型验证
- **金融教育机构**：实战教学、案例分析、模拟交易

## 最新动态

<div class="news-container">
  <div class="news-item">
    <span class="date">2025-09-18</span>
    <h4>Kynance v2.0 即将发布</h4>
    <p>新增AI辅助分析功能，优化大数据处理性能，支持更多技术指标</p>
  </div>

  <div class="news-item">
    <span class="date">2025-08-20</span>
    <h4>Kynance荣获"114514最佳金融科技产品"奖</h4>
    <p>在全球金融科技峰会上，Kynance凭借其创新技术和卓越性能获得行业认可</p>
  </div>

  <div class="news-item">
    <span class="date">2025-06-11</span>
    <h4>Kynance 正式开始制作</h4>
    <p>Kynance 项目正式启动，致力于打造专业级量化交易分析平台</p>
  </div>
</div>

<style>
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 40px 0;
}

.feature-card {
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 24px;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.news-container {
  margin: 15px 0;
}

.news-item {
  padding: 20px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.news-item:last-child {
  border-bottom: none;
}

.news-item .date {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
}

.news-item h4 {
  margin: 8px 0;
}

.news-item a {
  display: inline-block;
  margin-top: 10px;
  font-weight: 500;
  color: var(--vp-c-brand);
}
</style>
