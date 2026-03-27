import React from 'react'

export type UserRole = 'admin' | 'developer' | 'viewer'

export interface Account {
  id: string
  name: string
  avatar: string
  role: UserRole
  orgName: string
  balance: string // Display string e.g., "¥ 45,200"
  numericBalance: number // For calculation
  permissions: {
    canPublish: boolean
    canManageFinance: boolean
    canViewAnalytics: boolean
  }
}
export interface ApiResponse<T> {
  data: T
  success: boolean
  msg: string
  code?: number
}
export enum ReportType {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  QUARTERLY = 'Quarterly',
  YEARLY = 'Yearly',
}

export enum DocType {
  PRODUCTION = 'production', // 产量/轧制力
  QUALITY = 'quality', // 质量/缺陷
  EQUIPMENT = 'equipment', // 设备/辊系
  ANALYSIS = 'analysis', // 综合分析
}

export interface ReportItem {
  id: string
  title: string
  date: string
  type: DocType
  status: 'ready' | 'processing' | 'alert'
}

export interface Message {
  id: string
  sender: 'user' | 'ai'
  content: string | React.ReactNode
  timestamp: Date
}

export interface RelatedRecord {
  id: string
  title: string
  category: string
  icon: string
}

export interface ThinkingMode {
  id: string
  label: string
  icon: any
  active: boolean
}

// New Types for User Profile Interactions
export interface Transaction {
  id: string
  type: 'income' | 'expense' | 'withdraw' | 'topup'
  amount: number
  date: string
  desc: string
  status: 'success' | 'pending' | 'failed'
}

export interface TrialConfig {
  enabled: boolean
  duration: number // in days or months
  durationUnit: 'day' | 'month'
  tokenLimit: number
  storageLimit: number
  installationFee?: number // Added installation fee for trial
}

export interface ResourceLicense {
  key: string
  type: 'saas' | 'perpetual' | 'trial'
  expiry: string
  maxNodes: number
  activeNodes: number
  trialConfig?: TrialConfig
}
