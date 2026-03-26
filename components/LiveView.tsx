import { Gift, Heart, Radio, Send, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const LiveView: React.FC = () => {
  const [messages, setMessages] = useState([
    { user: '钢铁侠007', text: '这个界面看起来很清爽啊', color: 'text-blue-500' },
    { user: '轧钢老王', text: '对厚度偏差的预测准确率有多少？', color: 'text-orange-500' },
    { user: 'TechObserver', text: '这是基于Gemini模型微调的吗？', color: 'text-purple-500' },
    { user: 'DataMiner', text: '感觉比我们现在的系统快多了', color: 'text-green-500' },
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      const newMsgs = [
        { user: '游客9527', text: '有没有移动端版本？', color: 'text-gray-500' },
        { user: 'ProductionLead', text: '报警机制很实用', color: 'text-red-500' },
        { user: 'AI_Fan', text: '主播能演示一下缺陷追溯吗？', color: 'text-blue-400' },
      ]
      const randomMsg = newMsgs[Math.floor(Math.random() * newMsgs.length)]
      setMessages((prev) => [...prev.slice(-8), randomMsg])
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="h-full bg-[#0f0f13] text-white flex overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* Left: Main Stream Area */}
      <div className="flex-1 flex flex-col relative p-4">
        <div className="flex-1 bg-[#1a1a23] rounded-2xl overflow-hidden relative border border-gray-800">
          {/* Background Stream Simulation */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center opacity-30">
              <Radio size={64} className="mx-auto mb-4 animate-pulse" />
              <p className="text-2xl font-bold">LIVE SIGNAL</p>
            </div>
            {/* Overlay actual app screenshot or similar for effect */}
            <img
              src="https://picsum.photos/seed/factory_tech/1600/900"
              alt="stream"
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
            />
          </div>

          {/* Host Pip */}
          <div className="absolute top-4 right-4 w-48 aspect-video bg-black rounded-lg border border-gray-700 shadow-xl overflow-hidden">
            <img
              src="https://picsum.photos/seed/host/300/200"
              alt="host"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 left-2 text-[10px] bg-red-600 px-1 rounded text-white">
              LIVE
            </div>
          </div>

          {/* Stream Overlays */}
          <div className="absolute top-6 left-6">
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <img
                src="https://picsum.photos/seed/avatar_host/100/100"
                className="w-8 h-8 rounded-full border border-white"
              />
              <div>
                <p className="text-xs font-bold text-white">科技观察员</p>
                <p className="text-[10px] text-gray-300">12.5w 订阅</p>
              </div>
              <button className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-full font-bold ml-2">
                + 关注
              </button>
            </div>
          </div>

          <div className="absolute bottom-8 left-8 max-w-2xl">
            <h2 className="text-2xl font-bold drop-shadow-md mb-2">
              正在直播：AI助手实战演示 - 如何处理轧制力异常
            </h2>
            <p className="text-gray-200 text-sm drop-shadow-md bg-black/30 p-2 rounded inline-block">
              本场直播我们将连线一线工程师，展示“数智冷轧AI”在真实生产环境中的表现。点击右下角商品链接查看详细技术白皮书。
            </p>
          </div>
        </div>
      </div>

      {/* Right: Chat & Interaction */}
      <div className="w-80 bg-[#16161d] border-l border-gray-800 flex flex-col">
        <div className="h-14 border-b border-gray-800 flex items-center px-4 justify-between">
          <span className="font-bold text-gray-200">实时互动</span>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <User size={12} />
            <span>3,429 人在线</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-medium text-sm">
          <div className="text-center text-xs text-gray-500 my-4">-- 欢迎来到直播间 --</div>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className="flex gap-2 items-start animate-in slide-in-from-left-2 fade-in duration-300"
            >
              <span className={`font-bold whitespace-nowrap ${msg.color}`}>{msg.user}:</span>
              <span className="text-gray-300 break-all">{msg.text}</span>
            </div>
          ))}
        </div>

        <div className="p-4 bg-[#1a1a23] border-t border-gray-800">
          <div className="flex gap-2 mb-3 justify-end">
            <button className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors">
              <Gift size={16} className="text-pink-400" />
            </button>
            <button className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors">
              <Heart size={16} className="text-red-500" />
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="说点什么..."
              className="w-full bg-[#0f0f13] border border-gray-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
            <button className="absolute right-1 top-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700">
              <Send size={14} className="ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveView
