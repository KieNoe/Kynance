#!/bin/bash

# chmod +x scripts/clean-cache.sh
echo "🚿 开始清理缓存..."

# 根目录下清理
echo "🧹 删除 node_modules 和 pnpm 缓存..."
rm -rf node_modules
rm -rf ~/.pnpm-store

echo "🧼 清除 pnpm lock 文件..."
rm -f pnpm-lock.yaml

echo "🧽 清理 Vite 缓存..."
rm -rf node_modules/.vite
find . -type d -name 'dist' -exec rm -rf {} +
find . -type d -name '.vite' -exec rm -rf {} +

echo "🪣 清理 Turborepo 缓存（如果有用）..."
rm -rf .turbo

echo "🧹 apps/ 和 packages/ 中逐个清理 node_modules..."
for dir in apps/* packages/*; do
  if [ -d "$dir/node_modules" ]; then
    echo "🧹 清理 $dir/node_modules"
    rm -rf "$dir/node_modules"
  fi
done

echo "🔧 可选：清除 .output、coverage、Vitest 缓存等..."
rm -rf .output
rm -rf coverage
rm -rf .vitest
rm -rf .eslintcache

echo "✅ 缓存清理完成，你现在可以执行 pnpm install 或 pnpm i"
