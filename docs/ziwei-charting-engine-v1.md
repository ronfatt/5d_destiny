# Ziwei Charting Engine V1

## 1. 文档定位

本文件定义五维命运系统中“紫微斗数排盘引擎”的工程规格。

它的职责是：

- 接收用户出生信息
- 进行时间标准化
- 生成紫微命盘骨架
- 安置主星、辅星、四化、运限
- 输出结构化命盘 JSON
- 为五维系统提供 `Structure` 与 `Timing` 的底层输入

本文件不负责 AI 文案解释。它只定义：

- 如何排盘
- 输出什么数据
- 哪些地方要参数化
- 哪些地方不能假装有唯一标准

## 2. 关键原则

### 2.1 不假设唯一真算法

紫微斗数不存在单一全网统一算法。

不同流派在以下部分可能不同：

- 命宫/身宫取法细节
- 辅星与神煞安法
- 四化推法
- 流月/流日/流时起法
- 真太阳时校正方式

因此，工程上必须：

- 先固定 `school` 规则集
- 再做程序化实现

### 2.2 规则必须表格化

口诀、推演规则、安星逻辑都不能散落在代码里。

必须整理为：

- lookup table
- rule config
- strategy mode

### 2.3 排盘引擎只负责算，不负责解释

排盘引擎负责：

- 算位置
- 算结构
- 输出 JSON

解释由：

- 五维评分引擎
- AI 解读引擎

单独负责。

### 2.4 先输出命盘 JSON，再接五维模型

正确流程：

```text
出生信息 -> 排盘引擎 -> 命盘 JSON -> 规则映射 -> 五维评分 -> AI 报告
```

不应直接：

```text
出生信息 -> AI 解读
```

## 3. 引擎边界

Ziwei Charting Engine V1 只覆盖：

- 时间标准化
- 十二宫骨架
- 命宫/身宫
- 14 主星安星
- 常用辅星框架
- 生年四化
- 大运
- 流年
- 基础结构输出

V1 暂不完整覆盖：

- 全量辅星/神煞
- 流月/流日/流时完整实现
- 多流派并行切换
- 真太阳时默认启用

## 4. 六层引擎结构

建议引擎拆成六层：

1. 输入层
2. 时间标准化层
3. 命盘骨架生成层
4. 安星层
5. 四化与运限层
6. 输出与接口层

## 5. 输入层

### 5.1 必填字段

- 公历出生年月日
- 出生时间
- 性别
- 出生地

### 5.2 推荐内部字段

- 时区
- 是否夏令时
- 真太阳时开关
- 流派版本号
- 数据来源版本

### 5.3 输入结构示例

```json
{
  "birth": {
    "date": "1998-05-22",
    "time": "14:35",
    "location": "Kuala Lumpur",
    "gender": "female",
    "timezone": "Asia/Kuala_Lumpur"
  },
  "engineConfig": {
    "school": "preset_A",
    "useTrueSolarTime": false,
    "useDSTAdjustment": true,
    "calendarMode": "lunar_ganzhi"
  }
}
```

## 6. 时间标准化层

这是最容易出错的一层。

### 6.1 目标

将用户输入的公历时间统一转换为排盘所需的历法和干支字段。

### 6.2 输出字段

- 公历时间标准化结果
- 农历年月日
- 年干支
- 月支
- 日干支
- 时支

### 6.3 时辰映射

系统必须将出生时间映射为 12 时辰之一：

- 子
- 丑
- 寅
- 卯
- 辰
- 巳
- 午
- 未
- 申
- 酉
- 戌
- 亥

### 6.4 配置建议

```json
{
  "useTrueSolarTime": false,
  "useDSTAdjustment": true,
  "calendarMode": "lunar_ganzhi",
  "school": "preset_A"
}
```

### 6.5 输出示例

```json
{
  "normalizedTime": {
    "solar": "1998-05-22T14:35:00+08:00",
    "lunar": "戊寅年 四月廿七 未时",
    "yearStemBranch": "戊寅",
    "monthBranch": "巳",
    "dayStemBranch": "丙午",
    "hourBranch": "未"
  }
}
```

