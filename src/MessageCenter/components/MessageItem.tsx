import React from 'react'
import { Bot, User } from 'lucide-react'
import type { IMessage, IContact } from '../types'

interface MessageItemProps {
  message: IMessage
  activeContact: IContact
  isFromMe: boolean
}

const MessageItem: React.FC<MessageItemProps> = ({ message, activeContact, isFromMe }) => {
  return (
    <div className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
      {!isFromMe && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 mr-3 overflow-hidden">
          {activeContact.isBot ? (
            <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white">
              <Bot size={16} />
            </div>
          ) : (
            <img src={activeContact.avatar} className="w-full h-full object-cover" alt="avatar" />
          )}
        </div>
      )}
      <div className="max-w-[70%]">
        <div
          className={`rounded-2xl text-sm leading-relaxed shadow-sm ${
            isFromMe
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-white text-gray-700 rounded-bl-none border border-gray-100'
          } ${message.type === 'image' ? 'p-1' : 'p-4'}`}
        >
          {message.type === 'image' ? (
            <a href={message.text} target="_blank" rel="noreferrer">
              <img
                src={message.text}
                alt="聊天图片"
                className="max-w-[280px] max-h-[280px] rounded-xl object-cover"
              />
            </a>
          ) : (
            message.text
          )}
        </div>
        <div
          className={`text-[10px] text-gray-400 mt-1 ${isFromMe ? 'text-right' : 'text-left'}`}
        >
          {message.time}
        </div>
      </div>
      {isFromMe && (
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 ml-3 flex items-center justify-center text-indigo-600 overflow-hidden">
          <User size={16} />
        </div>
      )}
    </div>
  )
}

export default MessageItem