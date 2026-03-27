

## 创建资源包订单


**接口地址**:`/order/createResourcePackOrder`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "amount": 0,
  "buyType": 0,
  "exampleId": 0,
  "goodsList": [
    {
      "buyQuantity": 0,
      "deadline": 0,
      "goodsCode": "",
      "goodsDesc": "",
      "goodsId": 0,
      "goodsName": "",
      "goodsType": 0,
      "price": 0,
      "quantity": 0,
      "totalAmount": 0,
      "unit": 0
    }
  ],
  "payAmount": 0,
  "remark": "",
  "tenantId": "",
  "tenantName": "",
  "userId": 0,
  "userName": ""
}
```


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|dto|dto|body|true|资源包订单创建DTO（支持多商品）|资源包订单创建DTO（支持多商品）|
|&emsp;&emsp;amount|订单总金额||true|number||
|&emsp;&emsp;buyType|购买类型（1：新购订单 2：续费订单 3：试用订单）||true|integer(int32)||
|&emsp;&emsp;exampleId|实例ID||false|integer(int64)||
|&emsp;&emsp;goodsList|资源包商品列表（支持多个商品）||true|array|资源包商品项DTO|
|&emsp;&emsp;&emsp;&emsp;buyQuantity|购买数量||true|integer||
|&emsp;&emsp;&emsp;&emsp;deadline|有效期 1-6个月 2-1年||true|integer||
|&emsp;&emsp;&emsp;&emsp;goodsCode|商品编码||true|string||
|&emsp;&emsp;&emsp;&emsp;goodsDesc|商品描述||false|string||
|&emsp;&emsp;&emsp;&emsp;goodsId|商品ID||true|integer||
|&emsp;&emsp;&emsp;&emsp;goodsName|商品名称||true|string||
|&emsp;&emsp;&emsp;&emsp;goodsType|商品类型 1-token包 2-数据存储包||true|integer||
|&emsp;&emsp;&emsp;&emsp;price|单价||true|number||
|&emsp;&emsp;&emsp;&emsp;quantity|资源数量||true|integer||
|&emsp;&emsp;&emsp;&emsp;totalAmount|该商品项总金额||true|number||
|&emsp;&emsp;&emsp;&emsp;unit|资源单位 1-tokens 2-GB||true|integer||
|&emsp;&emsp;payAmount|支付金额||true|number||
|&emsp;&emsp;remark|订单备注||false|string||
|&emsp;&emsp;tenantId|租户ID||false|string||
|&emsp;&emsp;tenantName|租户名称||true|string||
|&emsp;&emsp;userId|用户ID||false|integer(int64)||
|&emsp;&emsp;userName|用户名称||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«string»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|data|承载数据|string||
|msg|返回消息|string||
|success|是否成功|boolean||


**响应示例**:
```javascript
{
	"code": 0,
	"data": "",
	"msg": "",
	"success": true
}
```



## 取消订单


**接口地址**:`/order/cancel/{orderId}`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|orderId|订单ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«boolean»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|data|承载数据|boolean||
|msg|返回消息|string||
|success|是否成功|boolean||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"msg": "",
	"success": true
}
```


## 创建应用订单


