# 🚀 上线部署完整指南

## 一、本地环境（已完成 ✅）

- Rancher Desktop 已安装，Docker 命令可用
- Container Engine: `dockerd (moby)` ✅ 与服务器兼容

---

## 二、GitHub 仓库设置

### 1. 创建 GitHub 仓库

```bash
# 在 GitHub 上创建新仓库，例如: l3-ai-quant-wallet
# 然后本地关联远程仓库

cd C:\Users\44994\Projects\l3-ai-quant-wallet
git remote -v  # 查看当前远程（可能是 Gitee）
git remote add github https://github.com/你的用户名/l3-ai-quant-wallet.git
git push github main
```

### 2. 配置 GitHub Secrets

进入 GitHub 仓库 → Settings → Secrets and variables → Actions → New repository secret

| Secret 名称 | 说明 | 获取方式 |
|---|---|---|
| `DOCKER_USERNAME` | Docker Hub 用户名 | 注册 docker.com |
| `DOCKER_PASSWORD` | Docker Hub 密码/Token | Docker Hub → Account Settings → Security → New Access Token |
| `AWS_EC2_HOST` | AWS EC2 公网 IP | AWS 控制台 |
| `AWS_EC2_USER` | EC2 登录用户名 | 通常是 `ubuntu` |
| `AWS_EC2_SSH_KEY` | EC2 SSH 私钥 | 本地 `.pem` 文件内容 |

---

## 三、AWS EC2 服务器配置

### 1. SSH 连接到服务器

```bash
ssh -i your-key.pem ubuntu@你的EC2公网IP
```

### 2. 在服务器上运行初始化脚本

```bash
# 把 aws-setup.sh 上传到服务器
scp -i your-key.pem aws-setup.sh ubuntu@你的EC2公网IP:~/

# SSH 登录后运行
bash aws-setup.sh
```

### 3. 编辑服务器上的 `.env` 文件

```bash
ssh -i your-key.pem ubuntu@你的EC2公网IP
cd ~/l3-ai-quant-wallet
nano .env  # 填写真实值
```

---

## 四、推送代码触发自动部署

```bash
git add .
git commit -m "feat: add CI/CD pipeline"
git push github main
```

推送后自动触发：
1. GitHub Actions 构建 3 个 Docker 镜像
2. 推送到 Docker Hub
3. SSH 到 AWS EC2 拉取最新镜像
4. 重启服务

---

## 五、常用运维命令

```bash
# SSH 登录服务器查看状态
ssh -i your-key.pem ubuntu@你的EC2公网IP
cd ~/l3-ai-quant-wallet
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f backend

# 手动重启
docker compose -f docker-compose.prod.yml restart

# 更新代码（手动）
git pull origin main
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

---

## 六、Gitee 同步到 GitHub（可选）

如果希望继续用 Gitee 作为主要仓库：

```bash
# 在 Gitee 仓库设置 → WebHook → 添加 GitHub 同步 WebHook
# 或者使用 GitHub Actions 定时同步（需要写额外 workflow）
```

---

## 七、检查清单

- [ ] GitHub 仓库已创建
- [ ] 代码已推送到 GitHub
- [ ] GitHub Secrets 已配置（5个）
- [ ] AWS EC2 已运行 `aws-setup.sh`
- [ ] 服务器 `.env` 已填写真实值
- [ ] Docker Hub 已登录（服务器上）
- [ ] 推送代码测试自动部署
