# 应用市场消息中心 API 接口文档

## 概述

应用市场消息中心为售前咨询场景提供消息服务，支持用户之间的一对一会话。
消息中心为跨租户服务，不依赖租户ID。

**Base URL:** `/market/chat`

**通用请求头:**
| Header | 必填 | 说明 |
|--------|------|------|
| Authorization | 是 | 用户认证Token |

---

## 会话管理

### 1. 获取会话列表

获取当前用户参与的所有会话。

**请求:**
```
GET /market/chat/session/list
```

**参数:**
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| current | Integer | 否 | 1 | 当前页 |
| size | Integer | 否 | 20 | 每页大小，最大100 |

**响应:**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "records": [
      {
        "sessionId": 1,
        "sessionKey": "1001_2001",
        "user1Id": 1001,
        "user2Id": 2001,
        "lastMessage": "您好，请问这个商品...",
        "lastMsgTime": "2026-03-24T10:30:00",
        "unreadCount": 2,
        "status": 0
      }
    ],
    "total": 10,
    "size": 20,
    "current": 1,
    "pages": 1
  },
  "msg": "操作成功"
}
```

---

### 2. 创建或获取会话

向目标用户发起会话时调用，返回已存在或新创建的会话。

**请求:**
```
POST /market/chat/session/create
```

**参数:**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| targetId | Long | 是 | 目标用户ID |

**响应:**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "sessionId": 1,
    "sessionKey": "1001_2001",
    "user1Id": 1001,
    "user2Id": 2001,
    "lastMessage": null,
    "lastMsgTime": null,
    "unreadCount": 0,
    "status": 0
  },
  "msg": "操作成功"
}
```

---

## 消息管理

### 3. 发送消息

向指定会话发送文本消息。

**请求:**
```
POST /market/chat/message/send
```

**Body:**
```json
{
  "sessionId": 1,
  "content": "您好，请问这个商品有货吗？",
  "contentType": 1
}
```

发送图片：
```json
{
  "sessionId": 1,
  "content": "https://example.com/images/photo.jpg",
  "contentType": 2
}
```

**参数:**
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| sessionId | Long | 是 | - | 会话ID |
| content | String | 是 | - | 消息内容（文本或图片URL），最大2000字符 |
| contentType | Integer | 否 | 1 | 内容类型：1=文本, 2=图片 |

**响应:**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "messageId": 100,
    "sessionId": 1,
    "senderId": 1001,
    "receiverId": 2001,
    "content": "您好，请问这个商品有货吗？",
    "contentType": 1,
    "isRead": 0,
    "msgTime": "2026-03-24T10:35:00"
  },
  "msg": "操作成功"
}
```

**错误响应:**
```json
{
  "code": 400,
  "success": false,
  "msg": "消息包含敏感词: xxx"
}
```

---

### 4. 查询历史消息

分页查询会话的历史消息（游标分页，倒序返回）。

**请求:**
```
GET /market/chat/message/history
```

**参数:**
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| sessionId | Long | 是 | - | 会话ID |
| lastId | Long | 否 | - | 游标ID，查询比此ID小的消息 |
| limit | Integer | 否 | 20 | 查询条数，最大50 |

**响应:**
```json
{
  "code": 200,
  "success": true,
  "data": [
    {
      "messageId": 100,
      "sessionId": 1,
      "senderId": 2001,
      "receiverId": 1001,
      "content": "您好，有货的",
      "contentType": 1,
      "isRead": 1,
      "msgTime": "2026-03-24T10:36:00"
    },
    {
      "messageId": 99,
      "sessionId": 1,
      "senderId": 1001,
      "receiverId": 2001,
      "content": "您好，请问这个商品有货吗？",
      "contentType": 1,
      "isRead": 1,
      "msgTime": "2026-03-24T10:35:00"
    }
  ],
  "msg": "操作成功"
}
```

---

### 5. 轮询新消息

增量获取新消息（游标分页，正序返回）。

**请求:**
```
GET /market/chat/message/poll
```

**参数:**
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| sessionId | Long | 是 | - | 会话ID |
| lastMsgId | Long | 是 | - | 最后消息ID，0表示从头开始 |
| limit | Integer | 否 | 50 | 查询条数，最大50 |

**响应:**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "messages": [
      {
        "messageId": 101,
        "sessionId": 1,
        "senderId": 2001,
        "receiverId": 1001,
        "content": "请问还有什么可以帮助您的吗？",
        "contentType": 1,
        "isRead": 0,
        "msgTime": "2026-03-24T10:40:00"
      }
    ],
    "hasMore": false,
    "lastMsgId": 101
  },
  "msg": "操作成功"
}
```

---

### 6. 标记消息已读

标记单条或批量消息为已读。

**请求:**
```
POST /market/chat/message/read
```

**Body:**
```json
{
  "sessionId": 1,
  "messageId": 101
}
```

或批量标记：
```json
{
  "sessionId": 1,
  "upToMessageId": 101
}
```

**参数:**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| sessionId | Long | 是 | 会话ID |
| messageId | Long | 否* | 单条标记时的消息ID |
| upToMessageId | Long | 否* | 批量标记上限ID（标记该ID及之前发给当前用户的所有消息） |

*注：messageId 和 upToMessageId 至少提供一个

**响应:**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "markedCount": 5,
    "sessionId": 1
  },
  "msg": "操作成功"
}
```

---

## 数据结构

### SessionVO 会话视图对象

| 字段 | 类型 | 说明 |
|------|------|------|
| sessionId | Long | 会话ID |
| sessionKey | String | 会话唯一标识(较小用户ID_较大用户ID) |
| user1Id | Long | 用户1 ID（较小的用户ID） |
| user2Id | Long | 用户2 ID（较大的用户ID） |
| lastMessage | String | 最后一条消息内容 |
| lastMsgTime | DateTime | 最后一条消息时间 |
| unreadCount | Integer | 当前用户未读消息数 |
| status | Integer | 会话状态: 0=正常, 1=已关闭 |

### MessageVO 消息视图对象

| 字段 | 类型 | 说明 |
|------|------|------|
| messageId | Long | 消息ID |
| sessionId | Long | 会话ID |
| senderId | Long | 发送者ID |
| receiverId | Long | 接收者ID |
| content | String | 消息内容 |
| contentType | Integer | 内容类型: 1=文本, 2=图片 |
| isRead | Integer | 是否已读: 0=未读, 1=已读 |
| msgTime | DateTime | 消息时间 |

### PollResultVO 轮询结果对象

| 字段 | 类型 | 说明 |
|------|------|------|
| messages | List\<MessageVO\> | 消息列表 |
| hasMore | Boolean | 是否还有更多消息 |
| lastMsgId | Long | 最后一条消息ID（用于下次轮询） |

### MarkReadResultVO 标记已读结果对象

| 字段 | 类型 | 说明 |
|------|------|------|
| markedCount | Integer | 实际标记的消息数量 |
| sessionId | Long | 会话ID |

---

## 错误码

| code | 说明 |
|------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 403 | 无权限访问 |
| 500 | 服务器内部错误 |

---

## 接入示例

### 前端轮询示例

```javascript
let lastMsgId = 0;

async function pollMessages(sessionId) {
  const response = await fetch(
    `/market/chat/message/poll?sessionId=${sessionId}&lastMsgId=${lastMsgId}`
  );
  const result = await response.json();

  if (result.success && result.data.messages.length > 0) {
    result.data.messages.forEach(msg => {
      displayMessage(msg);
    });
    lastMsgId = result.data.lastMsgId;
  }

  setTimeout(() => pollMessages(sessionId), 3000);
}
```

### 创建会话并发送消息示例

```javascript
// 1. 创建/获取会话
const sessionRes = await fetch('/market/chat/session/create?targetId=2001', {
  method: 'POST'
});
const session = await sessionRes.json();

// 2. 发送消息
const msgRes = await fetch('/market/chat/message/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: session.data.sessionId,
    content: '您好，请问有货吗？'
  })
});
```

### 获取会话列表示例

```javascript
const sessions = await fetch('/market/chat/session/list');
```
