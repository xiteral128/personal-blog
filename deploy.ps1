# ============================================
# 个人博客一键部署脚本
# 使用方法：在 PowerShell 中运行 .\deploy.ps1
# ============================================

# 设置工作目录为脚本所在目录
Set-Location $PSScriptRoot

# 服务器配置
$SERVER = "172.245.114.162"
$USER = "root"
$REMOTE_DIR = "/opt/blog"
$DOMAIN = "cli.cnmnimasile.asia"
$TAR_FILE = "blog-deploy.tar.gz"

# 提示输入 SSH 密码
$PASSWORD = Read-Host "请输入服务器 SSH 密码（$USER@$SERVER）" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($PASSWORD)
$PLAIN_PASSWORD = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  博客一键部署 -> $SERVER" -ForegroundColor Cyan
Write-Host "  域名: $DOMAIN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ---- 第 1 步：本地打包 ----
Write-Host "[1/4] 正在打包项目文件（排除 node_modules、dist、.git）..." -ForegroundColor Yellow

# 清理旧的压缩包
if (Test-Path $TAR_FILE) {
    Remove-Item $TAR_FILE -Force
}

tar -czf $TAR_FILE `
    --exclude="node_modules" `
    --exclude=".git" `
    --exclude="blog-frontend/dist" `
    blog-backend `
    blog-frontend `
    database `
    nginx `
    docker-compose.yml `
    .env.production `
    deploy-server.sh

if ($LASTEXITCODE -ne 0) {
    Write-Host "[错误] 打包失败，请检查 tar 命令是否可用。" -ForegroundColor Red
    exit 1
}

$fileSize = [math]::Round((Get-Item $TAR_FILE).Length / 1MB, 2)
Write-Host "[1/4] 打包完成，文件大小: ${fileSize} MB" -ForegroundColor Green

# ---- 第 2 步：在远程服务器创建目录 ----
Write-Host "[2/4] 在远程服务器创建部署目录..." -ForegroundColor Yellow

ssh "${USER}@${SERVER}" "mkdir -p ${REMOTE_DIR}"

if ($LASTEXITCODE -ne 0) {
    Write-Host "[错误] 无法连接到远程服务器，请检查 SSH 连接和密码。" -ForegroundColor Red
    exit 1
}

Write-Host "[2/4] 远程目录已就绪: ${REMOTE_DIR}" -ForegroundColor Green

# ---- 第 3 步：上传压缩包 ----
Write-Host "[3/4] 正在上传压缩包到服务器（${fileSize} MB）..." -ForegroundColor Yellow

scp $TAR_FILE "${USER}@${SERVER}:${REMOTE_DIR}/"

if ($LASTEXITCODE -ne 0) {
    Write-Host "[错误] 文件上传失败，请检查网络连接。" -ForegroundColor Red
    exit 1
}

Write-Host "[3/4] 上传完成！" -ForegroundColor Green

# ---- 第 4 步：远程解压并执行部署 ----
Write-Host "[4/4] 在远程服务器上解压并执行部署脚本..." -ForegroundColor Yellow

ssh "${USER}@${SERVER}" "cd ${REMOTE_DIR} && tar -xzf ${TAR_FILE} && chmod +x deploy-server.sh && bash deploy-server.sh"

if ($LASTEXITCODE -ne 0) {
    Write-Host "[错误] 远程部署执行失败，请登录服务器查看日志。" -ForegroundColor Red
    exit 1
}

# ---- 清理本地临时文件 ----
Write-Host ""
Write-Host "正在清理本地临时文件..." -ForegroundColor Gray
if (Test-Path $TAR_FILE) {
    Remove-Item $TAR_FILE -Force
}

# ---- 部署完成 ----
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  部署成功！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "访问地址:" -ForegroundColor Cyan
Write-Host "  公网: https://${DOMAIN}" -ForegroundColor White
Write-Host "  直连: http://${SERVER}:8080" -ForegroundColor White
Write-Host ""
Write-Host "提示:" -ForegroundColor Yellow
Write-Host "  - 请确保 Cloudflare DNS A 记录指向 ${SERVER}" -ForegroundColor Gray
Write-Host "  - Cloudflare SSL 模式建议设为 Flexible" -ForegroundColor Gray
Write-Host "  - 首次部署后数据库密码会自动生成，请在服务器 ${REMOTE_DIR}/.env.production 中查看" -ForegroundColor Gray
Write-Host ""
