// types/resourcePack.ts
import { ReactNode } from 'react'

export interface QuotaOption {
  value: number
  label: string
  price: number
  tag?: string
}

export interface ResourceTypeConfig {
  label: string
  unit: string
  icon: ReactNode
  desc: string
  quotas: QuotaOption[]
}

export interface DurationOption {
  value: number
  label: string
  multiplier: number
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

export interface Order {
  id: string
  productName: string
  provider?: string
  status: string
  // ... other fields
}