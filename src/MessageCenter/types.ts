export interface IMessage {
  id: string
  senderId: string
  text: string
  time: string
  type: 'text' | 'image' | 'system'
  rawId: number // 保存原始 ID 方便轮询等操作
}

export interface IContact {
  id: string
  name: string
  avatar: string
  role: string
  lastMessage: string
  lastTime: string
  unread: number
  status: 'online' | 'offline' | 'busy'
  isBot?: boolean
  rawSessionId: number // 真实会话 ID
  targetId: string // 对方的用户 ID
}

export interface IMessageCenterProps {
  initialParams?: { conversationId?: string; tab?: string }
  systemNotifications?: any[]
}
