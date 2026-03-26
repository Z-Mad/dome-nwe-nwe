// components/CartSidebar.tsx
import React from 'react'
import { ShoppingCart, Plus, X, ChevronRight, Cpu, Database } from 'lucide-react'
import type { CartItem } from '../types/resourcePack'

interface CartSidebarProps {
  cartItems: CartItem[]
  cartTotal: number
  currentSelection: {
    label: string
    duration: string
    subtotal: number
    quantity: number
  }
  onAddToCart: () => void
  onRemoveFromCart: (id: string) => void
  onCheckout: () => void
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  cartItems,
  cartTotal,
  currentSelection,
  onAddToCart,
  onRemoveFromCart,
  onCheckout,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-6">
      {/* Current Selection Preview */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="text-xs font-bold text-gray-400 mb-2 uppercase">当前配置预览</div>
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-gray-800 text-sm">
            {currentSelection.label} / {currentSelection.duration}
          </span>
          <span className="font-mono text-orange-600 font-bold">
            ¥{currentSelection.subtotal}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>数量: {currentSelection.quantity}</span>
          <button
            onClick={onAddToCart}
            className="text-blue-600 font-bold hover:underline flex items-center gap-1"
          >
            <Plus size={12} /> 加入清单
          </button>
        </div>
      </div>

      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
        <ShoppingCart size={20} className="text-blue-600" /> 配置清单 ({cartItems.length})
      </h3>

      {/* Cart Items List */}
      <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
        {cartItems.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-xs bg-gray-50 rounded-xl border border-dashed border-gray-200">
            暂无商品，请在左侧添加
          </div>
        ) : (
          cartItems.map(item => (
            <div
              key={item.id}
              className="p-3 border border-gray-200 rounded-xl relative group hover:border-blue-300 transition-colors bg-white"
            >
              <div className="flex justify-between items-start mb-1">
                <div className="font-bold text-sm text-gray-800">{item.name}</div>
                <button
                  onClick={() => onRemoveFromCart(item.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>数量: x{item.quantity}</span>
                <span className="font-mono font-bold text-gray-700">
                  ¥{item.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                {item.type === 'token' ? <Cpu size={10} /> : <Database size={10} />}
                {item.type === 'token' ? '算力包' : '存储包'}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Total & Action */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex justify-between items-end mb-4">
          <span className="text-sm font-bold text-gray-600 mb-1">总计费用</span>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900 font-mono text-orange-600 leading-none">
              <span className="text-sm mr-1">¥</span>
              {cartTotal.toLocaleString()}
            </div>
          </div>
        </div>

        <button
          onClick={onCheckout}
          disabled={cartItems.length === 0}
          className={`w-full py-3.5 rounded-xl text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2 group ${
            cartItems.length === 0
              ? 'bg-gray-300 cursor-not-allowed shadow-none'
              : 'bg-gray-900 hover:bg-black shadow-gray-200'
          }`}
        >
          去结算{' '}
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="mt-4 px-2 text-[10px] text-gray-400 text-center leading-relaxed">
          点击去结算即代表同意《资源包服务协议》，购买后立即生效，不支持退款。
        </div>
      </div>
    </div>
  )
}