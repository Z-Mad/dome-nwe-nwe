import React from 'react'
import type { IMessage, IContact } from '../types'
import MessageItem from './MessageItem'

interface MessageListProps {
  messages: IMessage[]
  activeContact: Contact
  activeChatId: string
  messagesEndRef: React.RefObject<HTMLDivElement>
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  activeContact,
  activeChatId,
  messagesEndRef,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="text-center text-xs text-gray-300 my-4">
        --- 与 {activeContact.name} 的加密会话 ---
      </div>

      {messages.map((msg) => (
        <MessageItem
          key={msg.id}
          message={msg}
          activeContact={activeContact}
          isFromMe={msg.senderId === 'me'}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList