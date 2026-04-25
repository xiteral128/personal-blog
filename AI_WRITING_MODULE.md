# AI 写作中心模块记录

本文档记录个人博客新增的 AI 写作中心 V1 设计、接口、权限模型和本次代码变化。文档只记录公开设计与开发变更，不记录任何 API Key、后台密码、Cloudflare Token 或服务器密钥。

## 目标

AI 写作中心让多个 AI Agent 使用独立 API Key 为博客创作和排版 Markdown 文章。模块把 Agent 分成两种工作模式：

| 模式 | 说明 |
| --- | --- |
| AI 全权负责 | Agent 可以创建、更新并发布自己创建的文章 |
| 人类拍板 | Agent 只能提交 AI 待审核文章，最终由管理员在后台通过、发布或驳回 |

核心原则：

- AI 可以负责创作、摘要、分类选择和 Markdown 排版。
- 管理员可以在后台统一管理 Agent Key。
- 数据库只保存 API Key 哈希，明文 Key 只在创建时展示一次。
- AI 默认只能操作自己创建的文章，不能管理后台账号、系统配置或密钥。

## 权限模型

V1 不设计复杂 scope，只使用 `mode` 字段控制 Agent 能力。

| 能力 | AI 全权负责 | 人类拍板 |
| --- | --- | --- |
| 创建文章 | 可以 | 可以 |
| 更新自己创建的文章 | 可以 | 可以 |
| 读取分类/标签 | 可以 | 可以 |
| 直接发布 | 可以 | 不可以 |
| 进入待审核 | 可以 | 强制 |
| 修改人类文章 | 不可以 | 不可以 |
| 管理 API Key | 不可以 | 不可以 |

文章状态：

| status | 含义 |
| --- | --- |
| 0 | 普通草稿 |
| 1 | 已发布 |
| 2 | AI 待审核 |
| 3 | AI 已驳回 |

## 数据库变化

新增迁移：

```text
database/migrations/004_ai_writing_module.sql
```

新增表：

```text
ai_api_keys
```

关键字段：

- `name`：Agent 名称
- `key_prefix`：密钥前缀，后台展示用
- `key_hash`：API Key 的 SHA-256 哈希
- `mode`：`autonomous` 或 `review`
- `enabled`：是否启用
- `daily_limit`：每日创建文章上限
- `last_used_at` / `last_used_ip`：最近调用记录
- `expires_at` / `revoked_at`：过期和吊销信息

扩展 `articles` 表字段：

- `source`：`manual` 或 `ai`
- `ai_key_id`：创建文章的 AI Key ID
- `review_status`：`pending` / `approved` / `rejected`
- `review_note`：审核备注
- `reviewed_by` / `reviewed_at`：审核管理员和时间

## 后端接口

AI Agent 接口：

```http
GET  /api/v1/ai/meta
POST /api/v1/ai/articles
GET  /api/v1/ai/articles/:id
PUT  /api/v1/ai/articles/:id
```

认证方式：

```http
Authorization: Bearer blog_ai_xxx
```

创建文章示例：

```json
{
  "title": "文章标题",
  "summary": "文章摘要",
  "content": "## Markdown 正文",
  "category_id": 2,
  "status": 1
}
```

后台管理接口：

```http
GET   /api/v1/admin/ai/keys
POST  /api/v1/admin/ai/keys
PATCH /api/v1/admin/ai/keys/:id/rotate
PATCH /api/v1/admin/ai/keys/:id/revoke
GET   /api/v1/admin/ai/drafts
POST  /api/v1/admin/ai/drafts/:id/approve
POST  /api/v1/admin/ai/drafts/:id/reject
GET   /api/v1/admin/articles/:id
```

`GET /api/v1/admin/articles/:id` 用于后台读取任意状态文章，解决 AI 待审核文章无法进入编辑器排版的问题。

## 前端后台变化

新增后台菜单：

```text
AI 写作
```

页面路径：

```text
/admin/ai-writing
```

页面能力：

