SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `ai_call_logs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'AI call log ID',
  `ai_key_id` BIGINT NULL DEFAULT NULL COMMENT 'AI API Key ID',
  `agent_name` VARCHAR(100) NULL DEFAULT NULL COMMENT 'Agent name snapshot',
  `method` VARCHAR(12) NOT NULL COMMENT 'HTTP method',
  `path` VARCHAR(255) NOT NULL COMMENT 'Request path',
  `status_code` INT NOT NULL DEFAULT 0 COMMENT 'HTTP status code',
  `success` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Whether status code is below 400',
  `latency_ms` INT NOT NULL DEFAULT 0 COMMENT 'Request latency in milliseconds',
  `request_bytes` INT NOT NULL DEFAULT 0 COMMENT 'Approximate JSON request body size',
  `ip_address` VARCHAR(64) NULL DEFAULT NULL COMMENT 'Client IP',
  `user_agent` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Client user agent',
  `trace_id` VARCHAR(64) NULL DEFAULT NULL COMMENT 'Trace ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Created time',
  PRIMARY KEY (`id`),
  KEY `idx_ai_call_logs_key_time` (`ai_key_id`, `created_at`),
  KEY `idx_ai_call_logs_status_time` (`status_code`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI writing API call logs';

CREATE TABLE IF NOT EXISTS `article_versions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Article version ID',
  `article_id` INT(11) NOT NULL COMMENT 'Article ID',
  `title` VARCHAR(200) NOT NULL COMMENT 'Title snapshot',
  `summary` TEXT NULL COMMENT 'Summary snapshot',
  `content` MEDIUMTEXT NOT NULL COMMENT 'Content snapshot',
  `category_id` INT(11) NULL DEFAULT NULL COMMENT 'Category ID snapshot',
  `status` TINYINT(4) NOT NULL DEFAULT 0 COMMENT 'Status snapshot',
  `source` VARCHAR(20) NOT NULL DEFAULT 'manual' COMMENT 'manual/ai',
  `ai_key_id` BIGINT NULL DEFAULT NULL COMMENT 'AI Key ID snapshot',
  `review_status` VARCHAR(20) NULL DEFAULT NULL COMMENT 'Review status snapshot',
  `snapshot_type` VARCHAR(40) NOT NULL DEFAULT 'manual_update' COMMENT 'Why this version was created',
  `created_by` INT(11) NULL DEFAULT NULL COMMENT 'Admin user ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Created time',
  PRIMARY KEY (`id`),
  KEY `idx_article_versions_article_time` (`article_id`, `created_at`),
  KEY `idx_article_versions_type_time` (`snapshot_type`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Article version snapshots';
