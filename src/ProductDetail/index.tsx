import React, { useState, useEffect, useRef } from "react";
import {
  Monitor,
  PlayCircle,
  Radio,
  Star,
  Share2,
  Heart,
  CheckCircle,
  Download,
  Globe,
  Calendar,
  Box,
  Database,
  Factory,
  Layers,
  ChevronRight,
  Zap,
  BarChart2,
  TrendingUp,
  AlertTriangle,
  FileText,
  User,
  Users,
  ShieldCheck,
  Map,
  Activity,
  X,
  Check,
  Phone,
  Mail,
  MessageSquare,
  ArrowRight,
  Cpu,
  Server,
  Lightbulb,
  GitBranch,
  Target,
  Plus,
  Layout,
  BookOpen,
  PieChart,
  File,
  Building2,
  Search,
  CreditCard,
  Loader2,
  Clock,
  Copy,
  MoreHorizontal,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import ReportPanel from "@/components/ReportPanel";
import ChatPanel from "@/components/ChatPanel";
import RelatedPanel from "@/components/RelatedPanel";
import VideoView from "@/components/VideoView";
import LiveView from "@/components/LiveView";
import {
  MOCK_AGENTS,
  AgentData,
  DetailModule,
  Deliverable,
  DataColumn,
  DataRow,
} from "@/data";

interface ProductDetailProps {
  onBack: () => void;
  onNavigate: (view: string, params?: any) => void;
  onPurchase?: (product: any, planDetails: any) => void;
  onUpgrade?: (orderId: string, planDetails: any) => void;
  initialParams?: { 
    id?: string; 
    action?: "purchase" | "review";
    upgrade_instance_id?: string;
    instance_name?: string;
    instance_status?: string;
  };
  productOrders?: any[]; // Orders related to this product
}

// --- Helper Components ---

const TargetIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-blue-600"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

const ColdRollingPreview = () => (
  <div className="flex h-full w-full bg-white text-left">
    <Sidebar />
    <ReportPanel />
    <ChatPanel />
    <RelatedPanel />
  </div>
);

// High-Fidelity BI Dashboard Preview for Analysis Agent
const QualityBIPreview = () => {
  const [viewMode, setViewMode] = useState<"dashboard" | "report">("report");

  // Dashboard Mode Content (Original)
  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-xs text-gray-500 mb-1">行业平均合格率</div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">
              97.5<span className="text-lg">%</span>
            </span>
            <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded mb-1">
              ↑ 0.5%
            </span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-xs text-gray-500 mb-1">您的企业排名</div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">
              Top 15<span className="text-lg">%</span>
            </span>
            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded mb-1">
              -
            </span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-xs text-gray-500 mb-1">样本覆盖量</div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">
              1,200<span className="text-lg">万吨</span>
            </span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-xs text-gray-500 mb-1">质量预警数</div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">
              3<span className="text-lg">项</span>
            </span>
            <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded mb-1">
              高风险
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* SPC Chart */}
        <div className="flex-1 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 border-l-4 border-blue-600 pl-3">
            <h3 className="font-bold text-gray-800 text-sm">
              行业基准：热轧厚度 Cpk 分布
            </h3>
          </div>
          <div className="h-40 relative flex items-center px-4 border-l border-b border-gray-300">
            <div className="absolute top-[20%] left-0 right-0 border-t border-dashed border-gray-200 text-[10px] text-gray-400 pl-1">
              行业前10% (1.67)
            </div>
            <div className="absolute top-[50%] left-0 right-0 border-t border-blue-200 text-[10px] text-blue-400 pl-1">
              行业平均 (1.33)
            </div>

            <div className="flex-1 flex justify-between items-end h-full pt-4 px-2">
              {[20, 35, 50, 70, 85, 60, 45, 30, 20, 10].map((val, i) => (
                <div
                  key={i}
                  className="w-1/12 mx-0.5 bg-blue-100 rounded-t-sm relative group hover:bg-blue-300 transition-colors"
                  style={{ height: `${val}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100">
                    {val}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-1/3 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 border-l-4 border-purple-600 pl-3">
            <h3 className="font-bold text-gray-800 text-sm">
              缺陷高发排行 (TOP 5)
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { name: "边部裂纹", val: "28%", trend: "up" },
              { name: "氧化铁皮压入", val: "22%", trend: "down" },
              { name: "辊印", val: "15%", trend: "flat" },
              { name: "浪形", val: "12%", trend: "down" },
              { name: "划伤", val: "8%", trend: "up" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${i < 3 ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {i + 1}
                  </span>
                  {item.name}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-purple-500 h-full"
                      style={{ width: item.val }}
                    ></div>
                  </div>
                  <span className="w-6 text-right text-gray-900">
                    {item.val}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Report Mode Content (New)
  const renderReport = () => (
    <div className="flex h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in duration-300">
      {/* TOC Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
          蓝皮书目录 (Contents)
        </div>
        <ul className="space-y-1">
          {[
            "前言：2025行业展望",
            "第一章：原材料质量分析",
            "第二章：热轧工序基准",
            "第三章：酸轧工艺控制",
            "第四章：主要缺陷图谱",
            "第五章：未来技术趋势",
          ].map((item, i) => (
            <li
              key={i}
              className={`px-3 py-2 rounded-lg text-sm cursor-pointer ${i === 2 ? "bg-blue-100 text-blue-700 font-bold" : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"}`}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Document Viewer */}
      <div className="flex-1 p-8 overflow-y-auto bg-white relative">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 border-b border-gray-100 pb-4">
            <span className="text-blue-600 font-bold text-sm mb-2 block">
              第二章：热轧工序基准
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              2.3 厚度控制能力 (AGC) 行业现状
            </h1>
            <p className="text-gray-500 text-sm">
              最后更新：2025-03-15 · 数据来源：钢铁大数据中心
            </p>
          </div>

          <div className="prose prose-blue max-w-none text-gray-700">
            <p className="mb-4">
              2024年，全行业热轧板卷厚度控制能力稳步提升。头部企业通过引入
              <strong>AI前馈控制模型</strong>，有效降低了头部厚度超差的长度。
              数据显示，行业平均 Cpk 值达到{" "}
              <span className="bg-green-100 text-green-800 px-1 rounded font-bold">
                1.33
              </span>
              ，较去年提升 5.2%。
            </p>

            {/* Embedded Chart */}
            <div className="my-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-4 text-sm text-center">
                图 2-3：2020-2025 行业厚度 Cpk 均值走势
              </h4>
              <div className="h-48 flex items-end justify-between px-8 gap-4 border-b border-gray-200 pb-2 relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[1, 2, 3, 4].map((l) => (
                    <div
                      key={l}
                      className="border-t border-dashed border-gray-200 w-full h-0"
                    ></div>
                  ))}
                </div>

                {[1.15, 1.18, 1.22, 1.28, 1.33].map((val, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 group w-full"
                  >
                    <div
                      className="w-full bg-blue-500 hover:bg-blue-600 transition-all rounded-t-lg relative"
                      style={{ height: `${(val - 1.0) * 300}px` }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        {val}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">202{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3 mt-8">
              关键发现 (Key Findings)
            </h3>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>
                <strong>装备升级效应明显：</strong>
                配置液压AGC系统的机组，其厚度命中率比电动压下机组高出{" "}
                <span className="font-bold text-gray-900">12%</span>。
              </li>
              <li>
                <strong>AI算法介入：</strong>约 35%
                的受调研企业已在精轧末机架部署了神经网络厚度补偿模型。
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full w-full bg-gray-50 p-6 overflow-y-auto flex-col">
      {/* View Switcher */}
      <div className="flex justify-center mb-6">
        <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex gap-1">
          <button
            onClick={() => setViewMode("report")}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              viewMode === "report"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <BookOpen size={16} /> 蓝皮书阅读 (Report)
          </button>
          <button
            onClick={() => setViewMode("dashboard")}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              viewMode === "dashboard"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <PieChart size={16} /> 对标看板 (Dashboard)
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 w-full max-w-6xl mx-auto">
        {viewMode === "dashboard" ? renderDashboard() : renderReport()}
      </div>
    </div>
  );
};

// --- Module Renderer ---

const ModuleRenderer: React.FC<{ module: DetailModule }> = ({ module }) => {
  switch (module.type) {
    case "hero":
      return (
        <div
          className={`bg-gradient-to-br from-${module.data?.theme || "blue"}-50 to-indigo-50 p-8 rounded-2xl border border-${module.data?.theme || "blue"}-100 relative overflow-hidden mb-8`}
        >
          <div className="relative z-10 max-w-3xl">
            {module.data?.theme === "blue" && (
              <span className="text-xs font-bold text-blue-600 bg-white px-2 py-1 rounded border border-blue-200 mb-2 inline-block shadow-sm">
                方法智能体 (Method Agent)
              </span>
            )}
            {module.data?.theme === "purple" && (
              <span className="text-xs font-bold text-purple-600 bg-white px-2 py-1 rounded border border-purple-200 mb-2 inline-block shadow-sm">
                分析智能体 (Analysis Agent)
              </span>
            )}
            <h3
              className={`text-2xl font-bold text-${module.data?.theme || "blue"}-900 mb-4`}
            >
              {module.title}
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              {module.content}
            </p>
            {module.data?.stats && (
              <div className="flex gap-6 mt-4">
                {module.data.stats.map((stat: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white/60 p-3 rounded-lg backdrop-blur-sm"
                  >
                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      {stat.icon === "activity" && <Activity size={12} />}
                      {stat.icon === "zap" && <Zap size={12} />}
                      {stat.icon === "user" && <User size={12} />}
                      {stat.icon === "database" && <Database size={12} />}
                      {stat.icon === "building" && <Building2 size={12} />}
                      {stat.label}
                    </div>
                    <div className="font-bold text-gray-900 text-lg">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    case "text":
      return (
        <p className="text-gray-700 leading-relaxed mb-6">{module.content}</p>
      );
    case "image":
      return (
        <img
          src={module.content}
          alt={module.title}
          className="w-full rounded-xl mb-6 shadow-sm border border-gray-100"
        />
      );
    case "features-grid":
      return (
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 mb-8">
          <h3 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">
            {module.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {module.data.map((feature: any, idx: number) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-xl border border-gray-100 hover:border-blue-200 transition-all hover:shadow-sm"
              >
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-3">
                  {feature.icon === "book" ? (
                    <BookOpen size={20} />
                  ) : feature.icon === "target" ? (
                    <TargetIcon />
                  ) : feature.icon === "alert" ? (
                    <AlertTriangle size={20} />
                  ) : feature.icon === "database" ? (
                    <Database size={20} />
                  ) : feature.icon === "chart" ? (
                    <PieChart size={20} />
                  ) : (
                    <Box size={20} />
                  )}
                </div>
                <h4 className="font-bold text-gray-800 mb-2 text-sm">
                  {feature.title}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    case "comparison":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-red-50 p-6 rounded-xl border border-red-100">
            <h4 className="font-bold text-red-800 mb-4 flex items-center gap-2">
              <X size={18} /> {module.data.bad.title}
            </h4>
            <ul className="space-y-3">
              {module.data.bad.items.map((item: any, i: number) => (
                <li key={i} className="text-sm text-red-700">
                  <span className="font-bold block mb-1">{item.title}</span>
                  <span className="opacity-80">{item.desc}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-green-50 p-6 rounded-xl border border-green-100">
            <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2">
              <CheckCircle size={18} /> {module.data.good.title}
            </h4>
            <ul className="space-y-3">
              {module.data.good.items.map((item: any, i: number) => (
                <li key={i} className="text-sm text-green-700">
                  <span className="font-bold block mb-1">{item.title}</span>
                  <span className="opacity-80">{item.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    case "custom-architecture":
      return (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Cpu size={20} className="text-blue-600" /> {module.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative group">
              <div className="absolute -top-3 left-6 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-sm">
                1. 全息感知
              </div>
              <Activity
                size={32}
                className="text-blue-500 mb-4 group-hover:scale-110 transition-transform"
              />
              <h4 className="font-bold text-gray-900 mb-2">多维数据融合</h4>
              <p className="text-sm text-gray-500">
                实时采集PLC信号、ASI表面影像及测厚仪数据，构建毫秒级数字孪生体。
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm relative group">
              <div className="absolute -top-3 left-6 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-sm">
                2. 专家推理
              </div>
              <GitBranch
                size={32}
                className="text-blue-600 mb-4 group-hover:scale-110 transition-transform"
              />
              <h4 className="font-bold text-blue-900 mb-2">知识图谱匹配</h4>
              <p className="text-sm text-blue-700">
                将异常特征与“专家规则库”及“机理模型”进行匹配，定位根因（如：弯辊力设置不当）。
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative group">
              <div className="absolute -top-3 left-6 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-sm">
                3. 闭环执行
              </div>
              <Zap
                size={32}
                className="text-green-500 mb-4 group-hover:scale-110 transition-transform"
              />
              <h4 className="font-bold text-gray-900 mb-2">反向控制</h4>
              <p className="text-sm text-gray-500">
                生成优化后的控制指令（Setpoints），直接下发至L2系统，完成无人化调整。
              </p>
            </div>
          </div>
        </div>
      );
    case "custom-bi-concept":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {module.title}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-purple-100 text-purple-600 rounded p-1">
                  <BookOpen size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">
                    内置静态数据集 (行业基准)
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    包含 2024-2025
                    全行业千万级样本的脱敏统计数据，覆盖35家标杆钢企。
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-purple-100 text-purple-600 rounded p-1">
                  <BarChart2 size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">
                    动态诊断模型
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    输入您企业的质量数据，即刻生成与行业Top 10%的差距诊断报告。
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-purple-100 text-purple-600 rounded p-1">
                  <FileText size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">
                    深度分析报告
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    季度更新的深度长文报告，解读政策影响、技术趋势与市场波动。
                  </p>
                </div>
              </li>
            </ul>
          </div>
          {/* Visual representation of Book + BI */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="relative mb-6 group cursor-pointer">
              <div className="absolute inset-0 bg-purple-200 rounded-lg blur-lg opacity-50 group-hover:opacity-80 transition-opacity"></div>
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white w-40 h-52 rounded-lg shadow-xl relative z-10 flex flex-col justify-between p-4 transform group-hover:-translate-y-2 transition-transform">
                <div>
                  <div className="text-[10px] opacity-70 uppercase tracking-widest mb-1">
                    Industry Report
                  </div>
                  <div className="font-bold text-lg leading-tight">
                    2025
                    <br />
                    冷轧质量
                    <br />
                    蓝皮书
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <Activity size={24} className="opacity-80" />
                  <div className="text-[10px] opacity-70">Vol. 1</div>
                </div>
              </div>
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-sm text-xs font-bold text-gray-500 border border-gray-100 flex items-center gap-2">
              <Search size={12} className="text-purple-500" />
              支持全文检索与数据洞察
            </div>
          </div>
        </div>
      );
    case "scenarios":
      if (!module.data || module.data.length === 0) return null;
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {module.data.map((scenario: any, idx: number) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
            >
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Factory size={18} className="text-blue-500" />
                {scenario.title}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                {scenario.desc}
              </p>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
};

// --- Share Flow Components ---

const ShareModal: React.FC<{
  onClose: () => void;
  onShare: (platform: "wechat" | "wecom" | "dingtalk") => void;
}> = ({ onClose, onShare }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in duration-200">
    <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl transform transition-all scale-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">分享智能体</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => onShare("wechat")}
          className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 rounded-xl transition-colors group"
        >
          <div className="w-12 h-12 bg-[#07C160] rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
            <MessageSquare size={24} fill="currentColor" />
          </div>
          <span className="text-xs text-gray-600">微信</span>
        </button>
        <button
          onClick={() => onShare("wecom")}
          className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 rounded-xl transition-colors group"
        >
          <div className="w-12 h-12 bg-[#297DFF] rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
            <Building2 size={24} fill="currentColor" />
          </div>
          <span className="text-xs text-gray-600">企业微信</span>
        </button>
        <button
          onClick={() => onShare("dingtalk")}
          className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 rounded-xl transition-colors group"
        >
          <div className="w-12 h-12 bg-[#0089FF] rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
            <Zap size={24} fill="currentColor" />
          </div>
          <span className="text-xs text-gray-600">钉钉</span>
        </button>
      </div>
      <div className="border-t border-gray-100 pt-4">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors">
          <Copy size={16} /> 复制链接
        </button>
      </div>
    </div>
  </div>
);

const ChatSimulationModal: React.FC<{
  platform: "wechat" | "wecom" | "dingtalk" | null;
  agent: any;
  onClose: () => void;
  onOpenLink: () => void;
}> = ({ platform, agent, onClose, onOpenLink }) => {
  const platformName =
    platform === "wechat" ? "微信" : platform === "wecom" ? "企业微信" : "钉钉";
  const headerColor =
    platform === "wechat"
      ? "bg-[#ededed]"
      : platform === "wecom"
        ? "bg-[#f5f5f5]"
        : "bg-[#0089FF] text-white";
  const bubbleColor = "bg-white";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in duration-200">
      <div className="bg-[#f5f5f5] w-[375px] h-[667px] rounded-[30px] shadow-2xl overflow-hidden flex flex-col relative border-8 border-gray-800">
        {/* Phone Status Bar Mock */}
        <div
          className={`h-12 flex items-end justify-between px-6 pb-2 text-xs font-medium ${platform === "dingtalk" ? "bg-[#0089FF] text-white" : "bg-[#ededed] text-black"}`}
        >
          <span>14:30</span>
          <div className="flex gap-1">
            <div className="w-4 h-2.5 bg-current rounded-sm opacity-80"></div>
            <div className="w-0.5 h-2.5 bg-current rounded-sm opacity-80"></div>
          </div>
        </div>

        {/* App Header */}
        <div
          className={`h-12 flex items-center justify-between px-4 ${headerColor} border-b border-gray-200/10`}
        >
          <div className="flex items-center gap-1">
            <ChevronRight size={20} className="rotate-180" />
            <span className="font-medium text-base">{platformName}</span>
          </div>
          <MoreHorizontal size={20} />
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-[#f2f2f2]">
          <div className="flex gap-3 mb-6">
            <div className="w-10 h-10 rounded bg-gray-300 flex-shrink-0"></div>
            <div className="flex flex-col gap-1 max-w-[260px]">
              <span className="text-xs text-gray-400">王工程师</span>
              <div
                onClick={onOpenLink}
                className={`${bubbleColor} p-3 rounded-lg shadow-sm cursor-pointer hover:opacity-90 transition-opacity border border-gray-100`}
              >
                <div className="flex gap-3 mb-2">
                  <div
                    className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center ${agent.type === "method" ? "bg-blue-100 text-blue-500" : "bg-purple-100 text-purple-500"}`}
                  >
                    {agent.type === "method" ? (
                      <Box size={24} />
                    ) : (
                      <BarChart2 size={24} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
                      {agent.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {agent.description}
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-2 mt-1 flex items-center gap-1 text-[10px] text-gray-400">
                  <div className="w-3 h-3 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-[6px] text-white font-bold">W</span>
                  </div>
                  维观AI - 工业智能体平台
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Input Mock */}
        <div className="h-14 bg-[#f7f7f7] border-t border-gray-200 flex items-center px-4 gap-3">
          <div className="w-7 h-7 rounded-full border border-gray-400"></div>
          <div className="flex-1 h-9 bg-white rounded px-2 border border-gray-200"></div>
          <div className="w-7 h-7 rounded-full border border-gray-400"></div>
          <div className="w-7 h-7 rounded-full border border-gray-400"></div>
        </div>

        {/* Close Simulation Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-black/20 rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors z-50"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const LandingPageModal: React.FC<{
  agent: any;
  onClose: () => void;
}> = ({ agent, onClose }) => (
  <div className="fixed inset-0 bg-white z-[60] animate-in slide-in-from-bottom duration-300 flex flex-col">
    {/* Mobile Header */}
    <div className="h-14 border-b border-gray-100 flex items-center justify-between px-4 bg-white sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
          W
        </div>
        <span className="font-bold text-gray-900">维观AI</span>
      </div>
      <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
        <X size={24} />
      </button>
    </div>

    {/* Content */}
    <div className="flex-1 overflow-y-auto bg-gray-50 pb-32">
      {/* Hero */}
      <div className="bg-white p-6 mb-4">
        <div
          className={`w-20 h-20 rounded-2xl mb-6 flex items-center justify-center ${agent.type === "method" ? "bg-blue-100 text-blue-500" : "bg-purple-100 text-purple-500"}`}
        >
          {agent.type === "method" ? (
            <Box size={40} />
          ) : (
            <BarChart2 size={40} />
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{agent.title}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">
            {agent.category}
          </span>
          <span>v{agent.version}</span>
        </div>
        <p className="text-gray-600 leading-relaxed mb-6">
          {agent.description}
        </p>
        <div className="flex gap-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />{" "}
            {agent.rating}
          </div>
          <div className="flex items-center gap-1">
            <Download size={14} /> {agent.installCount} 次安装
          </div>
        </div>
      </div>

      {/* Preview Images Mock */}
      <div className="bg-white p-6 mb-4">
        <h3 className="font-bold text-gray-900 mb-4">应用预览</h3>
        <div className="flex gap-3 overflow-x-auto pb-4">
          <div className="w-64 h-40 bg-gray-100 rounded-lg flex-shrink-0 border border-gray-200 flex items-center justify-center text-gray-400 bg-gray-50">
            <Monitor size={32} />
          </div>
          <div className="w-64 h-40 bg-gray-100 rounded-lg flex-shrink-0 border border-gray-200 flex items-center justify-center text-gray-400 bg-gray-50">
            <BarChart2 size={32} />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white p-6">
        <h3 className="font-bold text-gray-900 mb-4">核心能力</h3>
        <ul className="space-y-3">
          {agent.detailsModules[0]?.data?.features?.map(
            (feature: string, idx: number) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <CheckCircle
                  size={16}
                  className="text-green-500 mt-0.5 flex-shrink-0"
                />
                {feature}
              </li>
            ),
          )}
        </ul>
      </div>
    </div>

    {/* Bottom Action Bar */}
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-xl pb-8">
      <div className="flex items-center gap-4 max-w-md mx-auto">
        <div className="hidden sm:block w-24 h-24 bg-gray-900 rounded-xl flex-shrink-0 p-2">
          {/* QR Code Mock */}
          <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
            <div className="grid grid-cols-5 grid-rows-5 gap-0.5 w-16 h-16">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className={`bg-black ${Math.random() > 0.5 ? "opacity-100" : "opacity-0"}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="text-sm text-gray-500 mb-2 text-center sm:text-left">
            下载维观AI App，立即使用此智能体
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
            <Download size={20} />
            下载 App 体验
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ProductDetail: React.FC<ProductDetailProps> = ({
  onBack,
  onNavigate,
  onPurchase,
  onUpgrade,
  initialParams,
  productOrders = [],
}) => {
  const [activeAgentId, setActiveAgentId] = useState("1");
  const [demoTab, setDemoTab] = useState<"preview" | "video" | "live">(
    "preview",
  );
  const [pricingMode, setPricingMode] = useState<"saas" | "buyout">("saas");
  const [saasPlanType, setSaasPlanType] = useState<
    "monthly" | "yearly" | "usage"
  >("monthly");
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseProcessing, setPurchaseProcessing] = useState(false);
  const [purchaseType, setPurchaseType] = useState<
    "trial" | "paid" | "consultation"
  >("paid");
  const [riskCheckStatus, setRiskCheckStatus] = useState<
    "idle" | "checking" | "passed" | "failed"
  >("idle");
  const [trialAuditStatus, setTrialAuditStatus] = useState<
    "idle" | "auditing" | "passed" | "failed"
  >("idle");
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [consultationForm, setConsultationForm] = useState({
    name: "",
    phone: "",
    company: "",
  });
  const [consultationSubmitted, setConsultationSubmitted] = useState(false);
  const [keepData, setKeepData] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<
    "alipay" | "wechat" | "offline"
  >("alipay");
  const [showPaymentApplicationModal, setShowPaymentApplicationModal] =
    useState(false);

  // Share Flow State
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharePlatform, setSharePlatform] = useState<
    "wechat" | "wecom" | "dingtalk" | null
  >(null);
  const [showChatSimulation, setShowChatSimulation] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(false);

  const handleShare = (platform: "wechat" | "wecom" | "dingtalk") => {
    setSharePlatform(platform);
    setShowShareModal(false);
    setShowChatSimulation(true);
  };

  const handleOpenLink = () => {
    setShowChatSimulation(false);
    setShowLandingPage(true);
  };

  const reviewsRef = useRef<HTMLDivElement>(null);

  const agent = MOCK_AGENTS[activeAgentId];
  const trialCount = productOrders?.filter(o => o.orderType === "Trial").length || 0;

  // Determine User Status based on productOrders
  const activeTrialOrder = productOrders.find((o) => o.status === "Trial");
  const suspendedTrialOrder = productOrders.find(
    (o) => o.status === "TRIAL_SUSPENDED" || o.status === "GRACE_PERIOD",
  );
  const activePaidOrder = productOrders.find((o) => o.status === "Active");
  const paymentFailedOrder = productOrders.find(
    (o) => o.status === "PaymentFailed",
  );

  const userStatus = activeTrialOrder
    ? "trial_active"
    : suspendedTrialOrder
      ? "trial_suspended"
      : activePaidOrder
        ? "paid_active"
        : paymentFailedOrder
          ? "payment_failed"
          : "new_user";

  const isTrialEligible = !!agent?.trialConfig?.enabled;

  useEffect(() => {
    setDemoTab("preview");
    setPricingMode("saas");
    setSaasPlanType("monthly");
    setPurchaseType("paid"); // Reset on agent change
    setRiskCheckStatus("idle"); // Reset risk check
    setConsultationSubmitted(false);
    setConsultationForm({ name: "", phone: "", company: "" });
  }, [activeAgentId]);

  // Handle deep linking via initialParams
  useEffect(() => {
    if (initialParams) {
      if (initialParams.id) {
        setActiveAgentId(initialParams.id);
      }
      if (initialParams.action === "purchase") {
        if (pricingMode === "buyout") {
          setPurchaseType("consultation");
        } else if (initialParams.upgrade_instance_id) {
          setPurchaseType("upgrade");
        } else {
          setPurchaseType("paid");
        }
        setShowPurchaseModal(true);
      }
      if (initialParams.action === "review") {
        setTimeout(() => {
          reviewsRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 500); // Slight delay to ensure render
      }
    }
  }, [initialParams, pricingMode]);

  if (!agent) return <div>Loading...</div>;

  const handleContactManager = () => {
    onNavigate("messages", { conversationId: "manager_james" });
  };

  const handleCtaClick = (
    type: "trial" | "paid" | "consultation" | "upgrade",
  ) => {
    setPurchaseType(type);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = () => {
    setPurchaseProcessing(true);
    setPurchaseSuccess(false);
    if (purchaseType === "consultation") {
      setTimeout(() => {
        setPurchaseProcessing(false);
        setConsultationSubmitted(true);
        setTimeout(() => {
          setShowPurchaseModal(false);
          setConsultationSubmitted(false);
          setConsultationForm({ name: "", phone: "", company: "" });
          alert("咨询请求已提交，客户经理将尽快联系您！");
        }, 2000);
      }, 1500);
      return;
    }

    if (purchaseType === "trial") {
      setRiskCheckStatus("checking");
      setTimeout(() => {
        setRiskCheckStatus("passed");
        setTrialAuditStatus("auditing");
        setTimeout(() => {
          if (trialCount >= 2) {
            setTrialAuditStatus("failed");
            setPurchaseProcessing(false);
          } else {
            setTrialAuditStatus("passed");
            setTimeout(() => {
              setPurchaseProcessing(false);
              if (onPurchase) {
                onPurchase(agent, {
                  type: "trial",
                  amount: agent.trialConfig?.installationFee || 0,
                  trialConfig: agent.trialConfig,
                  version: agent.version,
                  paymentMethod:
                    paymentMethod === "alipay"
                      ? "Alipay"
                      : paymentMethod === "wechat"
                        ? "WeChat"
                        : "CorporateRemittance",
                });
              }
              setPurchaseSuccess(true);
              setRiskCheckStatus("idle");
              setTrialAuditStatus("idle");
            }, 1000);
          }
        }, 1500);
      }, 1500);
      return;
    }

    // Paid Purchase (New or Upgrade)
    setTimeout(() => {
      setPurchaseProcessing(false);
      const planDetails = {
        type: "Subscription",
        planName: saasPlanType === "monthly" ? "月度订阅" : saasPlanType === "yearly" ? "年度订阅" : "按量计费",
        period: saasPlanType === "monthly" ? "Monthly" : saasPlanType === "yearly" ? "Yearly" : "Usage",
        amount:
          saasPlanType === "monthly"
            ? parseInt(agent.pricing.saas.price.replace(/,/g, "")) * (agent.pricing.saas.monthlyDiscount !== undefined ? agent.pricing.saas.monthlyDiscount / 100 : 1)
            : saasPlanType === "yearly"
              ? parseInt(agent.pricing.saas.price.replace(/,/g, "")) * 12 * (agent.pricing.saas.yearlyDiscount !== undefined ? agent.pricing.saas.yearlyDiscount / 100 : 0.8)
              : 5000, // Usage base installation fee
        paymentMethod:
          paymentMethod === "alipay"
            ? "Alipay"
            : paymentMethod === "wechat"
              ? "WeChat"
              : "CorporateRemittance",
      };

      if (
        purchaseType === "upgrade" &&
        initialParams?.upgrade_instance_id &&
        onUpgrade
      ) {
        // Targeted Upgrade Flow
        onUpgrade(initialParams.upgrade_instance_id, planDetails);
      } else {
        // New Purchase (New User or Buy Another)
        if (onPurchase) {
          onPurchase(agent, planDetails);
        }
      }
      setPurchaseSuccess(true);
    }, 1500);
  };

  // Helper to get current display price
  const getDisplayPrice = () => {
    if (purchaseType === "trial") {
      return agent.trialConfig?.installationFee ? agent.trialConfig.installationFee.toLocaleString() : "0.00";
    }
    if (pricingMode === "buyout") return agent.pricing.buyout.price;
    const baseMonthly = parseInt(agent.pricing.saas.price.replace(/,/g, ""), 10);
    if (saasPlanType === "monthly") {
      const discount = agent.pricing.saas.monthlyDiscount !== undefined ? agent.pricing.saas.monthlyDiscount / 100 : 1;
      return (baseMonthly * discount).toLocaleString();
    }
    if (saasPlanType === "yearly") {
      const discount = agent.pricing.saas.yearlyDiscount !== undefined ? agent.pricing.saas.yearlyDiscount / 100 : 0.8;
      return (baseMonthly * 12 * discount).toLocaleString();
    }
    return "5,000"; // Usage base installation fee
  };

  const getDisplayUnit = () => {
    if (pricingMode === "buyout") return agent.pricing.buyout.unit;
    if (saasPlanType === "monthly") return "/ 月";
    if (saasPlanType === "yearly") return "/ 年";
    return "/ 基础费";
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white relative">
      {/* Top Navigation / Breadcrumb */}
      <header className="h-14 border-b border-gray-100 flex items-center px-8 justify-between flex-shrink-0 bg-white z-10">
        <div className="flex items-center text-sm text-gray-500 gap-2">
          <span className="hover:text-blue-600 cursor-pointer" onClick={onBack}>
            市场首页
          </span>
          <ChevronRight size={14} />
          <span>{agent.category.split(" · ")[0]}</span>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">{agent.title}</span>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <Heart
            size={20}
            className="hover:text-red-500 cursor-pointer transition-colors"
          />
          <Share2
            size={20}
            className="hover:text-blue-500 cursor-pointer transition-colors"
            onClick={() => setShowShareModal(true)}
          />
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex items-start max-w-[1600px] mx-auto">
          {/* Center Column: Product Details */}
          <div className="flex-1 p-8 min-w-0">
            {/* Product Header Card */}
            <div className="flex gap-6 mb-8">
              <div
                className={`w-32 h-32 rounded-3xl overflow-hidden shadow-sm flex-shrink-0 flex items-center justify-center ${agent.type === "method" ? "bg-blue-100" : "bg-purple-100"}`}
              >
                {agent.type === "method" ? (
                  <Box size={64} className="text-blue-500" />
                ) : (
                  <BarChart2 size={64} className="text-purple-500" />
                )}
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded border font-medium ${
                      agent.type === "method"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-purple-100 text-purple-700 border-purple-200"
                    }`}
                  >
                    {agent.type === "method" ? "方法智能体" : "分析智能体"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {agent.category}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                  {agent.title}
                </h1>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1.5 text-blue-600 font-medium">
                    <CheckCircle size={16} />
                    <span>{agent.provider}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star
                      size={16}
                      className="text-yellow-400 fill-yellow-400"
                    />
                    <span className="font-bold text-gray-900">
                      {agent.rating}
                    </span>
                    <span className="text-gray-400">
                      ({agent.reviewCount} 条评价)
                    </span>
                  </div>
                  <span className="text-gray-400">版本 {agent.version}</span>
                </div>
              </div>
            </div>

            {/* Version Tabs */}
            <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-1 overflow-x-auto">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-200 flex-shrink-0">
                {agent.versions[0]} (最新)
              </button>
              {agent.versions.slice(1).map((ver) => (
                <button
                  key={ver}
                  className="px-4 py-2 text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors flex-shrink-0"
                >
                  {ver}
                </button>
              ))}
            </div>

            {/* Demo Container */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-2xl bg-[#0f0f13] mb-10 ring-4 ring-gray-50">
              {/* Demo Header Tabs */}
              <div className="flex items-center justify-between px-6 py-3 bg-[#13131a] text-gray-400 text-sm border-b border-gray-800">
                <div className="flex gap-1">
                  <button
                    onClick={() => setDemoTab("preview")}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all ${demoTab === "preview" ? "text-white bg-gray-800" : "hover:text-gray-200"}`}
                  >
                    <Monitor size={14} />
                    界面预览
                  </button>
                  <button
                    onClick={() => setDemoTab("video")}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all ${demoTab === "video" ? "text-white bg-gray-800" : "hover:text-gray-200"}`}
                  >
                    <PlayCircle size={14} />
                    视频介绍
                  </button>
                  <button
                    onClick={() => setDemoTab("live")}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all ${demoTab === "live" ? "text-red-500 bg-gray-800" : "hover:text-gray-200"}`}
                  >
                    <Radio size={14} />
                    实时直播{" "}
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse ml-1"></span>
                  </button>
                </div>
              </div>

              {/* Demo Content */}
              <div className="h-[600px] bg-gray-50 relative overflow-hidden">
                {demoTab === "preview" &&
                  (agent.id === "2" ? (
                    <QualityBIPreview />
                  ) : (
                    <ColdRollingPreview />
                  ))}
                {demoTab === "video" && <VideoView />}
                {demoTab === "live" && <LiveView />}

                {/* Blocked Overlay for Suspended Instances */}
                {initialParams?.instance_status && ["TRIAL_SUSPENDED", "GRACE_PERIOD", "ARCHIVED"].includes(initialParams.instance_status) && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
                    <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl flex flex-col items-center">
                      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle size={32} strokeWidth={2.5} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {initialParams.instance_status === "TRIAL_SUSPENDED" ? "试用已结束 / 额度已用尽" : 
                         initialParams.instance_status === "GRACE_PERIOD" ? "实例已欠费停服" : "实例已归档"}
                      </h3>
                      <div className="text-gray-500 text-sm mb-6 leading-relaxed text-left bg-gray-50 p-4 rounded-xl border border-gray-100 w-full">
                        <p className="font-bold text-gray-700 mb-2">触发熔断机制：</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {initialParams.instance_status === "TRIAL_SUSPENDED" ? (
                            <>
                              <li>您的试用期（14天）已结束，或</li>
                              <li>您的试用额度（如：1000 Tokens）已用尽</li>
                              <li className="text-red-500 font-medium mt-2 list-none">当前状态：智能体调用接口已阻断，无法继续对话或处理数据。</li>
                            </>
                          ) : initialParams.instance_status === "GRACE_PERIOD" ? (
                            <>
                              <li>您的账户余额不足以支付上个计费周期的账单</li>
                              <li>已超过宽限期（通常为7天）未补缴欠款</li>
                              <li className="text-red-500 font-medium mt-2 list-none">当前状态：实例已冻结，API 访问被拒绝。</li>
                            </>
                          ) : (
                            <>
                              <li>该实例已被您或管理员手动归档</li>
                              <li>归档状态下不产生任何费用</li>
                              <li className="text-red-500 font-medium mt-2 list-none">当前状态：数据已封存，实例不可用。</li>
                            </>
                          )}
                        </ul>
                      </div>
                      <button
                        onClick={() => {
                          if (initialParams.instance_status !== "ARCHIVED") {
                            setShowPurchaseModal(true);
                          } else {
                            onNavigate("profile", { tab: "assets" });
                          }
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all"
                      >
                        {initialParams.instance_status !== "ARCHIVED" ? "立即解锁 / 续费" : "返回控制台"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Overlay Caption */}
                <div className="absolute bottom-6 left-6 max-w-lg pointer-events-none hidden sm:block">
                  {demoTab === "preview" && (
                    <div className="bg-black/80 backdrop-blur-md text-white p-4 rounded-xl shadow-lg border border-white/10">
                      <h3 className="font-bold text-sm mb-1">
                        {agent.title} - 运行预览
                      </h3>
                      <p className="text-xs text-gray-400">
                        当前版本: {agent.version}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modular Product Details Section (Unified) */}
            <div className="mb-10 animate-in fade-in duration-500">
              <h2 className="text-lg font-bold text-blue-600 mb-4">
                产品详情 (Product Details)
              </h2>
              {agent.detailsModules.map((module) => (
                <ModuleRenderer key={module.id} module={module} />
              ))}
            </div>

            {/* Deliverables Section */}
            <div className="mb-10">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                核心内容交付
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agent.deliverables.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        item.type === "report"
                          ? "bg-red-50 text-red-500"
                          : item.type === "dashboard"
                            ? "bg-blue-50 text-blue-500"
                            : item.type === "map"
                              ? "bg-purple-50 text-purple-500"
                              : item.type === "model"
                                ? "bg-indigo-50 text-indigo-500"
                                : "bg-green-50 text-green-500"
                      }`}
                    >
                      {item.type === "report" ? (
                        <FileText size={24} />
                      ) : item.type === "dashboard" ? (
                        <Activity size={24} />
                      ) : item.type === "map" ? (
                        <Map size={24} />
                      ) : item.type === "model" ? (
                        <Database size={24} />
                      ) : item.type === "chart" ? (
                        <PieChart size={24} />
                      ) : (
                        <Cpu size={24} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Preview Section */}
            <div className="mb-10">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                数据样本预览
              </h2>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                      <tr>
                        {agent.dataPreview.columns.map((col) => (
                          <th
                            key={col.key}
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {agent.dataPreview.rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          {agent.dataPreview.columns.map((col) => (
                            <td
                              key={col.key}
                              className="px-6 py-4 whitespace-nowrap text-gray-700 font-mono"
                            >
                              {row[col.key]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-3 text-center text-xs text-gray-400 bg-gray-50 border-t border-gray-100">
                  ... 仅展示前 {agent.dataPreview.rows.length} 条样本数据
                </div>
              </div>
            </div>

            {/* Compliance Section */}
            <div className="mb-10">
              <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                  <ShieldCheck size={20} /> 数据脱敏与安全合规说明
                </h3>
                <p className="text-sm text-green-700 mb-4 leading-relaxed">
                  {agent.compliance.text}
                </p>
                <div className="flex flex-wrap gap-2">
                  {agent.compliance.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-bold text-green-600 bg-white px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1"
                    >
                      <CheckCircle size={12} /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* User Reviews */}
            <div ref={reviewsRef}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">用户评价</h2>
                <button className="text-blue-600 text-sm font-bold flex items-center gap-1">
                  <FileText size={14} /> 撰写评论
                </button>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900 mb-1">
                    {agent.rating}
                  </div>
                  <div className="flex text-yellow-400 justify-center mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <div className="text-xs text-gray-400">
                    {agent.reviewCount} 条认证评价
                  </div>
                </div>
                <div className="flex-1 w-full space-y-2">
                  {[
                    { s: 5, p: "80%" },
                    { s: 4, p: "12%" },
                    { s: 3, p: "5%" },
                    { s: 2, p: "2%" },
                    { s: 1, p: "1%" },
                  ].map((bar) => (
                    <div
                      key={bar.s}
                      className="flex items-center gap-3 text-xs"
                    >
                      <span className="text-gray-500 w-2">{bar.s}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-yellow-400 h-full rounded-full"
                          style={{ width: bar.p }}
                        ></div>
                      </div>
                      <span className="text-gray-400 w-6 text-right">
                        {bar.p}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Meta */}
          <aside className="w-96 p-8 border-l border-gray-100 flex-shrink-0 hidden xl:block sticky top-0 h-screen overflow-y-auto">
            {/* Status Banner based on User Status */}
            {userStatus === "trial_active" && (
              <div className="mb-4 bg-green-50 border border-green-100 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 p-1.5 rounded-full text-green-600">
                    <Clock size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-green-900">
                      体验试用中
                    </div>
                    <div className="text-[10px] text-green-600">
                      剩余{" "}
                      {Math.ceil(
                        (new Date(
                          activeTrialOrder?.expireDate || "",
                        ).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}{" "}
                      天
                    </div>
                  </div>
                </div>
              </div>
            )}
            {userStatus === "trial_suspended" && (
              <div className="mb-4 bg-red-50 border border-red-100 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-red-100 p-1.5 rounded-full text-red-600">
                    <AlertTriangle size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-red-900">
                      试用已结束
                    </div>
                    <div className="text-[10px] text-red-600">
                      实例已冻结，请解锁
                    </div>
                  </div>
                </div>
              </div>
            )}
            {userStatus === "paid_active" && (
              <div className="mb-4 bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-1.5 rounded-full text-blue-600">
                    <CheckCircle size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-blue-900">
                      已拥有该产品
                    </div>
                    <div className="text-[10px] text-blue-600">
                      可购买新实例或管理已有实例
                    </div>
                  </div>
                </div>
              </div>
            )}
            {userStatus === "payment_failed" && (
              <div className="mb-4 bg-red-50 border border-red-100 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-red-100 p-1.5 rounded-full text-red-600">
                    <AlertTriangle size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-red-900">
                      存在支付失败的订单
                    </div>
                    <div className="text-[10px] text-red-600">
                      请重新支付或购买新实例
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isTrialEligible && (
              <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                  推荐体验
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Clock size={18} className="text-green-600" /> 体验试用
                  </h3>
                  <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md">
                    {agent.trialConfig.duration}天
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Cpu size={12}/> 包含 Token</div>
                    <div className="font-bold text-gray-900">{agent.trialConfig.tokenLimit.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Database size={12}/> 包含存储</div>
                    <div className="font-bold text-gray-900">{agent.trialConfig.storageLimit} GB</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4 px-1">
                  <span className="text-sm text-gray-600">初装费</span>
                  <span className="font-bold text-gray-900 font-mono">
                    {agent.trialConfig.installationFee ? `¥${agent.trialConfig.installationFee.toLocaleString()}` : "¥0.00"}
                  </span>
                </div>
                <button
                  onClick={() => handleCtaClick("trial")}
                  className="w-full font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white shadow-green-200"
                >
                  申请体验试用 <ChevronRight size={16} />
                </button>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
              <h3 className="font-bold text-gray-700 mb-4">选择授权模式</h3>

              {/* Subscription Sub-options */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <button
                  onClick={() => setSaasPlanType("usage")}
                  className={`py-2 rounded-lg text-xs font-bold border transition-all ${saasPlanType === "usage" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
                >
                  按量
                </button>
                <button
                  onClick={() => setSaasPlanType("monthly")}
                  className={`py-2 rounded-lg text-xs font-bold border transition-all relative ${saasPlanType === "monthly" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
                >
                  包月
                  {agent.pricing.saas.monthlyDiscount !== undefined && agent.pricing.saas.monthlyDiscount < 100 && (
                    <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[8px] px-1 rounded">
                      {agent.pricing.saas.monthlyDiscount / 10}折
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setSaasPlanType("yearly")}
                  className={`py-2 rounded-lg text-xs font-bold border transition-all relative ${saasPlanType === "yearly" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
                >
                  包年
                  {agent.pricing.saas.yearlyDiscount !== undefined ? (
                    agent.pricing.saas.yearlyDiscount < 100 && (
                      <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[8px] px-1 rounded">
                        {agent.pricing.saas.yearlyDiscount / 10}折
                      </span>
                    )
                  ) : (
                    <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[8px] px-1 rounded">
                      省20%
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ¥
                  {saasPlanType === "monthly"
                    ? (
                        parseInt(agent.pricing.saas.price.replace(/,/g, "")) *
                        (agent.pricing.saas.monthlyDiscount !== undefined ? agent.pricing.saas.monthlyDiscount / 100 : 1)
                      ).toLocaleString()
                    : saasPlanType === "yearly"
                      ? (
                          parseInt(agent.pricing.saas.price.replace(/,/g, "")) *
                          12 *
                          (agent.pricing.saas.yearlyDiscount !== undefined ? agent.pricing.saas.yearlyDiscount / 100 : 0.8)
                        ).toLocaleString()
                      : "0.02"}
                </span>
                <span className="text-gray-500 font-medium">
                  {saasPlanType === "monthly"
                    ? "/ 月"
                    : saasPlanType === "yearly"
                      ? "/ 年"
                      : "/ 1k Token"}
                </span>
              </div>

              {/* Quota Details */}
              <div className="mb-8 space-y-3">
                {agent.pricing.saas.quota && (
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                    <div className="text-xs font-bold text-gray-700 mb-2">
                      正式订阅包含
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Cpu size={12} />{" "}
                        {agent.pricing.saas.quota.tokens.toLocaleString()}{" "}
                        Tokens
                      </div>
                      <div className="flex items-center gap-1">
                        <Database size={12} />{" "}
                        {agent.pricing.saas.quota.storage} GB 存储
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={12} /> {agent.pricing.saas.quota.users}{" "}
                        个并发用户
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap size={12} /> 初装费用
                      </div>
                    </div>
                  </div>
                )}

                {saasPlanType === "usage" && (
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                    <div className="text-xs font-bold text-gray-700 mb-2">
                      按量计费规则
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex justify-between font-medium text-gray-800">
                        <span>初装费用</span>
                        <span>¥5,000 / 次</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Token 消耗</span>
                        <span>¥0.02 / 1k Tokens</span>
                      </div>
                      <div className="flex justify-between">
                        <span>存储空间</span>
                        <span>¥0.5 / GB / 月</span>
                      </div>
                      <div className="flex justify-between">
                        <span>并发用户</span>
                        <span>¥50 / 用户 / 月</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Context-Aware CTA Button */}
              {initialParams?.upgrade_instance_id ? (
                <button
                  onClick={() => handleCtaClick("upgrade")}
                  className="w-full font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mb-4 bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                >
                  确认续费 <TrendingUp size={18} />
                </button>
              ) : (
                <div className="space-y-3 mb-4">
                  <button
                    onClick={() => handleCtaClick("paid")}
                    className="w-full font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white shadow-gray-200"
                  >
                    立即获取 <ChevronRight size={18} />
                  </button>
                  <p className="text-[10px] text-gray-400 text-center">
                    支持为不同产线或业务环境申请独立实例
                  </p>
                </div>
              )}

              <button
                onClick={() => onNavigate("profile", { tab: "assets" })}
                className="w-full text-center text-xs text-blue-600 font-medium flex items-center justify-center gap-1 cursor-pointer hover:bg-blue-50 py-3 rounded-lg border border-blue-100 transition-colors mb-4"
              >
                前往控制台管理已有实例 <ArrowRight size={12} />
              </button>

              <button
                onClick={() => handleCtaClick("consultation")}
                className="w-full text-center text-xs text-gray-500 font-medium flex items-center justify-center gap-1 cursor-pointer hover:text-gray-900 transition-colors"
              >
                联系客户经理 (私有化部署) <ChevronRight size={12} />
              </button>
            </div>

            {/* Meta Info */}
            <div className="space-y-4 mb-10 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-gray-400" />
                <span>
                  发布者： <strong>{agent.provider.split(" ")[0]}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-gray-400" />
                <span>上传时间： {agent.meta.publishDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <Download size={18} className="text-gray-400" />
                <span>总获取数： {agent.meta.downloads.toLocaleString()}</span>
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap size={16} className="text-yellow-500" />
                你可能还需要
              </h3>
              <div className="space-y-4">
                {agent.related.map((relId) => {
                  const relAgent = MOCK_AGENTS[relId];
                  if (!relAgent) return null;
                  return (
                    <div
                      key={relId}
                      onClick={() => setActiveAgentId(relId)}
                      className="flex gap-3 group cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${relAgent.type === "method" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}
                      >
                        {relAgent.type === "method" ? (
                          <Box size={18} />
                        ) : (
                          <BarChart2 size={18} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors">
                          {relAgent.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                            {relAgent.type === "method" ? "METHOD" : "ANALYSIS"}
                          </span>
                          <span className="text-[10px] text-gray-400 flex items-center">
                            ★ {relAgent.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Instance Config Modal */}
      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                {purchaseType === "trial" ? (
                  <Clock size={18} className="text-green-600" />
                ) : purchaseType === "consultation" ? (
                  <MessageSquare size={18} className="text-blue-600" />
                ) : (
                  <CreditCard size={18} className="text-blue-600" />
                )}
                {purchaseType === "trial"
                  ? "申请体验试用"
                  : purchaseType === "consultation"
                    ? "预约部署咨询"
                    : "确认订单"}
              </h3>
              <button onClick={() => setShowPurchaseModal(false)}>
                <X size={20} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            {purchaseSuccess ? (
              <div className="p-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <Check size={32} strokeWidth={3} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {purchaseType === "trial"
                    ? "试用实例开通成功！"
                    : purchaseType === "upgrade"
                      ? "实例续费成功！"
                      : "实例购买成功！"}
                </h3>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                  实例已准备就绪。
                  <br />
                  请前往控制台查看实例详情。
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => {
                      setShowPurchaseModal(false);
                      setPurchaseSuccess(false);
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    返回详情页
                  </button>
                  <button
                    onClick={() => {
                      setShowPurchaseModal(false);
                      setPurchaseSuccess(false);
                      onNavigate("profile", { tab: "orders" });
                    }}
                    className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                  >
                    前往控制台查看
                  </button>
                </div>
              </div>
            ) : consultationSubmitted ? (
              <div className="p-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <Check size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  提交成功
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  我们的销售顾问将在 24 小时内与您联系，请保持电话畅通。
                </p>
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="bg-gray-100 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-200"
                >
                  关闭
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <h4 className="font-bold text-gray-900 text-sm mb-1">
                    {agent.title}
                  </h4>
                  <div className="text-xs text-gray-500 mb-3">
                    {agent.provider} · {agent.version}
                  </div>

                  <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3">
                    <span className="text-gray-600">
                      {purchaseType === "trial"
                        ? `体验试用 (${agent.trialConfig?.duration}天)`
                        : purchaseType === "consultation"
                          ? "私有化永久授权"
                          : saasPlanType === "yearly"
                            ? "年度订阅"
                            : saasPlanType === "monthly"
                              ? "月度订阅"
                              : "按量付费"}
                    </span>
                    <span
                      className={`font-mono font-bold ${purchaseType === "trial" ? "text-green-600" : "text-gray-900"}`}
                    >
                      {purchaseType === "consultation"
                        ? "待评估"
                        : `¥${getDisplayPrice()}`}
                    </span>
                  </div>

                  {/* Order Details Breakdown */}
                  {purchaseType !== "consultation" && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                      <div className="text-xs font-bold text-gray-700 mb-2">订单明细</div>
                      {purchaseType === "trial" ? (
                        <>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>包含 Token</span>
                            <span>{agent.trialConfig?.tokenLimit.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>包含存储</span>
                            <span>{agent.trialConfig?.storageLimit} GB</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>初装费</span>
                            <span>¥{agent.trialConfig?.installationFee ? agent.trialConfig.installationFee.toLocaleString() : "0.00"}</span>
                          </div>
                        </>
                      ) : saasPlanType === "usage" ? (
                        <>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>初装费</span>
                            <span>¥5,000.00</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Token 消耗</span>
                            <span>¥0.02 / 1k Tokens</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>存储空间</span>
                            <span>¥0.5 / GB / 月</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>并发用户</span>
                            <span>¥50 / 用户 / 月</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>包含 Token</span>
                            <span>{agent.pricing.saas.quota?.tokens.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>包含存储</span>
                            <span>{agent.pricing.saas.quota?.storage} GB</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>并发用户</span>
                            <span>{agent.pricing.saas.quota?.users} 个</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>周期订阅费</span>
                            <span>¥{getDisplayPrice()}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {purchaseType === "upgrade" &&
                  initialParams?.upgrade_instance_id && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-0.5">
                            <Database size={16} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-blue-900 mb-1">
                              是否保留原数据
                            </h4>
                            <p className="text-xs text-blue-700">
                              {keepData
                                ? "平滑过度，原有业务数据无缝保留"
                                : "业务数据清零"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setKeepData(!keepData)}
                          className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 shadow-inner flex items-center px-0.5 ${keepData ? "bg-blue-500" : "bg-gray-300"}`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${keepData ? "translate-x-5" : "translate-x-0"}`}
                          ></div>
                        </button>
                      </div>
                    </div>
                  )}

                {purchaseType === "trial" ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <h5 className="text-xs font-bold text-blue-800 mb-2 flex items-center gap-1">
                        <ShieldCheck size={14} /> 体验试用说明
                      </h5>
                      <p className="text-[11px] text-blue-700 leading-relaxed">
                        试用期间包含基础资源额度。根据产品规格及部署要求，可能涉及基础初装费用，具体以订单明细为准。请确认后开启试用。
                      </p>
                    </div>
                    
                    {trialAuditStatus === "failed" ? (
                      <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-800 mt-2">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle size={16} className="text-red-600" />
                          <p className="text-sm font-bold">试用审核未通过</p>
                        </div>
                        <p className="text-xs leading-relaxed mb-3">
                          同一账户针对同一智能体的统一版本，只允许试用2次，如需继续使用，可正式购买立即获取。
                        </p>
                        <button 
                          onClick={() => setPurchaseType("paid")}
                          className="text-xs font-bold text-red-600 flex items-center gap-1 hover:underline"
                        >
                          前往购买正式版 <ArrowRight size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-500 uppercase block">
                          支付方式
                        </label>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setPaymentMethod("alipay")}
                            className={`flex-1 py-2.5 border rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${paymentMethod === "alipay" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:bg-gray-50 text-gray-600"}`}
                          >
                            <div className="w-4 h-4 bg-blue-500 rounded text-white text-[10px] flex items-center justify-center">
                              支
                            </div>{" "}
                            支付宝
                          </button>
                          <button
                            onClick={() => setPaymentMethod("wechat")}
                            className={`flex-1 py-2.5 border rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${paymentMethod === "wechat" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 hover:bg-gray-50 text-gray-600"}`}
                          >
                            <div className="w-4 h-4 bg-green-500 rounded text-white text-[10px] flex items-center justify-center">
                              微
                            </div>{" "}
                            微信支付
                          </button>
                          <button
                            onClick={() => setPaymentMethod("offline")}
                            className={`flex-1 py-2.5 border rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${paymentMethod === "offline" ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 hover:bg-gray-50 text-gray-600"}`}
                          >
                            <Building2
                              size={16}
                              className={
                                paymentMethod === "offline"
                                  ? "text-orange-600"
                                  : "text-gray-400"
                              }
                            />{" "}
                            线下汇款
                          </button>
                        </div>
                      </div>
                    )}

                    {riskCheckStatus !== "idle" && (
                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mt-2">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>企业风控检测</span>
                            {riskCheckStatus === "checking" && (
                              <span className="text-blue-500 animate-pulse">检测中...</span>
                            )}
                            {riskCheckStatus === "passed" && (
                              <span className="text-green-500 font-bold">通过</span>
                            )}
                          </div>
                          {riskCheckStatus === "passed" && (
                            <div className="space-y-2 mt-2 pt-2 border-t border-gray-200">
                              <div className="flex items-center justify-between text-xs text-gray-600">
                                <span>试用资格审核</span>
                                {trialAuditStatus === "auditing" && (
                                  <span className="text-blue-500 animate-pulse">审核中...</span>
                                )}
                                {trialAuditStatus === "passed" && (
                                  <span className="text-green-500 font-bold">已通过</span>
                                )}
                                {trialAuditStatus === "failed" && (
                                  <span className="text-red-500 font-bold">未通过</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : purchaseType === "consultation" ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1">
                        联系人姓名
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                        placeholder="请输入您的姓名"
                        value={consultationForm.name}
                        onChange={(e) =>
                          setConsultationForm({
                            ...consultationForm,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1">
                        联系电话
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                        placeholder="请输入手机号码"
                        value={consultationForm.phone}
                        onChange={(e) =>
                          setConsultationForm({
                            ...consultationForm,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1">
                        公司名称
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                        placeholder="请输入公司全称"
                        value={consultationForm.company}
                        onChange={(e) =>
                          setConsultationForm({
                            ...consultationForm,
                            company: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 uppercase mt-2 block">
                      支付方式
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setPaymentMethod("alipay")}
                        className={`flex-1 py-2.5 border rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${paymentMethod === "alipay" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:bg-gray-50 text-gray-600"}`}
                      >
                        <div className="w-4 h-4 bg-blue-500 rounded text-white text-[10px] flex items-center justify-center">
                          支
                        </div>{" "}
                        支付宝
                      </button>
                      <button
                        onClick={() => setPaymentMethod("wechat")}
                        className={`flex-1 py-2.5 border rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${paymentMethod === "wechat" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 hover:bg-gray-50 text-gray-600"}`}
                      >
                        <div className="w-4 h-4 bg-green-500 rounded text-white text-[10px] flex items-center justify-center">
                          微
                        </div>{" "}
                        微信支付
                      </button>
                      <button
                        onClick={() => setPaymentMethod("offline")}
                        className={`flex-1 py-2.5 border rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${paymentMethod === "offline" ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 hover:bg-gray-50 text-gray-600"}`}
                      >
                        <Building2
                          size={16}
                          className={
                            paymentMethod === "offline"
                              ? "text-orange-500"
                              : "text-gray-400"
                          }
                        />{" "}
                        线下支付
                      </button>
                    </div>
                    {paymentMethod === "offline" && (
                      <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-xs text-orange-800 mt-2">
                        <p className="font-bold mb-1">对公转账说明：</p>
                        <p>
                          请在提交订单后，下载
                          <span
                            className="text-blue-600 cursor-pointer hover:underline"
                            onClick={() => setShowPaymentApplicationModal(true)}
                          >
                            《支付申请单》
                          </span>
                          并进行对公转账，支付成功后请上传付款回执凭证。款项确认到账后请前往已购资源激活智能体。
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={
                    trialAuditStatus === "failed" && purchaseType === "trial"
                      ? () => setPurchaseType("paid")
                      : paymentMethod === "offline"
                        ? () => {
                            confirmPurchase();
                            setShowPaymentApplicationModal(true);
                          }
                        : confirmPurchase
                  }
                  disabled={
                    purchaseProcessing ||
                    (purchaseType === "consultation" &&
                      (!consultationForm.name || !consultationForm.phone))
                  }
                  className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 transition-all shadow-lg ${
                    purchaseType === "trial"
                      ? trialAuditStatus === "failed" ? "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200" : "bg-green-600 hover:bg-green-700 text-white shadow-green-200"
                      : purchaseType === "consultation"
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        : "bg-gray-900 hover:bg-black text-white"
                  }`}
                >
                  {purchaseProcessing ? (
                    <div className="flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      {purchaseType === "trial"
                        ? "正在提交申请..."
                        : purchaseType === "consultation"
                          ? "正在提交..."
                          : "正在处理..."}
                    </div>
                  ) : trialAuditStatus === "failed" && purchaseType === "trial" ? (
                    "前往购买正式版"
                  ) : purchaseType === "consultation" ? (
                    "提交咨询意向"
                  ) : paymentMethod === "offline" ? (
                    "提交订单并下载《支付申请单》"
                  ) : purchaseType === "trial" ? (
                    agent.trialConfig?.installationFee && agent.trialConfig.installationFee > 0 
                      ? `立即支付 ¥${agent.trialConfig.installationFee.toLocaleString()}`
                      : "确认申请体验试用 (¥0.00)"
                  ) : (
                    `立即支付 ¥${getDisplayPrice()}`
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Share Flow Modals */}
      {showShareModal && (
        <ShareModal
          onClose={() => setShowShareModal(false)}
          onShare={handleShare}
        />
      )}

      {showChatSimulation && (
        <ChatSimulationModal
          platform={sharePlatform}
          agent={agent}
          onClose={() => setShowChatSimulation(false)}
          onOpenLink={handleOpenLink}
        />
      )}

      {showLandingPage && (
        <LandingPageModal
          agent={agent}
          onClose={() => setShowLandingPage(false)}
        />
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
                style={{ minHeight: "600px" }}
              >
                <div className="text-center mb-8 border-b-2 border-gray-900 pb-4">
                  <h1 className="text-2xl font-bold tracking-widest text-gray-900">
                    支付申请单
                  </h1>
                  <p className="text-sm text-gray-500 mt-2">
                    PAYMENT APPLICATION FORM
                  </p>
                </div>

                <div className="flex justify-between text-sm mb-6">
                  <div>
                    <span className="text-gray-500">申请日期：</span>{" "}
                    {new Date().toLocaleDateString()}
                  </div>
                  <div>
                    <span className="text-gray-500">订单编号：</span> ORD-
                    {new Date().getFullYear()}
                    {String(new Date().getMonth() + 1).padStart(2, "0")}
                    {String(new Date().getDate()).padStart(2, "0")}-
                    {Math.floor(Math.random() * 1000)
                      .toString()
                      .padStart(3, "0")}
                  </div>
                </div>

                <table className="w-full border-collapse border border-gray-300 text-sm mb-8">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-3 bg-gray-50 w-32 font-medium">
                        收款方名称
                      </td>
                      <td className="border border-gray-300 p-3 font-bold">
                        AI Studio 平台运营方
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 bg-gray-50 font-medium">
                        收款方账号
                      </td>
                      <td className="border border-gray-300 p-3 font-mono">
                        1234 5678 9012 3456
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 bg-gray-50 font-medium">
                        开户银行
                      </td>
                      <td className="border border-gray-300 p-3">
                        招商银行股份有限公司北京分行
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 bg-gray-50 font-medium">
                        支付金额
                      </td>
                      <td className="border border-gray-300 p-3">
                        <span className="font-bold text-lg">
                          ¥{" "}
                          {Number(getDisplayPrice()).toLocaleString("zh-CN", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 bg-gray-50 font-medium">
                        款项用途
                      </td>
                      <td className="border border-gray-300 p-3">
                        {agent.title} 购买费用
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
                  alert("正在生成PDF并下载...");
                  setShowPaymentApplicationModal(false);
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
  );
};

export default ProductDetail;
