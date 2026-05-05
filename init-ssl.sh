#!/bin/bash
# SSL 证书初始化脚本 - 在 AWS EC2 上运行一次

set -e

DOMAIN="app.l3aiclaw.com"
EMAIL="your-email@example.com"

echo "🔐 开始初始化 SSL 证书 for $DOMAIN ..."

cd /home/ubuntu/l3-ai-quant-wallet

# 1. 先启动 nginx（HTTP 模式，用于 Let's Encrypt 验证）
echo "📦 启动 nginx（HTTP 模式）..."
docker compose -f docker-compose.prod.yml up -d nginx

# 2. 等待 nginx 启动
sleep 5

# 3. 使用 certbot 获取证书
echo "🔑 获取 SSL 证书..."
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
  --standalone \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email \
  -d $DOMAIN

echo ""
echo "✅ SSL 证书获取成功！"
echo ""
echo "📋 下一步："
echo "   1. 修改 init-ssl.sh 中的 EMAIL 为你的真实邮箱"
echo "   2. 重启所有服务: docker compose -f docker-compose.prod.yml restart"
echo "   3. 访问 https://app.l3aiclaw.com 验证"
echo ""
echo "🔄 证书自动续期（证书有效期 90 天，自动续期）："
echo "   certbot 会自动续期，无需手动操作"
