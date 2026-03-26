import React from 'react'
import { LifeBuoy } from 'lucide-react'
import { useUserProfile } from '../../Core/useUserProfileStore'

const SellerSupport: React.FC = () => {
  const { openModal } = useUserProfile()

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <LifeBuoy size={20} className="text-orange-500" /> 待处理工单 (Pending Tickets)
        </h3>
        <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800">
          查看全部工单
        </button>
      </div>

      <div className="divide-y divide-gray-100 bg-white border border-gray-100 rounded-xl overflow-hidden">
        {[
          {
            id: 'T-250418-01',
            user: '沙钢集团',
            title: 'API 调用返回 500 错误',
            date: '2025-04-18',
            status: 'pending',
          },
          {
            id: 'T-250417-05',
            user: '某独立研究院',
            title: '发票开具有误',
            date: '2025-04-17',
            status: 'resolved',
          },
          {
            id: 'T-250416-02',
            user: '宝武集团',
            title: '新版本 SDK 兼容性咨询',
            date: '2025-04-16',
            status: 'pending',
          },
        ].map((ticket) => (
          <div
            key={ticket.id}
            className="p-4 border-b border-gray-50 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${ticket.status === 'pending' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}
                >
                  {ticket.status === 'pending' ? '待处理' : '已解决'}
                </span>
                <h4 className="font-bold text-sm text-gray-900">{ticket.title}</h4>
              </div>
              <div className="text-xs text-gray-500">
                {ticket.id} · 来自 {ticket.user} · {ticket.date}
              </div>
            </div>
            <button
              onClick={() => openModal('seller_reply_ticket', { ticketId: ticket.id })}
              className="text-xs font-bold text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50"
            >
              查看回复
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SellerSupport
