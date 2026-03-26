import {
  Building2,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Cpu,
  CreditCard,
  Database,
  Download,
  FileText,
  HelpCircle,
  Info,
  Loader2,
  Minus,
  Package,
  Plus,
  RefreshCcw,
  ShieldAlert,
  ShoppingCart,
  X,
} from 'lucide-react'
import React, { useState } from 'react'

interface ResourcePackViewProps {
  orders: any[] // List of active orders to link to
  onPurchase: (
    items: CartItem[],
    targetOrderId: string,
    version: string,
    paymentMethod: string,
  ) => void
}

// --- Configuration Data ---
const CONFIG_OPTIONS = {
  token: {
    label: '算力/Token包',
    unit: 'k Tokens',
    icon: <Cpu size={18} />,
    desc: '适用于所有大语言模型类智能体，抵扣对话、推理产生的 Token 消耗。',
    quotas: [
      { value: 1000, label: '100万 Tokens', price: 99 },
      { value: 5000, label: '500万 Tokens', price: 399, tag: '推荐' },
      { value: 10000, label: '1000万 Tokens', price: 699 },
      { value: 50000, label: '5000万 Tokens', price: 2999 },
      { value: 100000, label: '1亿 Tokens', price: 4999, tag: '企业' },
    ],
  },
  storage: {
    label: '存储/数据库包',
    unit: 'GB',
    icon: <Database size={18} />,
    desc: '用于扩展私有化部署模型的向量数据库容量或归档历史生产数据。',
    quotas: [
      { value: 100, label: '100 GB', price: 49 },
      { value: 500, label: '500 GB', price: 199 },
      { value: 1024, label: '1 TB', price: 299, tag: '热销' },
      { value: 5120, label: '5 TB', price: 1299 },
    ],
  },
}

const DURATIONS = [
  { value: 6, label: '6个月', multiplier: 1 },
  { value: 12, label: '1年', multiplier: 1.8, tag: '8.3折' },
]

// --- Rule Content ---
const RULES_CONTENT = [
  {
    id: 'instructions',
    label: '购买说明',
    icon: <FileText size={16} />,
    content: (
      <ul className="list-disc pl-5 space-y-2 text-xs text-gray-600 leading-relaxed">
        <li>资源包购买后立即生效，有效期自购买之日起计算。</li>
        <li>
          <strong>叠加规则：</strong>
          支持购买多个同类型或不同类型的资源包，额度将累加，有效期以各资源包独立时间为准。
        </li>
        <li>
          <strong>适用范围：</strong>
          Token包通用于所有接入标准API的智能体；存储包仅限私有化部署或需独立数据库的实例。
        </li>
        <li>企业认证用户购买大额资源包（单笔满 ¥10,000）可申请增值税专用发票。</li>
      </ul>
    ),
  },
  {
    id: 'deduction',
    label: '抵扣规则',
    icon: <RefreshCcw size={16} />,
    content: (
      <ul className="list-disc pl-5 space-y-2 text-xs text-gray-600 leading-relaxed">
        <li>
          <strong>抵扣顺序：</strong>系统优先抵扣即将过期的资源包额度（先到期先扣）。
        </li>
        <li>
          <strong>混合支付：</strong>
          当资源包额度不足时，超出部分将自动按照“按量付费”标准从账户余额中扣除。
        </li>
        <li>
          <strong>余额逻辑：</strong>
          平台没有充值功能，自动从已关联的企业对公账户或个人签约账户扣除。
        </li>
        <li className="text-red-500">若从关联账户扣除失败，则该订单自动失效。</li>
      </ul>
    ),
  },
  {
    id: 'refund',
    label: '退订规则',
    icon: <ShieldAlert size={16} />,
    content: (
      <ul className="list-disc pl-5 space-y-2 text-xs text-gray-600 leading-relaxed">
        <li>
          <strong>五天无理由：</strong>购买后5天内且未使用任何额度，支持全额退款。
        </li>
        <li>
          <strong>非全额退款：</strong>
          已使用部分额度或超过5天，不支持退款。特殊情况请提交工单申请，将收取15%手续费。
        </li>
        <li>活动赠送的资源包不支持退现或转让。</li>
      </ul>
    ),
  },
  {
    id: 'tips',
    label: '温馨提示',
    icon: <HelpCircle size={16} />,
    content: (
      <div className="space-y-2 text-xs text-gray-600 leading-relaxed">
        <p>
          1.
          请在购买前确认您的实例运行状态正常，挂载至“已过期”或“已冻结”实例可能导致服务无法立刻恢复。
        </p>
        <p>
          2. 系统已自动开启<strong>“余额预警”</strong>
          功能。当资源包剩余额度低于20%时，系统将发送短信提醒，您可以在个人中心的订单管理中查看预警详情。
        </p>
        <p className="text-orange-600 font-bold">
          3. 严禁利用平台资源进行挖矿或其他违规计算行为，一经发现将封禁账号。
        </p>
      </div>
    ),
  },
]

