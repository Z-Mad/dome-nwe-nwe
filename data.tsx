
import React from 'react';

export interface Deliverable {
  title: string;
  desc: string;
  type: 'dashboard' | 'chart' | 'map' | 'report' | 'algorithm' | 'model';
}

export interface DataColumn {
  key: string;
  label: string;
}

export interface DataRow {
  [key: string]: string | React.ReactNode;
}

export interface DetailModule {
  id: string;
  type: 'hero' | 'text' | 'image' | 'features-grid' | 'comparison' | 'scenarios' | 'custom-architecture' | 'custom-bi-concept';
  title?: string;
  content?: string; 
  data?: any; 
}

export interface AgentData {
    id: string;
    type: 'method' | 'analysis';
    category: string;
    title: string;
    provider: string;
    rating: number;
    reviewCount: number;
    version: string;
    versions: string[];
    tags: string[];
    detailsModules: DetailModule[]; 
    pricing: {
        saas: { 
            price: string; 
            unit: string; 
            features: string[];
            quota?: { tokens: number; storage: number; users: number };
            monthlyDiscount?: number;
            yearlyDiscount?: number;
        };
        buyout: { 
            price: string; 
            unit: string; 
            features: string[];
            quota?: { tokens: number; storage: number; users: number | '不限' };
        };
    };
    meta: {
        publishDate: string;
        downloads: number;
    };
    related: string[];
    deliverables: Deliverable[];
    dataPreview: {
        columns: DataColumn[];
        rows: DataRow[];
    };
    compliance: {
        text: string;
        tags: string[];
    };
    trialConfig?: {
        enabled: boolean;
        duration: number; // days
        tokenLimit: number;
        storageLimit: number;
        installationFee?: number;
    };
}

