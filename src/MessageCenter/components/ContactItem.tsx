import React from 'react'
import { Bot } from 'lucide-react'
import type { IContact } from '../types'

interface ContactItemProps {
  contact: IContact
  isActive: boolean
  onClick: (id: string) => void
}

const ContactItem: React.FC<ContactItemProps> = ({ contact, isActive, onClick }) => {
  return (
    <div
      onClick={() => onClick(contact.id)}
      className={`flex items-start gap-3 p-4 cursor-pointer transition-colors border-l-4 ${
        isActive
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
            className={`text-sm font-bold ${isActive ? 'text-blue-900' : 'text-gray-900'}`}
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
  )
}

export default ContactItem