## 7. 命盘骨架生成层

### 7.1 目标

建立 12 宫基础结构，并定出命宫、身宫、宫干、宫支。

### 7.2 十二宫建议结构

```json
[
  {"name": "命宫", "key": "life"},
  {"name": "兄弟宫", "key": "siblings"},
  {"name": "夫妻宫", "key": "spouse"},
  {"name": "子女宫", "key": "children"},
  {"name": "财帛宫", "key": "wealth"},
  {"name": "疾厄宫", "key": "health"},
  {"name": "迁移宫", "key": "travel"},
  {"name": "交友宫", "key": "friends"},
  {"name": "官禄宫", "key": "career"},
  {"name": "田宅宫", "key": "property"},
  {"name": "福德宫", "key": "fortune"},
  {"name": "父母宫", "key": "parents"}
]
```

### 7.3 命宫与身宫

建议实现方式：

- `ming = f(lunarMonth, hourBranch, school)`
- `shen = g(lunarMonth, hourBranch, school)`

说明：

- 这里不要在文档中写死唯一口诀版本。
- 应在规则表中维护 `preset_A` 规则。

### 7.4 宫干生成

为了支持四化和后续流月、运限模块，建议生成每宫天干。

可用字段：

- 宫名
- 地支
- 天干
- 是否命宫
- 是否身宫

## 8. 主星安星层

### 8.1 目标

确定 14 主星在 12 宫中的位置。

### 8.2 14 主星范围

- 紫微
- 天机
- 太阳
- 武曲
- 天同
- 廉贞
- 天府
- 太阴
- 贪狼
- 巨门
- 天相
- 天梁
- 七杀
- 破军

### 8.3 主星安法原则

传统逻辑上通常是：

1. 先确定紫微星位置
2. 再根据紫微与天府两组规则布其余主星

### 8.4 工程实现建议

不要在代码中写死流程推导文字，建议拆为：

- `find_ziwei_position()`
- `place_ziwei_group()`
- `place_tianfu_group()`

### 8.5 规则配置建议

```json
{
  "majorStarGroups": {
    "ziweiGroup": ["紫微", "天机", "太阳", "武曲", "天同", "廉贞"],
    "tianfuGroup": ["天府", "太阴", "贪狼", "巨门", "天相", "天梁", "七杀", "破军"]
  }
}
```

### 8.6 输出示例

```json
{
  "majorStars": {
    "紫微": "官禄宫",
    "天机": "迁移宫",
    "太阳": "财帛宫",
    "武曲": "命宫"
  }
}
```

## 9. 辅星安星层

### 9.1 目标

在 V1 中建立可扩展的辅星规则框架，而不是一次写满全部安星。

### 9.2 推荐分组

建议至少分为五组：

- 贵人组
- 文昌文曲组
- 煞星组
- 桃花情感组
- 神煞变化组

### 9.3 常见依赖字段

辅星与神煞通常依赖：

- 年干
- 年支
- 月
- 日
- 时
- 命宫
- 身宫

### 9.4 工程实现方式

每颗星建议独立规则配置：

```json
{
  "star": "文昌",
  "dependsOn": ["yearStem", "hourBranch"],
  "ruleType": "lookup_table",
  "school": "preset_A"
}
```

### 9.5 V1 范围建议

V1 先支持常用且和结构评分强相关的辅星：

- 左辅
- 右弼
- 文昌
- 文曲
- 天魁
- 天钺
- 禄存
- 火星
- 铃星
- 擎羊
- 陀罗
- 地空
- 地劫

## 10. 四化层

### 10.1 目标

根据年干或指定规则模式，生成化禄、化权、化科、化忌。

### 10.2 V1 范围

V1 先支持：

- 生年四化
- 大运四化框架
- 流年四化框架

### 10.3 输入

- 年干
- school
- transformer mode

### 10.4 配置模式建议

