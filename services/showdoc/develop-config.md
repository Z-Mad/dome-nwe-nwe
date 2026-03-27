

## 检查应用配置完整性


**接口地址**:`/develop/config/checkExtractConfig`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|appId|appId|query|true|integer(int64)||
|type|type|query|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«List«CheckConfigurationNewVO»»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|data|承载数据|array|CheckConfigurationNewVO|
|&emsp;&emsp;dataMap|参数|object||
|&emsp;&emsp;detailVOS|检查项|array|PickDetailVO|
|&emsp;&emsp;&emsp;&emsp;name|名称|string||
|&emsp;&emsp;&emsp;&emsp;reasons||array|string|
|&emsp;&emsp;&emsp;&emsp;status|检查状态：1-通过，2-忽略，3-失败|integer||
|&emsp;&emsp;modelName|模块名称|string||
|&emsp;&emsp;modelReason|整个模块都未检验的原因|string||
|msg|返回消息|string||
|success|是否成功|boolean||


**响应示例**:
```javascript
{
	"code": 0,
	"data": [
		{
			"dataMap": {},
			"detailVOS": [
				{
					"name": "",
					"reasons": [],
					"status": 0
				}
			],
			"modelName": "",
			"modelReason": ""
		}
	],
	"msg": "",
	"success": true
}
```


## 检查应用配置完整性


**接口地址**:`/develop/config/checkExtractConfig`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|appId|appId|query|true|integer(int64)||
|type|type|query|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«List«CheckConfigurationNewVO»»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|data|承载数据|array|CheckConfigurationNewVO|
|&emsp;&emsp;dataMap|参数|object||
|&emsp;&emsp;detailVOS|检查项|array|PickDetailVO|
|&emsp;&emsp;&emsp;&emsp;name|名称|string||
|&emsp;&emsp;&emsp;&emsp;reasons||array|string|
|&emsp;&emsp;&emsp;&emsp;status|检查状态：1-通过，2-忽略，3-失败|integer||
|&emsp;&emsp;modelName|模块名称|string||
|&emsp;&emsp;modelReason|整个模块都未检验的原因|string||
|msg|返回消息|string||
|success|是否成功|boolean||


**响应示例**:
```javascript
{
	"code": 0,
	"data": [
		{
			"dataMap": {},
			"detailVOS": [
				{
					"name": "",
					"reasons": [],
					"status": 0
				}
			],
			"modelName": "",
			"modelReason": ""
		}
	],
	"msg": "",
	"success": true
}
```


## 检查应用配置完整性


**接口地址**:`/develop/config/checkExtractConfig`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|appId|appId|query|true|integer(int64)||
|type|type|query|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«List«CheckConfigurationNewVO»»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|data|承载数据|array|CheckConfigurationNewVO|
|&emsp;&emsp;dataMap|参数|object||
|&emsp;&emsp;detailVOS|检查项|array|PickDetailVO|
|&emsp;&emsp;&emsp;&emsp;name|名称|string||
|&emsp;&emsp;&emsp;&emsp;reasons||array|string|
|&emsp;&emsp;&emsp;&emsp;status|检查状态：1-通过，2-忽略，3-失败|integer||
|&emsp;&emsp;modelName|模块名称|string||
|&emsp;&emsp;modelReason|整个模块都未检验的原因|string||
|msg|返回消息|string||
|success|是否成功|boolean||


**响应示例**:
```javascript
{
	"code": 0,
	"data": [
		{
			"dataMap": {},
			"detailVOS": [
				{
					"name": "",
					"reasons": [],
					"status": 0
				}
			],
			"modelName": "",
			"modelReason": ""
		}
	],
	"msg": "",
	"success": true
}
```