**接口地址**:`/order/createAppOrder`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "amount": 0,
  "buyType": 0,
  "exampleId": 0,
  "goodsList": [
    {
      "applicationSkuCurrentVersion": "",
      "applicationSkuId": 0,
      "applicationSkuName": "",
      "commodityAmount": 0,
      "initialInstallationFee": 0,
      "licenseType": 0,
      "paymentStrategy": "",
      "remark": "",
      "resourcePackageFee": 0,
      "riskControlStrategy": "",
      "trial": 0
    }
  ],
  "payAmount": 0,
  "remark": "",
  "tenantId": "",
  "tenantName": "",
  "userId": 0,
  "userName": ""
}
```


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|dto|dto|body|true|应用订单创建DTO（支持多商品）|应用订单创建DTO（支持多商品）|
|&emsp;&emsp;amount|订单总金额||true|number||
|&emsp;&emsp;buyType|购买类型（1：新购订单 2：续费订单 3：试用订单）||true|integer(int32)||
|&emsp;&emsp;exampleId|实例ID||false|integer(int64)||
|&emsp;&emsp;goodsList|应用商品列表（支持多个应用）||true|array|应用商品项DTO|
|&emsp;&emsp;&emsp;&emsp;applicationSkuCurrentVersion|应用SKU当前版本||true|string||
|&emsp;&emsp;&emsp;&emsp;applicationSkuId|应用SKU ID||true|integer||
|&emsp;&emsp;&emsp;&emsp;applicationSkuName|应用SKU名称||true|string||
|&emsp;&emsp;&emsp;&emsp;commodityAmount|商品总金额||true|number||
|&emsp;&emsp;&emsp;&emsp;initialInstallationFee|初始安装费||false|number||
|&emsp;&emsp;&emsp;&emsp;licenseType|授权类型 1-按月 2-按季 3-按年 4-永久||true|integer||
|&emsp;&emsp;&emsp;&emsp;paymentStrategy|付费策略||true|string||
|&emsp;&emsp;&emsp;&emsp;remark|备注||false|string||
|&emsp;&emsp;&emsp;&emsp;resourcePackageFee|资源包费用||false|number||
|&emsp;&emsp;&emsp;&emsp;riskControlStrategy|风控策略||true|string||
|&emsp;&emsp;&emsp;&emsp;trial|试用标识 0-非试用 1-试用||true|integer||
|&emsp;&emsp;payAmount|支付金额||true|number||
|&emsp;&emsp;remark|订单备注||false|string||
|&emsp;&emsp;tenantId|租户ID||false|string||
|&emsp;&emsp;tenantName|租户名称||true|string||
|&emsp;&emsp;userId|用户ID||false|integer(int64)||
|&emsp;&emsp;userName|用户名称||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«string»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|data|承载数据|string||
|msg|返回消息|string||
|success|是否成功|boolean||


**响应示例**:
```javascript
{
	"code": 0,
	"data": "",
	"msg": "",
	"success": true
}
```


## 删除订单


**接口地址**:`/order/deleted/{orderId}`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|orderId|订单ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«boolean»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|data|承载数据|boolean||
|msg|返回消息|string||
|success|是否成功|boolean||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"msg": "",
	"success": true
}
```


## 获取订单详情


