import React, { useState, useEffect, useMemo } from 'react'
import {
  X,
  Layers,
  Box,
  LineChart,
  FileText,
  CheckCircle,
  ChevronRight,
  Upload,
  Info,
  DollarSign,
  Wallet,
  Save,
  Monitor,
  PlayCircle,
  Radio,
  Tag,
  HelpCircle,
  AlertCircle,
  Video,
  Image as ImageIcon,
  Sparkles,
  Cpu,
  Trash2,
  PlusCircle,
  Lightbulb,
  BarChart3,
  BarChart2,
  GripVertical,
  GitCommit,
  ShieldAlert,
  Zap,
  Bug,
  Layout,
  List,
  Table,
  Code,
  Eye,
  PenTool,
  Target,
  User,
  Activity,
  ShieldCheck,
  FileImage,
  Settings,
  Type,
  Key,
  Database,
  HardHat,
  Check,
  CreditCard,
  Server,
  Users,
  Lock,
  Calendar,
  Building,
  Building2,
  Package,
  Clock,
  Loader2,
  GitBranch,
  ChevronLeft,
  Edit3,
  Plus,
  Minus,
  Folder,
  FileCode,
  ArrowRight,
  Filter,
  MoreVertical,
  AlertTriangle,
} from 'lucide-react'

interface PublishWizardProps {
  onClose: () => void
  onPublish: (data: any) => void
  initialData?: any // For upgrading version
  mode?: 'create' | 'version' | 'edit'
}

// --- Mock Source Assets Data ---
const MOCK_SUB_ITEMS = [
  { name: '昨天 计划达成率', type: 'combo', value: '94%', target: '目标≥98', status: 'red' },
  { name: '昨天 OEE', type: 'combo', value: '88%', target: '目标≥90', status: 'red' },
  { name: '昨天 生产效率', type: 'combo', value: '92%', target: '目标≥90', status: 'green' },
]

const BI_CONFIG_OPTIONS = [
  {
    category: '数据源表',
    items: [
      { name: '来料日报', hasDataToggle: true },
      { name: '生产管理表链接停机表', hasDataToggle: true },
    ],
  },
  {
    category: '组件配置',
    items: [
      { name: '生产', subItems: MOCK_SUB_ITEMS },
      { name: '设备', subItems: MOCK_SUB_ITEMS },
      { name: '质量', subItems: MOCK_SUB_ITEMS },
      { name: '交付', subItems: MOCK_SUB_ITEMS },
      { name: '来料', subItems: MOCK_SUB_ITEMS },
    ],
  },
]

const MOCK_SOURCE_ASSETS = [
  {
    id: 'src_001',
    name: '维观AI专家',
    type: 'AI',
    lastModified: '2026-02-27 09:30:10',
    owner: '19922290223',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    configOptions: [
      {
        category: '问答·思考模式',
        items: [{ name: '提示词模板' }, { name: '常用对象标签' }],
      },
      {
        category: '报告·思考模式',
        items: [
          { name: '名称' },
          { name: '提示词模板' },
          {
            name: '数据范围',
            hasDataToggle: true,
            subItems: ['设备问题', '质量问题', '生产问题', '项目问题', '销售问题', '采购问题'],
          },
          {
            name: '推送时间',
            subItems: ['日报', '周报', '月报'],
          },
        ],
      },
      {
        category: '专家问题·思考方式',
        items: [{ name: '专家问题列表' }],
      },
    ],
  },
  {
    id: 'src_002',
    name: '生产管理1107new',
    type: 'BI',
    lastModified: '2026-02-27 09:31:25',
    owner: '19922290223',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=prod1',
    configOptions: BI_CONFIG_OPTIONS,
  },
  {
    id: 'src_003',
    name: '含智能排产组件1112',
    type: 'BI',
    lastModified: '2026-02-27 09:35:11',
    owner: '19922290223',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=prod2',
    configOptions: BI_CONFIG_OPTIONS,
  },
  {
    id: 'src_004',
    name: '生产管理流程1110sa',
    type: 'BI',
    lastModified: '2026-02-27 10:11:25',
    owner: '19922290223',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=prod3',
    configOptions: BI_CONFIG_OPTIONS,
  },
  {
    id: 'src_005',
    name: '生产管理流程1110sa',
    type: 'BI',
    lastModified: '2026-02-27 14:04:06',
    owner: '19922290223',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=prod4',
    configOptions: BI_CONFIG_OPTIONS,
  },
  {
    id: 'src_006',
    name: '生产管理流程1110sa',
    type: 'BI',
    lastModified: '2026-02-27 15:05:45',
    owner: '19922290223',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=prod5',
    configOptions: BI_CONFIG_OPTIONS,
  },
]

