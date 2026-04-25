# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx vite build

# 运行阶段
# 注意：nginx 配置文件位于项目根目录 nginx/default.conf，
# 由于 build context 为 blog-frontend/，无法直接 COPY 上级目录文件，
# 需要在 docker-compose.yml 中通过 volumes 挂载 nginx 配置到 /etc/nginx/conf.d/default.conf
FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]