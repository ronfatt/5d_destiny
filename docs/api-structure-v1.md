# API 结构设计 V1

## 1. 文档定位

本文件定义五维命运系统 Web 平台的 API 结构。

目标是把现有产品流程拆成可以实现的后端接口集合。

本版本默认：

- 风格：REST API
- 鉴权：Session / Token
- 输出：JSON

## 2. 设计原则

- 前后端职责清楚
- 先结构化结果，再 AI 文本
- 接口按业务域分组
- 长耗时任务允许异步化
- 所有核心结果可追踪版本

## 3. API 模块划分

建议按以下业务域拆分：

1. Auth API
2. User API
3. Birth Profile API
4. Ziwei Chart API
5. Card Draw API
6. Questionnaire API
7. Destiny Reading API
8. Destiny Report API
9. Membership / Payment API
10. Course / Certification API

## 4. Auth API

### `POST /api/auth/register`

用途：注册用户

### `POST /api/auth/login`

用途：用户登录

### `POST /api/auth/logout`

用途：退出登录

### `GET /api/auth/me`

用途：获取当前用户信息

## 5. Birth Profile API

### `POST /api/birth-profiles`

用途：创建出生资料

请求示例：

```json
{
  "birthDate": "1998-05-22",
  "birthTime": "14:35",
  "birthLocation": "Kuala Lumpur",
  "timezone": "Asia/Kuala_Lumpur",
  "gender": "female"
}
```

### `GET /api/birth-profiles/:id`

用途：获取单个出生资料

### `PATCH /api/birth-profiles/:id`

用途：更新出生资料

## 6. Ziwei Chart API

### `POST /api/ziwei-charts/generate`

用途：根据出生资料生成命盘 JSON

请求示例：

```json
{
  "birthProfileId": "bp_123",
  "engineConfig": {
    "school": "preset_A",
    "useTrueSolarTime": false
  }
}
```

响应示例：

```json
{
  "chartId": "zc_123",
  "status": "completed",
  "chart": {
    "meta": {"engine": "ziwei-charting-engine-v1"},
    "palaces": []
  }
}
```

### `GET /api/ziwei-charts/:id`

用途：获取命盘结果

## 7. Card Draw API

### `POST /api/card-draws/draw`

用途：执行一次标准抽牌

请求示例：

```json
{
  "theme": "career",
  "readingType": "standard"
}
```

响应示例：

```json
{
  "drawId": "cd_123",
  "cards": {
    "archetype": "武曲执行",
    "energy1": "机会",
    "energy2": "压力",
    "event": "合作"
  },
  "rawEnergyScore": 3.4,
  "mappedEnergyScore": 10.2
}
```

## 8. Questionnaire API

### `POST /api/questionnaires/submit`

用途：提交 Mind / Action 问卷

请求示例：

```json
{
  "readingId": "dr_123",
  "theme": "career",
  "mindAnswers": [6,5,6,4,5,5,6,5,6,5],
  "actionAnswers": [2,2,1,1,2]
}
```

响应示例：

```json
{
  "mindFactor": 1.06,
  "mindLevel": 5,
  "actionRaw": 72,
  "actionLabel": "稳定执行"
}
```

## 9. Destiny Reading API

### `POST /api/readings`

用途：创建一次占卜任务

请求示例：

```json
{
  "birthProfileId": "bp_123",
  "question": "今年事业发展如何？",
  "theme": "career",
  "readingType": "standard"
}
```

### `POST /api/readings/:id/compute`

用途：整合命盘、卡牌、问卷，执行五维评分

响应示例：

```json
{
  "readingId": "dr_123",
  "inputs": {
    "structure": 81,
    "timing": 1.12,
    "energy": 10.2,
    "mind": 1.06,
    "action": 72
  },
  "scores": {
    "career": 94,
    "wealth": 71,
    "love": 58,
    "health": 76
  },
  "dominantFactor": "结构主导",
  "riskFlags": ["短期压力偏高"]
}
```

### `GET /api/readings/:id`

用途：获取单次占卜任务详情

### `GET /api/readings`

用途：获取当前用户历史占卜记录

## 10. Destiny Report API

### `POST /api/reports/generate`

用途：根据 reading 生成报告

请求示例：

```json
{
  "readingId": "dr_123",
  "reportType": "single_theme"
}
```

### `GET /api/reports/:id`

用途：获取单份报告

### `GET /api/reports/:id/pdf`

用途：下载 PDF 报告

## 11. Membership / Payment API

### `GET /api/memberships/me`

用途：查看当前会员状态

### `POST /api/payments/checkout`

用途：创建支付会话

### `POST /api/payments/webhook`

用途：接收支付平台回调

## 12. Course / Certification API

### `GET /api/courses`

用途：获取课程列表

### `POST /api/courses/:id/enroll`

用途：课程报名

### `GET /api/certifications/me`

用途：查看当前认证状态

### `POST /api/certifications/apply`

用途：提交认证申请

## 13. 推荐实现顺序

### MVP 接口

先做：

1. `POST /api/auth/register`
2. `POST /api/auth/login`
3. `POST /api/birth-profiles`
4. `POST /api/ziwei-charts/generate`
5. `POST /api/card-draws/draw`
6. `POST /api/questionnaires/submit`
7. `POST /api/readings`
8. `POST /api/readings/:id/compute`
9. `POST /api/reports/generate`
10. `GET /api/reports/:id`

### 第二阶段接口

再做：

- 会员接口
- 历史记录接口
- PDF 导出
- 课程与认证接口

## 14. 长耗时任务建议

以下接口建议异步化：

- 命盘生成
- 深度报告生成
- PDF 导出
- 周期批量报告

实现建议：

- `status = pending / processing / completed / failed`
- 前端轮询或 webhook 更新

## 15. 错误响应建议

统一错误结构：

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Birth time is required"
  }
}
```

## 16. 当前版本结论

API 结构的目标不是一次定死所有接口，而是先把：

- 用户注册
- 出生资料
- 命盘生成
- 抽牌
- 问卷
- 评分
- 报告生成

这条核心链路完整打通。

这条链路一旦稳定，平台 MVP 就可以开始实现。

