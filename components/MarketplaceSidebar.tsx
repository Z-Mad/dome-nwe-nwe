import type { TenantInfo } from '@/services/system'
import { useUserStore } from '@/utils/user'
import {
  Bell,
  Book,
  Box,
  Check,
  ChevronDown,
  Layers,
  LayoutGrid,
  LineChart,
  LogOut,
  Package,
  PlusCircle,
  Search,
  Settings,
  Shield,
  User,
  Zap,
} from 'lucide-react'
import React, { useState } from 'react'

interface SidebarProps {
  currentView: string
  onChangeView: (view: string) => void
  onPublish: () => void
}

const MarketplaceSidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onPublish }) => {
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const { userInfo, tenantList, refreshUser, checkDeveloper } = useUserStore()

  const handleSwitchAccount = async (tenantId: string) => {
    try {
      if (tenantId !== userInfo?.tenantId) {
        await refreshUser(tenantId, true)
        setShowAccountMenu(false)
      }
    } catch (error) {
      console.error('切换租户失败:', error)
    }
  }

  const menuItems = [
    { id: 'discovery', icon: <Search size={18} />, label: '探索', isHeader: false },
    { id: 'market_header', label: '市场 MARKETPLACE', isHeader: true },
    { id: 'method_agents', icon: <Box size={18} />, label: '方法智能体' },
    { id: 'analysis_agents', icon: <LineChart size={18} />, label: '分析智能体' },
    { id: 'resource_packs', icon: <Package size={18} />, label: '资源包' },
    { id: 'services', icon: <Zap size={18} />, label: '生产性服务' },
    { id: 'categories', icon: <Layers size={18} />, label: '类别' },
    { id: 'demand_header', label: '需求 DEMAND', isHeader: true },
    { id: 'demand_square', icon: <Search size={18} />, label: '需求广场' },
    { id: 'personal_header', label: '我的 PERSONAL', isHeader: true },
    { id: 'profile', icon: <User size={18} />, label: '个人中心' },
    { id: 'messages', icon: <Bell size={18} />, label: '消息中心', badge: 5 }, // Added Badge
    { id: 'settings', icon: <Settings size={18} />, label: '设置' },
  ]

  const getRoleLabel = () => {
    if (checkDeveloper) {
      return '开发者'
    } else if (userInfo?.ownerUserId == userInfo?.userId) {
      return '管理员'
    } else {
      return '访客'
    }
  }

  return (
    <div className="w-64 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col h-full hidden md:flex sticky top-0 z-50">
      <div
        className="p-6 pb-2 flex items-center gap-3 cursor-pointer"
        onClick={() => onChangeView('discovery')}
      >
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-blue-200 shadow-lg">
          <LayoutGrid size={20} />
        </div>
        <span className="font-bold text-gray-800 text-lg tracking-tight">维观市场</span>
      </div>

      {/* Account Switcher */}
      <div className="px-4 mb-2 mt-4 relative">
        <button
          onClick={() => setShowAccountMenu(!showAccountMenu)}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors text-left border border-transparent hover:border-gray-200"
        >
          <img
            src={userInfo?.avatar || '/default-avatar.png'}
            className="w-8 h-8 rounded-full border border-gray-100"
            alt="avatar"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-gray-800 truncate">
              {userInfo?.deptName || '未登录'}
            </div>
            <div className="text-[10px] text-gray-500 truncate flex items-center gap-1">
              <Shield size={10} /> {getRoleLabel()}
            </div>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        {showAccountMenu && (
          <div className="absolute top-full left-4 right-4 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-[10px] font-bold text-gray-400 px-3 py-2 uppercase">切换账号</div>
            <div className="max-h-[400px] overflow-auto">
              {tenantList.map((tenant: TenantInfo) => (
                <button
                  key={tenant.tenantId}
                  onClick={() => handleSwitchAccount(tenant.tenantId)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${userInfo?.tenantId === tenant.tenantId ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  <img src={tenant.logoUrl || '/tenantImg.png'} className="w-6 h-6 rounded-full" />
                  <div className="flex-1 text-left">
                    <div
                      className={`text-xs font-bold ${userInfo?.deptId === tenant.tenantId ? 'text-gray-900' : 'text-gray-600'}`}
                    >
                      {tenant.tenantName}
                    </div>
                  </div>
                  {userInfo?.deptId === tenant.tenantId && (
                    <Check size={12} className="text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Publish Button - Hidden for Viewers */}
      <div className="px-6 mb-2 mt-2">
        {checkDeveloper ? (
          <button
            onClick={onPublish}
            className="w-full bg-gray-900 hover:bg-black text-white py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-gray-200"
          >
            <PlusCircle size={16} />
            发布智能体
          </button>
        ) : (
          <div className="w-full bg-gray-50 text-gray-400 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 border border-gray-100 cursor-not-allowed">
            <PlusCircle size={16} />
            发布权限受限
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-1 py-2 custom-scrollbar">
        {menuItems.map((item, idx) =>
          item.isHeader ? (
            <div
              key={idx}
              className="px-3 pt-6 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider"
            >
              {item.label}
            </div>
          ) : (
            <button
              key={idx}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative group ${
                currentView === item.id || (currentView === 'detail' && item.id === 'method_agents')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {/* Badge for Messages */}
              {item.badge && item.badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 min-w-[1.2rem] h-[1.2rem] flex items-center justify-center rounded-full shadow-sm">
                  {item.badge}
                </span>
              )}
            </button>
          ),
        )}
      </div>

      <div className="p-4 border-t border-gray-100 space-y-2">
        <button
          onClick={() => onChangeView('documentation')}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm border rounded-lg justify-center transition-colors ${
            currentView === 'documentation'
              ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold'
              : 'text-gray-500 hover:text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Book size={16} />
          <span>产品文档</span>
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-600 border border-transparent hover:border-gray-200 rounded-lg justify-center hover:bg-gray-50 transition-colors">
          <LogOut size={16} />
          <span>退出市场</span>
        </button>
      </div>
    </div>
  )
}

export default MarketplaceSidebar
