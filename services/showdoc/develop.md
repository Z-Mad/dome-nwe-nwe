

## 根据条件获取发布应用列表


**接口地址**:`/develop/application/getListByCondition`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|name|name|query|true|string||
|status|status|query|true|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«List«PublishAgentVO»»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|data|承载数据|array|PublishAgentVO|
|&emsp;&emsp;agentId||integer(int64)||
|&emsp;&emsp;agentType||string||
|&emsp;&emsp;applicationPackageType||integer(int32)||
|&emsp;&emsp;configList||string||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;currentVersion||string||
|&emsp;&emsp;description||string||
|&emsp;&emsp;detailContent||string||
|&emsp;&emsp;developerId||integer(int64)||
|&emsp;&emsp;freeTrialConfig||string||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;industryCode||string||
|&emsp;&emsp;industryTypeCode||string||
|&emsp;&emsp;initialReleaseTime||string(date-time)||
|&emsp;&emsp;isFreeTrial||integer(int32)||
|&emsp;&emsp;lastUpdateTime||string(date-time)||
|&emsp;&emsp;logoUrl||string||
|&emsp;&emsp;name||string||
|&emsp;&emsp;offlineTime||string(date-time)||
|&emsp;&emsp;pricingConfig||string||
|&emsp;&emsp;productDisplay||string||
|&emsp;&emsp;riskControlStrategy||string||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;step||integer(int32)||
|&emsp;&emsp;submissionTime||string(date-time)||
|&emsp;&emsp;tag||string||
|&emsp;&emsp;tenantId||string||
|&emsp;&emsp;updateExplanation||string||
|&emsp;&emsp;updateTime||string(date-time)||
|&emsp;&emsp;versionType||string||
|msg|返回消息|string||
|success|是否成功|boolean||


**响应示例**:
```javascript
{
	"code": 0,
	"data": [
		{
			"agentId": 0,
			"agentType": "",
			"applicationPackageType": 0,
			"configList": "",
			"createTime": "",
			"currentVersion": "",
			"description": "",
			"detailContent": "",
			"developerId": 0,
			"freeTrialConfig": "",
			"id": 0,
			"industryCode": "",
			"industryTypeCode": "",
			"initialReleaseTime": "",
			"isFreeTrial": 0,
			"lastUpdateTime": "",
			"logoUrl": "",
			"name": "",
			"offlineTime": "",
			"pricingConfig": "",
			"productDisplay": "",
			"riskControlStrategy": "",
			"status": 0,
			"step": 0,
			"submissionTime": "",
			"tag": "",
			"tenantId": "",
			"updateExplanation": "",
			"updateTime": "",
			"versionType": ""
		}
	],
	"msg": "",
	"success": true
}
```


## 保存应用信息-草稿


