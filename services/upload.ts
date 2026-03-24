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
      [key: string]: any;
    };

const resolveUploadedUrl = (data: UploadData): string => {
  if (typeof data === 'string') {
    return data;
  }
  return data.url || data.fileUrl || data.ossUrl || data.path || '';
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
      throw new Error(res.msg || '上传成功但未返回可用URL');
    }

    return {
      ...res,
      data: {
        url,
      },
    };
  },
};
