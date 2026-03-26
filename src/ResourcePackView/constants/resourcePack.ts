// constants/resourcePack.ts
import React from 'react'
import { Cpu, Database, FileText, RefreshCcw, ShieldAlert, HelpCircle } from 'lucide-react'
import type { ResourceTypeConfig, DurationOption, RuleTab } from '../types/resourcePack'

export const CONFIG_OPTIONS: Record<'token' | 'storage', ResourceTypeConfig> = {
  token: {
    label: '算力/Tok en包',
    unit: 'k Tokens',
    icon: React.createElement(Cpu, { size: 18 }),
    desc: '适用于所有大语言模型类智能体，抵扣对话、推理产生的 Token 消耗。',
    quotas: [
      { value: 1000, label: '100万 Tokens', price: 99 },
      { value: 5000, label: '500万 Tokens', price: 399, tag: '推荐' },
      { value: 10000, label: '1000万 Tokens', price: 699 },
      { value: 50000, label: '5000万 Tokens', price: 2999 },
      { value: 100000, label: '1亿 Tokens', price: 4999, tag: '企业' },
    ],
  },
  storage: {
    label: '存储/数据库包',
    unit: 'GB',
    icon: React.createElement(Database, { size: 18 }),
    desc: '用于扩展私有化部署模型的向量数据库容量或归档历史生产数据。',
    quotas: [
      { value: 100, label: '100 GB', price: 49 },
      { value: 500, label: '500 GB', price: 199 },
      { value: 1024, label: '1 TB', price: 299, tag: '热销' },
      { value: 5120, label: '5 TB', price: 1299 },
    ],
  },
}

export const DURATIONS: DurationOption[] = [
  { value: 6, label: '6个月', multiplier: 1 },
  { value: 12, label: '1年', multiplier: 1.8, tag: '8.3折' },
]

export const RULES_CONTENT: RuleTab[] = [
  {
    id: 'instructions',
    label: '购买说明',
    icon: React.createElement(FileText, { size: 16 }),
    content: (
      <ul className="list-disc pl-5 space-y-2 text-xs text-gray-600 leading-relaxed">
        <li>资源包购买后立即生效，有效期自购买之日起计算。</li>
        <li>
          <strong>叠加规则：</strong>
          支持购买多个同类型或不同类型的资源包，额度将累加，有效期以各资源包独立时间为准。
        </li>
        <li>
          <strong>适用范围：</strong>
          Token包通用于所有接入标准API的智能体；存储包仅限私有化部署或需独立数据库的实例。
        </li>
        <li>企业认证用户购买大额资源包（单笔满 ¥10,000）可申请增值税专用发票。</li>
      </ul>
    ),
  },
  {
    id: 'deduction',
    label: '抵扣规则',
    icon: React.createElement(RefreshCcw, { size: 16 }),
    content: (
      <ul className="list-disc pl-5 space-y-2 text-xs text-gray-600 leading-relaxed">
        <li>
          <strong>抵扣顺序：</strong>系统优先抵扣即将过期的资源包额度（先到期先扣）。
        </li>
        <li>
          <strong>混合支付：</strong>
          当资源包额度不足时，超出部分将自动按照“按量付费”标准从账户余额中扣除。
        </li>
        <li>
          <strong>余额逻辑：</strong>
          平台没有充值功能，自动从已关联的企业对公账户或个人签约账户扣除。
        </li>
        <li className="text-red-500">若从关联账户扣除失败，则该订单自动失效。</li>
      </ul>
    ),
  },
  {
    id: 'refund',
    label: '退订规则',
    icon: React.createElement(ShieldAlert, { size: 16 }),
    content: (
      <ul className="list-disc pl-5 space-y-2 text-xs text-gray-600 leading-relaxed">
        <li>
          <strong>五天无理由：</strong>购买后5天内且未使用任何额度，支持全额退款。
        </li>
        <li>
          <strong>非全额退款：</strong>
          已使用部分额度或超过5天，不支持退款。特殊情况请提交工单申请，将收取15%手续费。
        </li>
        <li>活动赠送的资源包不支持退现或转让。</li>
      </ul>
    ),
  },
  {
    id: 'tips',
    label: '温馨提示',
    icon: React.createElement(HelpCircle, { size: 16 }),
    content: (
      <div className="space-y-2 text-xs text-gray-600 leading-relaxed">
        <p>
          1. 请在购买前确认您的实例运行状态正常，挂载至“已过期”或“已冻结”实例可能导致服务无法立刻恢复。
        </p>
        <p>
          2. 系统已自动开启<strong>“余额预警”</strong>
          功能。当资源包剩余额度低于20%时，系统将发送短信提醒，您可以在个人中心的订单管理中查看预警详情。
        </p>
        <p className="text-orange-600 font-bold">
          3. 严禁利用平台资源进行挖矿或其他违规计算行为，一经发现将封禁账号。
        </p>
      </div>
    ),
  },
]