const renderPreview = (subItem: any) => {
  if (subItem.type === 'metric') {
    const statusColor =
      subItem.status === 'red'
        ? 'bg-red-500'
        : subItem.status === 'green'
          ? 'bg-green-500'
          : 'bg-gray-400'
    return (
      <div className="flex flex-col h-20 justify-center relative">
        <div className="flex items-center gap-1.5 absolute top-0 left-0">
          <div className={`w-2 h-2 rounded-full ${statusColor}`}></div>
          <div className="text-[10px] text-gray-500">{subItem.name}</div>
        </div>
        <div className="mt-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{subItem.value}</div>
          {subItem.target && <div className="text-[10px] text-gray-400 mt-1">{subItem.target}</div>}
        </div>
      </div>
    )
  }

  if (subItem.type === 'chart') {
    return (
      <div className="flex flex-col h-20">
        <div className="text-[10px] text-gray-500 mb-2">{subItem.name}</div>
        <div className="flex-1 flex items-end justify-around px-2 pb-1 gap-1">
          {subItem.chartType === 'bar-group' ? (
            <>
              <div className="flex items-end gap-0.5 w-full h-full justify-center">
                <div className="w-2 bg-indigo-500 rounded-t" style={{ height: '60%' }}></div>
                <div className="w-2 bg-green-400 rounded-t" style={{ height: '40%' }}></div>
              </div>
              <div className="flex items-end gap-0.5 w-full h-full justify-center">
                <div className="w-2 bg-indigo-500 rounded-t" style={{ height: '80%' }}></div>
                <div className="w-2 bg-green-400 rounded-t" style={{ height: '70%' }}></div>
              </div>
              <div className="flex items-end gap-0.5 w-full h-full justify-center">
                <div className="w-2 bg-indigo-500 rounded-t" style={{ height: '50%' }}></div>
                <div className="w-2 bg-green-400 rounded-t" style={{ height: '30%' }}></div>
              </div>
              <div className="flex items-end gap-0.5 w-full h-full justify-center">
                <div className="w-2 bg-indigo-500 rounded-t" style={{ height: '90%' }}></div>
                <div className="w-2 bg-green-400 rounded-t" style={{ height: '85%' }}></div>
              </div>
            </>
          ) : (
            <>
              <div className="w-4 bg-indigo-500 rounded-t" style={{ height: '40%' }}></div>
              <div className="w-4 bg-indigo-500 rounded-t" style={{ height: '70%' }}></div>
              <div className="w-4 bg-indigo-500 rounded-t" style={{ height: '50%' }}></div>
              <div className="w-4 bg-indigo-500 rounded-t" style={{ height: '90%' }}></div>
              <div className="w-4 bg-indigo-500 rounded-t" style={{ height: '60%' }}></div>
            </>
          )}
        </div>
        <div className="border-t border-gray-200 w-full mt-1"></div>
      </div>
    )
  }

  if (subItem.type === 'combo') {
    const statusColor =
      subItem.status === 'red'
        ? 'bg-red-400'
        : subItem.status === 'green'
          ? 'bg-[#73d13d]'
          : 'bg-gray-400'
    return (
      <div className="flex h-[280px] w-full bg-white">
        {/* Left Blue Card */}
        <div className="w-[280px] bg-[#5482C8] flex flex-col p-5 relative text-white flex-shrink-0 border-r border-blue-400/30">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${statusColor}`}></div>
              <div className="text-sm font-medium">{subItem.name}</div>
            </div>
            <div className="flex items-center gap-2 opacity-60">
              <Filter size={14} />
              <MoreVertical size={14} />
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-6xl font-semibold tracking-tight mb-3">{subItem.value}</div>
            <div className="text-sm text-blue-100/80">{subItem.target}</div>
          </div>
        </div>
        {/* Right White Card */}
        <div className="flex-1 bg-white p-5 flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-700 font-medium">{subItem.name}</div>
            <div className="flex items-center gap-2 text-gray-400">
              <Filter size={14} />
              <MoreVertical size={14} />
            </div>
          </div>
          {/* Legend */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-6 h-3 bg-[#6384D4] rounded-sm"></div>
            <div className="text-xs text-gray-500">计划达成率(%)</div>
          </div>
          {/* Chart */}
          <div className="flex-1 flex items-end justify-around pb-8 gap-4 relative px-10">
            {/* Y-axis labels */}
            <div className="absolute left-2 top-0 bottom-8 flex flex-col justify-between text-[10px] text-gray-400">
              <span>120</span>
              <span>90</span>
              <span>60</span>
              <span>30</span>
              <span>0</span>
            </div>
            {/* Grid lines */}
            <div className="absolute left-8 right-4 top-1 border-t border-gray-100"></div>
            <div className="absolute left-8 right-4 top-1/4 border-t border-gray-100"></div>
            <div className="absolute left-8 right-4 top-2/4 border-t border-gray-100"></div>
            <div className="absolute left-8 right-4 top-3/4 border-t border-gray-100"></div>
            <div className="absolute left-8 right-4 bottom-8 border-t border-gray-400"></div>

            {/* Bars */}
            {[12, 87, 96, 99, 100, 100, 100, 100, 100, 100].map((val, i) => (
              <div
                key={i}
                className="flex flex-col items-center relative z-10 w-12 h-full justify-end"
              >
                <div className="text-[10px] text-gray-500 mb-1">{val}</div>
                <div
                  className="w-full bg-[#6384D4]"
                  style={{ height: `${(val / 120) * 100}%` }}
                ></div>
                <div className="absolute -bottom-6 text-[9px] text-gray-400 transform -rotate-12 whitespace-nowrap">
                  P01-{i + 1}#站
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return null
}

const PublishWizard: React.FC<PublishWizardProps> = ({
  onClose,
  onPublish,
  initialData,
  mode = 'create',
}) => {
  const [step, setStep] = useState(1)
  const [showAgreementModal, setShowAgreementModal] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [validationStep, setValidationStep] = useState(0)
  const [isStep1Validating, setIsStep1Validating] = useState(false)
  const [step1Error, setStep1Error] = useState<string | null>(null)

  // Asset Selection State
  const [expandedAssets, setExpandedAssets] = useState<string[]>([])
  const [selectedConfigs, setSelectedConfigs] = useState<Record<string, string[]>>({})
  const [dataValueToggles, setDataValueToggles] = useState<Record<string, boolean>>({})
  const [activeComponentTab, setActiveComponentTab] = useState<Record<string, string>>({})

  // Editor View State for Step 2
  const [detailViewMode, setDetailViewMode] = useState<'edit' | 'preview'>('edit')

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Source
    type: 'method', // method | analysis
    selectedSourceId: '',

    // Step 2: Product Detail
    title: '',
    industry: '汽车零配件',
    categoryType: '研发',
    currentVersion: 'v1.0.0',
    nextVersion: 'v1.0.1',
    updateType: 'patch' as 'patch' | 'minor' | 'major',
    versionLog: '',

    // Display Config
    displayMode: 'preview' as 'preview' | 'video' | 'live',
    videoUrl: '',
    liveUrl: '',
    liveKey: '',
    coverImage: null as string | null,

    // Content Config
    detailMode: 'template' as 'template' | 'image', // template | image

    // Template Fields (Structured)
    overview: '',

    painPoints: [''],
    solutions: [''],

    coreFeatures: {
      perception: '',
      reasoning: '',
      execution: '',
    },

    delivery: [''],
    scenarios: [''],

    targetAudience: '',

    dataPreviewRows: [{ time: '', event: '', logic: '', decision: '' }],

    compliance: '',

    // Step 3: Pricing
    enableSubscription: true,
    enableUsage: true,

    // Global Consumption Control
    consumptionControl: { alertThreshold: 1000, hardLimit: 5000 },

    // Subscription Plans
    monthlyPlan: { price: 299, tokens: 1000, storage: 10, users: 5, discount: 100 },
    yearlyPlan: { price: 2870, tokens: 12000, storage: 100, users: 5, discount: 80 },

    // Usage Rates
    unitRates: { setupFee: 0, token: 0.05, storage: 0.8, user: 25 },
    resourcePacks: [{ id: 'p1', name: '入门加油包', price: 99, tokens: 2000, storage: 5 }],

    // Buyout
    buyoutConfig: { licenseFee: 50000, maintenanceFee: 5000, maxNodes: 1 },

    // Common
    trialConfig: {
      enabled: true,
      duration: 1,
      durationUnit: 'month',
      tokenLimit: 500000,
      storageLimit: 5,
      maxTrialTimes: 1,
      setupFee: 0,
      qpsLimit: 2,
    },
    agreementChecked: false,
  })

  // Helper to calculate version
  const calculateVersion = (current: string, type: 'patch' | 'minor' | 'major') => {
    const cleanVer = current.toLowerCase().startsWith('v') ? current.substring(1) : current
    const parts = cleanVer.split('.').map((p) => parseInt(p, 10))
    if (parts.length !== 3 || parts.some(isNaN)) return current
    let [major, minor, patch] = parts
    if (type === 'major') {
      major++
      minor = 0
      patch = 0
    } else if (type === 'minor') {
      minor++
      patch = 0
    } else {
      patch++
    }
    return `v${major}.${minor}.${patch}`
  }

  // Initialize logic
  useEffect(() => {
    if (mode === 'version' && initialData) {
      // Pre-fill data if upgrading version
      const latestVer = initialData.versions?.[0]?.ver || 'v1.0.0'
      const nextVer = calculateVersion(latestVer, 'patch')

      setFormData((prev) => ({
        ...prev,
        title: initialData.title || '',
        currentVersion: latestVer,
        nextVersion: nextVer,
        // Mock filling content for demo purposes if empty
        overview: prev.overview || '本智能体基于深度强化学习（DRL）与机理模型融合技术...',
        painPoints: prev.painPoints.length > 1 ? prev.painPoints : ['人工调节滞后', '微小缺陷漏检'],
        solutions:
          prev.solutions.length > 1 ? prev.solutions : ['毫秒级闭环控制', '机器视觉全时段监控'],
        coreFeatures: {
          perception: '全息采集测厚仪数据',
          reasoning: '匹配 2000+ 条专家规则',
          execution: '生成最优控制参数',
        },
        // ... fill other fields similarly or use actual initialData if comprehensive
      }))

      // Skip Step 1
      setStep(2)
    }
  }, [mode, initialData])

  // --- Effects ---

  // Auto Recalculate Version when update type changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      nextVersion: calculateVersion(prev.currentVersion, prev.updateType),
    }))
  }, [formData.updateType, formData.currentVersion])

  useEffect(() => {
    if (step === 5) {
      setIsValidating(true)
      setValidationStep(0)
      const timers = [
        setTimeout(() => setValidationStep(1), 500),
        setTimeout(() => setValidationStep(2), 1500),
        setTimeout(() => setValidationStep(3), 2500),
        setTimeout(() => {
          setValidationStep(4)
          setIsValidating(false)
        }, 3500),
      ]
      return () => timers.forEach(clearTimeout)
    }
  }, [step])

  // --- Helper Functions for Array Fields ---
  const handleArrayChange = (
    field: 'painPoints' | 'solutions' | 'delivery' | 'scenarios',
    index: number,
    value: string,
  ) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData({ ...formData, [field]: newArray })
  }

  const addArrayItem = (field: 'painPoints' | 'solutions' | 'delivery' | 'scenarios') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] })
  }

  const removeArrayItem = (
    field: 'painPoints' | 'solutions' | 'delivery' | 'scenarios',
    index: number,
  ) => {
    const newArray = formData[field].filter((_, i) => i !== index)
    setFormData({ ...formData, [field]: newArray })
  }

  const handleDataPreviewChange = (index: number, key: string, value: string) => {
    const newRows = [...formData.dataPreviewRows]
    newRows[index] = { ...newRows[index], [key]: value }
    setFormData({ ...formData, dataPreviewRows: newRows })
  }

  const addDataPreviewRow = () => {
    setFormData({
      ...formData,
      dataPreviewRows: [
        ...formData.dataPreviewRows,
        { time: '', event: '', logic: '', decision: '' },
      ],
    })
  }

  const removeDataPreviewRow = (index: number) => {
    const newRows = formData.dataPreviewRows.filter((_, i) => i !== index)
    setFormData({ ...formData, dataPreviewRows: newRows })
  }

  const addResourcePack = () => {
    const newId = `p${formData.resourcePacks.length + 1}`
    setFormData((prev) => ({
      ...prev,
      resourcePacks: [
        ...prev.resourcePacks,
        { id: newId, name: '新资源包', price: 0, tokens: 0, storage: 0 },
      ],
    }))
  }

  const removeResourcePack = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      resourcePacks: prev.resourcePacks.filter((_, i) => i !== index),
    }))
  }

  const handleResourcePackChange = (index: number, field: string, value: any) => {
    const newPacks = [...formData.resourcePacks]
    newPacks[index] = { ...newPacks[index], [field]: value }
    setFormData((prev) => ({ ...prev, resourcePacks: newPacks }))
  }

  const handleMonthlyFeeChange = (val: number) => {
    setFormData({ ...formData, monthlyPlan: { ...formData.monthlyPlan, price: val } })
  }

  const handleYearlyFeeChange = (val: number) => {
    setFormData({ ...formData, yearlyPlan: { ...formData.yearlyPlan, price: val } })
  }

  // --- Pricing Calculations ---
  const { currentPriceText } = useMemo(() => {
    let parts = []

    if (formData.enableSubscription) {
      parts.push(`包月 ¥${formData.monthlyPlan.price} / 包年 ¥${formData.yearlyPlan.price}`)
    }
    if (formData.enableUsage) {
      parts.push(`按量计费`)
    }

    return {
      currentPriceText: parts.length > 0 ? parts.join(' | ') : '免费',
    }
  }, [
    formData.enableSubscription,
    formData.enableUsage,
    formData.monthlyPlan.price,
    formData.yearlyPlan.price,
  ])

  // --- Logic ---
  const handleNext = () => {
    if (step === 1) {
      if (!formData.selectedSourceId) {
        setStep1Error('请先选择一个源资产')
        setTimeout(() => setStep1Error(null), 3000)
        return
      }
      const currentConfigs = selectedConfigs[formData.selectedSourceId] || []
      if (currentConfigs.length === 0) {
        setStep1Error('请至少选择一项配置项打包')
        setTimeout(() => setStep1Error(null), 3000)
        return
      }

      setIsStep1Validating(true)
      setStep1Error(null)

      // 模拟打包配置校验过程
      setTimeout(() => {
        setIsStep1Validating(false)
        // 模拟 30% 概率校验失败，以展示错误提示框
        const isSuccess = Math.random() > 0.3
        if (isSuccess) {
          setStep(2)
        } else {
          setStep1Error('打包配置校验失败：检测到配置项冲突或缺失依赖，请调整后重试。')
          setTimeout(() => setStep1Error(null), 3000)
        }
      }, 1500)
      return
    }

    if (step === 4 && !formData.agreementChecked) {
      alert('请先阅读并同意《维观市场开发者服务与定价协议》')
      return
    }
    if (step === 5) {
      onPublish(formData)
      onClose()
    } else {
      setStep(step + 1)
    }
  }
  const handlePrev = () => setStep(step - 1)

  const handleConfigToggle = (assetId: string, item: string) => {
    setSelectedConfigs((prev) => {
      const currentSelected = prev[assetId] || []
      if (currentSelected.includes(item)) {
        return { ...prev, [assetId]: currentSelected.filter((i) => i !== item) }
      } else {
        return { ...prev, [assetId]: [...currentSelected, item] }
      }
    })
  }

  const toggleAssetExpand = (e: React.MouseEvent, assetId: string) => {
    e.stopPropagation()
    setExpandedAssets((prev) =>
      prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId],
    )
  }

  const handleDataToggle = (e: React.MouseEvent, assetId: string, itemName: string) => {
    e.stopPropagation()
    const key = `${assetId}-${itemName}`
    setDataValueToggles((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleAssetSelect = (asset: any) => {
    setFormData({ ...formData, selectedSourceId: asset.id, title: asset.name, type: asset.type })

    if (!expandedAssets.includes(asset.id)) {
      setExpandedAssets((prev) => [...prev, asset.id])
    }

    if (formData.selectedSourceId !== asset.id) {
      const allKeys: string[] = []
      asset.configOptions.forEach((group: any) => {
        group.items.forEach((item: any) => {
          allKeys.push(item.name)
          if (item.subItems) {
            item.subItems.forEach((sub: any) => {
              const subName = typeof sub === 'object' ? sub.name : sub
              allKeys.push(`${item.name}-${subName}`)
            })
          }
        })
      })

      setSelectedConfigs((prev) => ({
        ...prev,
        [asset.id]: allKeys,
      }))

      setDataValueToggles((prev) => {
        const next = { ...prev }
        asset.configOptions.forEach((group: any) => {
          group.items.forEach((item: any) => {
            if (item.hasDataToggle) {
              next[`${asset.id}-${item.name}`] = false
            }
          })
        })
        return next
      })
    }
  }

  // --- Renderers ---

  const renderStep1 = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 pb-20 relative min-h-[400px]">
      {/* Error Message Overlay */}
      {step1Error && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] animate-in fade-in zoom-in duration-200">
          <div className="bg-red-50 border-2 border-red-500 text-red-700 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <AlertCircle size={24} className="text-red-500" />
            <span className="font-bold text-lg">{step1Error}</span>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isStep1Validating && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-xl animate-in fade-in">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <div className="text-lg font-bold text-gray-800">正在校验打包配置...</div>
          <div className="text-sm text-gray-500 mt-2">请稍候，系统正在检查配置项兼容性</div>
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-900 mb-6">
        第一步：选择源资产 (Source Selection)
      </h2>

      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-800 mb-4">1. 选择智能体类型</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 方法智能体 */}
          <div
            onClick={() => setFormData({ ...formData, type: 'method' })}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
              formData.type === 'method'
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                formData.type === 'method'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <Box size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4
                  className={`font-bold text-base ${formData.type === 'method' ? 'text-gray-900' : 'text-gray-700'}`}
                >
                  方法智能体
                </h4>
                {formData.type === 'method' && <CheckCircle size={16} className="text-blue-500" />}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                封装了特定工业机理或控制逻辑，直接用于闭环控制。
              </p>
            </div>
          </div>

          {/* 分析智能体 */}
          <div
            onClick={() => setFormData({ ...formData, type: 'analysis' })}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
              formData.type === 'analysis'
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                formData.type === 'analysis'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <LineChart size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4
                  className={`font-bold text-base ${formData.type === 'analysis' ? 'text-gray-900' : 'text-gray-700'}`}
                >
                  分析智能体
                </h4>
                {formData.type === 'analysis' && (
                  <CheckCircle size={16} className="text-blue-500" />
                )}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                专注于从海量数据中挖掘规律，提供诊断与预测。
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-bold text-gray-800">2. 可用源文件列表</label>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-gray-100 text-xs font-bold text-gray-500 mb-2">
          <div className="col-span-6">名称</div>
          <div className="col-span-3">创建时间</div>
          <div className="col-span-3">所有者</div>
        </div>

        <div className="space-y-2">
          {MOCK_SOURCE_ASSETS.map((asset) => {
            const isSelected = formData.selectedSourceId === asset.id
            const isExpanded = expandedAssets.includes(asset.id)

            return (
              <div
                key={asset.id}
                className={`border rounded-xl transition-all ${isSelected ? 'border-indigo-600 ring-1 ring-indigo-600' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div
                  onClick={() => handleAssetSelect(asset)}
                  className={`flex items-center p-4 cursor-pointer group ${isSelected ? 'bg-indigo-50/30' : 'hover:bg-gray-50'}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border mr-4 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white'}`}
                  >
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>

                  <div className="grid grid-cols-12 gap-4 flex-1 items-center">
                    <div className="col-span-6 flex items-center gap-3">
                      <img
                        src={asset.avatar}
                        alt="avatar"
                        className="w-8 h-8 rounded-lg bg-gray-100 object-cover"
                      />
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-gray-900 group-hover:text-indigo-700 transition-colors">
                          {asset.name}
                        </h4>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold italic flex items-center gap-0.5 ${asset.type === 'AI' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}
                        >
                          {asset.type} <Sparkles size={10} />
                        </span>
                      </div>
                    </div>
                    <div className="col-span-3 text-xs text-gray-500 font-mono">
                      {asset.lastModified}
                    </div>
                    <div className="col-span-3 text-xs text-gray-500 flex justify-between items-center">
                      <span>{asset.owner}</span>
                      <button
                        onClick={(e) => toggleAssetExpand(e, asset.id)}
                        className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <ChevronRight
                          size={16}
                          className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Config Checklist */}
                {isExpanded && (
                  <div className="p-5 bg-gray-50/50 border-t border-gray-100 rounded-b-xl">
                    <div className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Settings size={16} className="text-blue-600" />
                      配置项打包清单
                      <span className="text-xs font-normal text-gray-500 ml-2">
                        请勾选需要随资产一同打包发布的配置
                      </span>
                    </div>
                    <div className="flex flex-col gap-4">
                      {asset.configOptions.map((configGroup, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                        >
                          <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                            <div className="w-1.5 h-3.5 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-bold text-gray-800">
                              {configGroup.category}
                            </span>
                          </div>
                          {configGroup.category === '组件配置' ? (
                            <div className="p-4">
                              <div className="flex items-center gap-6 border-b border-gray-100 mb-4 px-2">
                                {configGroup.items.map((item) => {
                                  const itemKey = item.name
                                  const isItemChecked = (selectedConfigs[asset.id] || []).includes(
                                    itemKey,
                                  )
                                  const isActive =
                                    (activeComponentTab[asset.id] || configGroup.items[0].name) ===
                                    item.name

                                  return (
                                    <div
                                      key={item.name}
                                      className={`flex items-center gap-2 pb-3 cursor-pointer border-b-2 transition-colors ${isActive ? 'border-blue-500' : 'border-transparent hover:border-gray-300'}`}
                                      onClick={() =>
                                        setActiveComponentTab((prev) => ({
                                          ...prev,
                                          [asset.id]: item.name,
                                        }))
                                      }
                                    >
                                      <label
                                        className="flex items-center gap-2 cursor-pointer"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <div
                                          className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${isItemChecked ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}
                                        >
                                          {isItemChecked && (
                                            <Check size={12} className="text-white stroke-[3]" />
                                          )}
                                        </div>
                                        <input
                                          type="checkbox"
                                          className="hidden"
                                          checked={isItemChecked}
                                          onChange={() => handleConfigToggle(asset.id, itemKey)}
                                        />
                                      </label>
                                      <span
                                        className={`text-sm ${isActive ? 'text-blue-600 font-bold' : 'text-gray-600 font-medium'}`}
                                      >
                                        {item.name}
                                      </span>
                                    </div>
                                  )
                                })}
                              </div>

                              <div className="mt-2">
                                {configGroup.items.map((item) => {
                                  const isActive =
                                    (activeComponentTab[asset.id] || configGroup.items[0].name) ===
                                    item.name
                                  if (!isActive) return null

                                  const isItemChecked = (selectedConfigs[asset.id] || []).includes(
                                    item.name,
                                  )

                                  return (
                                    <div key={item.name} className="flex flex-col gap-4">
                                      {item.subItems && isItemChecked ? (
                                        <div className="grid grid-cols-1 gap-4">
                                          {item.subItems.map((subItem: any) => {
                                            const isObj = typeof subItem === 'object'
                                            const subItemName = isObj ? subItem.name : subItem
                                            const subItemKey = `${item.name}-${subItemName}`
                                            const isSubItemChecked = (
                                              selectedConfigs[asset.id] || []
                                            ).includes(subItemKey)

                                            return (
                                              <label
                                                key={subItemName}
                                                className={`relative flex flex-col cursor-pointer group/sublabel bg-white rounded-lg border transition-all overflow-hidden ${isSubItemChecked ? 'border-blue-500 ring-1 ring-blue-500 shadow-md' : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'}`}
                                              >
                                                <div className="absolute top-2 right-2 z-10">
                                                  <div
                                                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSubItemChecked ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300 group-hover/sublabel:border-blue-400'}`}
                                                  >
                                                    {isSubItemChecked && (
                                                      <Check
                                                        size={12}
                                                        className="text-white stroke-[3]"
                                                      />
                                                    )}
                                                  </div>
                                                </div>
                                                <input
                                                  type="checkbox"
                                                  className="hidden"
                                                  checked={isSubItemChecked}
                                                  onChange={() =>
                                                    handleConfigToggle(asset.id, subItemKey)
                                                  }
                                                />
                                                <div className="flex-1 flex flex-col">
                                                  {renderPreview(subItem)}
                                                </div>
                                              </label>
                                            )
                                          })}
                                        </div>
                                      ) : (
                                        <div className="text-sm text-gray-400 text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                          请先勾选上方 "{item.name}" 分类，以查看和配置其包含的组件
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 space-y-4">
                              {configGroup.items.map((item) => {
                                const itemKey = item.name
                                const isItemChecked = (selectedConfigs[asset.id] || []).includes(
                                  itemKey,
                                )
                                const toggleKey = `${asset.id}-${item.name}`
                                const isDataToggled = dataValueToggles[toggleKey] || false

                                return (
                                  <div
                                    key={item.name}
                                    className="flex flex-col border border-gray-100 rounded-lg p-3 hover:border-blue-100 transition-colors"
                                  >
                                    <div className="flex items-center justify-between group/label">
                                      <label className="flex items-center gap-3 cursor-pointer flex-1">
                                        <div
                                          className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${isItemChecked ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300 group-hover/label:border-blue-400'}`}
                                        >
                                          {isItemChecked && (
                                            <Check size={12} className="text-white stroke-[3]" />
                                          )}
                                        </div>
                                        <input
                                          type="checkbox"
                                          className="hidden"
                                          checked={isItemChecked}
                                          onChange={() => handleConfigToggle(asset.id, itemKey)}
                                        />
                                        <span
                                          className={`text-sm transition-colors ${isItemChecked ? 'text-gray-900 font-bold' : 'text-gray-600 font-medium'}`}
                                        >
                                          {item.name}
                                        </span>
                                      </label>

                                      {item.hasDataToggle && isItemChecked && (
                                        <div className="flex items-center gap-2 text-xs bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-100">
                                          <span className="text-blue-700 font-medium">
                                            携带数据值
                                          </span>
                                          <button
                                            onClick={(e) =>
                                              handleDataToggle(e, asset.id, item.name)
                                            }
                                            className={`w-8 h-4 rounded-full transition-colors relative flex-shrink-0 shadow-inner flex items-center px-0.5 ${isDataToggled ? 'bg-blue-500' : 'bg-gray-300'}`}
                                          >
                                            <div
                                              className={`w-3 h-3 bg-white rounded-full transition-transform shadow-sm ${isDataToggled ? 'translate-x-4' : 'translate-x-0'}`}
                                            ></div>
                                          </button>
                                        </div>
                                      )}
                                    </div>

                                    {/* Sub Items */}
                                    {item.subItems && isItemChecked && (
                                      <div className="mt-3 pt-3 border-t border-gray-50 grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {item.subItems.map((subItem: any) => {
                                          const isObj = typeof subItem === 'object'
                                          const subItemName = isObj ? subItem.name : subItem
                                          const subItemType = isObj ? subItem.type : 'default'
                                          const subItemKey = `${item.name}-${subItemName}`
                                          const isSubItemChecked = (
                                            selectedConfigs[asset.id] || []
                                          ).includes(subItemKey)

                                          if (
                                            isObj &&
                                            (subItemType === 'metric' ||
                                              subItemType === 'chart' ||
                                              subItemType === 'combo')
                                          ) {
                                            return (
                                              <label
                                                key={subItemName}
                                                className={`relative flex flex-col cursor-pointer group/sublabel bg-white rounded-lg border transition-all overflow-hidden ${isSubItemChecked ? 'border-blue-500 ring-1 ring-blue-500 shadow-md' : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'}`}
                                              >
                                                <div className="absolute top-2 right-2 z-10">
                                                  <div
                                                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSubItemChecked ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300 group-hover/sublabel:border-blue-400'}`}
                                                  >
                                                    {isSubItemChecked && (
                                                      <Check
                                                        size={12}
                                                        className="text-white stroke-[3]"
                                                      />
                                                    )}
                                                  </div>
                                                </div>
                                                <input
                                                  type="checkbox"
                                                  className="hidden"
                                                  checked={isSubItemChecked}
                                                  onChange={() =>
                                                    handleConfigToggle(asset.id, subItemKey)
                                                  }
                                                />
                                                <div className="p-3 flex-1 flex flex-col">
                                                  {renderPreview(subItem)}
                                                </div>
                                                <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-1.5">
                                                  {subItemType === 'metric' && (
                                                    <Target
                                                      size={12}
                                                      className="text-blue-500 flex-shrink-0"
                                                    />
                                                  )}
                                                  {(subItemType === 'chart' ||
                                                    subItemType === 'combo') && (
                                                    <BarChart2
                                                      size={12}
                                                      className="text-purple-500 flex-shrink-0"
                                                    />
                                                  )}
                                                  <span
                                                    className={`text-xs truncate ${isSubItemChecked ? 'text-gray-900 font-medium' : 'text-gray-600'}`}
                                                    title={subItemName}
                                                  >
                                                    {subItemName}
                                                  </span>
                                                </div>
                                              </label>
                                            )
                                          }

                                          return (
                                            <label
                                              key={subItemName}
                                              className="flex items-center gap-2 cursor-pointer group/sublabel bg-white p-2 rounded border border-gray-100 hover:border-blue-200 transition-colors"
                                            >
                                              <div
                                                className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${isSubItemChecked ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300 group-hover/sublabel:border-blue-400'}`}
                                              >
                                                {isSubItemChecked && (
                                                  <Check
                                                    size={10}
                                                    className="text-white stroke-[3]"
                                                  />
                                                )}
                                              </div>
                                              <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={isSubItemChecked}
                                                onChange={() =>
                                                  handleConfigToggle(asset.id, subItemKey)
                                                }
                                              />
                                              {subItemType === 'metric' && (
                                                <Target
                                                  size={12}
                                                  className="text-blue-400 flex-shrink-0"
                                                />
                                              )}
                                              {subItemType === 'chart' && (
                                                <BarChart2
                                                  size={12}
                                                  className="text-purple-400 flex-shrink-0"
                                                />
                                              )}
                                              <span
                                                className={`text-xs transition-colors truncate ${isSubItemChecked ? 'text-gray-800 font-medium' : 'text-gray-500'}`}
                                                title={subItemName}
                                              >
                                                {subItemName}
                                              </span>
                                            </label>
                                          )
                                        })}
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 pb-20 space-y-8">
      <h2 className="text-xl font-bold text-gray-900">第二步：产品详情与展示 (Product Detail)</h2>

      {/* 1. Basic Info */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Type size={18} className="text-blue-600" /> 1. 资产名称与分类 (Basic Information)
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={mode === 'version'} // Lock title if upgrading
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none font-bold text-gray-900 placeholder-gray-300 ${mode === 'version' ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : 'border-gray-200 bg-white'}`}
              placeholder="例如：冷轧机组振动分析模型"
            />
            {mode === 'version' && (
              <p className="text-[10px] text-gray-400 mt-1">发布新版本时不支持修改资产名称。</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                行业 (Industry)
              </label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                disabled={mode === 'version'}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none font-bold text-gray-900 ${mode === 'version' ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : 'border-gray-200 bg-white'}`}
              >
                {[
                  '汽车零配件',
                  '新能源',
                  '钢铁冶炼',
                  '航空航天',
                  '医疗器械',
                  '电力装备',
                  '其他',
                ].map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                类型 (Type)
              </label>
              <select
                value={formData.categoryType}
                onChange={(e) => setFormData({ ...formData, categoryType: e.target.value })}
                disabled={mode === 'version'}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none font-bold text-gray-900 ${mode === 'version' ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : 'border-gray-200 bg-white'}`}
              >
                {['研发', '供应链', '生产', '销售', '其他'].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Version Control */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <GitBranch size={18} className="text-blue-600" /> 2. 版本预览 (Version Control)
        </h3>

        <div className="mb-4">
          <div className="text-xs font-bold text-gray-500 uppercase mb-2">Current Version</div>
          <div className="inline-block border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-bold text-gray-700 bg-gray-50">
            {formData.currentVersion}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {['patch', 'minor', 'major'].map((t) => {
            const type = t as 'patch' | 'minor' | 'major'
            const isActive = formData.updateType === type

            // Calculate next version purely for display inside card
            const calculateNext = (current: string) => {
              const cleanVer = current.toLowerCase().startsWith('v')
                ? current.substring(1)
                : current
              const parts = cleanVer.split('.').map((p) => parseInt(p, 10))
              if (parts.length !== 3 || parts.some(isNaN)) return current
              let [major, minor, patch] = parts
              if (type === 'major') {
                major++
                minor = 0
                patch = 0
              } else if (type === 'minor') {
                minor++
                patch = 0
              } else {
                patch++
              }
              return `v${major}.${minor}.${patch}`
            }
            const nextVer = calculateNext(formData.currentVersion)

            return (
              <div
                key={type}
                onClick={() => setFormData({ ...formData, updateType: type })}
                className={`border rounded-xl p-3 cursor-pointer transition-all relative ${
                  isActive
                    ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {isActive && (
                  <div className="absolute top-2 right-2 text-blue-600">
                    <CheckCircle size={14} />
                  </div>
                )}
                <div className="font-bold text-sm capitalize mb-1 text-gray-800">
                  {type === 'patch'
                    ? '🐞 补丁 (Patch)'
                    : type === 'minor'
                      ? '⚡ 次要 (Minor)'
                      : '🛡️ 重大 (Major)'}
                </div>
                <div className="text-[10px] text-gray-500 mb-2 h-8 leading-tight">
                  {type === 'patch'
                    ? '修复错误，向下兼容'
                    : type === 'minor'
                      ? '新增功能，向下兼容'
                      : '破坏性变更，不兼容'}
                </div>
                <div className="text-xs font-mono">
                  <span className="text-gray-400 mr-1">Next:</span>
                  <span className={`${isActive ? 'text-blue-700 font-bold' : 'text-green-600'}`}>
                    {nextVer}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            版本日志 (Version Log)
          </label>
          <textarea
            value={formData.versionLog}
            onChange={(e) => setFormData({ ...formData, versionLog: e.target.value })}
            placeholder="在此描述本次更新的内容、修复的问题以及新增特性..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none h-20 resize-none text-gray-600 placeholder-gray-300"
          />
        </div>
      </div>

      {/* 3. Product Display Config */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Monitor size={18} className="text-blue-600" /> 3. 产品展示 (Product Display)
        </h3>

        <div className="flex gap-4 mb-4">
          {[
            { id: 'preview', label: '界面预览', icon: Monitor },
            { id: 'video', label: '视频介绍', icon: PlayCircle },
            { id: 'live', label: '实时直播', icon: Radio },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setFormData({ ...formData, displayMode: mode.id as any })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                formData.displayMode === mode.id
                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                  : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
              }`}
            >
              <mode.icon size={14} /> {mode.label}
              {mode.id === 'live' && formData.displayMode === 'live' && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse ml-1" />
              )}
            </button>
          ))}
        </div>

        <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-8">
          {formData.displayMode === 'preview' && (
            <div className="flex flex-col items-center justify-center text-gray-400 h-32">
              <ImageIcon size={32} className="mb-2 text-gray-300" />
              <span className="text-xs font-bold text-gray-500">上传产品界面截图</span>
              <span className="text-[10px] mt-1">支持 PNG, JPG (推荐 16:9)</span>
            </div>
          )}
          {formData.displayMode === 'video' && (
            <div className="flex flex-col items-center justify-center text-gray-400 h-32">
              <Video size={32} className="mb-2 text-gray-300" />
              <span className="text-xs font-bold text-gray-500">上传 MP4 演示视频</span>
              <span className="text-[10px] mt-1">最大 500MB</span>
            </div>
          )}
          {formData.displayMode === 'live' && (
            <div className="max-w-md mx-auto space-y-3 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-center mb-4 text-red-500 font-bold text-xs gap-2">
                <Radio size={14} className="animate-pulse" /> ((•)) 配置直播推流
              </div>
              <input
                type="text"
                placeholder="RTMP 推流地址..."
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-400"
              />
              <input
                type="password"
                placeholder="直播间密钥..."
                value={formData.liveKey}
                onChange={(e) => setFormData({ ...formData, liveKey: e.target.value })}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-400"
              />
            </div>
          )}
        </div>
      </div>

      {/* 4. Detail Content Editor (Dual Mode) */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <FileText size={18} className="text-blue-600" /> 4. 详情内容 (Detail Content)
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setFormData({ ...formData, detailMode: 'template' })}
              className={`px-3 py-1.5 text-xs rounded-lg font-bold flex items-center gap-2 border transition-all ${
                formData.detailMode === 'template'
                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                  : 'bg-white text-gray-500 border-gray-200'
              }`}
            >
              <Layout size={12} /> 标准化模板
            </button>
            <button
              onClick={() => setFormData({ ...formData, detailMode: 'image' })}
              className={`px-3 py-1.5 text-xs rounded-lg font-bold flex items-center gap-2 border transition-all ${
                formData.detailMode === 'image'
                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                  : 'bg-white text-gray-500 border-gray-200'
              }`}
            >
              <ImageIcon size={12} /> 上传宣传长图
            </button>
          </div>
        </div>

        {/* Editor vs Preview Toggle */}
        {formData.detailMode === 'template' && (
          <div className="flex justify-end mb-4">
            <div className="bg-gray-100 p-1 rounded-lg flex text-xs font-bold">
              <button
                onClick={() => setDetailViewMode('edit')}
                className={`px-3 py-1 rounded flex items-center gap-1 transition-all ${detailViewMode === 'edit' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
              >
                <Edit3 size={12} /> 编辑
              </button>
              <button
                onClick={() => setDetailViewMode('preview')}
                className={`px-3 py-1 rounded flex items-center gap-1 transition-all ${detailViewMode === 'preview' ? 'bg-blue-100 text-blue-600 shadow-sm' : 'text-gray-500'}`}
              >
                <Eye size={12} /> 预览
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        {formData.detailMode === 'image' ? (
          <div className="h-64 border-2 border-dashed border-purple-200 bg-purple-50/30 rounded-xl flex flex-col items-center justify-center text-purple-400 group cursor-pointer hover:bg-purple-50 transition-colors">
            <Upload size={40} className="mb-3 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold">点击上传长图 (JPG/PNG)</span>
            <span className="text-xs mt-1 opacity-70">建议宽度: 1200px</span>
          </div>
        ) : detailViewMode === 'edit' ? (
          <div className="space-y-8 animate-in fade-in">
            {/* 1. Overview */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                1. 智能体概述 (Overview)
              </label>
              <textarea
                className="w-full border border-gray-200 rounded-lg p-3 text-sm h-24 focus:border-blue-500 outline-none resize-none bg-white"
                value={formData.overview}
                onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
              />
            </div>

            {/* 2. Requirement Analysis */}
            <div>
              <h4 className="font-bold text-gray-800 text-sm mb-3">
                2. 需求分析 (Requirement Analysis)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {/* Pain Points */}
                <div>
                  <label className="block text-xs font-bold text-red-600 mb-2">
                    现状痛点 (Pain Points)
                  </label>
                  <div className="space-y-2">
                    {formData.painPoints.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          className="flex-1 border border-red-100 bg-red-50/20 rounded-lg px-3 py-2 text-sm focus:border-red-300 outline-none"
                          value={item}
                          onChange={(e) => handleArrayChange('painPoints', index, e.target.value)}
                        />
                        <button
                          onClick={() => removeArrayItem('painPoints', index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem('painPoints')}
                      className="text-xs text-red-500 flex items-center gap-1 hover:underline mt-1"
                    >
                      <Plus size={12} /> 添加痛点
                    </button>
                  </div>
                </div>
                {/* Solutions */}
                <div>
                  <label className="block text-xs font-bold text-green-600 mb-2">
                    解决方案 (Solutions)
                  </label>
                  <div className="space-y-2">
                    {formData.solutions.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          className="flex-1 border border-green-100 bg-green-50/20 rounded-lg px-3 py-2 text-sm focus:border-green-300 outline-none"
                          value={item}
                          onChange={(e) => handleArrayChange('solutions', index, e.target.value)}
                        />
                        <button
                          onClick={() => removeArrayItem('solutions', index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem('solutions')}
                      className="text-xs text-green-600 flex items-center gap-1 hover:underline mt-1"
                    >
                      <Plus size={12} /> 添加方案
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Core Features */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h4 className="font-bold text-gray-800 text-sm mb-3">3. 核心功能 (Core Features)</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    全息感知 (Perception)
                  </label>
                  <input
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:border-blue-500 outline-none bg-white"
                    value={formData.coreFeatures.perception}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        coreFeatures: { ...formData.coreFeatures, perception: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    专家推理 (Reasoning)
                  </label>
                  <input
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:border-blue-500 outline-none bg-white"
                    value={formData.coreFeatures.reasoning}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        coreFeatures: { ...formData.coreFeatures, reasoning: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    执行优化 (Execution)
                  </label>
                  <input
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:border-blue-500 outline-none bg-white"
                    value={formData.coreFeatures.execution}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        coreFeatures: { ...formData.coreFeatures, execution: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 4. Delivery */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">4. 价值交付</label>
                <div className="space-y-2">
                  {formData.delivery.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
                        value={item}
                        onChange={(e) => handleArrayChange('delivery', index, e.target.value)}
                      />
                      <button
                        onClick={() => removeArrayItem('delivery', index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem('delivery')}
                    className="text-xs text-blue-600 flex items-center gap-1 hover:underline"
                  >
                    <Plus size={12} /> 添加
                  </button>
                </div>
              </div>
              {/* 5. Scenarios */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">5. 适用场景</label>
                <div className="space-y-2">
                  {formData.scenarios.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
                        value={item}
                        onChange={(e) => handleArrayChange('scenarios', index, e.target.value)}
                      />
                      <button
                        onClick={() => removeArrayItem('scenarios', index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem('scenarios')}
                    className="text-xs text-blue-600 flex items-center gap-1 hover:underline"
                  >
                    <Plus size={12} /> 添加
                  </button>
                </div>
              </div>
            </div>

            {/* 6. Target Audience */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">6. 适用对象</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-blue-500 outline-none"
                placeholder="输入角色，用逗号分隔 (e.g. 厂长, 工程师)"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              />
            </div>

            {/* 7. Data Sample Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <label className="text-sm font-bold text-gray-800">7. 数据样本预览</label>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 gap-3">
                  {formData.dataPreviewRows.map((row, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="grid grid-cols-4 gap-2 flex-1">
                        <input
                          className="border border-gray-200 rounded px-2 py-1.5 text-xs"
                          placeholder="时间"
                          value={row.time}
                          onChange={(e) => handleDataPreviewChange(index, 'time', e.target.value)}
                        />
                        <input
                          className="border border-gray-200 rounded px-2 py-1.5 text-xs"
                          placeholder="感知事件"
                          value={row.event}
                          onChange={(e) => handleDataPreviewChange(index, 'event', e.target.value)}
                        />
                        <input
                          className="border border-gray-200 rounded px-2 py-1.5 text-xs"
                          placeholder="专家推理"
                          value={row.logic}
                          onChange={(e) => handleDataPreviewChange(index, 'logic', e.target.value)}
                        />
                        <input
                          className="border border-gray-200 rounded px-2 py-1.5 text-xs"
                          placeholder="决策"
                          value={row.decision}
                          onChange={(e) =>
                            handleDataPreviewChange(index, 'decision', e.target.value)
                          }
                        />
                      </div>
                      <button
                        onClick={() => removeDataPreviewRow(index)}
                        className="text-gray-400 hover:text-red-500 mt-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addDataPreviewRow}
                  className="mt-3 text-xs text-blue-600 flex items-center gap-1 hover:underline"
                >
                  <Plus size={12} /> 添加行
                </button>
              </div>
            </div>

            {/* 8. Compliance */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">8. 合规说明</label>
              <textarea
                className="w-full border border-gray-200 rounded-lg p-3 text-sm h-20 focus:border-blue-500 outline-none resize-none"
                value={formData.compliance}
                onChange={(e) => setFormData({ ...formData, compliance: e.target.value })}
              />
            </div>
          </div>
        ) : (
          // High Fidelity Preview Mode (Updated to consume array data)
          <div className="border border-gray-200 rounded-xl overflow-hidden animate-in fade-in bg-white">
            <div className="p-6 bg-blue-50 border-b border-blue-100">
              <h2 className="text-xl font-bold text-gray-900 mb-2">智能体概述</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{formData.overview}</p>
            </div>

            <div className="p-6 space-y-8">
              {/* Requirement Analysis Preview */}
              <div>
                <div className="flex items-center gap-2 mb-4 border-l-4 border-blue-600 pl-3">
                  <h3 className="font-bold text-gray-900">需求分析 (Requirement Analysis)</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <h4 className="font-bold text-red-800 text-xs mb-2 flex items-center gap-1">
                      <X size={12} /> 现状痛点
                    </h4>
                    <ul className="space-y-1">
                      {formData.painPoints.map((p, i) => (
                        <li key={i} className="text-xs text-red-700 flex items-start gap-1">
                          • {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <h4 className="font-bold text-green-800 text-xs mb-2 flex items-center gap-1">
                      <CheckCircle size={12} /> 智能体解决方案
                    </h4>
                    <ul className="space-y-1">
                      {formData.solutions.map((p, i) => (
                        <li key={i} className="text-xs text-green-700 flex items-start gap-1">
                          • {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Core Features Preview */}
              <div>
                <div className="flex items-center gap-2 mb-4 border-l-4 border-blue-600 pl-3">
                  <h3 className="font-bold text-gray-900">核心功能 (Core Features)</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border border-gray-100 p-4 rounded-xl shadow-sm bg-white">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 bg-blue-50 text-blue-500">
                      <Activity size={16} />
                    </div>
                    <h4 className="font-bold text-xs mb-1">1. 全息感知</h4>
                    <p className="text-[10px] text-gray-500 line-clamp-3">
                      {formData.coreFeatures.perception}
                    </p>
                  </div>
                  <div className="border border-gray-100 p-4 rounded-xl shadow-sm bg-white">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 bg-purple-50 text-purple-500">
                      <Cpu size={16} />
                    </div>
                    <h4 className="font-bold text-xs mb-1">2. 专家推理</h4>
                    <p className="text-[10px] text-gray-500 line-clamp-3">
                      {formData.coreFeatures.reasoning}
                    </p>
                  </div>
                  <div className="border border-gray-100 p-4 rounded-xl shadow-sm bg-white">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 bg-green-50 text-green-500">
                      <Zap size={16} />
                    </div>
                    <h4 className="font-bold text-xs mb-1">3. 执行优化</h4>
                    <p className="text-[10px] text-gray-500 line-clamp-3">
                      {formData.coreFeatures.execution}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery & Scenarios */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4 border-l-4 border-blue-600 pl-3">
                    <h3 className="font-bold text-gray-900">价值交付 (Delivery)</h3>
                  </div>
                  <ul className="space-y-2">
                    {formData.delivery.map((d, i) => (
                      <li
                        key={i}
                        className="text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded border border-gray-100"
                      >
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4 border-l-4 border-blue-600 pl-3">
                    <h3 className="font-bold text-gray-900">适用场景 (Scenarios)</h3>
                  </div>
                  <ul className="space-y-2">
                    {formData.scenarios.map((s, i) => (
                      <li
                        key={i}
                        className="text-xs text-blue-700 bg-blue-50 px-3 py-2 rounded border border-blue-100 flex items-center gap-2"
                      >
                        <CheckCircle size={12} /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Data Sample Table Preview */}
              <div>
                <div className="flex items-center gap-2 mb-4 border-l-4 border-blue-600 pl-3">
                  <h3 className="font-bold text-gray-900">数据样本预览 (Data Sample)</h3>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden text-xs">
                  <div className="grid grid-cols-4 bg-gray-50 p-2 font-bold text-gray-500 border-b border-gray-200">
                    <div>时间</div>
                    <div>感知事件</div>
                    <div>专家推理</div>
                    <div>辅助决策</div>
                  </div>
                  {formData.dataPreviewRows.map((row, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-4 p-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="font-mono text-gray-400">{row.time}</div>
                      <div>{row.event}</div>
                      <div className="text-gray-500">{row.logic}</div>
                      <div className="text-blue-600 font-bold">{row.decision}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance */}
              <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex gap-3">
                <ShieldCheck size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-green-800 mb-1">安全合规说明</div>
                  <p className="text-[10px] text-green-700">{formData.compliance}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 pb-28">
      <h2 className="text-xl font-bold text-gray-900 mb-6">第三步：体验试用 (Experience Trial)</h2>

      {/* Asset Info Card */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            <Box size={20} />
          </div>
          <div>
            <div className="text-xs text-gray-500">当前配置资产</div>
            <div className="font-bold text-gray-900">{formData.title}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">发布版本</div>
          <div className="font-mono font-bold text-blue-600">{formData.nextVersion}</div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Clock size={18} className="text-green-600" />
          <div>
            <h3 className="font-bold text-gray-900 text-sm">体验试用配置</h3>
            <p className="text-[10px] text-gray-400">
              配置智能体的体验试用规则，吸引更多用户体验。
            </p>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Free Trial Toggle */}
          <div
            className={`border rounded-xl p-5 transition-all ${formData.trialConfig.enabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${formData.trialConfig.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}
                >
                  <Clock size={20} />
                </div>
                <div>
                  <div
                    className={`text-sm font-bold ${formData.trialConfig.enabled ? 'text-green-800' : 'text-gray-700'}`}
                  >
                    允许体验试用 (Enable Experience Trial)
                  </div>
                  <div
                    className={`text-[10px] mt-0.5 ${formData.trialConfig.enabled ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    开启后，用户可在指定期限和额度内免费体验该智能体服务。试用期内产生的用量或初装费将自动减免。
                  </div>
                </div>
              </div>
              <div className="relative inline-block w-10 h-5 align-middle select-none transition duration-200 ease-in">
                <input
                  type="checkbox"
                  name="toggle"
                  id="trial-toggle"
                  className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-green-600 right-5"
                  checked={formData.trialConfig.enabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      trialConfig: { ...formData.trialConfig, enabled: e.target.checked },
                    })
                  }
                />
                <label
                  htmlFor="trial-toggle"
                  className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${formData.trialConfig.enabled ? 'bg-green-600' : 'bg-gray-300'}`}
                ></label>
              </div>
            </div>

            {formData.trialConfig.enabled && (
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 animate-in fade-in slide-in-from-top-2 mt-6">
                <div className="col-span-1 lg:col-span-2">
                  <label className="block text-sm font-bold text-green-800 mb-2">
                    试用期限 (Duration)
                  </label>
                  <select
                    className="w-full border-2 border-green-300 bg-green-50 rounded-xl px-4 py-3 text-lg focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none text-green-900 font-black shadow-sm transition-all"
                    value={formData.trialConfig.duration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        trialConfig: { ...formData.trialConfig, duration: Number(e.target.value) },
                      })
                    }
                  >
                    <option value={1}>1 个月 (1 Month)</option>
                    <option value={2}>2 个月 (2 Months)</option>
                    <option value={3}>3 个月 (3 Months)</option>
                  </select>
                </div>
                <div className="col-span-1 lg:col-span-2">
                  <label className="block text-sm font-bold text-green-800 mb-2">
                    同一租户试用次数限制
                  </label>
                  <div className="flex items-center gap-2 bg-green-50 border-2 border-green-300 rounded-xl px-4 py-3 shadow-sm focus-within:border-green-600 focus-within:ring-4 focus-within:ring-green-100 transition-all">
                    <input
                      type="number"
                      className="w-full text-xl font-black text-green-900 outline-none bg-transparent"
                      value={formData.trialConfig.maxTrialTimes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          trialConfig: {
                            ...formData.trialConfig,
                            maxTrialTimes: Number(e.target.value),
                          },
                        })
                      }
                    />
                    <span className="text-sm font-bold text-green-700 flex-shrink-0">次</span>
                  </div>
                </div>
                <div className="col-span-2 lg:col-span-2">
                  <label className="block text-sm font-bold text-green-800 mb-2">
                    初装费 (Setup Fee)
                  </label>
                  <div className="flex items-center gap-2 bg-green-50 border-2 border-green-300 rounded-xl px-4 py-3 shadow-sm focus-within:border-green-600 focus-within:ring-4 focus-within:ring-green-100 transition-all">
                    <span className="text-lg font-bold text-green-700 flex-shrink-0">¥</span>
                    <input
                      type="number"
                      className="w-full text-xl font-black text-green-900 outline-none bg-transparent"
                      value={formData.trialConfig.setupFee}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          trialConfig: {
                            ...formData.trialConfig,
                            setupFee: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-span-1 lg:col-span-3">
                  <label className="block text-sm font-bold text-green-800 mb-2">Token 上限</label>
                  <div className="flex items-center gap-2 bg-green-50 border-2 border-green-300 rounded-xl px-4 py-3 shadow-sm focus-within:border-green-600 focus-within:ring-4 focus-within:ring-green-100 transition-all">
                    <input
                      type="number"
                      className="w-full text-xl font-black text-green-900 outline-none bg-transparent"
                      value={formData.trialConfig.tokenLimit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          trialConfig: {
                            ...formData.trialConfig,
                            tokenLimit: Number(e.target.value),
                          },
                        })
                      }
                    />
                    <span className="text-sm font-bold text-green-700 flex-shrink-0">Tokens</span>
                  </div>
                </div>
                <div className="col-span-1 lg:col-span-3">
                  <label className="block text-sm font-bold text-green-800 mb-2">存储上限</label>
                  <div className="flex items-center gap-2 bg-green-50 border-2 border-green-300 rounded-xl px-4 py-3 shadow-sm focus-within:border-green-600 focus-within:ring-4 focus-within:ring-green-100 transition-all">
                    <input
                      type="number"
                      className="w-full text-xl font-black text-green-900 outline-none bg-transparent"
                      value={formData.trialConfig.storageLimit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          trialConfig: {
                            ...formData.trialConfig,
                            storageLimit: Number(e.target.value),
                          },
                        })
                      }
                    />
                    <span className="text-sm font-bold text-green-700 flex-shrink-0">GB</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 pb-28">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        第四步：定价与服务 (Pricing & Services)
      </h2>

      {/* Asset Info Card */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            <Box size={20} />
          </div>
          <div>
            <div className="text-xs text-gray-500">当前配置资产</div>
            <div className="font-bold text-gray-900">{formData.title}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">发布版本</div>
          <div className="font-mono font-bold text-blue-600">{formData.nextVersion}</div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <CreditCard size={18} className="text-blue-600" />
          <div>
            <h3 className="font-bold text-gray-900 text-sm">定价策略配置</h3>
            <p className="text-[10px] text-gray-400">
              配置智能体的商业化计费规则，支持订阅制与按量付费模式。
            </p>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* 0. Global Consumption Control */}
          <div className="bg-orange-50/50 border border-orange-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-orange-600" />
              <h4 className="font-bold text-orange-800 text-sm">
                全局消费风控 (Global Consumption Control)
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-orange-800 mb-2">
                  消费预警阈值 (Alert Threshold)
                </label>
                <div className="flex items-center gap-2 bg-white border border-orange-200 rounded-xl px-4 py-2.5 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                  <span className="text-orange-600 font-bold">¥</span>
                  <input
                    type="number"
                    value={formData.consumptionControl.alertThreshold}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        consumptionControl: {
                          ...formData.consumptionControl,
                          alertThreshold: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full text-right text-lg font-black text-orange-900 outline-none bg-transparent"
                  />
                  <span className="text-xs text-orange-600 flex-shrink-0">/月</span>
                </div>
                <p className="text-[10px] text-orange-600 mt-1">
                  当月按量消费达到此金额时，发送预警通知
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold text-orange-800 mb-2">
                  消费熔断上限 (Hard Limit)
                </label>
                <div className="flex items-center gap-2 bg-white border border-orange-200 rounded-xl px-4 py-2.5 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                  <span className="text-orange-600 font-bold">¥</span>
                  <input
                    type="number"
                    value={formData.consumptionControl.hardLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        consumptionControl: {
                          ...formData.consumptionControl,
                          hardLimit: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full text-right text-lg font-black text-orange-900 outline-none bg-transparent"
                  />
                  <span className="text-xs text-orange-600 flex-shrink-0">/月</span>
                </div>
                <p className="text-[10px] text-orange-600 mt-1">
                  当月按量消费达到此金额时，自动暂停服务
                </p>
              </div>
            </div>
          </div>

          {/* 1. Pricing Plans */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
              定价模式配置 (Pricing Models)
            </label>
            <div className="space-y-6">
              {/* Usage Toggle & Config (Moved to top) */}
              <div
                className={`border-2 rounded-2xl transition-all ${formData.enableUsage ? 'border-purple-600 bg-purple-50/10' : 'border-gray-200 bg-gray-50'}`}
              >
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${formData.enableUsage ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-500'}`}
                    >
                      <Activity size={20} />
                    </div>
                    <div>
                      <div
                        className={`text-base font-bold ${formData.enableUsage ? 'text-purple-800' : 'text-gray-700'}`}
                      >
                        基础按量付费 (Pay-As-You-Go)
                      </div>
                      <div
                        className={`text-xs mt-0.5 ${formData.enableUsage ? 'text-purple-600' : 'text-gray-400'}`}
                      >
                        后付费模式，用多少付多少。作为全局基础费率。
                      </div>
                    </div>
                  </div>
                  <div className="relative inline-block w-10 h-5 align-middle select-none transition duration-200 ease-in">
                    <input
                      type="checkbox"
                      name="toggle-usage"
                      id="usage-toggle"
                      className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-purple-600 right-5"
                      checked={formData.enableUsage}
                      onChange={(e) => setFormData({ ...formData, enableUsage: e.target.checked })}
                    />
                    <label
                      htmlFor="usage-toggle"
                      className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${formData.enableUsage ? 'bg-purple-600' : 'bg-gray-300'}`}
                    ></label>
                  </div>
                </div>

                {formData.enableUsage && (
                  <div className="p-6 animate-in fade-in space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-purple-800 mb-2">
                        初装费 (Setup Fee)
                      </label>
                      <div className="w-1/3 flex items-center justify-between bg-white border-2 border-purple-200 rounded-xl px-4 py-3 focus-within:border-purple-600 focus-within:ring-4 focus-within:ring-purple-100 transition-all">
                        <span className="text-sm font-bold text-gray-800">正式部署费用</span>
                        <div className="flex items-center gap-2">
                          <span className="text-purple-600 text-lg font-bold">¥</span>
                          <input
                            type="number"
                            value={formData.unitRates.setupFee}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                unitRates: {
                                  ...formData.unitRates,
                                  setupFee: Number(e.target.value),
                                },
                              })
                            }
                            className="w-20 text-right text-xl font-black text-purple-900 outline-none bg-transparent"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-purple-800 mb-2">
                        资源单价 (Unit Rates)
                      </label>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="flex items-center justify-between bg-white border-2 border-purple-200 rounded-xl px-4 py-3 focus-within:border-purple-600 transition-colors">
                          <div className="flex items-center gap-3">
                            <Cpu size={18} className="text-purple-500" />
                            <span className="text-sm font-bold text-gray-800">Tokens</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-purple-600 text-lg font-bold">¥</span>
                            <input
                              type="number"
                              value={formData.unitRates.token}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  unitRates: {
                                    ...formData.unitRates,
                                    token: Number(e.target.value),
                                  },
                                })
                              }
                              className="w-20 text-right text-xl font-black text-gray-900 outline-none bg-transparent"
                            />
                            <span className="text-purple-600 text-sm font-bold">/k</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-white border-2 border-purple-200 rounded-xl px-4 py-3 focus-within:border-purple-600 transition-colors">
                          <div className="flex items-center gap-3">
                            <Database size={18} className="text-purple-500" />
                            <span className="text-sm font-bold text-gray-800">存储 (Storage)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-purple-600 text-lg font-bold">¥</span>
                            <input
                              type="number"
                              value={formData.unitRates.storage}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  unitRates: {
                                    ...formData.unitRates,
                                    storage: Number(e.target.value),
                                  },
                                })
                              }
                              className="w-20 text-right text-xl font-black text-gray-900 outline-none bg-transparent"
                            />
                            <span className="text-purple-600 text-sm font-bold">/GB</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-white border-2 border-purple-200 rounded-xl px-4 py-3 focus-within:border-purple-600 transition-colors">
                          <div className="flex items-center gap-3">
                            <Users size={18} className="text-purple-500" />
                            <span className="text-sm font-bold text-gray-800">用户数 (Seats)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-purple-600 text-lg font-bold">¥</span>
                            <input
                              type="number"
                              value={formData.unitRates.user}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  unitRates: {
                                    ...formData.unitRates,
                                    user: Number(e.target.value),
                                  },
                                })
                              }
                              className="w-20 text-right text-xl font-black text-gray-900 outline-none bg-transparent"
                            />
                            <span className="text-purple-600 text-sm font-bold">/人</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Subscription Toggle & Config */}
              <div
                className={`border-2 rounded-2xl transition-all ${formData.enableSubscription ? 'border-blue-600 bg-blue-50/10' : 'border-gray-200 bg-gray-50'}`}
              >
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${formData.enableSubscription ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}
                    >
                      <Package size={20} />
                    </div>
                    <div>
                      <div
                        className={`text-base font-bold ${formData.enableSubscription ? 'text-blue-800' : 'text-gray-700'}`}
                      >
                        套餐付费 (Subscription)
                      </div>
                      <div
                        className={`text-xs mt-0.5 ${formData.enableSubscription ? 'text-blue-600' : 'text-gray-400'}`}
                      >
                        包含包月、包年套餐及基础资源额度。超额后按上方基础费率计费。
                      </div>
                    </div>
                  </div>
                  <div className="relative inline-block w-10 h-5 align-middle select-none transition duration-200 ease-in">
                    <input
                      type="checkbox"
                      name="toggle-sub"
                      id="sub-toggle"
                      className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-blue-600 right-5"
                      checked={formData.enableSubscription}
                      onChange={(e) =>
                        setFormData({ ...formData, enableSubscription: e.target.checked })
                      }
                    />
                    <label
                      htmlFor="sub-toggle"
                      className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${formData.enableSubscription ? 'bg-blue-600' : 'bg-gray-300'}`}
                    ></label>
                  </div>
                </div>

                {formData.enableSubscription && (
                  <div className="p-6 grid grid-cols-2 gap-6 animate-in fade-in">
                    {/* Monthly Plan */}
                    <div className="bg-white border-2 border-blue-100 rounded-xl p-5 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-blue-900">包月套餐 (Monthly)</h4>
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1">
                            <span className="text-blue-600 font-bold">¥</span>
                            <input
                              type="number"
                              value={formData.monthlyPlan.price}
                              onChange={(e) => handleMonthlyFeeChange(Number(e.target.value))}
                              className="w-20 text-right text-2xl font-black text-blue-900 outline-none bg-transparent border-b border-dashed border-blue-300 focus:border-blue-600"
                            />
                            <span className="text-xs text-gray-500">/月</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">折扣:</span>
                            <input
                              type="number"
                              value={formData.monthlyPlan.discount ?? 100}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  monthlyPlan: {
                                    ...formData.monthlyPlan,
                                    discount: Number(e.target.value),
                                  },
                                })
                              }
                              className="w-10 text-center text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded outline-none"
                            />
                            <span className="text-xs text-gray-500">% (折)</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                          <span className="text-xs text-gray-600 flex items-center gap-2">
                            <Cpu size={14} /> Tokens
                          </span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={formData.monthlyPlan.tokens}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  monthlyPlan: {
                                    ...formData.monthlyPlan,
                                    tokens: Number(e.target.value),
                                  },
                                })
                              }
                              className="w-16 text-right text-sm font-bold text-gray-900 outline-none bg-transparent border-b border-dashed border-gray-300"
                            />
                            <span className="text-xs text-gray-500">k/月</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                          <span className="text-xs text-gray-600 flex items-center gap-2">
                            <Database size={14} /> 存储
                          </span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={formData.monthlyPlan.storage}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  monthlyPlan: {
                                    ...formData.monthlyPlan,
                                    storage: Number(e.target.value),
                                  },
                                })
                              }
                              className="w-16 text-right text-sm font-bold text-gray-900 outline-none bg-transparent border-b border-dashed border-gray-300"
                            />
                            <span className="text-xs text-gray-500">GB</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                          <span className="text-xs text-gray-600 flex items-center gap-2">
                            <Users size={14} /> 用户数
                          </span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={formData.monthlyPlan.users}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  monthlyPlan: {
                                    ...formData.monthlyPlan,
                                    users: Number(e.target.value),
                                  },
                                })
                              }
                              className="w-16 text-right text-sm font-bold text-gray-900 outline-none bg-transparent border-b border-dashed border-gray-300"
                            />
                            <span className="text-xs text-gray-500">人</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Yearly Plan */}
                    <div className="bg-white border-2 border-blue-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                        推荐
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-blue-900">包年套餐 (Yearly)</h4>
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1">
                            <span className="text-blue-600 font-bold">¥</span>
                            <input
                              type="number"
                              value={formData.yearlyPlan.price}
                              onChange={(e) => handleYearlyFeeChange(Number(e.target.value))}
                              className="w-24 text-right text-2xl font-black text-blue-900 outline-none bg-transparent border-b border-dashed border-blue-300 focus:border-blue-600"
                            />
                            <span className="text-xs text-gray-500">/年</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">折扣:</span>
                            <input
                              type="number"
                              value={formData.yearlyPlan.discount ?? 100}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  yearlyPlan: {
                                    ...formData.yearlyPlan,
                                    discount: Number(e.target.value),
                                  },
                                })
                              }
                              className="w-10 text-center text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded outline-none"
                            />
                            <span className="text-xs text-gray-500">% (折)</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-blue-50/50 rounded-lg px-3 py-2">
                          <span className="text-xs text-gray-600 flex items-center gap-2">
                            <Cpu size={14} /> Tokens
                          </span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={formData.yearlyPlan.tokens}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  yearlyPlan: {
                                    ...formData.yearlyPlan,
                                    tokens: Number(e.target.value),
                                  },
                                })
                              }
                              className="w-20 text-right text-sm font-bold text-gray-900 outline-none bg-transparent border-b border-dashed border-gray-300"
                            />
                            <span className="text-xs text-gray-500">k/年</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-blue-50/50 rounded-lg px-3 py-2">
                          <span className="text-xs text-gray-600 flex items-center gap-2">
                            <Database size={14} /> 存储
                          </span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={formData.yearlyPlan.storage}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  yearlyPlan: {
                                    ...formData.yearlyPlan,
                                    storage: Number(e.target.value),
                                  },
                                })
                              }
                              className="w-20 text-right text-sm font-bold text-gray-900 outline-none bg-transparent border-b border-dashed border-gray-300"
                            />
                            <span className="text-xs text-gray-500">GB</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-blue-50/50 rounded-lg px-3 py-2">
                          <span className="text-xs text-gray-600 flex items-center gap-2">
                            <Users size={14} /> 用户数
                          </span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={formData.yearlyPlan.users}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  yearlyPlan: {
                                    ...formData.yearlyPlan,
                                    users: Number(e.target.value),
                                  },
                                })
                              }
                              className="w-20 text-right text-sm font-bold text-gray-900 outline-none bg-transparent border-b border-dashed border-gray-300"
                            />
                            <span className="text-xs text-gray-500">人</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Agreement */}
      <div className="mt-6 bg-white border-2 border-gray-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
        <input
          type="checkbox"
          id="agreement"
          className="mt-1 w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          checked={formData.agreementChecked}
          onChange={(e) => setFormData({ ...formData, agreementChecked: e.target.checked })}
        />
        <div>
          <label
            htmlFor="agreement"
            className="text-base font-bold text-gray-800 cursor-pointer select-none"
          >
            我已阅读并同意{' '}
            <span
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              onClick={(e) => {
                e.preventDefault()
                setShowAgreementModal(true)
              }}
            >
              《维观市场开发者服务与定价协议》
            </span>
          </label>
          <p className="text-sm text-gray-500 mt-1">
            包含数据隐私保护条款、SLA服务等级承诺及平台分润规则。勾选即代表您承诺对发布的智能体服务的稳定性与合规性负责。
          </p>
        </div>
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
      <h2 className="text-xl font-bold text-gray-900 mb-6">第五步：合规审核 (Review)</h2>
      {/* Final Check Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-6 shadow-lg flex items-start gap-6">
        <div className="bg-green-100 p-4 rounded-full text-green-600">
          <ShieldCheck size={32} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">校验通过，准备上架</h3>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-500" /> 业务数据剥离完成
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-500" /> 代码安全扫描通过
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-500" /> 依赖库合规性检查通过
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-500" /> 接口连通性测试通过 (Latency {`<`} 50ms)
            </div>
          </div>
          <div className="bg-yellow-50 text-yellow-800 text-xs px-3 py-2 rounded-lg border border-yellow-100 flex items-center gap-2">
            <Clock size={14} />
            提交发布后，人工审核将在 1-3 个工作日内完成。审核期间您无法修改核心资产文件。
          </div>
        </div>
      </div>
      {/* Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h4 className="font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center justify-between">
          发布清单确认
          <span className="text-xs bg-white border px-2 py-1 rounded text-gray-500 font-normal">
            ID: {Date.now().toString().slice(-8)}
          </span>
        </h4>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">资产名称</span>
            <span className="font-bold text-gray-900">{formData.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">版本号</span>
            <span className="font-mono bg-white border px-2 rounded">
              {mode === 'version' ? `${formData.currentVersion} -> ` : ''}
              {formData.nextVersion}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">定价模式</span>
            <span className="capitalize text-blue-600 font-bold">
              {formData.enableSubscription && formData.enableUsage
                ? '套餐付费 + 按量付费'
                : formData.enableSubscription
                  ? '套餐付费'
                  : formData.enableUsage
                    ? '按量付费'
                    : '免费'}
            </span>
          </div>
          <div className="flex justify-between col-span-2 pt-2 border-t border-gray-200 mt-2">
            <span className="text-gray-500 font-bold">当前定价总价</span>
            <span className="font-bold text-gray-900 text-lg">{currentPriceText}</span>
          </div>
        </div>
      </div>
    </div>
  )

  // --- Render Agreement Modal ---
  const renderAgreementModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">维观市场开发者服务与定价协议</h3>
          <button
            onClick={() => setShowAgreementModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 text-sm text-gray-600 space-y-4 leading-relaxed">
          <h4 className="font-bold text-gray-900 text-base mb-2">欢迎您使用维观市场开发者服务！</h4>
          <p>
            本《维观市场开发者服务与定价协议》（以下简称“本协议”）是您（以下简称“开发者”）与维观市场（以下简称“平台”）之间关于您在平台发布智能体、数据集等资产并进行商业化定价所订立的有效合约。
          </p>

          <h5 className="font-bold text-gray-800 mt-4">1. 服务内容与规范</h5>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              开发者承诺其在平台发布的任何资产（包括但不限于代码、模型、数据、文档等）均拥有合法、完整的知识产权，且不侵犯任何第三方的合法权益。
            </li>
            <li>
              开发者需保证其提供的智能体服务具备稳定性、安全性和合规性，不得包含任何恶意代码、病毒或违反国家法律法规的内容。
            </li>
            <li>
              平台有权对开发者提交的资产进行安全扫描、合规性检查及接口连通性测试。审核通过后方可上架。
            </li>
          </ul>

          <h5 className="font-bold text-gray-800 mt-4">2. 定价与收益结算规则</h5>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              开发者可自主选择“包年包月（Subscription）”或“按量付费（Pay-As-You-Go）”的定价模式，并设定相应的价格参数。
            </li>
            <li>
              平台将根据买家的实际支付金额，扣除 <strong>15% 的平台技术服务费</strong>
              后，将剩余收益结算给开发者。
            </li>
            <li>收益结算周期为自然月，平台将在次月 15 个工作日内完成上月收益的核对与打款。</li>
            <li>若因开发者资产质量问题导致买家退款，平台有权从开发者后续收益中扣除相应款项。</li>
          </ul>

          <h5 className="font-bold text-gray-800 mt-4">3. 数据隐私与安全</h5>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              开发者在提供服务过程中，若涉及处理买家业务数据，必须严格遵守《数据安全法》、《个人信息保护法》等相关法律法规。
            </li>
            <li>开发者不得擅自收集、存储、使用、泄露或向第三方提供买家的业务数据。</li>
            <li>平台将采取必要的技术手段和管理措施，保障开发者资产和买家数据的安全。</li>
          </ul>

          <h5 className="font-bold text-gray-800 mt-4">4. 违约责任与协议终止</h5>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              若开发者违反本协议任何条款，平台有权视情节轻重采取下架资产、冻结收益、封停账号等措施。
            </li>
            <li>
              开发者可随时申请下架其发布的资产，但需提前 30
              天通知平台，并妥善处理已购买用户的后续服务事宜。
            </li>
          </ul>
          <p className="mt-4 text-xs text-gray-500">
            请您仔细阅读上述条款，勾选“我已阅读并同意”即表示您完全接受本协议的全部内容。
          </p>
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 text-right">
          <button
            onClick={() => {
              setFormData({ ...formData, agreementChecked: true })
              setShowAgreementModal(false)
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            我已阅读并同意
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">
              {mode === 'version' ? '发布新版本 (Upgrade Version)' : '发布智能体 (Upload Wizard)'}
            </h1>
            {mode === 'version' && (
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 font-medium">
                Upgrade: {formData.currentVersion}
              </span>
            )}
          </div>
          <button onClick={onClose}>
            <X size={24} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-8 pt-6 pb-2 bg-white z-10">
          <div className="flex gap-2 h-1.5 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-blue-600' : 'bg-gray-100'}`}
              ></div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar bg-gray-50/50">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 border-t border-gray-100 flex justify-between items-center bg-white z-10">
          <div className="flex items-center gap-4">
            {step > 1 && (
              <button
                onClick={handlePrev}
                className="px-6 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors"
              >
                上一步
              </button>
            )}

            {/* Current Price Preview in Footer */}
            {step === 4 && (
              <div className="hidden sm:block text-right border-l border-gray-200 pl-6">
                <div className="text-[10px] text-gray-400 font-bold uppercase">
                  当前定价 (CURRENT PRICE)
                </div>
                <div className="text-sm font-bold text-gray-900">{currentPriceText}</div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button className="px-6 py-2.5 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition-colors flex items-center gap-2">
              <Save size={18} /> 保存草稿
            </button>
            <button
              onClick={handleNext}
              disabled={(step === 5 && isValidating) || (step === 1 && isStep1Validating)}
              className={`px-8 py-2.5 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 ${
                step === 4 && !formData.agreementChecked
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : (step === 5 && isValidating) || (step === 1 && isStep1Validating)
                    ? 'bg-blue-400 text-white cursor-wait'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
              }`}
            >
              {step === 5
                ? isValidating
                  ? '校验中...'
                  : '确认发布'
                : step === 1 && isStep1Validating
                  ? '校验中...'
                  : step === 3 && !formData.trialConfig.enabled
                    ? '跳过，配置正式定价'
                    : '下一步'}
              {step !== 5 && <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      </div>
      {/* Agreement Modal Layer */}
      {showAgreementModal && renderAgreementModal()}
    </div>
  )
}

export default PublishWizard
