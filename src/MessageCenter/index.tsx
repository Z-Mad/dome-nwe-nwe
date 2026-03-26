import { chatService, type MessageVO, type SessionVO } from '@/services/chat'
import { uploadService } from '@/services/upload'
import {
  Bot,
  Image as ImageIcon,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  User,
  Video,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

interface Message {
  id: string
  senderId: string
  text: string
  time: string
  type: 'text' | 'image' | 'system'
  rawId: number // 保存原始 ID 方便轮询等操作
}

interface Contact {
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

interface MessageCenterProps {
  initialParams?: { conversationId?: string; tab?: string }
  systemNotifications?: any[]
}

const CURRENT_USER_ID = localStorage.getItem('market_userId') // FIXME: 需要从全局状态/上下文中获取当前登录用户ID

const MessageCenter: React.FC<MessageCenterProps> = ({ initialParams }) => {
  // --- State ---
  const [contacts, setContacts] = useState<Contact[]>([])
  const [activeChatId, setActiveChatId] = useState<string>(initialParams?.conversationId || '')
  const [chatHistory, setChatHistory] = useState<Record<string, Message[]>>({})
  const [inputText, setInputText] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null)

  // --- Helpers ---
  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return ''
    const d = new Date(timeStr)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const convertSessionToContact = (session: SessionVO): Contact => {
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

  const convertMessageToLocal = (msg: MessageVO): Message => {
    return {
      id: msg.messageId.toString(),
      rawId: msg.messageId,
      senderId: msg.senderId === CURRENT_USER_ID ? 'me' : msg.senderId,
      text: msg.content,
      time: formatTime(msg.msgTime),
      type: msg.contentType === 2 ? 'image' : 'text',
    }
  }

  // --- Fetch Data ---
  const fetchSessions = async () => {
    try {
      const res = await chatService.getSessionList(1, 100)
      if (res.data?.records) {
        const mappedContacts = res.data.records.map(convertSessionToContact)
        setContacts(mappedContacts)
        if (!activeChatId && mappedContacts.length > 0) {
          setActiveChatId(mappedContacts[0].id)
        }
      }
    } catch (error) {
      console.error('获取会话列表失败', error)
    }
  }

  const fetchHistory = async (sessionId: number) => {
    try {
      const res = await chatService.getHistory(sessionId, 50)
      if (res.data) {
        // 历史接口是倒序返回的，我们需要正序显示
        const sortedMessages = res.data.reverse().map(convertMessageToLocal)
        setChatHistory((prev) => ({
          ...prev,
          [sessionId.toString()]: sortedMessages,
        }))
      }
    } catch (error) {
      console.error('获取历史消息失败', error)
    }
  }

  // --- Effects ---
  // 1. 初始化拉取会话列表
  useEffect(() => {
    fetchSessions()
    // 清理轮询
    return () => {
      if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current)
    }
  }, [])

  // 2. 切换会话时，拉取历史记录并重置轮询
  useEffect(() => {
    if (!activeChatId) return
    const contact = contacts.find((c) => c.id === activeChatId)
    if (contact && !chatHistory[activeChatId]) {
      fetchHistory(contact.rawSessionId)
    }
  }, [activeChatId, contacts])

  // 3. 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeChatId, chatHistory])

  // 4. 轮询机制
  useEffect(() => {
    if (!activeChatId) return

    const activeSessionId = Number(activeChatId)
    const pollMessages = async () => {
      try {
        const currentMsgs = chatHistory[activeChatId] || []
        const lastMsgId = currentMsgs.length > 0 ? currentMsgs[currentMsgs.length - 1].rawId : 0

        const res = await chatService.pollMessages(activeSessionId, lastMsgId)
        if (res.data?.messages && res.data.messages.length > 0) {
          const newMsgs = res.data.messages.map(convertMessageToLocal)
          setChatHistory((prev) => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), ...newMsgs],
          }))

          // 标记已读
          const latestId = res.data.lastMsgId || newMsgs[newMsgs.length - 1].rawId
          await chatService.markRead(activeSessionId, latestId)
        }
      } catch (error) {
        console.error('轮询消息失败', error)
      } finally {
        pollingTimerRef.current = setTimeout(pollMessages, 3000)
      }
    }

    if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current)
    pollingTimerRef.current = setTimeout(pollMessages, 3000)

    return () => {
      if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current)
    }
  }, [activeChatId, chatHistory])

  // --- Handlers ---
  const handleSend = async () => {
    if (!inputText.trim() || !activeChatId) return
    const currentActiveChatId = activeChatId // 捕获当前会话ID，防止异步改变
    const textToSend = inputText
    setInputText('') // 先清空输入框

    try {
      const res = await chatService.sendMessage(Number(currentActiveChatId), textToSend, 1)
      if (res.data) {
        const newMsg = convertMessageToLocal(res.data)
        setChatHistory((prev) => ({
          ...prev,
          [currentActiveChatId]: [...(prev[currentActiveChatId] || []), newMsg],
        }))
      }
    } catch (error) {
      console.error('发送消息失败', error)
      // 可以加入重发逻辑或提示用户
    }
  }

  const handleSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !activeChatId) return
    if (!file.type.startsWith('image/')) return
    if (file.size > 10 * 1024 * 1024) return

    const currentActiveChatId = activeChatId
    try {
      setUploadingImage(true)
      const uploadRes = await uploadService.uploadFile(file)
      const imageUrl = uploadRes.data.url
      const sendRes = await chatService.sendMessage(Number(currentActiveChatId), imageUrl, 2)
      if (sendRes.data) {
        const newMsg = convertMessageToLocal(sendRes.data)
        setChatHistory((prev) => ({
          ...prev,
          [currentActiveChatId]: [...(prev[currentActiveChatId] || []), newMsg],
        }))
      }
    } catch (error) {
      console.error('发送图片失败', error)
    } finally {
      setUploadingImage(false)
    }
  }

  const activeContact = contacts.find((c) => c.id === activeChatId) || contacts[0]

  if (!activeContact) {
    return (
      <div className="flex h-full bg-white items-center justify-center text-gray-500">暂无会话</div>
    )
  }

  return (
    <div className="flex h-full bg-white overflow-hidden">
      {/* Left: Contact List */}
      <div className="w-80 border-r border-gray-100 flex flex-col bg-white">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">消息中心</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="搜索联系人..."
              className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setActiveChatId(contact.id)}
              className={`flex items-start gap-3 p-4 cursor-pointer transition-colors border-l-4 ${
                activeChatId === contact.id
                  ? 'bg-blue-50/50 border-blue-600'
                  : 'hover:bg-gray-50 border-transparent'
              }`}
            >
              <div className="relative flex-shrink-0">
                {contact.isBot ? (
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <Bot size={20} />
                  </div>
                ) : (
                  <img
                    src={contact.avatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                ></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span
                    className={`text-sm font-bold ${activeChatId === contact.id ? 'text-blue-900' : 'text-gray-900'}`}
                  >
                    {contact.name}
                  </span>
                  <span className="text-[10px] text-gray-400">{contact.lastTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 truncate max-w-[140px]">
                    {contact.isBot ? '为您生成昨天的板形质量报告...' : contact.lastMessage}
                  </p>
                  {contact.unread > 0 && (
                    <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Chat Window */}
      <div className="flex-1 flex flex-col bg-gray-50/30">
        {/* Header */}
        <div className="h-16 border-b border-gray-100 bg-white px-6 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            {activeContact.isBot ? (
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Bot size={20} />
              </div>
            ) : (
              <img
                src={activeContact.avatar}
                className="w-10 h-10 rounded-full object-cover shadow-sm"
                alt="avatar"
              />
            )}
            <div>
              <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                {activeContact.name}
                {activeContact.status === 'online' && (
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                )}
              </div>
              <div className="text-xs text-gray-500">{activeContact.role}</div>
            </div>
          </div>
          <div className="flex gap-4 text-gray-400">
            <Phone size={20} className="hover:text-blue-600 cursor-pointer transition-colors" />
            <Video size={20} className="hover:text-blue-600 cursor-pointer transition-colors" />
            <MoreVertical
              size={20}
              className="hover:text-gray-600 cursor-pointer transition-colors"
            />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-center text-xs text-gray-300 my-4">
            --- 与 {activeContact.name} 的加密会话 ---
          </div>

          {chatHistory[activeChatId]?.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.senderId !== 'me' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 mr-3 overflow-hidden">
                  {activeContact.isBot ? (
                    <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white">
                      <Bot size={16} />
                    </div>
                  ) : (
                    <img src={activeContact.avatar} className="w-full h-full object-cover" />
                  )}
                </div>
              )}
              <div className="max-w-[70%]">
                <div
                  className={`rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.senderId === 'me'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-700 rounded-bl-none border border-gray-100'
                  } ${msg.type === 'image' ? 'p-1' : 'p-4'}`}
                >
                  {msg.type === 'image' ? (
                    <a href={msg.text} target="_blank" rel="noreferrer">
                      <img
                        src={msg.text}
                        alt="聊天图片"
                        className="max-w-[280px] max-h-[280px] rounded-xl object-cover"
                      />
                    </a>
                  ) : (
                    msg.text
                  )}
                </div>
                <div
                  className={`text-[10px] text-gray-400 mt-1 ${msg.senderId === 'me' ? 'text-right' : 'text-left'}`}
                >
                  {msg.time}
                </div>
              </div>
              {msg.senderId === 'me' && (
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 ml-3 flex items-center justify-center text-indigo-600 overflow-hidden">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex gap-4 mb-3 text-gray-400 px-2">
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="hover:text-blue-600 cursor-pointer transition-colors"
              disabled={uploadingImage}
            >
              <ImageIcon size={20} />
            </button>
            <Paperclip size={20} className="hover:text-blue-600 cursor-pointer transition-colors" />
            <Smile size={20} className="hover:text-blue-600 cursor-pointer transition-colors" />
            {uploadingImage && <span className="text-xs text-blue-600">图片上传中...</span>}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleSelectImage}
            />
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="输入消息..."
              className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 border rounded-xl px-4 py-3 text-sm outline-none transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || uploadingImage}
              className={`p-3 rounded-xl transition-all shadow-md flex items-center justify-center ${
                inputText.trim() && !uploadingImage
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageCenter
