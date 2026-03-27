

## 获取默认平台银行账户


**接口地址**:`/bankAccount/getDefault`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«平台银行账户VO»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|data|承载数据|平台银行账户VO|平台银行账户VO|
|&emsp;&emsp;account|平台账户|string||
|&emsp;&emsp;accountName|平台账户名称|string||
|&emsp;&emsp;bank|平台开户银行|string||
|&emsp;&emsp;defaultAccount|是否为默认账户(0：不是 1：是)|integer(int32)||
|&emsp;&emsp;id|主键ID|integer(int64)||
|msg|返回消息|string||
|success|是否成功|boolean||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"account": "",
		"accountName": "",
		"bank": "",
		"defaultAccount": 0,
		"id": 0
	},
	"msg": "",
	"success": true
}
```


## 获取所有正常状态的平台银行账户列表


**接口地址**:`/bankAccount/listAll`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«List«平台银行账户VO»»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|data|承载数据|array|平台银行账户VO|
|&emsp;&emsp;account|平台账户|string||
|&emsp;&emsp;accountName|平台账户名称|string||
|&emsp;&emsp;bank|平台开户银行|string||
|&emsp;&emsp;defaultAccount|是否为默认账户(0：不是 1：是)|integer(int32)||
|&emsp;&emsp;id|主键ID|integer(int64)||
|msg|返回消息|string||
|success|是否成功|boolean||


**响应示例**:
```javascript
{
	"code": 0,
	"data": [
		{
			"account": "",
			"accountName": "",
			"bank": "",
			"defaultAccount": 0,
			"id": 0
		}
	],
	"msg": "",
	"success": true
}
```