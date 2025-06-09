English | [简体中文](./README-zh_CN.md)

# Kynance

Kynance is a professional-grade stock data visualization and analysis platform, designed to help users perform in-depth analysis and visualization of stock market data.

## Background

Kynance is a Web platform specifically designed for quantitative strategy development and data visualization analysis. It aims to provide strategy developers, data analysts, and investors with a highly interactive, high-performance, and easily extensible tool for data presentation and strategy validation.

The project adopts a Monorepo architecture, collaboratively built from multiple independent modules, including a chart rendering core library, strategy engine, data provider SDK, utility libraries, etc. The platform emphasizes modular decoupling, performance optimization, and user experience, and supports multilingual internationalization for global accessibility.

## Features

1. Data Visualization

- Multiple chart types supported: line, bar, pie, candlestick (K-line), etc.

- Real-time market updates and multi-dimensional comparative analysis.

- Data filtering, detail inspection, and export (PDF) functionality.

2. User Interaction

- Strategy backtesting and visualized buy/sell point display.

- Chart and indicator combination configuration, with custom template support.

- Interactive operations: zooming, dragging, data pivot analysis.

- Language switching, theme system, and personalization settings.

- Data threshold alerts and push notifications.

3. Performance Optimization

- IndexedDB caches historical data, supporting offline access.

- Web Worker accelerates computation, enhancing UI responsiveness.

- Virtual scrolling and lazy loading optimize large data rendering.

- Delta data update strategy reduces unnecessary refreshes.

## Project Structure

This project adopts a Monorepo structure, containing multiple packages and apps:

- **packages/**: Includes core libraries, strategy engine, type definitions, etc.

- **apps/**: Contains the main application and landing page.

## Installation & Startup

### Usage

- Install dependencies

```sh
pnpm install
```

- Development compilation & hot reload

```sh
pnpm dev
```

- Production build & compression

```sh
pnpm build
```

- Vitest testing

```sh
pnpm test
```

- ESLint check

```sh
pnpm lint
```

# Contributing

Kynance welcomes anyone interested in contributing. If you need to run the code locally or want to contribute, please refer to [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to get involved.

# License

Kynance follows the MIT License. Please see the [LICENSE](./LICENSE) for more information.

# One more thing

Kynance is created by KieNoe, a person who has parted ways with sophisticated tastes.
Thank you for your patience, and have a wonderful day.
