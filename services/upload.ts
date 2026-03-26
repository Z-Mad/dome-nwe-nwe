import { postForm } from '../utils/request';

interface UploadResponse<T> {
  code: number;
  success: boolean;
  data: T;
  msg: string;
}

type UploadData =
  | string
  | {
      url?: string;
      fileUrl?: string;
      ossUrl?: string;
      path?: string;
      link?: string;
      [key: string]: any;
    };

const resolveUploadedUrl = (data: UploadData): string => {
  if (typeof data === 'string') {
    return data;
  }
  return data.link || data.url || data.fileUrl || data.ossUrl || data.path || '';
};

export const uploadService = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await postForm<UploadResponse<UploadData>>(
      `${__SCS_RESOURCE__}/oss/endpoint/put-file`,
      formData
    );

    const url = resolveUploadedUrl(res.data);
    if (!url) {
      console.error('上传成功但解析URL失败，后端返回数据:', res.data);
      throw new Error('上传成功，但未能从接口响应中提取到有效的图片链接');
    }

    return {
      ...res,
      data: {
        url,
      },
    };
  },
};
