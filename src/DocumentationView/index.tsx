
import React, { useState } from 'react';
import { 
    Book,  ChevronRight, Cpu, 
     Layers, Key, ShieldCheck,
     Download, 
     Zap, Server, Globe, Code, Lock, Share2, Workflow, Coins, Scale, Factory, Package,
    Table, MousePointer, Eye,  List, PieChart,
   
    Rocket, Trophy, Sparkles, Map,  HardHat, Briefcase
} from 'lucide-react';

const DocumentationView: React.FC = () => {
    const [activeSection, setActiveSection] = useState('overview');

    // --- Helper Visual Components ---

    const SectionHeader = ({ title, subtitle, icon: Icon }: any) => (
        <div className="border-b border-gray-200 pb-6 mb-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Icon size={24} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            </div>
            <p className="text-gray-500 text-lg leading-relaxed ml-1">{subtitle}</p>
        </div>
    );

    const SpecTable = ({ headers, rows, title }: { headers: string[], rows: string[][], title?: string }) => (
        <div className="mb-8">
            {title && <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2"><Table size={14}/> {title}</h4>}
            <div className="border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
                <table className="w-full text-sm text-left min-w-max">
                    <thead className="bg-gray-50 font-bold text-gray-700 border-b border-gray-200">
                        <tr>
                            {headers.map((h, i) => <th key={i} className="px-6 py-3 whitespace-nowrap bg-gray-50/50">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {rows.map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                {row.map((cell, j) => (
                                    <td key={j} className="px-6 py-4 text-gray-600 font-mono text-xs md:text-sm leading-relaxed align-top">
                                        <div dangerouslySetInnerHTML={{ __html: cell }} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const FlowStep = ({ label, desc, type = 'normal' }: any) => {
        let bg = 'bg-white border-gray-200';
        let text = 'text-gray-800';
        let icon = null;

        if (type === 'start') { bg = 'bg-green-50 border-green-200'; text = 'text-green-800'; icon = <div className="w-2 h-2 rounded-full bg-green-500 mb-1"/>; }
        if (type === 'decision') { bg = 'bg-yellow-50 border-yellow-200'; text = 'text-yellow-800'; icon = <div className="w-2 h-2 rotate-45 bg-yellow-500 mb-1"/>; }
        if (type === 'end') { bg = 'bg-red-50 border-red-200'; text = 'text-red-800'; icon = <div className="w-2 h-2 rounded-sm bg-red-500 mb-1"/>; }
        if (type === 'system') { bg = 'bg-blue-50 border-blue-200'; text = 'text-blue-800'; icon = <Cpu size={12} className="text-blue-500 mb-1"/>; }
        if (type === 'action') { bg = 'bg-gray-50 border-gray-300 border-dashed'; text = 'text-gray-600'; icon = <MousePointer size={12} className="text-gray-400 mb-1"/>; }

        return (
            <div className={`flex flex-col items-center p-3 rounded-lg border shadow-sm min-w-[120px] max-w-[140px] text-center z-10 transition-transform hover:scale-105 ${bg}`}>
                {icon}
                <span className={`font-bold text-xs ${text}`}>{label}</span>
                {desc && <span className="text-[9px] text-gray-500 mt-1 leading-tight">{desc}</span>}
            </div>
        );
    };

    const FlowArrow = ({ label }: { label?: string }) => (
        <div className="flex-1 h-px bg-gray-300 relative mx-2 min-w-[30px] flex items-center justify-center">
            {label && <span className="absolute -top-3 text-[9px] text-gray-500 bg-white px-1 whitespace-nowrap border border-gray-100 rounded">{label}</span>}
            <ChevronRight size={14} className="absolute right-0 text-gray-300 -mt-[7px]" />
        </div>
    );

    const ModuleSection = ({ title, id, children }: any) => (
        <div id={id} className="mb-12 scroll-mt-20">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-4">{title}</h2>
            {children}
        </div>
    );

    // --- Content Renderers ---

    const renderOverview = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader 
                title="1. 产品综述 (Product Overview)" 
                subtitle="维观市场 (Weiguan Marketplace) 是专为钢铁重工行业打造的工业智能体（Industrial Agents）分发与交易操作系统。"
                icon={Globe}
            />

            {/* Vision & Goals Section */}
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden mb-12">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-500/20 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
                            <Rocket size={28} className="text-blue-400 animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight">产品愿景与目标 (Vision & Goals)</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                        {/* Vision Card */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/30 rounded-full border border-blue-400/30 text-[10px] font-bold tracking-[0.2em] uppercase text-blue-200">
                                <Sparkles size={10}/> Our Vision
                            </div>
                            <h3 className="text-3xl font-bold leading-tight">
                                引领钢铁工业的 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">“数智零缺陷”</span> 时代
                            </h3>
                            <p className="text-blue-100/70 text-sm leading-relaxed text-justify">
                                我们致力于构建一个打破 OT（生产技术）与 IT（信息技术）边界的数字化操作系统。通过标准化的工业智能体网络，将顶尖专家的隐性知识转化为可计算、可分发的算法资产，助力全球钢企实现冷轧产线的零缺陷、全自动与可持续制造。
                            </p>
                        </div>

                        {/* Goals Grid */}
                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { title: '连接 (Connect)', desc: '消除工序壁垒，实现从炼铁到冷轧全流程 100% 数字化感知。', icon: Share2, color: 'text-blue-400' },
                                { title: '赋能 (Empower)', desc: '使中小钢企以 1/10 的成本获取世界级工艺模型。', icon: Zap, color: 'text-yellow-400' },
                                { title: '标准化 (Standard)', desc: '定义工业知识资产化的 I/O 协议，实现知识即服务 (KaaS)。', icon: ShieldCheck, color: 'text-green-400' },
                                { title: '生态 (Ecosystem)', desc: '汇聚 10,000+ 工业开发者，打造千亿级规模的智能资产市场。', icon: Trophy, color: 'text-purple-400' }
                            ].map((goal, i) => (
                                <div key={i} className="bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-white/10 transition-all group backdrop-blur-sm">
                                    <div className={`mb-3 p-2 rounded-lg bg-slate-800 w-fit ${goal.color}`}>
                                        <goal.icon size={20}/>
                                    </div>
                                    <h4 className="font-bold text-sm mb-1 group-hover:translate-x-1 transition-transform">{goal.title}</h4>
                                    <p className="text-xs text-blue-100/50 leading-relaxed">{goal.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px]"></div>
                <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
                    <Factory size={400}/>
                </div>
            </div>

            {/* Core User Personas (Added) */}
            <div className="mb-12">
                <h3 className="text-lg font-bold text-gray-900 mb-6 border-l-4 border-indigo-600 pl-3">1.2 核心用户画像 (Core Personas)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Buyer Persona */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Briefcase size={80}/>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                <HardHat size={24}/>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900">买家：钢企工程师/管理者</h4>
                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">需求侧</span>
                            </div>
                        </div>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex gap-2"><strong className="text-gray-900 min-w-[40px]">痛点:</strong> 产线质量波动大，缺乏高级工艺模型，自研成本高。</li>
                            <li className="flex gap-2"><strong className="text-gray-900 min-w-[40px]">目标:</strong> 快速引入成熟算法解决板形、厚度等具体质量问题，降低废品率。</li>
                            <li className="flex gap-2"><strong className="text-gray-900 min-w-[40px]">场景:</strong> 生产监控室、质量管理部、IT中心。</li>
                        </ul>
                    </div>

                    {/* Seller Persona */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Code size={80}/>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                                <Cpu size={24}/>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900">卖家：科研院所/ISV</h4>
                                <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">供给侧</span>
                            </div>
                        </div>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex gap-2"><strong className="text-gray-900 min-w-[40px]">痛点:</strong> 优质算法缺乏商业化落地渠道，知识产权保护难，交付部署繁琐。</li>
                            <li className="flex gap-2"><strong className="text-gray-900 min-w-[40px]">目标:</strong> 将沉淀的工业机理模型标准化封装，实现知识变现与规模化分发。</li>
                            <li className="flex gap-2"><strong className="text-gray-900 min-w-[40px]">场景:</strong> 实验室、软件开发中心。</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderArchitecture = () => (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader 
                title="2. 产品整体架构 (Architecture)" 
                subtitle="自底向上的技术分层设计，确保系统的稳定性、安全性与可扩展性。"
                icon={Layers}
            />

            {/* 2.1 System Architecture */}
            <div className="mb-12">
                <h3 className="text-lg font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-3">2.1 系统架构图 (System Architecture)</h3>
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                    <div className="flex flex-col gap-4 max-w-4xl mx-auto">
                        {/* User Layer */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white p-3 rounded-lg border border-gray-200 text-center shadow-sm text-sm font-bold text-gray-700">Web 端 (React/TS)</div>
                            <div className="bg-white p-3 rounded-lg border border-gray-200 text-center shadow-sm text-sm font-bold text-gray-700">Mobile 端 (H5/App)</div>
                            <div className="bg-white p-3 rounded-lg border border-gray-200 text-center shadow-sm text-sm font-bold text-gray-700">API 客户端 (SDK)</div>
                        </div>
                        
                        {/* Gateway */}
                        <div className="bg-indigo-600 p-3 rounded-lg text-center shadow-md text-white text-sm font-bold tracking-wider">
                            API 网关 (Authentication / Rate Limiting / Routing)
                        </div>

                        {/* Application Layer */}
                        <div className="grid grid-cols-4 gap-4 p-4 bg-white rounded-xl border border-dashed border-gray-300">
                            <div className="text-center text-xs font-bold text-gray-400 col-span-4 mb-2 uppercase tracking-widest">Application Layer</div>
                            <div className="bg-blue-50 p-4 rounded-lg text-center text-blue-800 font-bold text-sm">市场前台<br/><span className="text-xs font-normal opacity-70">Marketplace</span></div>
                            <div className="bg-green-50 p-4 rounded-lg text-center text-green-800 font-bold text-sm">买家工作台<br/><span className="text-xs font-normal opacity-70">Buyer Console</span></div>
                            <div className="bg-purple-50 p-4 rounded-lg text-center text-purple-800 font-bold text-sm">卖家控制台<br/><span className="text-xs font-normal opacity-70">Seller Console</span></div>
                            <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-800 font-bold text-sm">运营后台<br/><span className="text-xs font-normal opacity-70">Admin Panel</span></div>
                        </div>

                        {/* Domain Services */}
                        <div className="grid grid-cols-5 gap-2">
                            {['用户中心 (Identity)', '资产管理 (Asset)', '订单计费 (Billing)', '消息通知 (Message)', '执行引擎 (Execution)'].map(svc => (
                                <div key={svc} className="bg-white border border-gray-200 p-2 rounded text-center text-xs font-medium text-gray-600 shadow-sm">{svc}</div>
                            ))}
                        </div>

                        {/* Infrastructure */}
                        <div className="bg-slate-800 p-4 rounded-xl text-center text-white text-xs space-y-2">
                            <div className="font-bold opacity-50 uppercase tracking-widest mb-2">Infrastructure (Cloud / Edge)</div>
                            <div className="flex justify-center gap-4">
                                <span className="bg-slate-700 px-3 py-1 rounded">Kubernetes Cluster</span>
                                <span className="bg-slate-700 px-3 py-1 rounded">PostgreSQL</span>
                                <span className="bg-slate-700 px-3 py-1 rounded">Redis / Kafka</span>
                                <span className="bg-slate-700 px-3 py-1 rounded">Vector DB</span>
                                <span className="bg-slate-700 px-3 py-1 rounded">Object Storage (S3)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2.2 Functional Structure */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6 border-l-4 border-purple-600 pl-3">2.2 产品功能结构图 (Functional Structure)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Market */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 font-bold text-blue-800">交易市场 (Marketplace)</div>
                        <div className="p-4 space-y-2 text-sm text-gray-600">
                            <div className="flex gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5"></div> 全局搜索与筛选</div>
                            <div className="flex gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5"></div> 智能体分类导航</div>
                            <div className="flex gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5"></div> 商品详情页 (Demo/Video)</div>
                            <div className="flex gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5"></div> 需求广场</div>
                            <div className="flex gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5"></div> 资源包选购</div>
                        </div>
                    </div>
                    {/* Buyer */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="bg-green-50 px-4 py-3 border-b border-green-100 font-bold text-green-800">采购工作台 (Buyer)</div>
                        <div className="p-4 space-y-2 text-sm text-gray-600">
                            <div className="flex gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5"></div> 仪表盘 (Dashboard)</div>
                            <div className="flex gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5"></div> 订单管理 & 续费</div>
                            <div className="flex gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5"></div> 资源用量监控</div>
                            <div className="flex gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5"></div> 账单与发票</div>
                            <div className="flex gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5"></div> 工单支持</div>
                        </div>
                    </div>
                    {/* Seller */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="bg-purple-50 px-4 py-3 border-b border-purple-100 font-bold text-purple-800">开发者控制台 (Seller)</div>
                        <div className="p-4 space-y-2 text-sm text-gray-600">
                            <div className="flex gap-2"><div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5"></div> 收益总览</div>
                            <div className="flex gap-2"><div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5"></div> 资产发布向导</div>
                            <div className="flex gap-2"><div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5"></div> 版本管理</div>
                            <div className="flex gap-2"><div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5"></div> 运营数据分析</div>
                            <div className="flex gap-2"><div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5"></div> API Key 管理</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDetailedFlows = () => (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader 
                title="3. 核心业务流程 (Core Business Flows)" 
                subtitle="可视化展示平台关键业务闭环的流转逻辑与状态变迁。"
                icon={Workflow}
            />

            {/* 3.1 Publish Flow */}
            <div className="mb-12">
                <h3 className="text-lg font-bold text-gray-900 mb-6 border-l-4 border-indigo-600 pl-3">3.1 资产发布与上架流程 (Asset Publishing)</h3>
                <div className="bg-white p-8 rounded-2xl border border-gray-200 overflow-x-auto shadow-sm">
                    <div className="flex items-center gap-2 min-w-[1000px]">
                        <FlowStep label="开发者" desc="发起发布" type="start"/>
                        <FlowArrow label="上传文件"/>
                        <FlowStep label="系统网关" desc="病毒/安全扫描" type="system"/>
                        <FlowArrow label="Pass"/>
                        <FlowStep label="填写详情" desc="Step 2: Docs"/>
                        <FlowArrow label="Next"/>
                        <FlowStep label="配置定价" desc="Step 3: Pricing"/>
                        <FlowArrow label="Submit"/>
                        <FlowStep label="状态: Auditing" desc="人工审核中" type="decision"/>
                        <FlowArrow label="Approve"/>
                        <FlowStep label="智能合约" desc="上架/生成SKU" type="system"/>
                        <FlowArrow label="Success"/>
                        <FlowStep label="市场可见" desc="状态: Active" type="end"/>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 flex gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> 异常流：安全扫描失败 → 驳回修改 → 重新提交</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> 异常流：人工审核拒绝 → 发送通知 → 开发者修改</div>
                    </div>
                </div>
            </div>

            {/* 3.2 Purchase Flow */}
            <div className="mb-12">
                <h3 className="text-lg font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-3">3.2 购买与履约流程 (Purchase & Fulfillment)</h3>
                <div className="bg-white p-8 rounded-2xl border border-gray-200 overflow-x-auto shadow-sm">
                    <div className="flex items-center gap-2 min-w-[1000px]">
                        <FlowStep label="买家" desc="点击购买" type="start"/>
                        <FlowArrow label="选择规格"/>
                        <FlowStep label="收银台" desc="生成订单" type="action"/>
                        <FlowArrow label="支付"/>
                        <FlowStep label="支付网关" desc="资金冻结" type="system"/>
                        <FlowArrow label="Callback"/>
                        <FlowStep label="履约中心" desc="分发 License" type="system"/>
                        <FlowArrow label="Provision"/>
                        <FlowStep label="资源调度" desc="初始化 Quota" type="system"/>
                        <FlowArrow label="Ready"/>
                        <FlowStep label="订单完成" desc="状态: Active" type="end"/>
                    </div>
                </div>
            </div>

            {/* 3.3 Resource Pack Mounting */}
            <div className="mb-12">
                <h3 className="text-lg font-bold text-gray-900 mb-6 border-l-4 border-green-600 pl-3">3.3 资源包挂载流程 (Resource Pack Mounting)</h3>
                <p className="text-sm text-gray-600 mb-4">
                    资源包购买后，需“挂载”到具体的实例（Instance）上才能生效。这是一种解耦设计，允许资源包在不同实例间流转（仅限通用包）。
                </p>
                <div className="bg-white p-8 rounded-2xl border border-gray-200 overflow-x-auto shadow-sm">
                    <div className="flex items-center gap-2 min-w-[1000px]">
                        <FlowStep label="购买资源包" desc="状态: Unmounted" type="start"/>
                        <FlowArrow label="选择挂载"/>
                        <FlowStep label="选择实例" desc="Filter Active Orders"/>
                        <FlowArrow label="Confirm"/>
                        <FlowStep label="配额中心" desc="校验兼容性" type="system"/>
                        <FlowArrow label="Valid"/>
                        <FlowStep label="更新实例 Quota" desc="+ Pack Amount" type="system"/>
                        <FlowArrow label="Sync"/>
                        <FlowStep label="资源包状态" desc="Mounted" type="end"/>
                    </div>
                </div>
            </div>

            {/* 3.4 Support Flow */}
            <div className="mb-12">
                <h3 className="text-lg font-bold text-gray-900 mb-6 border-l-4 border-orange-600 pl-3">3.4 售后与退款流程 (Support & Refund)</h3>
                <div className="bg-white p-8 rounded-2xl border border-gray-200 overflow-x-auto shadow-sm">
                    <div className="flex items-center gap-2 min-w-[1000px]">
                        <FlowStep label="买家" desc="发起退款" type="start"/>
                        <FlowArrow label="Reason"/>
                        <FlowStep label="规则引擎" desc="自动校验" type="system"/>
                        <FlowArrow label="Check"/>
                        <div className="p-2 border border-dashed border-gray-300 rounded bg-gray-50 text-xs text-gray-500">
                            <div>规则：</div>
                            <div>1. 5天内</div>
                            <div>2. 用量=0</div>
                        </div>
                        <FlowArrow label="Pass"/>
                        <FlowStep label="自动退款" desc="原路返回" type="end"/>
                    </div>
                    <div className="my-4 border-t border-dashed border-gray-200"></div>
                    <div className="flex items-center gap-2 min-w-[1000px]">
                        <FlowStep label="人工介入" desc="规则不通过" type="decision"/>
                        <FlowArrow label="转工单"/>
                        <FlowStep label="卖家控制台" desc="审核申请" type="action"/>
                        <FlowArrow label="Audit"/>
                        <FlowStep label="同意/拒绝" desc="填写理由" type="end"/>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDetailedFeatures = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader 
                title="4. 功能模块详述 (Functional Specifications)" 
                subtitle="本章节对平台各核心模块的功能清单、交互说明及逻辑规则进行详细定义。"
                icon={List}
            />

            {/* 4.1 Navigation & Global */}
            <ModuleSection title="4.1 全局导航与鉴权 (Sidebar & Auth)" id="feat-nav">
                <SpecTable 
                    title="功能点细分"
                    headers={['功能点', '前置条件', '逻辑描述', '交互说明']}
                    rows={[
                        ['<strong>角色切换 (Console Switch)</strong>', 'Admin/Developer', '允许在“买家工作台”与“开发者后台”之间无缝切换。', '点击 Sidebar 底部账户卡片 -> 选择“切换身份”'],
                        ['<strong>身份模拟 (Identity Mock)</strong>', 'Admin Only', '用于演示目的，快速切换不同用户身份（如张采购、王工）。', 'DevTools 浮窗或账户菜单中的隐藏入口'],
                        ['<strong>发布入口 (Publish Entry)</strong>', 'Developer/Admin', '仅在“开发者模式”下可见。', 'Sidebar 中部显著的“发布智能体”按钮'],
                        ['<strong>消息徽标 (Badge)</strong>', 'Any Role', '实时显示未读消息数，包含系统通知与私信。', 'WebSocket 推送更新 Sidebar 菜单上的红点']
                    ]}
                />
            </ModuleSection>

            {/* 4.2 Discovery */}
            <ModuleSection title="4.2 市场探索 (Discovery Marketplace)" id="feat-discovery">
                <SpecTable 
                    title="核心组件逻辑"
                    headers={['组件', '交互逻辑', '数据源', '排序/筛选规则']}
                    rows={[
                        ['<strong>全局搜索 (Global Search)</strong>', '支持模糊匹配 Title, Tags, Provider。防抖 (Debounce) 300ms。', 'ElasticSearch / DB', '相关度降序 > 销量降序 > 评分降序'],
                        ['<strong>类目筛选 (Category Filter)</strong>', '点击 Tag 切换，支持多选（如 Method + Steel）。', 'Metadata Tags', '精确匹配'],
                        ['<strong>智能体卡片 (Agent Card)</strong>', '展示封面、评分、销量。Hover 时显示“快速预览”按钮，点击进入详情页。', 'Assets Table', 'N/A'],
                        ['<strong>榜单推荐 (Ranking)</strong>', '基于 CTR 和 Conversion Rate 的加权算法推荐。', 'User Behavior Log', 'Top 3 高亮展示']
                    ]}
                />
            </ModuleSection>

            {/* 4.3 Product Detail */}
            <ModuleSection title="4.3 智能体详情页 (Product Detail)" id="feat-detail">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 text-sm text-blue-800">
                    <strong>核心设计：</strong> 详情页不仅仅是信息展示，更是“试用”与“交易”的决策中心。集成了实时预览 (Live Demo)、视频介绍与动态定价计算器。
                </div>
                <SpecTable 
                    headers={['模块', '功能描述', '交互逻辑']}
                    rows={[
                        ['<strong>多维演示 (Demo Container)</strong>', '支持切换：1. 界面截图 2. 宣传视频 3. 实时交互组件 (Live Component)。', 'Tab 切换触发不同组件渲染；Live 模式下模拟真实数据流。'],
                        ['<strong>模块化详情 (Modular Detail)</strong>', '支持 Hero, Features, Comparison, Architecture 等多种布局模块。', '根据 JSON 配置动态渲染不同类型的 React 组件。'],
                        ['<strong>动态定价 (Pricing Calculator)</strong>', '根据用户选择的模式（订阅/买断）及版本，实时计算总价。', '单选框切换触发价格重算；“立即获取”按钮触发购买弹窗。'],
                        ['<strong>合规披露 (Compliance)</strong>', '强制展示数据脱敏声明与知识产权归属。', '静态展示，鼠标 Hover 显示详细解释。']
                    ]}
                />
            </ModuleSection>

            {/* 4.4 Publish Wizard */}
            <ModuleSection title="4.4 资产发布向导 (Publish Wizard)" id="feat-publish">
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="border border-gray-200 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-800 mb-2">Step 1: 源资产选择</h4>
                        <ul className="list-disc pl-4 text-xs text-gray-600 space-y-1">
                            <li>读取用户的沙箱/本地文件列表</li>
                            <li>校验文件格式 (.zip, .py, .json)</li>
                            <li>交互：文件列表单选，支持搜索</li>
                        </ul>
                    </div>
                    <div className="border border-gray-200 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-800 mb-2">Step 2: 详情与展示</h4>
                        <ul className="list-disc pl-4 text-xs text-gray-600 space-y-1">
                            <li>版本号自动递增 (SemVer)</li>
                            <li>结构化痛点/解决方案录入</li>
                            <li>交互：表单填写，富文本编辑器，图片上传</li>
                        </ul>
                    </div>
                    <div className="border border-gray-200 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-800 mb-2">Step 3: 定价策略</h4>
                        <ul className="list-disc pl-4 text-xs text-gray-600 space-y-1">
                            <li>配置订阅制/买断制参数</li>
                            <li><strong>收入模拟器：</strong>拖动滑块实时测算开发者净收益</li>
                            <li>交互：定价模型切换，滑块交互</li>
                        </ul>
                    </div>
                    <div className="border border-gray-200 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-800 mb-2">Step 4: 预审与提交</h4>
                        <ul className="list-disc pl-4 text-xs text-gray-600 space-y-1">
                            <li>自动化安全扫描 (Security Scan)</li>
                            <li>生成发布清单快照</li>
                            <li>交互：展示 Loading 状态动画，最后确认按钮</li>
                        </ul>
                    </div>
                </div>
            </ModuleSection>

            {/* 4.5 Resource Pack */}
            <ModuleSection title="4.5 资源包中心 (Resource Packs)" id="feat-resource">
                <SpecTable 
                    title="资源包类型定义"
                    headers={['类型', '单位', '适用场景', '交互逻辑']}
                    rows={[
                        ['<strong>Token 包 (算力)</strong>', 'k Tokens', '大语言模型对话、逻辑推理、代码生成。', '选择规格 -> 选择有效期 -> 加入清单 -> 结算'],
                        ['<strong>Storage 包 (存储)</strong>', 'GB', '向量数据库扩容、历史生产数据归档。', '同上，支持多选不同规格合并支付'],
                        ['<strong>API Calls 包 (调用)</strong>', '次 (Calls)', '传统判别式模型的 API 接口调用。', '按次扣除，失败不计费']
                    ]}
                />
            </ModuleSection>

            {/* 4.6 Buyer Console */}
            <ModuleSection title="4.6 采购工作台 (Buyer Console)" id="feat-buyer">
                <h4 className="font-bold text-gray-800 text-sm mb-3 mt-6">4.6.1 概览仪表盘 (Dashboard)</h4>
                <SpecTable 
                    headers={['功能点', '逻辑描述', '交互']}
                    rows={[
                        ['<strong>消费统计</strong>', '展示本月实时消费金额及环比趋势。', 'KPI 卡片展示，趋势箭头指示涨跌'],
                        ['<strong>资源预警</strong>', '当任一资源包余额低于 20% 时高亮提示。', 'Alert Banner 顶部通栏显示'],
                        ['<strong>资源概览图</strong>', '可视化展示 Token/Storage 每日消耗趋势。', 'ECharts 柱状/折线混合图，Hover 显示具体数值']
                    ]} 
                />

                <h4 className="font-bold text-gray-800 text-sm mb-3 mt-6">4.6.2 订单与资源管理</h4>
                <SpecTable 
                    headers={['模块', '功能描述', '交互']}
                    rows={[
                        ['<strong>订单列表</strong>', '支持按状态 (Active/Expired) 筛选。', 'Tab 切换状态，搜索框过滤订单号/产品名'],
                        ['<strong>订单详情</strong>', '查看详细配置、历史记录、续费入口。', '点击“详情”按钮弹出 Modal'],
                        ['<strong>我的资源</strong>', '展示已购资源包及其剩余量。', '进度条展示使用率，支持“续费/升级”跳转']
                    ]}
                />
            </ModuleSection>

            {/* 4.7 Seller Console */}
            <ModuleSection title="4.7 开发者控制台 (Seller Console)" id="feat-seller">
                <h4 className="font-bold text-gray-800 text-sm mb-3 mt-6">4.7.1 资产管理</h4>
                <SpecTable 
                    headers={['功能点', '逻辑描述', '交互']}
                    rows={[
                        ['<strong>资产列表</strong>', '展示所有发布资产及其状态（上架/审核/草稿）。', 'Tab 切换状态，列表项包含版本信息、健康度'],
                        ['<strong>版本管理</strong>', '发布新版本、回滚旧版本、弃用版本。', 'Modal 弹窗管理版本历史，支持“发布新版本”入口'],
                        ['<strong>资产编辑</strong>', '修改资产元数据（描述、标签）。', '点击“编辑信息”弹出表单 Modal']
                    ]} 
                />

                <h4 className="font-bold text-gray-800 text-sm mb-3 mt-6">4.7.2 收益与财务</h4>
                <SpecTable 
                    headers={['模块', '功能点', '交互']}
                    rows={[
                        ['<strong>收益看板</strong>', '展示可提现余额、待结算金额、总收益趋势。', '大数字卡片展示，图表展示月度趋势'],
                        ['<strong>提现申请</strong>', '发起资金提现请求。', '点击“申请提现”按钮弹出金额输入 Modal'],
                        ['<strong>退款审核</strong>', '审核买家的退款申请。', '列表展示待办事项，点击“处理”弹出审核详情与操作按钮']
                    ]} 
                />
            </ModuleSection>

            {/* 4.8 Settings */}
            <ModuleSection title="4.8 系统设置 (Settings)" id="feat-settings">
                <SpecTable 
                    headers={['模块', '功能点', '交互逻辑']}
                    rows={[
                        ['<strong>基本资料 (Profile)</strong>', '头像、昵称、企业认证信息修改。', '表单编辑，上传图片'],
                        ['<strong>安全设置 (Security)</strong>', '登录密码修改、MFA 多因素认证绑定。', 'Toggle 开关控制 MFA，修改密码需原密码验证'],
                        ['<strong>API 密钥 (Keys)</strong>', '创建、删除 API Key。', '列表展示 Key（脱敏），点击“新建”弹出配置 Modal，生成后仅显示一次'],
                        ['<strong>通知偏好</strong>', '配置接收通知的类型。', 'Toggle 开关控制不同类型的通知']
                    ]}
                />
                
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5 mb-6">
                    <h5 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                        <Key size={16}/> API Key 管理详解
                    </h5>
                    <p className="text-sm text-yellow-700 leading-relaxed mb-3">
                        API Key 是开发者在第三方应用（如 ERP、MES、L2 控制系统）中调用平台智能体服务的<strong>唯一身份凭证</strong>。
                    </p>
                    <ul className="text-xs text-yellow-700 list-disc pl-4 space-y-1">
                        <li><strong>系统集成必选：</strong> 工业现场系统必须通过 API Key 进行鉴权。</li>
                        <li><strong>最小权限原则：</strong> 建议为不同项目生成独立 Key。</li>
                        <li><strong>环境隔离：</strong> 生产环境与测试环境 Key 应严格区分。</li>
                    </ul>
                </div>
            </ModuleSection>
        </div>
    );

    const renderEconomics = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader 
                title="5. 经济模型与定价 (Economic Model)" 
                subtitle="构建公平、可持续的工业软件交易生态，平衡开发者收益与企业成本。"
                icon={Coins}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Scale size={18}/> 定价公式 (Pricing Formula)</h3>
                    <div className="bg-gray-100 p-4 rounded-xl font-mono text-sm text-gray-700 mb-4 border border-gray-200">
                        Total_Cost = Base_Fee + ∑(Usage_i × Unit_Rate_i)
                    </div>
                    <ul className="text-sm text-gray-600 space-y-3">
                        <li className="flex gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></span> <div><strong>Base_Fee:</strong> 订阅周期内的固定费用（如 ¥5,800/月），包含基础 SLA 和 基础 Quota。</div></li>
                        <li className="flex gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></span> <div><strong>Usage_i:</strong> 超出基础 Quota 后的增量使用量 (如 Token 数)。</div></li>
                        <li className="flex gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></span> <div><strong>Unit_Rate_i:</strong> 阶梯定价费率。用量越大，费率越低。</div></li>
                    </ul>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><PieChart size={18}/> 分成与结算 (Settlement)</h3>
                    <div className="flex items-center gap-1 mb-4 w-full h-10 rounded-lg overflow-hidden">
                        <div className="flex-1 bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-800 border-r border-white">开发者 85%</div>
                        <div className="w-[15%] bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">平台 15%</div>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        平台收取 15% 技术服务费，用于覆盖支付通道费、服务器带宽及运营成本。
                        结算周期为 <strong>T+7 (月结)</strong>。即本月产生的收益，将在次月 7 日汇入开发者对公账户。
                    </p>
                </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
                <h3 className="font-bold text-gray-900 mb-6">影响定价的因子 (Pricing Factors)</h3>
                <SpecTable 
                    headers={['因子维度', '权重', '说明']}
                    rows={[
                        ['<strong>稀缺性 (Scarcity)</strong>', 'High', '例如：独家的高炉炉腹温度场模型，定价可高于市场均值 200%。'],
                        ['<strong>算力消耗 (Compute)</strong>', 'Medium', '包含大模型的 Token 消耗、GPU 渲染时长。直接计入 Unit Rate。'],
                        ['<strong>数据价值 (Data Value)</strong>', 'High', '涉及行业对标数据（Analysis Agent），数据本身即资产。'],
                        ['<strong>部署方式 (Deployment)</strong>', 'High', '私有化部署通常为订阅年费的 3-5 倍 (一次性买断)。']
                    ]}
                />
            </div>
        </div>
    );

    const renderNFR = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader 
                title="6. 非功能需求与埋点 (NFRs & Analytics)" 
                subtitle="系统的性能指标、安全性要求及关键数据采集规范。"
                icon={Scale}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><Zap size={20} className="text-yellow-500"/> 性能指标 (Performance)</h3>
                    <ul className="space-y-4 text-sm text-gray-600">
                        <li className="flex justify-between border-b border-gray-50 pb-2">
                            <span>API 响应潜伏期 (Latency)</span>
                            <span className="font-mono font-bold text-gray-900">{'<'} 50ms</span>
                        </li>
                        <li className="flex justify-between border-b border-gray-50 pb-2">
                            <span>报告生成时间 (Processing)</span>
                            <span className="font-mono font-bold text-gray-900">{'<'} 5s (P99)</span>
                        </li>
                        <li className="flex justify-between border-b border-gray-50 pb-2">
                            <span>并发连接数 (Concurrency)</span>
                            <span className="font-mono font-bold text-gray-900">10k+ / Cluster</span>
                        </li>
                        <li className="flex justify-between pt-2">
                            <span>系统可用性 (Availability)</span>
                            <span className="font-mono font-bold text-gray-900">99.95%</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><ShieldCheck size={20} className="text-green-500"/> 安全与合规 (Security)</h3>
                    <ul className="space-y-4 text-sm text-gray-600">
                        <li className="flex gap-3 items-center"><Lock size={16} className="text-gray-400"/> <strong>传输加密：</strong> 全链路 TLS 1.3 加密。</li>
                        <li className="flex gap-3 items-center"><Eye size={16} className="text-gray-400"/> <strong>数据隐私：</strong> 敏感生产数据（如配方）在存储层进行 AES-256 加密。</li>
                        <li className="flex gap-3 items-center"><Server size={16} className="text-gray-400"/> <strong>隔离性：</strong> 智能体运行在独立的沙箱环境（Sandbox）中。</li>
                    </ul>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-8 py-5 border-b border-gray-200">
                    <h3 className="font-bold text-gray-800 text-lg">6.2 关键数据埋点与指标 (Analytics & Tracking)</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        为了持续优化平台，我们构建了统一的监控体系，涵盖顶层业务指标 (Metrics) 与底层行为埋点 (Events)。
                    </p>
                </div>
                <div className="p-8">
                    <SpecTable 
                        headers={['类型 (Type)', '监控项 (Item / Key)', '定义 / 触发条件 (Definition)', '数据源 / 参数 (Source / Params)', '业务目标 (Goal)']}
                        rows={[
                            // Business Metrics
                            ['<span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-200">核心指标</span>', '<strong>交易漏斗</strong>', '详情页UV → 试用转化率 → 购买转化率', '页面PV，试用按钮Click，支付成功回调', '评估智能体吸引力与定价合理性'],
                            ['<span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-200">核心指标</span>', '<strong>履约与留存</strong>', '次月续费率 (NDR)、流失率 (Churn)', '订阅周期到期事件、续费事件', '评估产品长期业务价值'],
                            ['<span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-200">核心指标</span>', '<strong>系统健康</strong>', 'API 请求成功率、P99 Latency (如 < 50ms)', 'API 网关日志', '触发SLA告警，判定是否触发退款理赔'],
                            ['<span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-200">核心指标</span>', '<strong>资源消耗</strong>', 'Token 消耗速度、存储扩容包复购率', '计费引擎实时统计', '指导客户经理进行Upsell（追加销售）'],
                            
                            // Domain Metrics
                            ['<span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-200">工业指标</span>', '<strong>缺陷拦截率</strong>', 'AI识别缺陷且被人工复核确认为真的比例', '质检反馈日志 (Feedback Loop)', '验证冷轧表面检测模型(ASI)的实战效果'],
                            ['<span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-200">工业指标</span>', '<strong>控制时延 (Loop Latency)</strong>', '从采集轧机信号到下发调整指令的时间差', '边缘计算节点 (Edge Node) 日志', '确保板形自动控制 (AFC) 满足毫秒级响应要求'],

                            // Event Tracking
                            ['<span class="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold border border-purple-200">埋点事件</span>', '<code class="bg-gray-100 px-1 rounded text-purple-600">view_product</code>', '用户进入详情页', '<code class="bg-gray-100 px-1 rounded text-gray-600">{asset_id, source_ref}</code>', '计算转化漏斗 (CTR)'],
                            ['<span class="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold border border-purple-200">埋点事件</span>', '<code class="bg-gray-100 px-1 rounded text-purple-600">click_purchase</code>', '点击订阅或购买按钮', '<code class="bg-gray-100 px-1 rounded text-gray-600">{pricing_mode, user_role}</code>', '评估购买意愿'],
                            ['<span class="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold border border-purple-200">埋点事件</span>', '<code class="bg-gray-100 px-1 rounded text-purple-600">api_invoke_success</code>', '智能体API调用成功', '<code class="bg-gray-100 px-1 rounded text-gray-600">{latency, token_usage}</code>', '计费与性能监控'],
                            ['<span class="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold border border-purple-200">埋点事件</span>', '<code class="bg-gray-100 px-1 rounded text-purple-600">api_invoke_error</code>', '调用返回4XX/5XX状态码', '<code class="bg-gray-100 px-1 rounded text-gray-600">{error_code, endpoint}</code>', '健康度诊断'],
                            ['<span class="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold border border-purple-200">埋点事件</span>', '<code class="bg-gray-100 px-1 rounded text-purple-600">resource_pack_mount</code>', '资源包挂载操作', '<code class="bg-gray-100 px-1 rounded text-gray-600">{resource_id, instance_id}</code>', '资源利用率分析'],
                            ['<span class="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold border border-purple-200">埋点事件</span>', '<code class="bg-gray-100 px-1 rounded text-purple-600">model_inference</code>', '冷轧机理模型完成一次推演', '<code class="bg-gray-100 px-1 rounded text-gray-600">{input_coil_id, output_flatness}</code>', '监控模型在不同钢种下的表现'],
                        ]}
                    />
                </div>
            </div>
        </div>
    );

    const renderRoadmap = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader 
                title="7. 产品规划 (Product Roadmap)" 
                subtitle="未来一年的产品演进路线图，持续引领工业智能体生态建设。"
                icon={Map}
            />

            <div className="relative border-l-4 border-blue-200 ml-6 space-y-12 pl-8 py-4">
                {[
                    { phase: 'Phase 1: MVP', time: '2025 Q1', title: '基础交易闭环', desc: '上线市场前台、买家/卖家控制台核心功能，支持 API Key 鉴权与基础计费。', status: 'done' },
                    { phase: 'Phase 2: Ecosystem', time: '2025 Q2', title: '开发者生态增强', desc: '开放 OpenAPI，提供 SDK，支持更复杂的智能体类型（如可视化组件）。引入社区评价体系。', status: 'current' },
                    { phase: 'Phase 3: Intelligence', time: '2025 Q3', title: 'AI 辅助与 RAG', desc: '集成 Copilot 助手，支持自然语言检索市场资产。上线基于 RAG 的智能文档问答。', status: 'planned' },
                    { phase: 'Phase 4: Interconnection', time: '2025 Q4', title: '工业互联深度集成', desc: '支持与主流工业互联网平台（如 MindSphere, Predix）的直接互通，实现资产的一键部署。', status: 'planned' }
                ].map((item, idx) => (
                    <div key={idx} className="relative">
                        <div className={`absolute -left-[42px] top-0 w-5 h-5 rounded-full border-4 border-white ${
                            item.status === 'done' ? 'bg-green-500' : item.status === 'current' ? 'bg-blue-600' : 'bg-gray-300'
                        } shadow-sm`}></div>
                        
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                                        item.status === 'done' ? 'bg-green-100 text-green-700' : item.status === 'current' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {item.phase}
                                    </span>
                                    <span className="text-sm font-mono text-gray-400">{item.time}</span>
                                </div>
                                {item.status === 'current' && <span className="text-xs text-blue-600 font-bold animate-pulse">进行中...</span>}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // --- Main Render ---

    const renderContent = () => {
        switch (activeSection) {
            case 'overview': return renderOverview();
            case 'architecture': return renderArchitecture();
            case 'flows': return renderDetailedFlows();
            case 'features': return renderDetailedFeatures();
            case 'economics': return renderEconomics();
            case 'nfr': return renderNFR();
            case 'roadmap': return renderRoadmap();
            default: return renderOverview();
        }
    };

    return (
        <div className="flex h-full bg-white font-sans text-gray-900">
            {/* Navigation Sidebar */}
            <div className="w-72 bg-gray-50 border-r border-gray-200 flex-shrink-0 flex flex-col h-full sticky top-0 overflow-y-auto custom-scrollbar">
                <div className="p-6 border-b border-gray-200 bg-white sticky top-0 z-20">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Book size={24} className="text-blue-600"/> 产研白皮书
                    </h2>
                    <p className="text-xs text-gray-500 mt-2 font-mono uppercase tracking-wider">Product Spec v2.5</p>
                </div>
                
                <nav className="p-4 space-y-1">
                    {[
                        { id: 'overview', label: '1. 产品综述 (Overview)', icon: Globe },
                        { id: 'architecture', label: '2. 整体架构 (Architecture)', icon: Layers },
                        { id: 'flows', label: '3. 核心流程 (Flows)', icon: Workflow },
                        { id: 'features', label: '4. 功能详述 (Features)', icon: List },
                        { id: 'economics', label: '5. 经济模型 (Economics)', icon: Coins },
                        { id: 'nfr', label: '6. NFR与埋点 (NFRs)', icon: Scale },
                        { id: 'roadmap', label: '7. 产品规划 (Roadmap)', icon: Map },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full text-left px-3 py-3 text-sm rounded-lg font-medium flex items-center gap-3 transition-colors ${
                                activeSection === item.id 
                                ? 'bg-blue-100 text-blue-700 shadow-sm' 
                                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                            }`}
                        >
                            <item.icon size={16} className={activeSection === item.id ? 'text-blue-600' : 'text-gray-400'}/>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="px-4 py-4 mt-auto">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">快速导航</div>
                    {activeSection === 'features' && (
                        <div className="space-y-1 border-l-2 border-gray-200 ml-2 pl-2">
                            <a href="#feat-nav" className="block text-xs text-gray-500 hover:text-blue-600 py-1">4.1 导航与鉴权</a>
                            <a href="#feat-discovery" className="block text-xs text-gray-500 hover:text-blue-600 py-1">4.2 市场探索</a>
                            <a href="#feat-detail" className="block text-xs text-gray-500 hover:text-blue-600 py-1">4.3 详情页</a>
                            <a href="#feat-publish" className="block text-xs text-gray-500 hover:text-blue-600 py-1">4.4 发布向导</a>
                            <a href="#feat-resource" className="block text-xs text-gray-500 hover:text-blue-600 py-1">4.5 资源包</a>
                            <a href="#feat-buyer" className="block text-xs text-gray-500 hover:text-blue-600 py-1">4.6 采购工作台</a>
                            <a href="#feat-seller" className="block text-xs text-gray-500 hover:text-blue-600 py-1">4.7 开发者控制台</a>
                            <a href="#feat-settings" className="block text-xs text-gray-500 hover:text-blue-600 py-1">4.8 系统设置</a>
                        </div>
                    )}
                </div>

                <div className="mt-auto p-6 border-t border-gray-200 bg-gray-50">
                    <button className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-100 flex items-center justify-center gap-2 transition-colors shadow-sm">
                        <Download size={16}/> 导出 PDF
                    </button>
                    <div className="text-center text-[10px] text-gray-400 mt-4">
                        Last Updated: 2025-04-15<br/>
                        Authored by Product Team
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white scroll-smooth">
                <div className="max-w-5xl mx-auto p-12">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default DocumentationView;
