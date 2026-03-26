import React from 'react'
import { Search } from 'lucide-react'
import type { IContact } from '../types'
import ContactItem from './ContactItem'

interface ContactListProps {
  contacts: IContact[]
  activeChatId: string
  setActiveChatId: (id: string) => void
}

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  activeChatId,
  setActiveChatId,
}) => {
  return (
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
          <ContactItem
            key={contact.id}
            contact={contact}
            isActive={activeChatId === contact.id}
            onClick={setActiveChatId}
          />
        ))}
      </div>
    </div>
  )
}

export default ContactList