export interface CartItem {
  id: string
  type: 'token' | 'storage'
  name: string
  amount: number
  unit: string
  price: number // Unit price for this config
  validity: string
  quantity: number
  subtotal: number
}

const ResourcePackView: React.FC<ResourcePackViewProps> = ({ orders, onPurchase }) => {
  // Selection State
  const [selectedType, setSelectedType] = useState<'token' | 'storage'>('token')
  const [selectedQuotaIdx, setSelectedQuotaIdx] = useState(1)
  const [selectedDurationIdx, setSelectedDurationIdx] = useState(0)
  const [purchaseQuantity, setPurchaseQuantity] = useState(1)
  const [activeRuleTab, setActiveRuleTab] = useState('deduction') // Default to Deduction per screenshot suggestion

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Modal State
  const [targetOrderId, setTargetOrderId] = useState<string>('')
  const [selectedVersion, setSelectedVersion] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<'alipay' | 'wechat' | 'offline'>('alipay')
  const [agreementChecked, setAgreementChecked] = useState(true) // Default checked as per screenshot annotation
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showAgreementDetail, setShowAgreementDetail] = useState(false)
  const [showPaymentApplicationModal, setShowPaymentApplicationModal] = useState(false)

  // Dynamic Data Calculation for Current Selection
  const currentConfig = CONFIG_OPTIONS[selectedType]
  const currentQuota = currentConfig.quotas[selectedQuotaIdx]
  const currentDuration = DURATIONS[selectedDurationIdx]

  const currentSelectionPrice = Math.floor(currentQuota.price * currentDuration.multiplier)
  const currentSelectionSubtotal = currentSelectionPrice * purchaseQuantity

  // Cart Actions
  const addToCart = () => {
    const newItem: CartItem = {
      id: `item_${Date.now()}`,
      type: selectedType,
      name: `${currentQuota.label} (${currentDuration.label})`,
      amount: currentQuota.value,
      unit: currentConfig.unit,
      price: currentSelectionPrice,
      validity: currentDuration.label,
      quantity: purchaseQuantity,
      subtotal: currentSelectionSubtotal,
    }
    setCartItems([...cartItems, newItem])
    // Optional: Reset quantity to 1 after adding
    setPurchaseQuantity(1)
  }

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const cartTotal = cartItems.reduce((acc, item) => acc + item.subtotal, 0)

  // Mock Versions
  const getVersionsForOrder = (productName: string) => {
    if (productName.includes('数字冷轧')) return ['v2.4.1 (最新)', 'v2.4.0', 'v2.3.5']
    if (productName.includes('连退炉温')) return ['v1.2.0', 'v1.1.5']
    return ['v1.0.0']
  }

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) return
    // Reset modal states
    setTargetOrderId('')
    setSelectedVersion('')
    setPaymentMethod('alipay')
    setAgreementChecked(true) // Auto check

    // Auto-select eligible order
    const validOrders = orders.filter((o) => o.status === 'Active' || o.status === 'Trial')
    if (validOrders.length > 0) {
      setTargetOrderId(validOrders[0].id)
      const versions = getVersionsForOrder(validOrders[0].productName)
      setSelectedVersion(versions[0])
    }

    setIsPurchaseModalOpen(true)
  }

  const confirmPurchase = () => {
    if (!targetOrderId || !selectedVersion || !agreementChecked) return

    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      onPurchase(cartItems, targetOrderId, selectedVersion, paymentMethod)
      setIsPurchaseModalOpen(false)
      setCartItems([]) // Clear cart
    }, 1500)
  }

  // Eligible orders for dropdown
  const activeOrders = orders.filter((o) => o.status === 'Active' || o.status === 'Trial')

  const currentVersions = targetOrderId
    ? getVersionsForOrder(orders.find((o) => o.id === targetOrderId)?.productName || '')
    : []

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto h-full p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-10 text-white mb-8 relative overflow-hidden shadow-lg">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-3">资源包中心</h1>
            <p className="text-blue-200 max-w-2xl text-sm leading-relaxed">
              为您的智能体实例灵活补充算力与存储。即买即用，自动挂载，支持跨周期抵扣。
            </p>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform origin-bottom-right"></div>
          <Package className="absolute right-20 bottom-[-20px] text-white/10 w-64 h-64 rotate-12" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT: Configuration Panel */}
          <div className="flex-1 space-y-6 w-full">
            {/* 1. Product Type */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-base border-l-4 border-blue-600 pl-3">
                1. 产品类型 (Type)
              </h3>
              <div className="flex gap-4">
                {(Object.keys(CONFIG_OPTIONS) as Array<'token' | 'storage'>).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedType(type)
                      setSelectedQuotaIdx(0)
                    }}
                    className={`flex-1 py-4 px-6 rounded-xl border-2 flex items-center justify-center gap-3 transition-all ${
                      selectedType === type
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-100 hover:border-gray-200 text-gray-600'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${selectedType === type ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {CONFIG_OPTIONS[type].icon}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-sm">{CONFIG_OPTIONS[type].label}</div>
                    </div>
                    {selectedType === type && (
                      <CheckCircle size={20} className="ml-auto text-blue-600 fill-blue-100" />
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <Info size={14} className="mt-0.5 text-blue-500 flex-shrink-0" />
                {currentConfig.desc}
              </div>
            </div>

            {/* 2. Quota Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-base border-l-4 border-blue-600 pl-3">
                2. 资源规格 (Specification)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {currentConfig.quotas.map((quota, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedQuotaIdx(idx)}
                    className={`relative py-3 px-4 rounded-xl border transition-all text-left group ${
                      selectedQuotaIdx === idx
                        ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {quota.tag && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm z-10">
                        {quota.tag}
                      </span>
                    )}
                    <div
                      className={`text-sm font-bold mb-1 ${selectedQuotaIdx === idx ? 'text-blue-700' : 'text-gray-800'}`}
                    >
                      {quota.label}
                    </div>
                    <div className="text-xs text-gray-400 group-hover:text-gray-500">
                      基准价: ¥{quota.price}
                    </div>
                    {selectedQuotaIdx === idx && (
                      <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-b-[20px] border-b-blue-600 rounded-br-xl">
                        <CheckCircle
                          size={10}
                          className="text-white absolute right-[-17px] bottom-[-17px]"
                        />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Duration & Quantity Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-base border-l-4 border-blue-600 pl-3">
                3. 有效期与数量 (Duration & Quantity)
              </h3>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 mb-2">选择有效期</label>
                  <div className="flex gap-4">
                    {DURATIONS.map((dur, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedDurationIdx(idx)}
                        className={`relative py-3 px-6 rounded-xl border transition-all flex-1 ${
                          selectedDurationIdx === idx
                            ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        {dur.label}
                        {dur.tag && (
                          <span className="absolute -top-2 right-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm">
                            {dur.tag}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 mb-2">
                    购买数量 (个)
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPurchaseQuantity(Math.max(1, purchaseQuantity - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100"
                    >
                      <Minus size={16} className="text-gray-600" />
                    </button>
                    <div className="w-16 text-center font-mono font-bold text-lg text-gray-900 bg-gray-50 py-1.5 rounded-lg border border-gray-100">
                      {purchaseQuantity}
                    </div>
                    <button
                      onClick={() => setPurchaseQuantity(purchaseQuantity + 1)}
                      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100"
                    >
                      <Plus size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Rules & Instructions Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-100 overflow-x-auto">
                {RULES_CONTENT.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveRuleTab(tab.id)}
                    className={`px-6 py-4 text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${
                      activeRuleTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30'
                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
              <div className="p-6 bg-gray-50/30 min-h-[160px]">
                {RULES_CONTENT.find((r) => r.id === activeRuleTab)?.content}
              </div>
            </div>
          </div>

          {/* RIGHT: Cart & Summary Sidebar (Sticky) */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-6">
              {/* Current Selection Preview */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-xs font-bold text-gray-400 mb-2 uppercase">当前配置预览</div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-800 text-sm">
                    {currentQuota.label} / {currentDuration.label}
                  </span>
                  <span className="font-mono text-orange-600 font-bold">
                    ¥{currentSelectionSubtotal}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>数量: {purchaseQuantity}</span>
                  <button
                    onClick={addToCart}
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
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 border border-gray-200 rounded-xl relative group hover:border-blue-300 transition-colors bg-white"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-bold text-sm text-gray-800">{item.name}</div>
                        <button
                          onClick={() => removeFromCart(item.id)}
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
                  onClick={handleCheckoutClick}
                  disabled={cartItems.length === 0}
                  className={`w-full py-3.5 rounded-xl text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2 group ${
                    cartItems.length === 0
                      ? 'bg-gray-300 cursor-not-allowed shadow-none'
                      : 'bg-gray-900 hover:bg-black shadow-gray-200'
                  }`}
                >
                  去结算{' '}
                  <ChevronRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>

                <div className="mt-4 px-2 text-[10px] text-gray-400 text-center leading-relaxed">
                  点击去结算即代表同意《资源包服务协议》，购买后立即生效，不支持退款。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {isPurchaseModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <CreditCard size={18} className="text-blue-600" /> 订单确认
              </h3>
              <button onClick={() => setIsPurchaseModalOpen(false)}>
                <X size={20} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Items Summary */}
              <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-4 max-h-40 overflow-y-auto custom-scrollbar">
                <div className="text-xs font-bold text-blue-800 mb-2 uppercase">
                  包含商品 ({cartItems.length})
                </div>
                <div className="space-y-2">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-gray-700">
                      <span>
                        {item.name} <span className="text-xs text-gray-500">x{item.quantity}</span>
                      </span>
                      <span className="font-mono">¥{item.subtotal}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-blue-200 mt-3 pt-2 flex justify-between font-bold text-blue-900">
                  <span>合计</span>
                  <span>¥{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* 1. Instance Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  1. 挂载实例 (TARGET INSTANCE) <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar border border-gray-100 rounded-xl p-1">
                  {activeOrders.length > 0 ? (
                    activeOrders.map((order) => (
                      <div
                        key={order.id}
                        onClick={() => {
                          setTargetOrderId(order.id)
                          const vers = getVersionsForOrder(order.productName)
                          setSelectedVersion(vers[0])
                        }}
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                          targetOrderId === order.id
                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-sm text-gray-800">{order.productName}</div>
                          <div className="text-xs text-gray-500 font-mono">
                            {order.id} · {order.provider}
                          </div>
                        </div>
                        {targetOrderId === order.id && (
                          <CheckCircle size={18} className="text-blue-600" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 rounded-lg">
                      暂无有效订阅实例
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Version Selection */}
              {targetOrderId && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    2. 适配版本 (TARGET VERSION) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedVersion}
                      onChange={(e) => setSelectedVersion(e.target.value)}
                      className="w-full p-3 rounded-xl border border-blue-500 bg-blue-50 text-blue-700 font-bold outline-none appearance-none cursor-pointer hover:bg-blue-100 transition-colors"
                    >
                      {currentVersions.map((ver) => (
                        <option key={ver} value={ver}>
                          {ver}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none"
                    />
                  </div>
                </div>
              )}

              {/* 3. Payment Method */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  3. 支付方式 (PAYMENT) <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setPaymentMethod('alipay')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                      paymentMethod === 'alipay'
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                      支
                    </div>
                    <span className="text-sm font-bold">支付宝</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('wechat')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                      paymentMethod === 'wechat'
                        ? 'border-green-500 bg-green-50 ring-1 ring-green-500 text-green-700'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">
                      微
                    </div>
                    <span className="text-sm font-bold">微信支付</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('offline')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                      paymentMethod === 'offline'
                        ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500 text-orange-700'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <Building2
                      size={18}
                      className={paymentMethod === 'offline' ? 'text-orange-500' : 'text-gray-400'}
                    />
                    <span className="text-sm font-bold">线下支付</span>
                  </button>
                </div>
                {paymentMethod === 'offline' && (
                  <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-xs text-orange-800 mt-3">
                    <p className="font-bold mb-1">对公转账说明：</p>
                    <p>
                      请在提交订单后，下载
                      <span
                        className="text-blue-600 cursor-pointer hover:underline"
                        onClick={() => setShowPaymentApplicationModal(true)}
                      >
                        《支付申请单》
                      </span>
                      并交由财务进行对公转账。款项到账后系统将自动开通服务。
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100">
              {/* Agreement Checkbox */}
              <div className="flex items-start gap-2 mb-4 px-2">
                <input
                  type="checkbox"
                  id="modal-agreement"
                  className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  checked={agreementChecked}
                  onChange={(e) => setAgreementChecked(e.target.checked)}
                />
                <label
                  htmlFor="modal-agreement"
                  className="text-xs text-gray-500 cursor-pointer select-none"
                >
                  点击去结算即代表同意
                  <span
                    className="text-blue-600 hover:underline mx-1 font-medium"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowAgreementDetail(true)
                    }}
                  >
                    《资源包服务协议》
                  </span>
                  ，购买后立即生效，不支持退款。
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsPurchaseModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={
                    paymentMethod === 'offline'
                      ? () => {
                          confirmPurchase()
                          setShowPaymentApplicationModal(true)
                        }
                      : confirmPurchase
                  }
                  disabled={!targetOrderId || !selectedVersion || !agreementChecked || isProcessing}
                  className={`flex-1 py-2.5 rounded-xl text-white font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                    !targetOrderId || !selectedVersion || !agreementChecked || isProcessing
                      ? 'bg-gray-300 cursor-not-allowed shadow-none'
                      : 'bg-gray-900 hover:bg-black shadow-gray-300'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> 支付处理中...
                    </>
                  ) : paymentMethod === 'offline' ? (
                    '提交订单并下载《支付申请单》'
                  ) : (
                    `支付 ¥${cartTotal.toLocaleString()}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agreement Content Modal */}
      {showAgreementDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">资源包服务协议</h3>
              <button onClick={() => setShowAgreementDetail(false)}>
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
                onClick={() => {
                  setShowAgreementDetail(false)
                  setAgreementChecked(true)
                }}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-colors"
              >
                我已阅读并同意
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentApplicationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <FileText size={18} className="text-blue-600" /> 支付申请单预览
              </h3>
              <button
                onClick={() => setShowPaymentApplicationModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1 bg-gray-50">
              <div
                className="bg-white p-10 shadow-sm border border-gray-200 mx-auto max-w-xl"
                style={{ minHeight: '600px' }}
              >
                <div className="text-center mb-8 border-b-2 border-gray-900 pb-4">
                  <h1 className="text-2xl font-bold tracking-widest text-gray-900">支付申请单</h1>
                  <p className="text-sm text-gray-500 mt-2">PAYMENT APPLICATION FORM</p>
                </div>

                <div className="flex justify-between text-sm mb-6">
                  <div>
                    <span className="text-gray-500">申请日期：</span>{' '}
                    {new Date().toLocaleDateString()}
                  </div>
                  <div>
                    <span className="text-gray-500">订单编号：</span> ORD-{new Date().getFullYear()}
                    {String(new Date().getMonth() + 1).padStart(2, '0')}
                    {String(new Date().getDate()).padStart(2, '0')}-
                    {Math.floor(Math.random() * 1000)
                      .toString()
                      .padStart(3, '0')}
                  </div>
                </div>

                <table className="w-full border-collapse border border-gray-300 text-sm mb-8">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-3 bg-gray-50 w-32 font-medium">
                        收款方名称
                      </td>
                      <td className="border border-gray-300 p-3 font-bold">AI Studio 平台运营方</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 bg-gray-50 font-medium">
                        收款方账号
                      </td>
                      <td className="border border-gray-300 p-3 font-mono">1234 5678 9012 3456</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 bg-gray-50 font-medium">
                        开户银行
                      </td>
                      <td className="border border-gray-300 p-3">招商银行股份有限公司北京分行</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 bg-gray-50 font-medium">
                        支付金额
                      </td>
                      <td className="border border-gray-300 p-3">
                        <span className="font-bold text-lg">
                          ¥ {cartTotal.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 bg-gray-50 font-medium">
                        款项用途
                      </td>
                      <td className="border border-gray-300 p-3">
                        {cartItems.map((item) => item.name).join(', ')} 购买费用
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 bg-gray-50 font-medium">
                        备注说明
                      </td>
                      <td className="border border-gray-300 p-3 text-gray-600">
                        请在汇款附言中注明订单编号，以便财务及时核销。
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-between mt-16 pt-8 border-t border-gray-200">
                  <div className="text-center w-32">
                    <div className="border-b border-gray-400 h-8 mb-2"></div>
                    <span className="text-sm text-gray-500">申请人签字</span>
                  </div>
                  <div className="text-center w-32">
                    <div className="border-b border-gray-400 h-8 mb-2"></div>
                    <span className="text-sm text-gray-500">部门主管审批</span>
                  </div>
                  <div className="text-center w-32">
                    <div className="border-b border-gray-400 h-8 mb-2"></div>
                    <span className="text-sm text-gray-500">财务审批</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-white flex justify-end gap-3">
              <button
                onClick={() => setShowPaymentApplicationModal(false)}
                className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  alert('正在生成PDF并下载...')
                  setShowPaymentApplicationModal(false)
                }}
                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <Download size={16} /> 下载 PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResourcePackView
