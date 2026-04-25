#!/bin/bash
set -euo pipefail

echo "=== 服务端部署开始 ==="

if ! command -v docker >/dev/null 2>&1; then
    echo "[1/4] 安装 Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
else
    echo "[1/4] Docker 已安装，跳过"
fi

if ! docker compose version >/dev/null 2>&1; then
    echo "[2/4] 安装 Docker Compose 插件..."
    apt-get update
    apt-get install -y docker-compose-plugin
else
    echo "[2/4] Docker Compose 已安装，跳过"
fi

if grep -q "CHANGE_ME" .env.production; then
    echo "[3/4] 生成生产密钥..."
    jwt_secret=$(openssl rand -hex 32)
    db_password=$(openssl rand -hex 16)

    sed -i "s/CHANGE_ME_use_openssl_rand_hex_32_to_generate/${jwt_secret}/" .env.production
    sed -i "s/CHANGE_ME_use_strong_password_here/${db_password}/g" .env.production

    echo "  已生成新的 JWT_SECRET 和数据库密码"
    echo "  数据库密码: ${db_password}"
    echo "  请妥善保存以上信息"
else
    echo "[3/4] 生产密钥已配置，跳过"
fi

public_http_port=$(grep -E '^PUBLIC_HTTP_PORT=' .env.production | tail -n 1 | cut -d= -f2 || true)
public_http_port=${public_http_port:-28080}
cors_origin=$(grep -E '^CORS_ORIGIN=' .env.production | tail -n 1 | cut -d= -f2- || true)
cors_origin=${cors_origin:-https://your-domain.example}

echo "[4/4] 构建并启动 Docker 容器..."
docker compose --env-file .env.production down 2>/dev/null || true
docker compose --env-file .env.production up -d --build

echo "等待服务启动..."
sleep 10

echo
echo "=== 服务状态 ==="
docker compose --env-file .env.production ps

if command -v ufw >/dev/null 2>&1; then
    ufw allow "${public_http_port}/tcp" 2>/dev/null || true
    ufw allow 22/tcp 2>/dev/null || true
    echo "防火墙已放行 ${public_http_port} 和 22 端口"
fi

echo
echo "=== 部署完成 ==="
echo "本地访问: http://localhost:${public_http_port}"
echo "公网访问: ${cors_origin} (需正确配置 Cloudflare)"
echo
echo "提示: 请确认 Cloudflare DNS 指向当前服务器 IP"
echo "提示: Cloudflare Origin Rules 需要把目标端口改为 ${public_http_port}"
