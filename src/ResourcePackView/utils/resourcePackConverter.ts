// utils/resourcePackConverter.ts
import  type {  QuotaOption, ResourceTypeConfig } from '../types/resourcePack'
import { Cpu, Database } from 'lucide-react'
import type { GoodType } from '@/services/expansion-pack'
import React from 'react'
/**
/**
 * 将 API 返回的商品列表转换为组件需要的 QuotaOption 数组
 * @param goodsList 商品列表
 * @returns QuotaOption[]
 */
export const convertToQuotas = (goodsList: GoodType[]): QuotaOption[] => {
  return goodsList
    .filter(g => g.status === 0) // 只取上架商品
    .map(g => ({
      value: g.quantity,
      label: `${g.quantity}${g.unit === 1 ? '万 Tokens' : ' GB'}`,
      price: g.price,
      tag: g.recommendation === 0 ? '推荐' : undefined,
    }))
    .sort((a, b) => a.price - b.price) // 按价格排序
}

/**
 * 根据商品类型获取配置信息（图标、标签、描述等）
 */
export const getResourceTypeConfig = (goodsType: number): Pick<ResourceTypeConfig, 'label' | 'unit' | 'icon' | 'desc'> => {
  if (goodsType === 1) {
    return {
      label: '算力/Token包',
      unit: 'k Tokens',
     icon: React.createElement(Cpu, { size: 18 }),
      desc: '适用于所有大语言模型类智能体，抵扣对话、推理产生的 Token 消耗。',
    }
  }
  return {
    label: '存储/数据库包',
    unit: 'GB',
    icon: React.createElement(Database, { size: 18 }),
    desc: '用于扩展私有化部署模型的向量数据库容量或归档历史生产数据。',
  }
}