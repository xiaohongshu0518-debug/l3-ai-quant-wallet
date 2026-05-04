#!/bin/bash
# AWS EC2 初始化脚本 - 在服务器上运行一次
# 使用方法: bash aws-setup.sh

set -e

echo "🚀 开始配置 AWS EC2 服务器..."

# 1. 安装 Docker（如果没装）
if ! command -v docker &> /dev/null; then
    echo "📦 安装 Docker..."
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl gnupg
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    sudo usermod -aG docker $USER
    echo "✅ Docker 安装完成，请重新登录 Shell 使 docker 组生效"
fi

# 2. 创建项目目录
PROJECT_DIR="/home/$USER/l3-ai-quant-wallet"
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# 3. 创建生产环境 .env 文件
if [ ! -f "$PROJECT_DIR/.env" ]; then
    cat > "$PROJECT_DIR/.env" << 'EOF'
# Docker Registry（Docker Hub 用户名）
DOCKER_REGISTRY=your-dockerhub-username

# JWT Secret（请修改为随机字符串）
JWT_SECRET=change-this-to-a-secure-secret-key

# 加密密钥（32字节十六进制）
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef

# 域名（用于 HTTPS）
DOMAIN=your-domain.com
EOF
    echo "✅ 已创建 .env 文件，请编辑 $PROJECT_DIR/.env 填写真实值"
fi

# 4. 拉取代码（需要先在 GitHub 创建 repo）
echo "📥 请输入 GitHub 仓库地址（例如: https://github.com/username/l3-ai-quant-wallet.git）"
read -p "仓库地址: " REPO_URL

if [ ! -d "$PROJECT_DIR/.git" ]; then
    git clone "$REPO_URL" "$PROJECT_DIR"
    cd "$PROJECT_DIR"
    git checkout main || git checkout master
fi

# 5. 登录 Docker Hub
echo "🐳 请登录 Docker Hub..."
docker login

# 6. 首次启动
cd "$PROJECT_DIR"
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

echo "✅ AWS EC2 配置完成！"
echo "📋 接下来请："
echo "   1. 编辑 $PROJECT_DIR/.env 填写真实值"
echo "   2. 在 GitHub 仓库设置 Secrets（见 DEPLOY_GUIDE.md）"
echo "   3. 推送代码触发自动部署"
