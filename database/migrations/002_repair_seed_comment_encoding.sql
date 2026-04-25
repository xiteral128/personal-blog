SET NAMES utf8mb4;

UPDATE `comments`
SET
  `nickname` = '测试用户',
  `content` = '第一篇评论测试！网站很棒！'
WHERE
  `article_id` = 1
  AND `email` = 'test@example.com'
  AND HEX(`nickname`) = 'C3A6C2B5E280B9C3A8C2AFE280A2C3A7E2809DC2A8C3A6CB86C2B7';
