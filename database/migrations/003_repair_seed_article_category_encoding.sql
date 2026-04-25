SET NAMES utf8mb4;

UPDATE `categories`
SET
  `name` = '前端技术',
  `description` = '前端开发相关的技术文章与笔记'
WHERE
  `id` = 1
  AND HEX(`name`) = 'C3A5E280B0C28DC3A7C2ABC2AFC3A6C5A0E282ACC3A6C593C2AF';

UPDATE `categories`
SET
  `name` = '后端技术',
  `description` = '后端开发与服务器相关'
WHERE
  `id` = 2
  AND HEX(`name`) = 'C3A5C290C5BDC3A7C2ABC2AFC3A6C5A0E282ACC3A6C593C2AF';

UPDATE `categories`
SET
  `name` = '生活随笔',
  `description` = '记录生活中的点点滴滴'
WHERE
  `id` = 3
  AND HEX(`name`) = 'C3A7E2809DC5B8C3A6C2B4C2BBC3A9C5A1C28FC3A7C2ACE2809D';

UPDATE `articles`
SET
  `title` = '欢迎来到我的博客',
  `summary` = '这是博客系统的第一篇测试文章，基于 Vue 3 + Vite + MySQL 构建。',
  `content` = '## 前言\n\n欢迎来到我的全新博客系统！\n\n这是一个由 Vue 3、Vite 和 MySQL 驱动的现代化个人博客系统。\n\n### 功能介绍\n\n- **Markdown 渲染**\n- **响应式设计**\n- **文章分类与标签**'
WHERE
  `id` = 1
  AND HEX(`title`) = 'C3A6C2ACC2A2C3A8C2BFC5BDC3A6C29DC2A5C3A5CB86C2B0C3A6CB86E28098C3A7C5A1E2809EC3A5C28DC5A1C3A5C2AEC2A2';

UPDATE `article_chunks`
SET
  `content` = '欢迎来到我的博客\n这是博客系统的第一篇测试文章，基于 Vue 3 + Vite + MySQL 构建。\n## 前言\n\n欢迎来到我的全新博客系统！\n\n这是一个由 Vue 3、Vite 和 MySQL 驱动的现代化个人博客系统。\n\n### 功能介绍\n\n- **Markdown 渲染**\n- **响应式设计**\n- **文章分类与标签**'
WHERE
  `article_id` = 1
  AND `chunk_index` = 0
  AND `content` LIKE 'æ%';