- 创建新的 Agent API Key。
- 选择模式：AI 全权负责 / 人类拍板。
- 设置每日创建上限。
- 查看 Key 前缀、模式、状态和最近使用时间。
- 重置已有 Agent Key，并一次性显示新的完整 API Key。
- 吊销 Key。
- 查看 AI 草稿箱。
- 编辑 AI 文章排版。
- 通过为普通草稿。
- 通过并发布。
- 驳回 AI 草稿。

## 本次代码变化

后端新增：

- `blog-backend/src/routes/ai.ts`
- `blog-backend/src/controllers/aiWritingController.ts`
- `blog-backend/src/modules/aiWriting/repository.ts`
- `blog-backend/src/modules/aiWriting/service.ts`
- `blog-backend/src/shared/middleware/aiAuth.ts`

后端修改：

- `blog-backend/src/app.ts`：挂载 `/api/v1/ai`
- `blog-backend/src/routes/admin.ts`：增加 AI 写作后台接口和管理员文章详情接口
- `blog-backend/src/controllers/articleController.ts`：增加管理员读取任意文章详情
- `blog-backend/src/modules/article/repository.ts`：支持 AI 来源字段和后台文章详情查询
- `blog-backend/src/modules/article/service.ts`：更新文章时保留原状态，避免 AI 待审核稿被误发布
- `blog-backend/src/shared/types/express.d.ts`：增加 `req.aiKey`

前端新增：

- `blog-frontend/src/views/admin/AiWriting.vue`

前端修改：

- `blog-frontend/src/api/admin.ts`：增加 AI 写作后台 API
- `blog-frontend/src/api/article.ts`：补充 AI 文章元数据字段
- `blog-frontend/src/router/index.ts`：增加 AI 写作路由
- `blog-frontend/src/layout/AdminLayout.vue`：增加 AI 写作菜单
- `blog-frontend/src/views/admin/ArticleEdit.vue`：改用后台文章详情接口，并支持编辑文章状态

## 验证记录

本地已执行：

```bash
cd blog-backend
npm run build

cd ../blog-frontend
npm run build
```

结果：

- 后端 TypeScript 构建通过。
- 前端类型检查和 Vite 构建通过。
- 前端仍有大 chunk 警告，这是现有编辑器和图表依赖导致的构建提示，不影响发布。

## 本次执行记录

执行日期：2026-04-25

本次围绕“AI 写作中心 V1”完成了以下工作：

- 设计并实现独立的 AI 写作 API 模块。
- 新增后台 AI 写作页面，用于创建、查看和吊销 Agent API Key。
- 新增 AI 待审核草稿箱，支持管理员编辑排版后通过、发布或驳回。
- 新增数据库迁移，保存 AI Key 哈希、Agent 模式、文章来源和审核状态。
- 将 API Key 设计为只显示一次，数据库只保存 SHA-256 哈希。
- 清理 `reset-pwd.ts` 中的硬编码密码逻辑，改为从环境变量读取。
- 更新 README，记录公网博客地址、项目架构、Docker 部署方式和 AI 写作中心入口。
- 执行后端构建、前端构建、数据库迁移幂等性检查、本地 Docker 重建和接口流转验证。
- 执行敏感信息扫描，确认仓库代码和文档中没有写入后台密码、Cloudflare Token、服务器登录密码或明文 AI API Key。

本次不会提交以下内容：

- `.env.production`
- 后台管理员密码
- Cloudflare API Token
- 服务器 SSH 私钥或登录密码
- 任何完整 AI API Key 明文

## 公网部署记录

部署日期：2026-04-25

已执行：

- 将代码提交并推送到 GitHub `main` 分支。
- 在服务器仓库目录执行 `git pull --ff-only origin main`。
- 使用生产环境 `.env.production` 执行 Docker Compose 重建和滚动启动。
- 迁移服务已执行 `004_ai_writing_module.sql`。
- 服务状态检查通过：backend、nginx、mysql、redis、qdrant 均处于运行状态。
- 公网首页访问验证通过：`https://blog.cnmnimasile.asia/` 返回 200。
- 后台 AI 写作页面访问验证通过：`https://blog.cnmnimasile.asia/admin/ai-writing` 返回 200。
- AI API 未携带 Key 访问验证通过：`/api/v1/ai/meta` 返回 401，说明 AI API 已上线且默认受鉴权保护。

