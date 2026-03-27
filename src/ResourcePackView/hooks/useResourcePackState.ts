// hooks/useResourcePackData.ts
import { useState, useEffect, useCallback } from 'react'
import { getByGoodType,type GoodType } from '@/services/expansion-pack'
import  type {  QuotaOption, ResourceTypeConfig } from '../types/resourcePack'
import { convertToQuotas, getResourceTypeConfig } from '../utils/resourcePackConverter'
import { CONFIG_OPTIONS as fallbackConfig } from '../constants/resourcePack' // 备用静态配置

export const useResourcePackData = () => {
  const [goodsMap, setGoodsMap] = useState<Record<number, GoodType[]>>({ 1: [], 2: [] })
  const [loading, setLoading] = useState<Record<number, boolean>>({ 1: false, 2: false })
  const [error, setError] = useState<Record<number, string | null>>({ 1: null, 2: null })

  // 获取指定类型的商品列表
  const fetchGoods = useCallback(async (goodsType: number) => {
    if (goodsMap[goodsType]?.length > 0) return // 已缓存
    setLoading(prev => ({ ...prev, [goodsType]: true }))
    setError(prev => ({ ...prev, [goodsType]: null }))
    try {
      const res = await getByGoodType(goodsType)
      if (res.success && res.data) {
        setGoodsMap(prev => ({ ...prev, [goodsType]: res.data }))
      } else {
        throw new Error(res.msg || '获取商品列表失败')
      }
    } catch (err: any) {
      setError(prev => ({ ...prev, [goodsType]: err.message }))
    } finally {
      setLoading(prev => ({ ...prev, [goodsType]: false }))
    }
  }, [goodsMap])

  // 获取指定类型的配置（合并静态配置和动态数据）
  const getConfigForType = useCallback((goodsType: number): ResourceTypeConfig => {
    const staticCfg = goodsType === 1 ? fallbackConfig.token : fallbackConfig.storage
    const goods = goodsMap[goodsType] || []
    const quotas = convertToQuotas(goods)
    return {
      ...staticCfg,
      quotas: quotas.length ? quotas : staticCfg.quotas, // 如果接口无数据则使用静态
    }
  }, [goodsMap])

  return {
    goodsMap,
    loading,
    error,
    fetchGoods,
    getConfigForType,
  }
}