**接口地址**:`/order/detail/{orderId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|orderId|订单ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«订单VO»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|data|承载数据|订单VO|订单VO|
|&emsp;&emsp;actualPayAmount|实际支付金额|number||
|&emsp;&emsp;amount|订单总金额|number||
|&emsp;&emsp;billingStatus|开票状态（0：待开票 1：开票中 2：已开票）|integer(int32)||
|&emsp;&emsp;buyType|购买类型（1：新购订单 2：续费订单 3：试用订单）|integer(int32)||
|&emsp;&emsp;commodityList|应用订单商品列表|array|订单商品详情VO（应用市场）|
|&emsp;&emsp;&emsp;&emsp;applicationSkuCurrentVersion|应用SKU当前版本|string||
|&emsp;&emsp;&emsp;&emsp;applicationSkuId|应用SKU ID|integer||
|&emsp;&emsp;&emsp;&emsp;applicationSkuName|应用SKU名称|string||
|&emsp;&emsp;&emsp;&emsp;commodityAmount|商品总金额|number||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;endTime|授权结束时间|string||
|&emsp;&emsp;&emsp;&emsp;exampleId|实例ID|integer||
|&emsp;&emsp;&emsp;&emsp;id|ID|integer||
|&emsp;&emsp;&emsp;&emsp;initialInstallationFee|初始安装费|number||
|&emsp;&emsp;&emsp;&emsp;licenseDays|授权天数|integer||
|&emsp;&emsp;&emsp;&emsp;licenseType|授权类型 1-按月 2-按季 3-按年 4-永久|integer||
|&emsp;&emsp;&emsp;&emsp;orderId|订单ID|integer||
|&emsp;&emsp;&emsp;&emsp;orderNo|订单编号|string||
|&emsp;&emsp;&emsp;&emsp;paymentStrategy|付费策略|string||
|&emsp;&emsp;&emsp;&emsp;remark|备注|string||
|&emsp;&emsp;&emsp;&emsp;resourcePackageFee|资源包费用|number||
|&emsp;&emsp;&emsp;&emsp;riskControlStrategy|风控策略|string||
|&emsp;&emsp;&emsp;&emsp;startTime|授权开始时间|string||
|&emsp;&emsp;&emsp;&emsp;tenantId|租户ID|string||
|&emsp;&emsp;&emsp;&emsp;trial|试用标识 0-非试用 1-试用|integer||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;userId|用户ID|integer||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;exampleId|实例ID|integer(int64)||
|&emsp;&emsp;expansionPackList|资源包订单商品列表|array|订单商品详情VO（资源包）|
|&emsp;&emsp;&emsp;&emsp;buyQuantity|购买数量|integer||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;deadline|有效期 1-6个月 2-1年|integer||
|&emsp;&emsp;&emsp;&emsp;endTime|生效结束时间|string||
|&emsp;&emsp;&emsp;&emsp;goodsCode|商品编码|string||
|&emsp;&emsp;&emsp;&emsp;goodsDesc|商品描述|string||
|&emsp;&emsp;&emsp;&emsp;goodsId|商品ID|integer||
|&emsp;&emsp;&emsp;&emsp;goodsName|商品名称|string||
|&emsp;&emsp;&emsp;&emsp;goodsType|商品类型 1-token包 2-数据存储包|integer||
|&emsp;&emsp;&emsp;&emsp;id|ID|integer||
|&emsp;&emsp;&emsp;&emsp;orderId|订单ID|integer||
|&emsp;&emsp;&emsp;&emsp;orderNo|订单编号|string||
|&emsp;&emsp;&emsp;&emsp;price|价格|number||
|&emsp;&emsp;&emsp;&emsp;quantity|资源数量|integer||
|&emsp;&emsp;&emsp;&emsp;startTime|生效开始时间|string||
|&emsp;&emsp;&emsp;&emsp;totalAmount|总金额|number||
|&emsp;&emsp;&emsp;&emsp;unit|资源单位 1-tokens 2-GB|integer||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;id|订单ID|integer(int64)||
|&emsp;&emsp;logList|订单操作日志列表|array|订单日志VO|
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;id|主键ID|integer||
|&emsp;&emsp;&emsp;&emsp;logType|日志类型（0：待支付 1:待创建实例 2: 已取消 3：已完成 99:已删除）|integer||
|&emsp;&emsp;&emsp;&emsp;logTypeDesc|日志类型描述|string||
|&emsp;&emsp;&emsp;&emsp;operateUserId|操作人ID|integer||
|&emsp;&emsp;&emsp;&emsp;operateUserName|操作人名称|string||
|&emsp;&emsp;&emsp;&emsp;orderId|订单表主键|integer||
|&emsp;&emsp;&emsp;&emsp;orderNo|订单编号|string||
|&emsp;&emsp;orderNo|订单编号|string||
|&emsp;&emsp;orderType|订单类型 1-资源包订单 2-应用订单|integer(int32)||
|&emsp;&emsp;payAmount|支付金额|number||
|&emsp;&emsp;payType|支付方式(0:支付宝 1：微信 2：云闪付 3：线下支付 )|integer(int32)||
|&emsp;&emsp;status|订单状态 0-待支付 1-待创建实例 2-已取消 3-已完成|integer(int32)||
|&emsp;&emsp;tenantId|租户ID|string||
|&emsp;&emsp;tenantName|租户名称|string||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|&emsp;&emsp;userId|用户ID|integer(int64)||
|&emsp;&emsp;userName|用户名称|string||
|msg|返回消息|string||
|success|是否成功|boolean||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"actualPayAmount": 0,
		"amount": 0,
		"billingStatus": 0,
		"buyType": 0,
		"commodityList": [
			{
				"applicationSkuCurrentVersion": "",
				"applicationSkuId": 0,
				"applicationSkuName": "",
				"commodityAmount": 0,
				"createTime": "",
				"endTime": "",
				"exampleId": 0,
				"id": 0,
				"initialInstallationFee": 0,
				"licenseDays": 0,
				"licenseType": 0,
				"orderId": 0,
				"orderNo": "",
				"paymentStrategy": "",
				"remark": "",
				"resourcePackageFee": 0,
				"riskControlStrategy": "",
				"startTime": "",
				"tenantId": "",
				"trial": 0,
				"updateTime": "",
				"userId": 0
			}
		],
		"createTime": "",
		"exampleId": 0,
		"expansionPackList": [
			{
				"buyQuantity": 0,
				"createTime": "",
				"deadline": 0,
				"endTime": "",
				"goodsCode": "",
				"goodsDesc": "",
				"goodsId": 0,
				"goodsName": "",
				"goodsType": 0,
				"id": 0,
				"orderId": 0,
				"orderNo": "",
				"price": 0,
				"quantity": 0,
				"startTime": "",
				"totalAmount": 0,
				"unit": 0,
				"updateTime": ""
			}
		],
		"id": 0,
		"logList": [
			{
				"createTime": "",
				"id": 0,
				"logType": 0,
				"logTypeDesc": "",
				"operateUserId": 0,
				"operateUserName": "",
				"orderId": 0,
				"orderNo": ""
			}
		],
		"orderNo": "",
		"orderType": 0,
		"payAmount": 0,
		"payType": 0,
		"status": 0,
		"tenantId": "",
		"tenantName": "",
		"updateTime": "",
		"userId": 0,
		"userName": ""
	},
	"msg": "",
	"success": true
}
```


