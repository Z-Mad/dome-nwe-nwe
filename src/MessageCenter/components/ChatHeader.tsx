import React from 'react'
import { Bot, Phone, Video, MoreVertical } from 'lucide-react'
import type { IContact } from '../types'

interface ChatHeaderProps {
  activeContact: IContact
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ activeContact }) => {
  return (
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
  )
}

export default ChatHeader