import { LifeBuoy, Loader2, X } from 'lucide-react'
import { useState } from 'react'

export const CreateTicketModal = ({ closeModal, showToast }: any) => {
  const [ticketForm, setTicketForm] = useState({ type: 'technical', desc: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateTicket = () => {
    if (!ticketForm.desc) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      showToast('工单已提交，技术人员将尽快与您联系。')
      closeModal()
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        <h3 className="font-bold text-lg mb-6 text-gray-900 flex items-center gap-2">
          <LifeBuoy size={20} className="text-blue-600" /> 提交工单
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">问题类型</label>
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={ticketForm.type}
              onChange={(e) => setTicketForm({ ...ticketForm, type: e.target.value })}
            >
              <option value="technical">技术支持</option>
              <option value="billing">财务/账单</option>
              <option value="account">账号问题</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">问题描述</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
              placeholder="请详细描述您遇到的问题..."
              value={ticketForm.desc}
              onChange={(e) => setTicketForm({ ...ticketForm, desc: e.target.value })}
            ></textarea>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={closeModal}
            className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleCreateTicket}
            disabled={!ticketForm.desc || isLoading}
            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : '提交'}
          </button>
        </div>
      </div>
    </div>
  )
}