**接口地址**:`/develop/application/saveApplication`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "agentId": 0,
  "agentType": "",
  "applicationPackageType": 0,
  "configList": "",
  "currentVersion": "",
  "description": "",
  "detailContent": "",
  "developerId": 0,
  "freeTrialConfig": "",
  "id": 0,
  "industryCode": "",
  "industryTypeCode": "",
  "isFreeTrial": 0,
  "logoUrl": "",
  "name": "",
  "pricingConfig": "",
  "productDisplay": "",
  "riskControlStrategy": "",
  "status": 0,
  "step": 0,
  "tag": "",
  "updateExplanation": "",
  "versionType": ""
}
```


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|applicationDTO|applicationDTO|body|true|PublishAgentDTO|PublishAgentDTO|
|&emsp;&emsp;agentId|||false|integer(int64)||
|&emsp;&emsp;agentType|||false|string||
|&emsp;&emsp;applicationPackageType|||false|integer(int32)||
|&emsp;&emsp;configList|||false|string||
|&emsp;&emsp;currentVersion|||false|string||
|&emsp;&emsp;description|||false|string||
|&emsp;&emsp;detailContent|||false|string||
|&emsp;&emsp;developerId|||false|integer(int64)||
|&emsp;&emsp;freeTrialConfig|||false|string||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;industryCode|||false|string||
|&emsp;&emsp;industryTypeCode|||false|string||
|&emsp;&emsp;isFreeTrial|||false|integer(int32)||
|&emsp;&emsp;logoUrl|||false|string||
|&emsp;&emsp;name|||false|string||
|&emsp;&emsp;pricingConfig|||false|string||
|&emsp;&emsp;productDisplay|||false|string||
|&emsp;&emsp;riskControlStrategy|||false|string||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;step|||false|integer(int32)||
|&emsp;&emsp;tag|||false|string||
|&emsp;&emsp;updateExplanation|||false|string||
|&emsp;&emsp;versionType|||false|string||


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


## 发布


**接口地址**:`/develop/application/publishApplication`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "agentId": 0,
  "agentType": "",
  "applicationPackageType": 0,
  "configList": "",
  "currentVersion": "",
  "description": "",
  "detailContent": "",
  "developerId": 0,
  "freeTrialConfig": "",
  "id": 0,
  "industryCode": "",
  "industryTypeCode": "",
  "isFreeTrial": 0,
  "logoUrl": "",
  "name": "",
  "pricingConfig": "",
  "productDisplay": "",
  "riskControlStrategy": "",
  "status": 0,
  "step": 0,
  "tag": "",
  "updateExplanation": "",
  "versionType": ""
}
```


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|applicationDTO|applicationDTO|body|true|PublishAgentDTO|PublishAgentDTO|
|&emsp;&emsp;agentId|||false|integer(int64)||
|&emsp;&emsp;agentType|||false|string||
|&emsp;&emsp;applicationPackageType|||false|integer(int32)||
|&emsp;&emsp;configList|||false|string||
|&emsp;&emsp;currentVersion|||false|string||
|&emsp;&emsp;description|||false|string||
|&emsp;&emsp;detailContent|||false|string||
|&emsp;&emsp;developerId|||false|integer(int64)||
|&emsp;&emsp;freeTrialConfig|||false|string||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;industryCode|||false|string||
|&emsp;&emsp;industryTypeCode|||false|string||
|&emsp;&emsp;isFreeTrial|||false|integer(int32)||
|&emsp;&emsp;logoUrl|||false|string||
|&emsp;&emsp;name|||false|string||
|&emsp;&emsp;pricingConfig|||false|string||
|&emsp;&emsp;productDisplay|||false|string||
|&emsp;&emsp;riskControlStrategy|||false|string||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;step|||false|integer(int32)||
|&emsp;&emsp;tag|||false|string||
|&emsp;&emsp;updateExplanation|||false|string||
|&emsp;&emsp;versionType|||false|string||


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


## 应用包下架


**接口地址**:`/develop/application/offlineAppPackage`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|agentId|agentId|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«int»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|data|承载数据|integer(int32)|integer(int32)|
|msg|返回消息|string||
|success|是否成功|boolean||


**响应示例**:
```javascript
{
	"code": 0,
	"data": 0,
	"msg": "",
	"success": true
}
```


## 应用包下架


**接口地址**:`/develop/application/offlineAppPackage`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|agentId|agentId|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«int»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|data|承载数据|integer(int32)|integer(int32)|
|msg|返回消息|string||
|success|是否成功|boolean||


**响应示例**:
```javascript
{
	"code": 0,
	"data": 0,
	"msg": "",
	"success": true
}
```


## 应用包下架


**接口地址**:`/develop/application/offlineAppPackage`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|agentId|agentId|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«int»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|data|承载数据|integer(int32)|integer(int32)|
|msg|返回消息|string||
|success|是否成功|boolean||


**响应示例**:
```javascript
{
	"code": 0,
	"data": 0,
	"msg": "",
	"success": true
}
```


## 应用包下架


**接口地址**:`/develop/application/offlineAppPackage`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|agentId|agentId|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«int»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|data|承载数据|integer(int32)|integer(int32)|
|msg|返回消息|string||
|success|是否成功|boolean||


**响应示例**:
```javascript
{
	"code": 0,
	"data": 0,
	"msg": "",
	"success": true
}
```


## 应用包下架


**接口地址**:`/develop/application/offlineAppPackage`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|agentId|agentId|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«int»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|data|承载数据|integer(int32)|integer(int32)|
|msg|返回消息|string||
|success|是否成功|boolean||


**响应示例**:
```javascript
{
	"code": 0,
	"data": 0,
	"msg": "",
	"success": true
}
```