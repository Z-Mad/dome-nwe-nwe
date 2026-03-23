
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, FileText, BarChart2, GitBranch, MessageCircle, X, Layers, FileBarChart, AlertTriangle, CheckCircle } from 'lucide-react';
import { INITIAL_CHAT_HISTORY } from '../constants';
import { Message } from '../types';

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_CHAT_HISTORY);
  const [inputValue, setInputValue] = useState('');
  const [isThinkingModeOpen, setIsThinkingModeOpen] = useState(true); // Default open as per screenshot
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');

    // Simulate AI response with a structured Quality Report
    setTimeout(() => {
        const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            content: (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-2">
                    <FileBarChart className="text-blue-600" size={20} />
                    <div>
                        <span className="font-bold text-gray-800 block text-base">质量分析报告: 钢卷 #88392</span>
                        <span className="text-xs text-gray-500">生成时间: 刚刚</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                        <span className="text-gray-500 text-xs block mb-1">厚度偏差 (AGC)</span>
                        <div className="flex items-baseline gap-2">
                           <span className="text-gray-800 font-mono font-bold text-lg">+2.4μm</span>
                           <span className="text-green-600 text-xs bg-green-50 px-1 rounded flex items-center"><CheckCircle size={10} className="mr-1"/> 合格</span>
                        </div>
                        <div className="w-full bg-gray-200 h-1 mt-2 rounded-full overflow-hidden">
                           <div className="bg-green-500 h-full w-[60%]"></div>
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                        <span className="text-gray-500 text-xs block mb-1">板形平直度 (I-Unit)</span>
                         <div className="flex items-baseline gap-2">
                           <span className="text-gray-800 font-mono font-bold text-lg">5.8</span>
                           <span className="text-yellow-600 text-xs bg-yellow-50 px-1 rounded flex items-center"><AlertTriangle size={10} className="mr-1"/> 波动</span>
                        </div>
                         <div className="w-full bg-gray-200 h-1 mt-2 rounded-full overflow-hidden">
                           <div className="bg-yellow-500 h-full w-[80%]"></div>
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm col-span-2">
                        <div className="flex justify-between items-start">
                             <div>
                                <span className="text-gray-500 text-xs block mb-1">表面缺陷检测 (Parsytec)</span>
                                <span className="text-red-600 font-bold block">检测到 2 处异常</span>
                             </div>
                             <div className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-medium">等级 C</div>
                        </div>
                        <div className="mt-2 space-y-1">
                             <div className="flex justify-between text-xs text-gray-600 bg-gray-50 p-1 rounded">
                                <span>1. 周期性辊印 (Top)</span>
                                <span>Zone 2: 1250m</span>
                             </div>
                             <div className="flex justify-between text-xs text-gray-600 bg-gray-50 p-1 rounded">
                                <span>2. 边部裂纹 (Drive Side)</span>
                                <span>Zone 4: 1280m</span>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-sm">
                    <p className="font-semibold text-blue-800 mb-1 text-xs uppercase tracking-wider">AI 诊断建议:</p>
                    <p className="text-gray-700 leading-relaxed text-xs">
                        厚度控制尚在公差范围内，但板形I-Unit值出现高频波动。建议立即检查 <strong>3号机架弯辊力设定</strong>，并关注冷却液喷嘴是否堵塞。对于表面缺陷，建议下一卷降速至 <strong>800mpm</strong> 运行并进行人工复检。
                    </p>
                </div>
                
                <div className="flex gap-2 mt-2">
                    <button className="flex-1 bg-white border border-gray-200 text-gray-600 py-2 rounded-lg text-xs hover:bg-gray-50">查看趋势图</button>
                    <button className="flex-1 bg-white border border-gray-200 text-gray-600 py-2 rounded-lg text-xs hover:bg-gray-50">导出PDF</button>
                </div>
            </div>
            ),
            timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  return (
    <div className="flex-1 h-full flex flex-col relative bg-white">
      {/* Header */}
      <div className="h-16 border-b border-gray-100 flex items-center px-6 justify-between shrink-0">
        <div>
           <h2 className="font-semibold text-gray-800">冷轧首席AI助手</h2>
           <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             <span className="text-xs text-gray-400">在线 | 延迟 5ms</span>
           </div>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
             <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">TCM 2号连轧线已连接</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                 <img src="https://picsum.photos/100/100" alt="AI Avatar" className="w-full h-full rounded-full object-cover" />
              </div>
            )}
            <div
              className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {/* Mock user question from screenshot */}
        <div className="flex justify-end">
             <div className="bg-blue-600 text-white rounded-2xl rounded-br-none p-4 max-w-[70%] text-sm">
                最近这批钢卷有什么问题吗？我们该如何解决板形缺陷？
             </div>
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Input Area & Modal Container */}
      <div className="absolute bottom-6 left-6 right-6 flex flex-col items-center">
        
        {/* The Dark "Thinking Mode" Modal (Replicating screenshot) */}
        {isThinkingModeOpen && (
          <div className="w-full max-w-lg bg-[#1e1e2d] rounded-3xl p-5 shadow-2xl mb-4 text-white animate-fade-in-up border border-gray-700/50 backdrop-blur-xl">
             <div className="flex justify-between items-center mb-4 border-b border-gray-700/50 pb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">深度思考模式</span>
                <button onClick={() => setIsThinkingModeOpen(false)} className="text-gray-500 hover:text-white">
                    <X size={16} />
                </button>
             </div>

             <div className="grid grid-cols-2 gap-3 mb-6">
                <button className="flex items-center gap-3 bg-[#2b2b40] hover:bg-[#363650] p-3 rounded-xl transition-colors text-left group border border-transparent hover:border-blue-500/30">
                    <div className="p-2 bg-gray-700/50 rounded-lg group-hover:bg-blue-500/20 text-gray-300 group-hover:text-blue-400 transition-colors">
                        <FileBarChart size={18} />
                    </div>
                    <span className="text-sm font-medium text-gray-200">生产报告</span>
                </button>
                <button className="flex items-center gap-3 bg-blue-600/90 hover:bg-blue-600 p-3 rounded-xl transition-colors text-left shadow-lg shadow-blue-900/50 border border-blue-500/50">
                    <div className="p-2 bg-white/20 rounded-lg text-white">
                         <Layers size={18} />
                    </div>
                    <span className="text-sm font-medium">质量报告</span>
                </button>
                 <button className="flex items-center gap-3 bg-[#2b2b40] hover:bg-[#363650] p-3 rounded-xl transition-colors text-left group border border-transparent hover:border-blue-500/30">
                    <div className="p-2 bg-gray-700/50 rounded-lg group-hover:bg-blue-500/20 text-gray-300 group-hover:text-blue-400 transition-colors">
                        <BarChart2 size={18} />
                    </div>
                    <span className="text-sm font-medium text-gray-200">数字化报告</span>
                </button>
                <button className="flex items-center gap-3 bg-[#2b2b40] hover:bg-[#363650] p-3 rounded-xl transition-colors text-left group border border-transparent hover:border-blue-500/30">
                    <div className="p-2 bg-gray-700/50 rounded-lg group-hover:bg-blue-500/20 text-gray-300 group-hover:text-blue-400 transition-colors">
                        <MessageCircle size={18} />
                    </div>
                    <span className="text-sm font-medium text-gray-200">专家问答</span>
                </button>
             </div>

             <div className="mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3">展示方案</span>
                <div className="space-y-2">
                     <button className="w-full flex items-center justify-between bg-blue-500 p-3 rounded-xl text-left transition-colors hover:bg-blue-600 shadow-md">
                        <div className="flex items-center gap-3">
                            <Sparkles size={18} className="text-white" />
                            <span className="text-sm font-medium">AI输出 (默认)</span>
                        </div>
                    </button>
                    <button className="w-full flex items-center justify-between bg-[#2b2b40] p-3 rounded-xl text-left transition-colors hover:bg-[#363650] group">
                        <div className="flex items-center gap-3">
                            <BarChart2 size={18} className="text-gray-400 group-hover:text-blue-400" />
                            <span className="text-sm font-medium text-gray-300 group-hover:text-white">BI分析图表</span>
                        </div>
                    </button>
                     <button className="w-full flex items-center justify-between bg-[#2b2b40] p-3 rounded-xl text-left transition-colors hover:bg-[#363650] group">
                        <div className="flex items-center gap-3">
                            <GitBranch size={18} className="text-gray-400 group-hover:text-blue-400" />
                            <span className="text-sm font-medium text-gray-300 group-hover:text-white">思维导图</span>
                        </div>
                    </button>
                </div>
             </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-200 p-2 flex items-center gap-2">
            <button 
                onClick={() => setIsThinkingModeOpen(!isThinkingModeOpen)}
                className={`p-3 rounded-xl transition-colors ${isThinkingModeOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
                <Sparkles size={20} />
            </button>
            <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="询问关于轧制力、厚度或缺陷的问题..." 
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 px-2"
            />
            <button 
                onClick={handleSendMessage}
                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-md shadow-blue-200"
            >
                <Send size={18} />
            </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2">内容由数字冷轧质量AI生成，仅供参考。</p>
      </div>
    </div>
  );
};

export default ChatPanel;
