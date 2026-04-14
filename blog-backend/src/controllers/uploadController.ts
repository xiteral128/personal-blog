import { Request, Response } from 'express';

// 上传图片接口 (处理单张图片)
export const uploadImage = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ code: 400, message: '请选择要上传的图片' });
    }

    // 构建图片的访问 URL
    // 注意：这里假设前端和后端的域名或代理路径一致。如果是独立后端，需要加上后端完整域名，如 process.env.API_URL + '/uploads/...'
    const imageUrl = `/api/v1/uploads/${req.file.filename}`;

    res.json({
      code: 200,
      message: '上传成功',
      data: {
        url: imageUrl,
        alt: req.file.originalname
      }
    });
  } catch (error) {
    console.error('上传图片失败:', error);
    res.status(500).json({ code: 500, message: 'Server Error' });
  }
};