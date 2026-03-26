import type { IMessage, IContact } from './types'
import type { SessionVO, MessageVO } from '@/services/chat'

const CURRENT_USER_ID = localStorage.getItem('market_userId') // FIXME: 需要从全局状态/上下文中获取当前登录用户ID

export const formatTime = (timeStr: string | null) => {
  if (!timeStr) return ''
  const d = new Date(timeStr)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export const convertSessionToContact = (session: SessionVO): Contact => {
  const targetId = session.user1Id === CURRENT_USER_ID ? session.user2Id : session.user1Id
  return {
    id: session.sessionId.toString(),
    rawSessionId: session.sessionId,
    targetId,
    name: session.targetName || `用户 ${targetId}`, // FIXME: 接口未返回目标用户信息，需要后端补充或前端额外查询
    avatar: session.targetAvatar || `https://picsum.photos/seed/${targetId}/100/100`,
    role: session.targetRole || '普通用户',
    lastMessage: session.lastMessage || '暂无消息',
    lastTime: formatTime(session.lastMsgTime),
    unread: session.unreadCount || 0,
    status: 'online',
    isBot: false,
  }
}

export const convertMessageToLocal = (msg: MessageVO): Message => {
  return {
    id: msg.messageId.toString(),
    rawId: msg.messageId,
    senderId: msg.senderId === CURRENT_USER_ID ? 'me' : msg.senderId,
    text: msg.content,
    time: formatTime(msg.msgTime),
    type: msg.contentType === 2 ? 'image' : 'text',
  }
}