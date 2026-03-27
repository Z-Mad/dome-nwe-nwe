import { get, post } from '../utils/request'
import type { ApiResponse } from '@/types'

export interface GoodType {
  	"deadline": number, //有效期 1-6个月 2-1年
    "goodsCode": string, //商品编码
    "goodsDesc": string, //商品描述
    "goodsName": string, //商品名称
    "goodsType": number, //商品类型 1-token包 2-数据存储包
    "id": number, //商品ID
    "price": number, //商品价格
    "quantity": number, //商品数量
    "recommendation": number, //是否推荐 0-推荐 1-不推荐
    "status": number, //状态 0-上架 1-下架 2-删除
    "unit": number //资源单位 1-tokens 2-GB
  [key: string]: any
}

/**
 * 通过商品类型查询资源扩展包商品列表
 * @param goodsType	商品类型 1-token包 2-数据存储包
 */
export const getByGoodType = (goodsType: number) => {
  return post<ApiResponse<GoodType>>(`${__SCS_MARKET_CENTER__}/expansion-pack/getByGoodType`, { goodsType })
}