import React, { useState } from 'react'
import {
  FileText,
  Calendar,
  MoreVertical,
  BellOff,
  Activity,
  Layers,
  AlertTriangle,
} from 'lucide-react'
import { MOCK_REPORTS } from '../constants'
import { ReportItem, DocType, ReportType } from '../types'

const ReportPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Daily')

  const tabs = [
    { id: 'Daily', label: '日' },
    { id: 'Weekly', label: '周' },
    { id: 'Monthly', label: '月' },
    { id: 'Season', label: '季' },
    { id: 'Year', label: '年' },
  ]

  const getIconForType = (type: DocType) => {
    switch (type) {
      case DocType.PRODUCTION:
        return <Activity size={18} className="text-blue-500" />
      case DocType.QUALITY:
        return <Layers size={18} className="text-purple-500" />
      case DocType.EQUIPMENT:
        return <AlertTriangle size={18} className="text-orange-500" />
      case DocType.ANALYSIS:
        return <FileText size={18} className="text-indigo-500" />
      default:
        return <FileText size={18} className="text-gray-500" />
    }
  }

  const getBgColorForType = (type: DocType) => {
    switch (type) {
      case DocType.PRODUCTION:
        return 'bg-blue-100'
      case DocType.QUALITY:
        return 'bg-purple-100'
      case DocType.EQUIPMENT:
        return 'bg-orange-100'
      case DocType.ANALYSIS:
        return 'bg-indigo-100'
      default:
        return 'bg-gray-100'
    }
  }

  return (
    <div className="w-80 bg-gray-50/50 border-r border-gray-200 h-full flex flex-col p-4">
      {/* Top Cards */}
      <div className="flex gap-2 mb-6">
        <div className="flex-1 bg-white p-3 rounded-xl shadow-sm border border-blue-100 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow">
          <FileText className="text-blue-600 mb-1" size={20} />
          <span className="text-xs font-semibold text-gray-700">AI报告</span>
        </div>
        <div className="flex-1 bg-transparent p-3 rounded-xl border border-transparent hover:bg-white hover:shadow-sm transition-all flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600">
          <div className="mb-1 border-2 border-dashed border-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
            ?
          </div>
          <span className="text-xs font-medium">专家问答</span>
        </div>
        <div className="flex-1 bg-transparent p-3 rounded-xl border border-transparent hover:bg-white hover:shadow-sm transition-all flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600">
          <div className="mb-1 border-2 border-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-[10px] transform rotate-180">
            ↺
          </div>
          <span className="text-xs font-medium">历史记录</span>
        </div>
      </div>

      {/* Date Tabs */}
      <div className="bg-white p-1 rounded-lg flex justify-between shadow-sm mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <button className="px-2 text-gray-400 hover:text-gray-600">
          <Calendar size={14} />
        </button>
      </div>

      {/* Report List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3">
        {MOCK_REPORTS.map((report) => (
          <div
            key={report.id}
            className="group bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg ${getBgColorForType(report.type)} flex items-center justify-center`}
                >
                  {getIconForType(report.type)}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 leading-tight">
                    {report.title}
                  </h3>
                </div>
              </div>
              <button className="text-gray-300 hover:text-gray-500">
                <MoreVertical size={16} />
              </button>
            </div>

            <div className="flex justify-between items-center mt-2 pl-11">
              <div className="flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${report.status === 'alert' ? 'bg-red-500' : 'bg-green-500'}`}
                ></span>
                <span className="text-xs text-gray-400">{report.date}</span>
              </div>
              {report.status === 'alert' && <BellOff size={14} className="text-gray-300" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReportPanel
