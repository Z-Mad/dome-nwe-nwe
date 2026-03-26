import React, { useEffect } from 'react'
import { useContacts } from './hooks/useContacts'
import { useMessages } from './hooks/useMessages'
import ContactList from './components/ContactList'
import ChatHeader from './components/ChatHeader'
import MessageList from './components/MessageList'
import MessageInput from './components/MessageInput'
import type { IMessageCenterProps } from './types'

const MessageCenter: React.FC<IMessageCenterProps> = ({ initialParams }) => {
  const {
    contacts,
    activeChatId,
    setActiveChatId,
    loading,
    getContactById,
  } = useContacts(initialParams?.conversationId)

  const {
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
  } = useMessages(activeChatId)

  // 切换会话时，拉取历史记录
  useEffect(() => {
    if (!activeChatId) return
    const contact = getContactById(activeChatId)
    if (contact && !chatHistory[activeChatId]) {
      fetchHistory(contact.rawSessionId)
    }
  }, [activeChatId, contacts, chatHistory, getContactById, fetchHistory])

  const activeContact = getContactById(activeChatId) || contacts[0]

  if (!activeContact) {
    return (
      <div className="flex h-full bg-white items-center justify-center text-gray-500">暂无会话</div>
    )
  }

  const messages = getMessagesForChat(activeChatId)

  return (
    <div className="flex h-full bg-white overflow-hidden">
      <ContactList
        contacts={contacts}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
      />

      <div className="flex-1 flex flex-col bg-gray-50/30">
        <ChatHeader activeContact={activeContact} />
        <MessageList
          messages={messages}
          activeContact={activeContact}
          activeChatId={activeChatId}
          messagesEndRef={messagesEndRef}
        />

        <MessageInput
          inputText={inputText}
          setInputText={setInputText}
          uploadingImage={uploadingImage}
          imageInputRef={imageInputRef}
          handleSend={handleSend}
          handleSelectImage={handleSelectImage}
        />
      </div>
    </div>
  )
}

export default MessageCenter