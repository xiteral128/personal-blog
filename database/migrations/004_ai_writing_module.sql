SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `ai_api_keys` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'AI API Key ID',
  `name` VARCHAR(100) NOT NULL COMMENT 'Agent 名称',
  `key_prefix` VARCHAR(32) NOT NULL COMMENT '密钥前缀，用于后台识别',
  `key_hash` CHAR(64) NOT NULL COMMENT '密钥 SHA-256 哈希',
  `mode` VARCHAR(20) NOT NULL DEFAULT 'review' COMMENT 'autonomous=AI全权负责, review=人类拍板',
  `enabled` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
  `daily_limit` INT NOT NULL DEFAULT 20 COMMENT '每日最多创建文章数',
  `last_used_at` TIMESTAMP NULL DEFAULT NULL COMMENT '最近使用时间',
  `last_used_ip` VARCHAR(64) DEFAULT NULL COMMENT '最近使用 IP',
  `expires_at` TIMESTAMP NULL DEFAULT NULL COMMENT '过期时间',
  `created_by` INT(11) DEFAULT NULL COMMENT '创建管理员',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `revoked_at` TIMESTAMP NULL DEFAULT NULL COMMENT '吊销时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_ai_api_keys_prefix` (`key_prefix`),
  UNIQUE KEY `uk_ai_api_keys_hash` (`key_hash`),
  KEY `idx_ai_api_keys_enabled` (`enabled`, `mode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI 写作 API 密钥';

DROP PROCEDURE IF EXISTS `add_ai_column_if_missing`;
DELIMITER $$
CREATE PROCEDURE `add_ai_column_if_missing`(
  IN table_name_value VARCHAR(64),
  IN column_name_value VARCHAR(64),
  IN ddl_value TEXT
)
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = table_name_value
      AND COLUMN_NAME = column_name_value
  ) THEN
    SET @ddl = ddl_value;
    PREPARE stmt FROM @ddl;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END$$
DELIMITER ;

CALL add_ai_column_if_missing('articles', 'source', 'ALTER TABLE `articles` ADD COLUMN `source` VARCHAR(20) NOT NULL DEFAULT ''manual'' COMMENT ''manual=人工, ai=AI'' AFTER `status`');
CALL add_ai_column_if_missing('articles', 'ai_key_id', 'ALTER TABLE `articles` ADD COLUMN `ai_key_id` BIGINT NULL DEFAULT NULL COMMENT ''创建文章的 AI Key ID'' AFTER `source`');
CALL add_ai_column_if_missing('articles', 'review_status', 'ALTER TABLE `articles` ADD COLUMN `review_status` VARCHAR(20) NULL DEFAULT NULL COMMENT ''pending/approved/rejected'' AFTER `ai_key_id`');
CALL add_ai_column_if_missing('articles', 'review_note', 'ALTER TABLE `articles` ADD COLUMN `review_note` VARCHAR(500) NULL DEFAULT NULL COMMENT ''审核备注'' AFTER `review_status`');
CALL add_ai_column_if_missing('articles', 'reviewed_by', 'ALTER TABLE `articles` ADD COLUMN `reviewed_by` INT(11) NULL DEFAULT NULL COMMENT ''审核管理员 ID'' AFTER `review_note`');
CALL add_ai_column_if_missing('articles', 'reviewed_at', 'ALTER TABLE `articles` ADD COLUMN `reviewed_at` TIMESTAMP NULL DEFAULT NULL COMMENT ''审核时间'' AFTER `reviewed_by`');

DROP PROCEDURE IF EXISTS `add_ai_index_if_missing`;
DELIMITER $$
CREATE PROCEDURE `add_ai_index_if_missing`(
  IN table_name_value VARCHAR(64),
  IN index_name_value VARCHAR(64),
  IN ddl_value TEXT
)
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = table_name_value
      AND INDEX_NAME = index_name_value
  ) THEN
    SET @ddl = ddl_value;
    PREPARE stmt FROM @ddl;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END$$
DELIMITER ;

CALL add_ai_index_if_missing('articles', 'idx_articles_ai_review', 'ALTER TABLE `articles` ADD KEY `idx_articles_ai_review` (`source`, `review_status`, `updated_at`)');
CALL add_ai_index_if_missing('articles', 'idx_articles_ai_key', 'ALTER TABLE `articles` ADD KEY `idx_articles_ai_key` (`ai_key_id`, `created_at`)');

DROP PROCEDURE IF EXISTS `add_ai_column_if_missing`;
DROP PROCEDURE IF EXISTS `add_ai_index_if_missing`;
