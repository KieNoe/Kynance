#!/bin/bash

# chmod +x scripts/deploy.sh
# === 配置区 ===
MAIN_APP_DIR="apps/main-app"
LANDING_PAGE_DIR="apps/landing-page"
OUTPUT_DIR="dist"
REMOTE_USER="your-user"
REMOTE_HOST="your.server.com"
REMOTE_PATH="/var/www/kynance"
USE_REMOTE_DEPLOY=false  # 设置为 true 开启 SCP 上传部署

# === 脚本开始 ===
set -e  # 遇到错误就退出
echo "🚀 开始部署流程..."

# Step 1: 安装依赖
echo "📦 安装依赖..."
pnpm install

# Step 2: 构建主应用
echo "🔨 构建主应用..."
pnpm --filter main-app build

# Step 3: 构建宣传页
echo "🔨 构建宣传页..."
pnpm --filter landing-page build

# Step 4: 整理构建输出（合并 dist 文件夹）
echo "📁 准备部署文件夹..."
rm -rf deploy-dist
mkdir -p deploy-dist/main-app
mkdir -p deploy-dist/landing-page
cp -r $MAIN_APP_DIR/$OUTPUT_DIR/* deploy-dist/main-app/
cp -r $LANDING_PAGE_DIR/$OUTPUT_DIR/* deploy-dist/landing-page/

# Step 5: 可选远程上传
if [ "$USE_REMOTE_DEPLOY" = true ]; then
  echo "📡 正在上传到远程服务器..."
  rsync -avz deploy-dist/ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"
  echo "✅ 上传完成！部署路径: $REMOTE_PATH"
else
  echo "✅ 本地构建完成，请手动部署 deploy-dist 下的文件。"
fi

echo "🎉 部署流程完成！"
