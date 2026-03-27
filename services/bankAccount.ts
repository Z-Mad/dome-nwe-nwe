// bankAccount.ts
import { get } from '../utils/request'
import type { ApiResponse } from '@/types'
/**
 * 平台银行账户信息
 */
export interface BankAccountVO {
  id: number // 主键ID
  account: string // 平台账户
  accountName: string // 平台账户名称
  bank: string // 平台开户银行
  defaultAccount: number // 是否为默认账户(0：不是 1：是)
  [key: string]: any
}



/**
 * 获取默认平台银行账户
 */
export const getDefaultBankAccount = () => {
  return get<ApiResponse<BankAccountVO>>(`${__SCS_MARKET_CENTER__}/bankAccount/getDefault`)
}

/**
 * 获取所有正常状态的平台银行账户列表
 */
export const listAllBankAccounts = () => {
  return get<ApiResponse<BankAccountVO[]>>(`${__SCS_MARKET_CENTER__}/bankAccount/listAll`)
}