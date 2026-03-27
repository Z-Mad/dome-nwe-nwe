// types/resourcePack.ts
import { ReactNode } from 'react'

export interface QuotaOption {
  value: number        // 资源数量（tokens 或 GB）
  label: string        // 显示名称
  price: number        // 基准价格（元）
  tag?: string         // 标签，如“推荐”“热销”
}

export interface ResourceTypeConfig {
  label: string
  unit: string
  icon: ReactNode
  desc: string
  quotas: QuotaOption[]
}

export interface DurationOption {
  value: number        // 有效期值，如 6 表示 6 个月
  label: string        // 显示名称，如“6个月”
  multiplier: number   // 价格系数，如 1 或 1.8
  tag?: string
}

export interface CartItem {
  id: string
  type: 'token' | 'storage'
  name: string
  amount: number
  unit: string
  price: number
  validity: string
  quantity: number
  subtotal: number
}

export interface RuleTab {
  id: string
  label: string
  icon: ReactNode
  content: ReactNode
}