## V2 迭代记录

执行日期：2026-04-25

本次围绕“AI 写作中心 V2”完成以下能力：

| 能力 | 说明 |
| --- | --- |
| AI 调用日志 | 记录 Agent 调用 AI 写作 API 的接口、状态码、耗时、请求体大小、IP、User-Agent 和 TraceId |
| 文章版本历史 | 后台保存文章更新前快照，AI 更新和人工保存都会形成可回滚版本 |
| 版本恢复 | 管理员可在文章编辑页查看历史版本，并一键恢复；恢复前也会保存当前版本 |
| 代码高亮 | 文章详情页使用 `highlight.js` 渲染 Markdown fenced code block，支持 Rust、TS、JS、Shell、SQL 等常用语言 |
| SEO | 文章详情页动态写入 title、description、Canonical、Open Graph、Twitter Card 和 BlogPosting JSON-LD |

新增迁移：

```text
database/migrations/005_ai_writing_v2_logs_versions.sql
```

新增表：

```text
ai_call_logs
article_versions
```

新增/扩展后台接口：

```http
GET  /api/v1/admin/ai/calls
GET  /api/v1/admin/articles/:id/versions
POST /api/v1/admin/articles/:id/versions/:versionId/restore
```

本次后端变化：

- 新增 `aiCallLogMiddleware`，记录 AI API 调用日志；中间件位于 AI Key 鉴权前，可记录 401 调用。
- AI 写作仓库和服务层新增调用日志写入与后台查询。
- 文章仓库和服务层新增版本快照、版本列表和版本恢复。
- 管理员路由新增 AI 调用日志接口和文章版本接口。

本次前端变化：

- `AI 写作中心` 页面新增 AI 调用日志表格。
- `文章编辑页` 新增版本历史面板和恢复按钮。
- `文章详情页` 新增 `highlight.js` 代码块高亮。
- `文章详情页` 新增动态 SEO 元信息和结构化数据。
- `index.html` 默认语言改为 `zh-CN`，并设置站点级 description 和 title。

本次不会提交以下内容：

- `.env.production`
- 后台管理员密码
- Cloudflare API Token
- 服务器 SSH 私钥或登录密码
- 任何完整 AI API Key 明文

V2 本地验证：

```bash
cd blog-backend
npm run build

cd ../blog-frontend
npm run build
```

结果：

- 后端 TypeScript 构建通过。
- 前端类型检查和 Vite 构建通过。
- 前端仍有大 chunk 警告，这是现有编辑器、图表和管理后台依赖导致的构建提示，不影响发布。

## V2 公网部署记录

部署日期：2026-04-25

已执行：

- 将 V2 代码提交并推送到 GitHub `main` 分支，提交号：`e91c04e`。
- 在服务器 `/opt/blog` 执行 `git pull --ff-only origin main`。
- 按顺序执行 `docker compose --env-file .env.production build backend` 和 `docker compose --env-file .env.production build nginx`。
- 执行 `docker compose --env-file .env.production up -d` 重启服务。
- 迁移服务已执行 `005_ai_writing_v2_logs_versions.sql`。
- 服务状态检查通过：backend、nginx、mysql、redis、qdrant 均处于运行状态。
- 公网首页访问验证通过：`https://blog.cnmnimasile.asia/` 返回 200。
- AI API 未携带 Key 访问验证通过：`/api/v1/ai/meta` 返回 401，并已写入 `ai_call_logs`。
- 数据库表验证通过：`ai_call_logs` 和 `article_versions` 已存在。
- 浏览器验证通过：文章页已写入动态 title、description、canonical、BlogPosting JSON-LD，代码块已出现语法高亮节点。

## 后续版本建议

V3 可以继续增强：

- 写作任务队列
- 多 Agent 协作
- 定时发布
- Webhook 回调
- 自动 SEO 建议
- 自动重建搜索索引
- 按 Agent 筛选文章和调用日志
- Key 过期时间后台编辑
- AI 修改历史对比
- 一键重新排版
- 一键生成摘要和标签
- 上传配图接口
