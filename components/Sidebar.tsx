import React from 'react';
import { Database, BookOpen, Shield, Settings, LogOut, Cpu } from 'lucide-react';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: <Cpu size={20} />, label: '思考', active: true },
    { icon: <Database size={20} />, label: '数据', active: false },
    { icon: <BookOpen size={20} />, label: '经验', active: false },
    { icon: <Shield size={20} />, label: '权限', active: false },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col justify-between py-6">
      <div>
        {/* Header / Logo Area */}
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
             <img src="https://picsum.photos/100/100" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-sm">质量智脑 AI</h1>
            <p className="text-[10px] text-gray-500 leading-tight mt-0.5">数智冷轧质量管理的方法智能体</p>
          </div>
        </div>

        {/* Main Menu */}
        <div className="px-4 space-y-1">
          <div className="text-xs font-semibold text-gray-400 mb-2 px-2">核心工作区</div>
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.active && <span className="ml-auto text-xs opacity-70">{'>'}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="px-4 space-y-1">
         <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
            <Settings size={20} />
            <span>智能体设置</span>
         </button>
         <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
            <LogOut size={20} />
            <span>退出登录</span>
         </button>
      </div>
    </div>
  );
};

export default Sidebar;