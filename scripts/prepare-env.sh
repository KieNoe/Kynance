#!/bin/bash

# chmod +x scripts/prepare-env.sh
set -e

echo "🛠️ 正在初始化开发环境..."

# Step 1: 安装 pnpm（如果未安装）
if ! command -v pnpm &> /dev/null
then
    echo "⚠️ pnpm 未安装，正在尝试使用 npm 安装..."
    npm install -g pnpm
fi

# Step 2: 安装根依赖（pnpm workspace）
echo "📦 安装依赖..."
pnpm install

# Step 3: 初始化 Git hooks (husky)
if [ -d ".husky" ]; then
  echo "🔧 初始化 Husky Git Hooks..."
  pnpm husky install
else
  echo "⚠️ 未找到 .husky 目录，跳过 Git Hooks 初始化。"
fi

# Step 4: 初始化 Lerna（如有 bootstrap，首次可用）
if [ -f "lerna.json" ]; then
  echo "📦 使用 Lerna bootstrap 项目..."
  pnpm lerna bootstrap
fi

# Step 5: 构建公共包（例如 utils/chart-core/types）
echo "🔨 构建公共依赖包..."
pnpm --filter "utils" build || true
pnpm --filter "types" build || true
pnpm --filter "chart-core" build || true

# Step 6: 提示环境变量准备情况
if [ -f ".env.example" ]; then
  echo "📋 检查环境变量文件..."
  if [ ! -f ".env" ]; then
    echo "📄 复制 .env.example 为 .env"
    cp .env.example .env
  fi
else
  echo "⚠️ 未找到 .env.example，请手动准备环境变量文件。"
fi

echo "✅ 开发环境准备完成！🎉"
