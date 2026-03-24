import { get, post } from '../utils/request';

export interface SessionVO {
  sessionId: number;
  sessionKey: string;
  user1Id: number;
  user2Id: number;
  lastMessage: string | null;
  lastMsgTime: string | null;
  unreadCount: number;
  status: number;
  // 额外扩展字段（前端渲染需要，但接口目前未提供）
  targetName?: string;
  targetAvatar?: string;
  targetRole?: string;
}

export interface MessageVO {
  messageId: number;
  sessionId: number;
  senderId: number;
  receiverId: number;
  content: string;
  contentType: number; // 1=文本, 2=图片
  isRead: number; // 0=未读, 1=已读
  msgTime: string;
}

export interface PollResultVO {
  messages: MessageVO[];
  hasMore: boolean;
  lastMsgId: number;
}

// 定义统一的返回结构，配合 utils/request 中直接返回 data 的行为
export interface PageResult<T> {
  records: T[];
  total: number;
}

export interface BaseResponse<T> {
  code: number;
  success: boolean;
  data: T;
  msg: string;
}

export const chatService = {
  // 获取会话列表
  getSessionList: async (current = 1, size = 20) => {
    return get<BaseResponse<PageResult<SessionVO>>>(`${__SCS_IM_CENTER__}/market/chat/session/list`, { current, size });
  },

  // 创建/获取会话
  createSession: async (targetId: number) => {
    return post<BaseResponse<SessionVO>>(`${__SCS_IM_CENTER__}/market/chat/session/create?targetId=${targetId}`);
  },

  // 发送消息
  sendMessage: async (sessionId: number, content: string, contentType: number = 1) => {
    return post<BaseResponse<MessageVO>>(`${__SCS_IM_CENTER__}/market/chat/message/send`, { sessionId, content, contentType });
  },

  // 查询历史消息
  getHistory: async (sessionId: number, limit = 20, lastId?: number) => {
    const params: Record<string, any> = { sessionId, limit };
    if (lastId) params.lastId = lastId;
    return get<BaseResponse<MessageVO[]>>(`${__SCS_IM_CENTER__}/market/chat/message/history`, params);
  },

  // 轮询新消息
  pollMessages: async (sessionId: number, lastMsgId: number, limit = 50) => {
    return get<BaseResponse<PollResultVO>>(`${__SCS_IM_CENTER__}/market/chat/message/poll`, { sessionId, lastMsgId, limit });
  },

  // 标记消息已读
  markRead: async (sessionId: number, upToMessageId: number) => {
    return post<BaseResponse<{ markedCount: number; sessionId: number }>>(`${__SCS_IM_CENTER__}/market/chat/message/read`, { sessionId, upToMessageId });
  },
};