export const MOCK_AGENTS: Record<string, AgentData> = {
    '1': {
        id: '1',
        type: 'method',
        category: '钢铁冶金 · 生产制造',
        title: '数字冷轧质量管理 · 方法智能体',
        provider: '宝信软件 (Baosight)',
        rating: 4.9,
        reviewCount: 3,
        version: 'v2.4.1',
        versions: ['v2.4.1', 'v2.4.0', 'v2.3.5', 'v2.0.0'],
        tags: ['方法智能体', '专家经验固化', '闭环控制'],
        trialConfig: {
            enabled: true,
            duration: 30, // 1 month
            tokenLimit: 500000,
            storageLimit: 5,
            installationFee: 0
        },
        detailsModules: [
            {
                id: 'm1',
                type: 'hero',
                title: '从“经验主义”到“数据决策”的冷轧革命',
                content: '传统冷轧生产高度依赖老师傅的经验来调整轧机参数（如弯辊力、冷却液分布），往往存在滞后性，导致板形缺陷频发。数字冷轧质量管理智能体不仅仅是一个工具，它固化了宝信软件40年的行业Know-How，将机理模型 (Process Model)与深度学习 (Deep Learning)完美融合。',
                data: {
                    stats: [
                        { label: '良品率提升', value: '1.5%', icon: 'activity' },
                        { label: '故障响应', value: '< 50ms', icon: 'zap' },
                        { label: '减少人工干预', value: '60%', icon: 'user' },
                    ],
                    theme: 'blue'
                }
            },
            {
                id: 'm2',
                type: 'comparison',
                title: '核心业务价值',
                data: {
                    bad: {
                        title: '传统模式痛点',
                        icon: 'x',
                        items: [
                            { title: '视觉疲劳漏检', desc: '人工质检员在高强度作业下，对微小裂纹的漏检率高达 5-8%。' },
                            { title: '参数调整滞后', desc: '发现板形不良后再调整轧机，往往已经产生了数百米的次品钢卷。' },
                            { title: '质量黑箱', desc: '质量数据分散在不同系统（L1/L2/MES），无法进行全生命周期追溯。' }
                        ]
                    },
                    good: {
                        title: '智能体解决方案',
                        icon: 'check',
                        items: [
                            { title: '全时段机器视觉', desc: '7x24小时不知疲倦的监控，对 < 0.2mm 的微小缺陷识别率 > 99.2%。' },
                            { title: '毫秒级闭环控制', desc: '检测到异常瞬间，直接下发 PLC 调整指令，将缺陷扼杀在萌芽。' },
                            { title: '全息数字档案', desc: '每卷钢都有独立的“数字身份证”，记录从原料到成品的全部工艺参数。' }
                        ]
                    }
                }
            },
            {
                id: 'm3',
                type: 'custom-architecture',
                title: '专家思维引擎 (Expert Thinking Engine)'
            },
            {
                id: 'm4',
                type: 'features-grid',
                title: '核心价值交付',
                data: [
                    { title: '开箱即用的场景闭环', desc: '无需从零开发，预置了针对连续退火、热镀锌等标准产线的控制策略。企业只需配置设备参数，即可实现主要质量指标的自动管控。', icon: 'target' },
                    { title: '物理实体的数字化骨架', desc: '不仅仅是算法，更交付了一套标准化的数据结构（JSON/Excel），定义了轧机、卷取机等核心对象的属性、关系与接入规则。', icon: 'database' },
                    { title: '专家思维链 (CoT)', desc: '内置“观察-诊断-决策”的专家推理模型，自动处理板形波动与厚度异常。', icon: 'cpu' }
                ]
            },
            {
                id: 'm5',
                type: 'scenarios',
                title: '适用场景',
                data: [
                    { title: '板形自动控制 (AFC)', desc: '替代人工进行弯辊力与冷却液的实时调节，消除人为滞后。', icon: 'factory' },
                    { title: '表面缺陷根因阻断', desc: '视觉识别到周期性缺陷时，自动反推辊系故障并触发停机预警。', icon: 'shield' }
                ]
            }
        ],
        deliverables: [
            { title: '专家诊断逻辑库.py', desc: '包含2000+条针对冷轧常见质量问题的IF-THEN专家规则代码。', type: 'algorithm' },
            { title: '机组对象图谱.json', desc: '描述轧线设备拓扑关系与工艺参数绑定的标准化JSON文件。', type: 'model' },
            { title: '闭环控制应用包', desc: '可直接下发至L2系统的控制指令集接口定义。', type: 'model' },
            { title: '质量异常处理SOP', desc: 'AI生成的标准化作业程序，指导现场人员快速处置。', type: 'report' }
        ],
        dataPreview: {
            columns: [
                { key: 'time', label: '时间 (Time)' },
                { key: 'event', label: '感知事件 (Event)' },
                { key: 'logic', label: '专家逻辑 (Reasoning)' },
                { key: 'decision', label: '决策输出 (Decision)' }
            ],
            rows: [
                { time: '10:23:05.120', event: '出口板形 I-Unit > 15', logic: '匹配规则#802: 浪形主要集中在双边 -> 判定为弯辊力不足', decision: <span className="text-blue-600 font-bold">增加弯辊力 +50kN</span> },
                { time: '10:24:12.050', event: '厚度偏差 > 5μm', logic: '匹配规则#104: 轧制速度稳定 & 张力波动 -> 判定为来料楔形', decision: <span className="text-blue-600 font-bold">调整两侧压下量差值</span> },
                { time: '10:25:30.800', event: '视觉报警: 周期辊印', logic: '计算周长 942mm -> 匹配2#机架工作辊直径', decision: <span className="text-red-600 font-bold">触发换辊预警 (Lvl 2)</span> }
            ]
        },
        compliance: {
            text: '本方法智能体运行在私有云或边缘端，核心机理模型包含宝信软件知识产权。专家规则库支持企业本地化扩展，数据不出厂。',
            tags: ['本地部署', '知识产权保护', '规则可审计']
        },
        pricing: {
            saas: { 
                price: '5,800', 
                unit: '/ 月', 
                features: ['云端规则库更新', '专家在线微调', '7x24小时支持'],
                quota: { tokens: 100000, storage: 500, users: 20 },
                monthlyDiscount: 100,
                yearlyDiscount: 80
            },
            buyout: { 
                price: '200,000', 
                unit: '/ 永久', 
                features: ['源码级交付', '本地训练工具', '无限节点授权'],
                quota: { tokens: 5000000, storage: 5000, users: '不限' }
            }
        },
        meta: { publishDate: '2026-01-28', downloads: 3402 },
        related: ['2', '3']
    },
    '2': {
        id: '2',
        type: 'analysis',
        category: '钢铁冶金 · 行业智库',
        title: '2025冷轧行业质量洞察与对标 · 分析智能体',
        provider: '钢铁行业大数据中心',
        rating: 4.8,
        reviewCount: 64,
        version: 'v2025.1',
        versions: ['v2025.1', 'v2024.Final', 'v2024.3'],
        tags: ['行业对标', '质量诊断', '决策支持'],
        trialConfig: {
            enabled: true,
            duration: 14,
            tokenLimit: 100000,
            storageLimit: 1,
            installationFee: 0
        },
        detailsModules: [
            {
                id: 'm1',
                type: 'hero',
                title: '既是行业数据的“蓝皮书”，也是企业的“体检仪”',
                content: '本智能体基于2024-2025年度全行业千万吨级生产数据，构建了冷轧产品质量竞争力评估模型。它不只是一份静态的报告，更是一个动态的对标分析工具。企业导入自身数据后，可即时获取与行业Top 10%标杆企业的差距分析，为工艺优化提供精准导航。',
                data: { 
                    theme: 'purple',
                    stats: [
                        { label: '对标样本', value: '1,200万吨', icon: 'database' },
                        { label: '标杆企业', value: '35家', icon: 'building' },
                        { label: '指标维度', value: '140+', icon: 'activity' },
                    ]
                }
            },
            {
                id: 'm2',
                type: 'custom-bi-concept',
                title: '核心机制：数据+模型+出版物'
            },
            {
                id: 'm3',
                type: 'features-grid',
                title: '三大核心功能',
                data: [
                    { title: '全景对标诊断', desc: '一键生成《企业质量竞争力诊断报告》，从厚度精度(Cpk)、表面等级、力学性能三个维度进行行业排位。', icon: 'chart' },
                    { title: '动态基准库', desc: '不再是死板的标准，而是基于上千万吨实绩数据生成的动态分布曲线 (Distribution Curve)，真实反映行业技术水位。', icon: 'database' },
                    { title: '行业洞察蓝皮书', desc: '内嵌《2025中国冷轧行业发展年度报告》完整版，包含专家对双碳政策、新钢种研发趋势的深度解读。', icon: 'book' }
                ]
            }
        ],
        deliverables: [
            { title: '企业对标诊断报告.pdf', desc: '输入企业自身数据，自动生成与行业基准的差异分析报告。', type: 'chart' },
            { title: '行业质量基准数据库', desc: '有效期内的在线BI系统访问权限，支持自定义查询各钢种指标。', type: 'dashboard' },
            { title: '2025行业蓝皮书(电子版)', desc: '包含完整图文分析的数字化出版物（300页+），支持全文检索。', type: 'report' },
            { title: '季度趋势增量包', desc: '每季度推送最新的行业数据增量包与简报。', type: 'model' }
        ],
        dataPreview: {
            columns: [
                { key: 'category', label: '对标维度 (Dimension)' },
                { key: 'metric', label: '关键指标 (Metric)' },
                { key: 'benchmark', label: '行业标杆值 (Top 10%)' },
                { key: 'industry_avg', label: '行业平均 (Avg)' },
                { key: 'insight', label: '提升方向 (Recommendation)' }
            ],
            rows: [
                { category: '尺寸精度', metric: '汽车板厚度Cpk', benchmark: <span className="text-blue-600 font-bold">1.67</span>, industry_avg: '1.33', insight: '建议引入精轧机架液压AGC前馈模型' },
                { category: '表面质量', metric: 'O5板合格率', benchmark: <span className="text-blue-600 font-bold">96.5%</span>, industry_avg: '92.1%', insight: '需加强连退炉辊表面涂层管理' },
                { category: '性能稳定性', metric: '屈服强度波动', benchmark: <span className="text-blue-600 font-bold">±10MPa</span>, industry_avg: '±25MPa', insight: '优化热轧卷取温度(CT)控制精度' },
            ]
        },
        compliance: {
            text: '所有基准数据均源自行业协会授权采集及公开年报，经过严格的宏观统计脱敏处理（K-Anonymity），不包含任何单一企业的敏感商业信息。符合《数据安全法》及行业统计规范。',
            tags: ['行业协会授权', '统计脱敏', '合规出版']
        },
        pricing: {
            saas: { 
                price: '9,800', 
                unit: '/ 年', 
                features: ['在线阅读全本', 'BI对标查询', '季度数据更新'],
                quota: { tokens: 50000, storage: 200, users: 10 },
                monthlyDiscount: 100,
                yearlyDiscount: 80
            },
            buyout: { 
                price: '50,000', 
                unit: '/ 永久', 
                features: ['离线数据库', '企业内部分发权', '首席分析师解读会'],
                quota: { tokens: 2000000, storage: 2000, users: '不限' }
            }
        },
        meta: { publishDate: '2025-04-01', downloads: 856 },
        related: ['1', '3']
    },
    '3': {
        id: '3',
        type: 'method',
        category: '能源电力 · 预测维护',
        title: '高炉热力学对象图谱',
        provider: '宝信软件 (Baosight)',
        rating: 4.5,
        reviewCount: 12,
        version: 'v1.0',
        versions: ['v1.0'],
        tags: ['方法智能体', '数字孪生'],
        detailsModules: [
            { 
                id: 'm1', 
                type: 'text', 
                content: '定义了高炉炼铁过程中的核心实体关系。包含：炉腹、炉腰、炉身温度场结构定义。' 
            },
            {
                id: 'm2', 
                type: 'features-grid',
                title: '核心能力',
                data: [
                    { title: '温度场建模', desc: '基于热力学公式的三维温度场重构。', icon: 'fire' },
                    { title: '炉壁侵蚀预测', desc: '结合历史检修数据的侵蚀速率估算。', icon: 'alert' }
                ]
            }
        ],
        deliverables: [],
        dataPreview: { columns: [], rows: [] },
        compliance: { text: '', tags: [] },
        pricing: { 
            saas: { 
                price: '199', 
                unit: '/ 月', 
                features: [],
                quota: { tokens: 10000, storage: 50, users: 5 },
                monthlyDiscount: 100,
                yearlyDiscount: 80
            }, 
            buyout: { 
                price: '20,000', 
                unit: '/ 永久', 
                features: [],
                quota: { tokens: 500000, storage: 500, users: '不限' }
            } 
        },
        meta: { publishDate: '2026-02-14', downloads: 89 },
        related: ['1', '2']
    }
};
