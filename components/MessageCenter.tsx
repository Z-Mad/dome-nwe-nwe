
import React, { useState, useEffect, useRef } from 'react';
import { 
    Search, MoreVertical, Phone, Video, Send, Paperclip, 
    Smile, Image as ImageIcon, Bot, User, Check, Clock,
    Headphones, ShieldCheck
} from 'lucide-react';

interface Message {
    id: string;
    senderId: 'me' | string;
    text: string;
    time: string;
    type: 'text' | 'image' | 'system';
}

interface Contact {
    id: string;
    name: string;
    avatar: string;
    role: string;
    lastMessage: string;
    lastTime: string;
    unread: number;
    status: 'online' | 'offline' | 'busy';
    isBot?: boolean;
}

interface MessageCenterProps {
    initialParams?: { conversationId?: string };
    systemNotifications?: Message[];
}

const MessageCenter: React.FC<MessageCenterProps> = ({ initialParams, systemNotifications }) => {
    // --- Mock Data ---
    const contacts: Contact[] = [
        {
            id: 'sys_01',
            name: '冷轧 AI 助手',
            avatar: 'bot', 
            role: 'System Notification',
            lastMessage: '已为您生成昨天的板形质量报告。',
            lastTime: '10:42 AM',
            unread: 0,
            status: 'online',
            isBot: true
        },
        {
            id: 'manager_james',
            name: '客户经理 - 张大伟',
            avatar: 'https://picsum.photos/seed/manager_james/100/100',
            role: '宝信软件 · 销售总监',
            lastMessage: '关于您咨询的报价方案，我们已经做好了...',
            lastTime: '昨天',
            unread: 2,
            status: 'online'
        },
        {
            id: 'tech_support',
            name: '技术支持 - 李工',
            avatar: 'https://picsum.photos/seed/tech_li/100/100',
            role: '工单 #20240415-001 已受理',
            lastMessage: '好的，请提供一下机组的日志文件。',
            lastTime: '周一',
            unread: 0,
            status: 'busy'
        }
    ];

    const initialMessages: Record<string, Message[]> = {
        'manager_james': [
            { id: '1', senderId: 'manager_james', text: '王总您好，我是负责对接贵公司的客户经理张大伟。', time: '昨天 14:20', type: 'text' },
            { id: '2', senderId: 'manager_james', text: '关于您咨询的报价方案，我们已经做好了初步拟定，稍后发给您确认。', time: '昨天 14:21', type: 'text' }
        ],
        'sys_01': [
            { id: 's1', senderId: 'sys_01', text: '欢迎使用数字冷轧质量管理系统。', time: '周一 09:00', type: 'text' },
            { id: 's2', senderId: 'sys_01', text: '昨日产线运行平稳，综合良品率 98.2%。', time: '10:42 AM', type: 'text' }
        ],
        'tech_support': [
            { id: 't1', senderId: 'me', text: '你好，我们订购的API调用偶尔会超时。', time: '周一 10:00', type: 'text' },
            { id: 't2', senderId: 'tech_support', text: '收到，正在排查节点连接性。', time: '周一 10:05', type: 'text' }
        ]
    };

    // --- State ---
    const [activeChatId, setActiveChatId] = useState<string>(initialParams?.conversationId || 'sys_01');
    const [chatHistory, setChatHistory] = useState(initialMessages);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // --- Effects ---
    useEffect(() => {
        if (initialParams?.conversationId) {
            setActiveChatId(initialParams.conversationId);
        }
    }, [initialParams]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeChatId, chatHistory]);

    useEffect(() => {
        if (systemNotifications && systemNotifications.length > 0) {
            setChatHistory(prev => {
                const existingIds = new Set(prev['sys_01']?.map(m => m.id) || []);
                const newMessages = systemNotifications.filter(n => !existingIds.has(n.id));
                
                if (newMessages.length === 0) return prev;

                return {
                    ...prev,
                    'sys_01': [...(prev['sys_01'] || []), ...newMessages]
                };
            });
        }
    }, [systemNotifications]);

    // --- Handlers ---
    const handleSend = () => {
        if (!inputText.trim()) return;
        
        const newMessage: Message = {
            id: Date.now().toString(),
            senderId: 'me',
            text: inputText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'text'
        };

        setChatHistory(prev => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), newMessage]
        }));
        setInputText('');

        // Mock Auto Reply
        if (activeChatId === 'sys_01') {
            setTimeout(() => {
                setChatHistory(prev => ({
                    ...prev,
                    [activeChatId]: [...prev[activeChatId], {
                        id: Date.now().toString(),
                        senderId: 'sys_01',
                        text: '抱歉，我是自动助理，无法处理复杂指令。请联系人工客服。',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        type: 'text'
                    }]
                }));
            }, 1000);
        }
    };

    const activeContact = contacts.find(c => c.id === activeChatId) || contacts[0];

    return (
        <div className="flex h-full bg-white overflow-hidden">
            {/* Left: Contact List */}
            <div className="w-80 border-r border-gray-100 flex flex-col bg-white">
                <div className="p-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">消息中心</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                        <input 
                            type="text" 
                            placeholder="搜索联系人..." 
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {contacts.map(contact => (
                        <div 
                            key={contact.id}
                            onClick={() => setActiveChatId(contact.id)}
                            className={`flex items-start gap-3 p-4 cursor-pointer transition-colors border-l-4 ${
                                activeChatId === contact.id 
                                ? 'bg-blue-50/50 border-blue-600' 
                                : 'hover:bg-gray-50 border-transparent'
                            }`}
                        >
                            <div className="relative flex-shrink-0">
                                {contact.isBot ? (
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                        <Bot size={20}/>
                                    </div>
                                ) : (
                                    <img src={contact.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover"/>
                                )}
                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                    contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                                }`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className={`text-sm font-bold ${activeChatId === contact.id ? 'text-blue-900' : 'text-gray-900'}`}>
                                        {contact.name}
                                    </span>
                                    <span className="text-[10px] text-gray-400">{contact.lastTime}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-gray-500 truncate max-w-[140px]">
                                        {contact.isBot ? '为您生成昨天的板形质量报告...' : contact.lastMessage}
                                    </p>
                                    {contact.unread > 0 && (
                                        <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                            {contact.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Chat Window */}
            <div className="flex-1 flex flex-col bg-gray-50/30">
                {/* Header */}
                <div className="h-16 border-b border-gray-100 bg-white px-6 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-3">
                        {activeContact.isBot ? (
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
                                <Bot size={20}/>
                            </div>
                        ) : (
                            <img src={activeContact.avatar} className="w-10 h-10 rounded-full object-cover shadow-sm" alt="avatar"/>
                        )}
                        <div>
                            <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                {activeContact.name}
                                {activeContact.status === 'online' && <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>}
                            </div>
                            <div className="text-xs text-gray-500">{activeContact.role}</div>
                        </div>
                    </div>
                    <div className="flex gap-4 text-gray-400">
                        <Phone size={20} className="hover:text-blue-600 cursor-pointer transition-colors"/>
                        <Video size={20} className="hover:text-blue-600 cursor-pointer transition-colors"/>
                        <MoreVertical size={20} className="hover:text-gray-600 cursor-pointer transition-colors"/>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="text-center text-xs text-gray-300 my-4">--- 与 {activeContact.name} 的加密会话 ---</div>
                    
                    {chatHistory[activeChatId]?.map((msg, index) => (
                        <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                            {msg.senderId !== 'me' && (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 mr-3 overflow-hidden">
                                    {activeContact.isBot ? (
                                        <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white"><Bot size={16}/></div>
                                    ) : (
                                        <img src={activeContact.avatar} className="w-full h-full object-cover"/>
                                    )}
                                </div>
                            )}
                            <div className="max-w-[70%]">
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    msg.senderId === 'me' 
                                    ? 'bg-blue-600 text-white rounded-br-none' 
                                    : 'bg-white text-gray-700 rounded-bl-none border border-gray-100'
                                }`}>
                                    {msg.text}
                                </div>
                                <div className={`text-[10px] text-gray-400 mt-1 ${msg.senderId === 'me' ? 'text-right' : 'text-left'}`}>
                                    {msg.time}
                                </div>
                            </div>
                            {msg.senderId === 'me' && (
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 ml-3 flex items-center justify-center text-indigo-600 overflow-hidden">
                                    <User size={16}/>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <div className="flex gap-4 mb-3 text-gray-400 px-2">
                        <ImageIcon size={20} className="hover:text-blue-600 cursor-pointer transition-colors"/>
                        <Paperclip size={20} className="hover:text-blue-600 cursor-pointer transition-colors"/>
                        <Smile size={20} className="hover:text-blue-600 cursor-pointer transition-colors"/>
                    </div>
                    <div className="flex gap-3">
                        <input 
                            type="text" 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="输入消息..." 
                            className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 border rounded-xl px-4 py-3 text-sm outline-none transition-all"
                        />
                        <button 
                            onClick={handleSend}
                            className={`p-3 rounded-xl transition-all shadow-md flex items-center justify-center ${
                                inputText.trim() 
                                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            <Send size={18}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageCenter;