```json
{
  "siHuaMode": "annual_stem"
}
```

可扩展模式：

- `annual_stem`
- `palace_stem`
- `school_specific`

### 10.5 输出示例

```json
{
  "transformers": {
    "化禄": "武曲",
    "化权": "破军",
    "化科": "太阳",
    "化忌": "太阴"
  }
}
```

## 11. 运限层

### 11.1 大运

目标：生成 10 年一阶段的大运结构。

输出建议：

```json
[
  {"ageFrom": 3, "ageTo": 12, "palace": "命宫"},
  {"ageFrom": 13, "ageTo": 22, "palace": "兄弟宫"}
]
```

### 11.2 流年

目标：根据当前年份生成流年定位，为 `Timing` 提供年度输入。

### 11.3 流月

V1 只保留接口，不强行做唯一算法。

建议策略模式：

- `getMonthlyLuck(mode="school_A")`

说明：

- 流月是流派分歧最大的区域之一。
- 在未定流派前，不要假装结果唯一正确。

## 12. 命盘 JSON 输出模型

建议引擎最终统一输出结构化 JSON，而不是直接产出文字解盘。

### 12.1 推荐结构

```json
{
  "meta": {
    "engine": "ziwei-charting-engine-v1",
    "school": "preset_A",
    "timezone": "Asia/Kuala_Lumpur",
    "calendar": "lunar_ganzhi"
  },
  "birth": {
    "solar": "1998-05-22 14:35",
    "lunar": "戊寅年 四月廿七 未时"
  },
  "palaces": [
    {
      "name": "命宫",
      "key": "life",
      "branch": "午",
      "stem": "丙",
      "majorStars": ["紫微", "天相"],
      "minorStars": ["左辅", "文昌"],
      "transformers": ["化科"]
    }
  ],
  "luck": {
    "decade": [],
    "annual": [],
    "monthly": []
  }
}
```

## 13. 与五维系统的接口

Ziwei 排盘引擎的输出不会直接给用户看，而是先进入五维系统的规则层。

### 13.1 映射关系

- 主星 + 宫位 + 辅星 + 四化 -> `Structure`
- 大运 / 流年 / 流月 -> `Timing`
- 命运卡 -> `Energy`
- 问卷 / 对话 -> `Mind`
- 行为问卷 -> `Action`

### 13.2 正确数据流

```text
Ziwei Charting Engine
-> Rules Mapping
-> Parameter Table
-> Destiny Engine
-> AI Report
```

## 14. 实现建议

### 14.1 版本路线

#### V1

只做：

- 12 宫
- 命宫/身宫
- 14 主星
- 常用辅星框架
- 生年四化
- 大运
- 流年

#### V2

再加：

- 更多辅星
- 常用神煞
- 流月
- 更精细的宫干与飞化支持

#### V3

再加：

- 流日/流时
- 多流派切换
- 真太阳时校正
- 更完整的自动解释辅助

### 14.2 工程原则

1. 所有规则表格化
2. 所有流派差异加 `school` 参数
3. 排盘引擎只算位置，不写解释
4. 先做 JSON，再做报告

## 15. 技术建议

### 15.1 服务拆分

建议独立服务：

- `ziwei-charting-engine`
- `ziwei-rule-config`
- `ziwei-json-adapter`

### 15.2 技术栈建议

若与当前平台一致，建议：

- Python / FastAPI
- PostgreSQL 存规则版本与缓存结果
- 独立规则文件或 JSON config

### 15.3 外部参考策略

已有公开排盘项目可以参考，但不要无脑照抄。

原因：

- 默认流派未必匹配你的系统
- 字段设计未必适配五维模型
- 流月/飞化/神煞规则版本可能不一致

## 16. 当前版本结论

Ziwei Charting Engine V1 的目标不是一次做完全部紫微斗数，而是先建立一个：

- 边界清楚
- 可配置
- 可输出结构化数据
- 能稳定接入五维系统

的排盘底层。

一旦这个引擎稳定，第一体系和第三体系之间的断层就能补上。