## 根据订单编号获取订单详情


**接口地址**:`/order/getOrderDetailByNo`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|orderNo|订单编号|query|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«订单VO»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|data|承载数据|订单VO|订单VO|
|&emsp;&emsp;actualPayAmount|实际支付金额|number||
|&emsp;&emsp;amount|订单总金额|number||
|&emsp;&emsp;billingStatus|开票状态（0：待开票 1：开票中 2：已开票）|integer(int32)||
|&emsp;&emsp;buyType|购买类型（1：新购订单 2：续费订单 3：试用订单）|integer(int32)||
|&emsp;&emsp;commodityList|应用订单商品列表|array|订单商品详情VO（应用市场）|
|&emsp;&emsp;&emsp;&emsp;applicationSkuCurrentVersion|应用SKU当前版本|string||
|&emsp;&emsp;&emsp;&emsp;applicationSkuId|应用SKU ID|integer||
|&emsp;&emsp;&emsp;&emsp;applicationSkuName|应用SKU名称|string||
|&emsp;&emsp;&emsp;&emsp;commodityAmount|商品总金额|number||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;endTime|授权结束时间|string||
|&emsp;&emsp;&emsp;&emsp;exampleId|实例ID|integer||
|&emsp;&emsp;&emsp;&emsp;id|ID|integer||
|&emsp;&emsp;&emsp;&emsp;initialInstallationFee|初始安装费|number||
|&emsp;&emsp;&emsp;&emsp;licenseDays|授权天数|integer||
|&emsp;&emsp;&emsp;&emsp;licenseType|授权类型 1-按月 2-按季 3-按年 4-永久|integer||
|&emsp;&emsp;&emsp;&emsp;orderId|订单ID|integer||
|&emsp;&emsp;&emsp;&emsp;orderNo|订单编号|string||
|&emsp;&emsp;&emsp;&emsp;paymentStrategy|付费策略|string||
|&emsp;&emsp;&emsp;&emsp;remark|备注|string||
|&emsp;&emsp;&emsp;&emsp;resourcePackageFee|资源包费用|number||
|&emsp;&emsp;&emsp;&emsp;riskControlStrategy|风控策略|string||
|&emsp;&emsp;&emsp;&emsp;startTime|授权开始时间|string||
|&emsp;&emsp;&emsp;&emsp;tenantId|租户ID|string||
|&emsp;&emsp;&emsp;&emsp;trial|试用标识 0-非试用 1-试用|integer||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;userId|用户ID|integer||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;exampleId|实例ID|integer(int64)||
|&emsp;&emsp;expansionPackList|资源包订单商品列表|array|订单商品详情VO（资源包）|
|&emsp;&emsp;&emsp;&emsp;buyQuantity|购买数量|integer||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;deadline|有效期 1-6个月 2-1年|integer||
|&emsp;&emsp;&emsp;&emsp;endTime|生效结束时间|string||
|&emsp;&emsp;&emsp;&emsp;goodsCode|商品编码|string||
|&emsp;&emsp;&emsp;&emsp;goodsDesc|商品描述|string||
|&emsp;&emsp;&emsp;&emsp;goodsId|商品ID|integer||
|&emsp;&emsp;&emsp;&emsp;goodsName|商品名称|string||
|&emsp;&emsp;&emsp;&emsp;goodsType|商品类型 1-token包 2-数据存储包|integer||
|&emsp;&emsp;&emsp;&emsp;id|ID|integer||
|&emsp;&emsp;&emsp;&emsp;orderId|订单ID|integer||
|&emsp;&emsp;&emsp;&emsp;orderNo|订单编号|string||
|&emsp;&emsp;&emsp;&emsp;price|价格|number||
|&emsp;&emsp;&emsp;&emsp;quantity|资源数量|integer||
|&emsp;&emsp;&emsp;&emsp;startTime|生效开始时间|string||
|&emsp;&emsp;&emsp;&emsp;totalAmount|总金额|number||
|&emsp;&emsp;&emsp;&emsp;unit|资源单位 1-tokens 2-GB|integer||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;id|订单ID|integer(int64)||
|&emsp;&emsp;logList|订单操作日志列表|array|订单日志VO|
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;id|主键ID|integer||
|&emsp;&emsp;&emsp;&emsp;logType|日志类型（0：待支付 1:待创建实例 2: 已取消 3：已完成 99:已删除）|integer||
|&emsp;&emsp;&emsp;&emsp;logTypeDesc|日志类型描述|string||
|&emsp;&emsp;&emsp;&emsp;operateUserId|操作人ID|integer||
|&emsp;&emsp;&emsp;&emsp;operateUserName|操作人名称|string||
|&emsp;&emsp;&emsp;&emsp;orderId|订单表主键|integer||
|&emsp;&emsp;&emsp;&emsp;orderNo|订单编号|string||
|&emsp;&emsp;orderNo|订单编号|string||
|&emsp;&emsp;orderType|订单类型 1-资源包订单 2-应用订单|integer(int32)||
|&emsp;&emsp;payAmount|支付金额|number||
|&emsp;&emsp;payType|支付方式(0:支付宝 1：微信 2：云闪付 3：线下支付 )|integer(int32)||
|&emsp;&emsp;status|订单状态 0-待支付 1-待创建实例 2-已取消 3-已完成|integer(int32)||
|&emsp;&emsp;tenantId|租户ID|string||
|&emsp;&emsp;tenantName|租户名称|string||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|&emsp;&emsp;userId|用户ID|integer(int64)||
|&emsp;&emsp;userName|用户名称|string||
|msg|返回消息|string||
|success|是否成功|boolean||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"actualPayAmount": 0,
		"amount": 0,
		"billingStatus": 0,
		"buyType": 0,
		"commodityList": [
			{
				"applicationSkuCurrentVersion": "",
				"applicationSkuId": 0,
				"applicationSkuName": "",
				"commodityAmount": 0,
				"createTime": "",
				"endTime": "",
				"exampleId": 0,
				"id": 0,
				"initialInstallationFee": 0,
				"licenseDays": 0,
				"licenseType": 0,
				"orderId": 0,
				"orderNo": "",
				"paymentStrategy": "",
				"remark": "",
				"resourcePackageFee": 0,
				"riskControlStrategy": "",
				"startTime": "",
				"tenantId": "",
				"trial": 0,
				"updateTime": "",
				"userId": 0
			}
		],
		"createTime": "",
		"exampleId": 0,
		"expansionPackList": [
			{
				"buyQuantity": 0,
				"createTime": "",
				"deadline": 0,
				"endTime": "",
				"goodsCode": "",
				"goodsDesc": "",
				"goodsId": 0,
				"goodsName": "",
				"goodsType": 0,
				"id": 0,
				"orderId": 0,
				"orderNo": "",
				"price": 0,
				"quantity": 0,
				"startTime": "",
				"totalAmount": 0,
				"unit": 0,
				"updateTime": ""
			}
		],
		"id": 0,
		"logList": [
			{
				"createTime": "",
				"id": 0,
				"logType": 0,
				"logTypeDesc": "",
				"operateUserId": 0,
				"operateUserName": "",
				"orderId": 0,
				"orderNo": ""
			}
		],
		"orderNo": "",
		"orderType": 0,
		"payAmount": 0,
		"payType": 0,
		"status": 0,
		"tenantId": "",
		"tenantName": "",
		"updateTime": "",
		"userId": 0,
		"userName": ""
	},
	"msg": "",
	"success": true
}
```


## 获取用户订单列表


**接口地址**:`/order/getUserOrderList`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "page": 0,
  "pageSize": 0,
  "searchMessage": "",
  "status": 0
}
```


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|dto|dto|body|true|资源扩展包查询条件DTO_1|资源扩展包查询条件DTO_1|
|&emsp;&emsp;page|||true|integer(int32)||
|&emsp;&emsp;pageSize|||true|integer(int32)||
|&emsp;&emsp;searchMessage|搜索内容||false|string||
|&emsp;&emsp;status|订单状态||false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«Page«订单基础数据VO»»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|data|承载数据|Page«订单基础数据VO»|Page«订单基础数据VO»|
|&emsp;&emsp;countId||string||
|&emsp;&emsp;current||integer(int64)||
|&emsp;&emsp;maxLimit||integer(int64)||
|&emsp;&emsp;optimizeCountSql||boolean||
|&emsp;&emsp;orders||array|OrderItem|
|&emsp;&emsp;&emsp;&emsp;asc||boolean||
|&emsp;&emsp;&emsp;&emsp;column||string||
|&emsp;&emsp;pages||integer(int64)||
|&emsp;&emsp;records||array|订单基础数据VO|
|&emsp;&emsp;&emsp;&emsp;actualPayAmount|实际支付金额|number||
|&emsp;&emsp;&emsp;&emsp;amount|订单总金额|number||
|&emsp;&emsp;&emsp;&emsp;billingStatus|开票状态（0：待开票 1：开票中 2：已开票）|integer||
|&emsp;&emsp;&emsp;&emsp;buyType|购买类型（1：新购订单 2：续费订单 3：试用订单）|integer||
|&emsp;&emsp;&emsp;&emsp;commodityList|应用订单商品列表|array|订单商品详情VO（应用市场）|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;applicationSkuCurrentVersion|应用SKU当前版本|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;applicationSkuId|应用SKU ID|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;applicationSkuName|应用SKU名称|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;commodityAmount|商品总金额|number||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;endTime|授权结束时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;exampleId|实例ID|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id|ID|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;initialInstallationFee|初始安装费|number||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;licenseDays|授权天数|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;licenseType|授权类型 1-按月 2-按季 3-按年 4-永久|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;orderId|订单ID|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;orderNo|订单编号|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;paymentStrategy|付费策略|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;remark|备注|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;resourcePackageFee|资源包费用|number||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;riskControlStrategy|风控策略|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;startTime|授权开始时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tenantId|租户ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;trial|试用标识 0-非试用 1-试用|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userId|用户ID|integer||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;exampleId|实例ID|integer||
|&emsp;&emsp;&emsp;&emsp;expansionPackList|资源包订单商品列表|array|订单商品详情VO（资源包）|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;buyQuantity|购买数量|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;deadline|有效期 1-6个月 2-1年|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;endTime|生效结束时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;goodsCode|商品编码|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;goodsDesc|商品描述|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;goodsId|商品ID|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;goodsName|商品名称|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;goodsType|商品类型 1-token包 2-数据存储包|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id|ID|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;orderId|订单ID|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;orderNo|订单编号|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;price|价格|number||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;quantity|资源数量|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;startTime|生效开始时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;totalAmount|总金额|number||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;unit|资源单位 1-tokens 2-GB|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;id|订单ID|integer||
|&emsp;&emsp;&emsp;&emsp;orderNo|订单编号|string||
|&emsp;&emsp;&emsp;&emsp;orderType|订单类型 1-资源包订单 2-应用订单|integer||
|&emsp;&emsp;&emsp;&emsp;payAmount|支付金额|number||
|&emsp;&emsp;&emsp;&emsp;payType|支付方式(0:支付宝 1：微信 2：云闪付 3：线下支付 )|integer||
|&emsp;&emsp;&emsp;&emsp;status|订单状态 0-待支付 1-待创建实例 2-已取消 3-已完成|integer||
|&emsp;&emsp;searchCount||boolean||
|&emsp;&emsp;size||integer(int64)||
|&emsp;&emsp;total||integer(int64)||
|msg|返回消息|string||
|success|是否成功|boolean||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"countId": "",
		"current": 0,
		"maxLimit": 0,
		"optimizeCountSql": true,
		"orders": [
			{
				"asc": true,
				"column": ""
			}
		],
		"pages": 0,
		"records": [
			{
				"actualPayAmount": 0,
				"amount": 0,
				"billingStatus": 0,
				"buyType": 0,
				"commodityList": [
					{
						"applicationSkuCurrentVersion": "",
						"applicationSkuId": 0,
						"applicationSkuName": "",
						"commodityAmount": 0,
						"createTime": "",
						"endTime": "",
						"exampleId": 0,
						"id": 0,
						"initialInstallationFee": 0,
						"licenseDays": 0,
						"licenseType": 0,
						"orderId": 0,
						"orderNo": "",
						"paymentStrategy": "",
						"remark": "",
						"resourcePackageFee": 0,
						"riskControlStrategy": "",
						"startTime": "",
						"tenantId": "",
						"trial": 0,
						"updateTime": "",
						"userId": 0
					}
				],
				"createTime": "",
				"exampleId": 0,
				"expansionPackList": [
					{
						"buyQuantity": 0,
						"createTime": "",
						"deadline": 0,
						"endTime": "",
						"goodsCode": "",
						"goodsDesc": "",
						"goodsId": 0,
						"goodsName": "",
						"goodsType": 0,
						"id": 0,
						"orderId": 0,
						"orderNo": "",
						"price": 0,
						"quantity": 0,
						"startTime": "",
						"totalAmount": 0,
						"unit": 0,
						"updateTime": ""
					}
				],
				"id": 0,
				"orderNo": "",
				"orderType": 0,
				"payAmount": 0,
				"payType": 0,
				"status": 0
			}
		],
		"searchCount": true,
		"size": 0,
		"total": 0
	},
	"msg": "",
	"success": true
}
```


## 线下支付订单


**接口地址**:`/order/offlinePay`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "bankTransactionNumber": "",
  "mark": "",
  "orderId": 0,
  "payAccount": "",
  "payAmount": 0,
  "payBank": "",
  "payName": "",
  "payTime": "",
  "receiveAccount": "",
  "receiveBank": "",
  "receiveName": "",
  "voucherUrl": ""
}
```


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|dto|dto|body|true|线下支付订单DTO|线下支付订单DTO|
|&emsp;&emsp;bankTransactionNumber|银行流水号||true|string||
|&emsp;&emsp;mark|备注||false|string||
|&emsp;&emsp;orderId|订单ID||true|integer(int64)||
|&emsp;&emsp;payAccount|付款账户||true|string||
|&emsp;&emsp;payAmount|支付金额||true|number||
|&emsp;&emsp;payBank|付款银行||true|string||
|&emsp;&emsp;payName|付款人名称||true|string||
|&emsp;&emsp;payTime|付款时间||true|string(date-time)||
|&emsp;&emsp;receiveAccount|收款账户||true|string||
|&emsp;&emsp;receiveBank|收款银行||true|string||
|&emsp;&emsp;receiveName|收款人名称||true|string||
|&emsp;&emsp;voucherUrl|支付凭证URL||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«boolean»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|data|承载数据|boolean||
|msg|返回消息|string||
|success|是否成功|boolean||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"msg": "",
	"success": true
}
```