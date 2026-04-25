SET NAMES utf8mb4;

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

CREATE TABLE IF NOT EXISTS `article_embedding_jobs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
  `article_id` INT(11) NOT NULL COMMENT '文章ID',
  `chunk_count` INT(11) NOT NULL DEFAULT 0 COMMENT '切片数量',
  `status` VARCHAR(32) NOT NULL DEFAULT 'pending' COMMENT '同步状态',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_article_embedding_article` (`article_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='向量索引同步记录表';
