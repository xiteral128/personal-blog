SET NAMES utf8mb4;

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `my_blog` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `my_blog`;

-- ==========================================
-- 1. 用户表 (users) - 用于博主后台登录
-- ==========================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名，唯一',
  `password_hash` VARCHAR(255) NOT NULL COMMENT '加密后的密码',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 插入默认管理员数据 (密码: admin123, 建议后续在后台修改)
-- password_hash 示例值为 bcrypt 加密后的 "admin123"
INSERT IGNORE INTO `users` (`username`, `password_hash`, `avatar`) 
VALUES ('admin', '$2b$10$GslmoD/9rvAfxu0hZA9dHesQ1fN74Il/j9LoeLPhsBQh4FPgI6SUK', 'https://ui-avatars.com/api/?name=Admin&background=random');

-- ==========================================
-- 2. 分类表 (categories)
-- ==========================================
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称，唯一',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '分类描述',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';

-- 插入一些默认分类
INSERT IGNORE INTO `categories` (`name`, `description`) VALUES 
('前端技术', '前端开发相关的技术文章与笔记'),
('后端技术', '后端开发与服务器相关'),
('生活随笔', '记录生活中的点点滴滴');

-- ==========================================
-- 3. 标签表 (tags)
-- ==========================================
CREATE TABLE IF NOT EXISTS `tags` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
  `name` VARCHAR(50) NOT NULL COMMENT '标签名称，唯一',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';

-- 插入一些默认标签
INSERT IGNORE INTO `tags` (`name`) VALUES ('Vue 3'), ('React'), ('TypeScript'), ('Node.js');

-- ==========================================
-- 4. 文章表 (articles)
-- ==========================================
CREATE TABLE IF NOT EXISTS `articles` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
  `title` VARCHAR(100) NOT NULL COMMENT '文章标题',
  `summary` VARCHAR(255) NOT NULL COMMENT '文章摘要',
  `content` LONGTEXT NOT NULL COMMENT 'Markdown正文内容',
  `cover_image` VARCHAR(255) DEFAULT NULL COMMENT '封面图URL',
  `category_id` INT(11) DEFAULT NULL COMMENT '关联的分类ID',
  `views` INT(11) NOT NULL DEFAULT '0' COMMENT '阅读量',
  `likes` INT(11) NOT NULL DEFAULT '0' COMMENT '点赞数',
  `status` TINYINT(1) NOT NULL DEFAULT '1' COMMENT '状态（0:草稿, 1:已发布）',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_articles_status_created_at` (`status`, `created_at`),
  CONSTRAINT `fk_article_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章表';

-- 插入一篇测试文章
INSERT IGNORE INTO `articles` (`title`, `summary`, `content`, `category_id`) VALUES 
('欢迎来到我的博客', '这是博客系统的第一篇测试文章，基于 Vue 3 + Vite + MySQL 构建。', '## 前言\n\n欢迎来到我的全新博客系统！\n\n这是一个由 Vue 3、Vite 和 MySQL 驱动的现代化个人博客系统。\n\n### 功能介绍\n\n- **Markdown 渲染**\n- **响应式设计**\n- **文章分类与标签**', 1);

-- ==========================================
-- 5. 文章标签关联表 (article_tags)
-- ==========================================
CREATE TABLE IF NOT EXISTS `article_tags` (
  `article_id` INT(11) NOT NULL COMMENT '关联的文章ID',
  `tag_id` INT(11) NOT NULL COMMENT '关联的标签ID',
  PRIMARY KEY (`article_id`, `tag_id`),
  KEY `idx_tag_id` (`tag_id`),
  CONSTRAINT `fk_at_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_at_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章标签关联表';

-- 关联测试文章和标签
INSERT IGNORE INTO `article_tags` (`article_id`, `tag_id`) VALUES (1, 1), (1, 3);

-- ==========================================
-- 6. 评论表 (comments)
-- ==========================================
CREATE TABLE IF NOT EXISTS `comments` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
  `article_id` INT(11) NOT NULL COMMENT '关联的文章ID',
  `parent_id` INT(11) NOT NULL DEFAULT '0' COMMENT '父评论ID（用于楼中楼回复，0为一级评论）',
  `nickname` VARCHAR(50) NOT NULL COMMENT '评论者昵称',
  `email` VARCHAR(100) NOT NULL COMMENT '评论者邮箱（用于展示Gravatar头像）',
  `content` TEXT NOT NULL COMMENT '评论内容',
  `status` TINYINT(1) NOT NULL DEFAULT '1' COMMENT '状态（0:待审核, 1:已通过）',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '评论时间',
  PRIMARY KEY (`id`),
  KEY `idx_article_id` (`article_id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_comments_article_status_created` (`article_id`, `status`, `created_at`),
  CONSTRAINT `fk_comment_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- ==========================================
-- 7. 上传资源元数据表 (uploads)
-- ==========================================
CREATE TABLE IF NOT EXISTS `uploads` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
  `filename` VARCHAR(255) NOT NULL COMMENT '存储文件名',
  `original_name` VARCHAR(255) NOT NULL COMMENT '原始文件名',
  `mime_type` VARCHAR(100) DEFAULT NULL COMMENT '文件 MIME 类型',
  `size` BIGINT NOT NULL DEFAULT 0 COMMENT '文件大小（字节）',
  `storage_driver` VARCHAR(50) NOT NULL DEFAULT 'local' COMMENT '存储驱动',
  `url` VARCHAR(500) NOT NULL COMMENT '访问地址',
  `created_by` INT(11) DEFAULT NULL COMMENT '上传人',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
  PRIMARY KEY (`id`),
  KEY `idx_uploads_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='上传资源元数据表';

-- ==========================================
-- 8. 文章浏览日志表 (article_view_logs)
-- ==========================================
CREATE TABLE IF NOT EXISTS `article_view_logs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
  `article_id` INT(11) NOT NULL COMMENT '关联文章ID',
  `trace_id` VARCHAR(64) DEFAULT NULL COMMENT '链路追踪ID',
  `ip_address` VARCHAR(64) DEFAULT NULL COMMENT '访问IP',
  `user_agent` VARCHAR(500) DEFAULT NULL COMMENT '浏览器标识',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '访问时间',
  PRIMARY KEY (`id`),
  KEY `idx_article_view_logs_article_created` (`article_id`, `created_at`),
  KEY `idx_article_view_logs_trace_id` (`trace_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章浏览日志表';

-- ==========================================
-- 9. 管理员操作日志表 (admin_operation_logs)
-- ==========================================
CREATE TABLE IF NOT EXISTS `admin_operation_logs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
  `user_id` INT(11) DEFAULT NULL COMMENT '操作管理员ID',
  `action` VARCHAR(100) NOT NULL COMMENT '操作动作',
  `resource_type` VARCHAR(50) NOT NULL COMMENT '资源类型',
  `resource_id` VARCHAR(64) DEFAULT NULL COMMENT '资源ID',
  `trace_id` VARCHAR(64) DEFAULT NULL COMMENT '链路追踪ID',
  `ip_address` VARCHAR(64) DEFAULT NULL COMMENT '操作来源IP',
  `metadata` JSON DEFAULT NULL COMMENT '补充元数据',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`id`),
  KEY `idx_admin_logs_created_at` (`created_at`),
  KEY `idx_admin_logs_trace_id` (`trace_id`),
  KEY `idx_admin_logs_user_action` (`user_id`, `action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员操作日志表';

-- ==========================================
-- 10. 文章切片表 (article_chunks)
-- ==========================================
CREATE TABLE IF NOT EXISTS `article_chunks` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
  `article_id` INT(11) NOT NULL COMMENT '文章ID',
  `chunk_index` INT(11) NOT NULL COMMENT '切片序号',
  `content` MEDIUMTEXT NOT NULL COMMENT '切片内容',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_article_chunk` (`article_id`, `chunk_index`),
  KEY `idx_article_chunks_article_id` (`article_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章切片表';

-- ==========================================
-- 11. 向量索引同步记录表 (article_embedding_jobs)
-- ==========================================
CREATE TABLE IF NOT EXISTS `article_embedding_jobs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
  `article_id` INT(11) NOT NULL COMMENT '文章ID',
  `chunk_count` INT(11) NOT NULL DEFAULT 0 COMMENT '切片数量',
  `status` VARCHAR(32) NOT NULL DEFAULT 'pending' COMMENT '同步状态',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_article_embedding_article` (`article_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='向量索引同步记录表';

-- 插入一条测试评论
INSERT IGNORE INTO `comments` (`article_id`, `nickname`, `email`, `content`) VALUES 
(1, '测试用户', 'test@example.com', '第一篇评论测试！网站很棒！');
