// components/AgreementModal.tsx
import React from 'react'
import { X } from 'lucide-react'

interface AgreementModalProps {
  isOpen: boolean
  onClose: () => void
  onAgree: () => void
}

export const AgreementModal: React.FC<AgreementModalProps> = ({ isOpen, onClose, onAgree }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-900">资源包服务协议</h3>
          <button onClick={onClose}>
            <X size={20} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto text-sm text-gray-600 leading-relaxed space-y-4">
          <p>
            <strong>1. 服务内容</strong>
            <br />
            本资源包服务旨在为您提供额外的算力（Token）或存储空间。购买后，资源包将自动绑定至您指定的智能体实例，并优先于按量付费扣除。
          </p>
          <p>
            <strong>2. 有效期与过期</strong>
            <br />
            资源包具有明确的有效期。未在有效期内使用的额度将自动失效，不予退款或结转。请您根据实际需求合理规划购买量。
          </p>
          <p>
            <strong>3. 不可转让</strong>
            <br />
            资源包仅限当前账户下的实例使用，不支持跨账户转让或赠予。
          </p>
          <p>
            <strong>4. 免责声明</strong>
            <br />
            因不可抗力（如网络故障、服务器宕机）导致的服务中断，平台将依据SLA条款进行赔偿，但不承担超出资源包价值的连带责任。
          </p>
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 text-right">
          <button
            onClick={onAgree}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-colors"
          >
            我已阅读并同意
          </button>
        </div>
      </div>
    </div>
  )
}