import { useState, useEffect, useRef, useCallback } from 'react'
import { chatService } from '@/services/chat'
import { uploadService } from '@/services/upload'
import type { IMessage } from '../types'
import { convertMessageToLocal } from '../utils'

export const useMessages = (activeChatId: string) => {
  const [chatHistory, setChatHistory] = useState<Record<string, IMessage[]>>({})
  const [inputText, setInputText] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null)

  const fetchHistory = useCallback(async (sessionId: number) => {
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
  }, [])

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeChatId, chatHistory])

  // 轮询机制
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
          // const latestId = res.data.lastMsgId || newMsgs[newMsgs.length - 1].rawId
          // await chatService.markRead(activeSessionId, latestId)
        }
      } catch (error) {
        console.error('轮询消息失败', error)
      } finally {
        // 确保定时器在组件卸载后不会设置
        if (pollingTimerRef.current !== null) {
          pollingTimerRef.current = setTimeout(pollMessages, 3000)
        }
      }
    }

    // 清除之前的定时器
    if (pollingTimerRef.current) {
      clearTimeout(pollingTimerRef.current)
      pollingTimerRef.current = null
    }
    
    // 启动新的轮询
    pollingTimerRef.current = setTimeout(pollMessages, 3000)

    // 清理函数：确保页面关闭时轮询停止
    return () => {
      if (pollingTimerRef.current) {
        clearTimeout(pollingTimerRef.current)
        pollingTimerRef.current = null
      }
    }
  }, [activeChatId, chatHistory])

  const handleSend = useCallback(async () => {
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
  }, [inputText, activeChatId])

  const handleSelectImage = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, [activeChatId])

  const getMessagesForChat = useCallback((chatId: string) => {
    return chatHistory[chatId] || []
  }, [chatHistory])

  return {
    chatHistory,
    inputText,
    setInputText,
    uploadingImage,
    messagesEndRef,
    imageInputRef,
    handleSend,
    handleSelectImage,
    fetchHistory,
    getMessagesForChat,
  }
}