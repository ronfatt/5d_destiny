# Ziwei 12 Palaces × Major Stars Combination Table V1

## 1. 文档定位

本文件定义“紫微斗数 12 宫位 × 14 主星组合数据库”的 V1 结构。

目标不是写传统命理散文，而是建立一个可计算、可扩展、可进入五维系统的星宫组合数据层。

该文档将服务于：

- `Structure` 计算层
- Ziwei 规则数据库
- AI 解读辅助层
- 后续 168 组合扩表

## 2. 设计目标

本表的核心逻辑是：

`主星 + 宫位 = 某人生领域中的结构表现`

因此，它不是独立于参数表和规则表之外的新系统，而是：

- 参数表的细化层
- 规则表的组合层
- Structure 引擎的数据库层

## 3. 数据库总结构

理论组合总数：

- `12` 宫位
- `14` 主星

总计：

`12 × 14 = 168` 组合

每条组合建议至少包含以下字段：

- `palace`
- `star`
- `baseIndex`
- `positiveExpression`
- `shadowRisk`
- `dimensionBias`
- `themeBias`
- `notes`

## 4. 字段定义

### 4.1 palace

宫位名称。

### 4.2 star

主星名称。

### 4.3 baseIndex

该主星落入该宫位时的结构参考指数。

范围建议：`0-100`

说明：

- `baseIndex` 不是最终宫位分。
- 最终宫位分仍需叠加辅星、四化、状态、煞忌修正。

### 4.4 positiveExpression

该组合的正向表现。

### 4.5 shadowRisk

该组合的阴影风险。

### 4.6 dimensionBias

该组合对五维的偏向。

建议字段：

- `structure`
- `timing`
- `energy`
- `mind`
- `action`

范围建议：`1-5`

### 4.7 themeBias

该组合对四大主题的偏向。

建议字段：

- `career`
- `wealth`
- `relationship`
- `health`

范围建议：`1-5`

## 5. 12 宫位基础属性表

本层用于提供宫位本身的领域权重背景。

| 宫位 | 领域 | 权重指数 |
| --- | --- | --- |
| 命宫 | 人生方向 | 100 |
| 兄弟宫 | 同辈关系 | 60 |
| 夫妻宫 | 感情婚姻 | 90 |
| 子女宫 | 创造 / 后代 | 70 |
| 财帛宫 | 财富 | 95 |
| 疾厄宫 | 健康 | 85 |
| 迁移宫 | 外部环境 | 75 |
| 奴仆宫 | 人际合作 | 65 |
| 官禄宫 | 事业 | 100 |
| 田宅宫 | 房产资产 | 80 |
| 福德宫 | 精神状态 | 85 |
| 父母宫 | 长辈 / 资源 | 70 |

说明：

- 权重指数用于帮助系统理解“这个宫位本身的重要性”。
- 它不应直接覆盖四大主题宫位权重公式。
- `命宫` 与 `官禄宫`、`财帛宫`、`夫妻宫` 等在不同主题中仍需按主题公式处理。

## 6. V1 评分使用原则

### 6.1 组合分不等于最终宫位分

最终宫位分仍应遵循：

`PalaceScore = MainStarBase + SupportStarDelta + TransformationDelta + ShaJiDelta + StatusDelta`

而本表中的 `baseIndex` 主要承担两个作用：

- 校正“主星落宫”的领域差异
- 供 AI 解释该星在该宫的结构倾向

### 6.2 V1 先做核心组合，不强行伪造 168 条完整版

V1 先完成：

- 数据模型
- 12 宫属性层
- 核心星宫样例层
- 扩表规则

不建议在没有统一评分逻辑前硬写满全部 168 条。

## 7. 核心组合样例

以下样例用于建立 V1 数据格式和评分逻辑。

### 7.1 紫微星 × 宫位

#### 命宫 × 紫微

- `palace`: 命宫
- `star`: 紫微
- `baseIndex`: 95
- 正向表现：领导型人格、中心感强、容易成为主导者
- 阴影风险：控制欲、权力冲突
- 五维偏向：Structure 5 / Timing 3 / Energy 2 / Mind 4 / Action 3
- 主题偏向：career 5 / wealth 3 / relationship 2 / health 2

#### 官禄宫 × 紫微

- `palace`: 官禄宫
- `star`: 紫微
- `baseIndex`: 92
- 正向表现：事业核心人物、管理和统筹能力强
- 阴影风险：权力斗争、过度控制组织
- 五维偏向：Structure 5 / Timing 3 / Energy 2 / Mind 4 / Action 4
- 主题偏向：career 5 / wealth 3 / relationship 1 / health 1

#### 财帛宫 × 紫微

- `palace`: 财帛宫
- `star`: 紫微
- `baseIndex`: 85
- 正向表现：具备管理财富和配置资源的能力
- 阴影风险：控制式理财、过度关注掌控感
- 五维偏向：Structure 4 / Timing 3 / Energy 2 / Mind 4 / Action 3
- 主题偏向：career 3 / wealth 5 / relationship 1 / health 1

#### 夫妻宫 × 紫微

- `palace`: 夫妻宫
- `star`: 紫微
- `baseIndex`: 75
- 正向表现：伴侣地位高、关系中有稳定中心
- 阴影风险：关系中的控制和权力不平衡
- 五维偏向：Structure 3 / Timing 2 / Energy 2 / Mind 3 / Action 2
- 主题偏向：career 1 / wealth 1 / relationship 4 / health 1

#### 迁移宫 × 紫微

- `palace`: 迁移宫
- `star`: 紫微
- `baseIndex`: 80
- 正向表现：外部机会多，外界容易给予位置与认可
- 阴影风险：在外部环境中过度强调掌控
- 五维偏向：Structure 4 / Timing 4 / Energy 2 / Mind 3 / Action 3
- 主题偏向：career 4 / wealth 2 / relationship 1 / health 1

#### 福德宫 × 紫微

- `palace`: 福德宫
- `star`: 紫微
- `baseIndex`: 88
- 正向表现：精神格局高，自我中心整合力强
- 阴影风险：内在控制欲过强，难以放松
- 五维偏向：Structure 4 / Timing 3 / Energy 2 / Mind 5 / Action 2
- 主题偏向：career 2 / wealth 1 / relationship 2 / health 3

### 7.2 天机星 × 宫位

#### 命宫 × 天机

- `baseIndex`: 85
- 正向表现：聪明多变、思考快、适应力强
- 阴影风险：犹豫、想太多、行动延迟
- 五维偏向：Structure 3 / Timing 4 / Energy 3 / Mind 5 / Action 2
- 主题偏向：career 4 / wealth 2 / relationship 2 / health 2

#### 官禄宫 × 天机

- `baseIndex`: 82
- 正向表现：策略型职业、擅长规划与变通
- 阴影风险：决策过慢、反复调整方向
- 五维偏向：Structure 3 / Timing 4 / Energy 3 / Mind 5 / Action 2
- 主题偏向：career 5 / wealth 2 / relationship 1 / health 1

#### 财帛宫 × 天机

- `baseIndex`: 75
- 正向表现：靠智慧赚钱、适合脑力型财富路径
- 阴影风险：计划过多、落地不足
- 五维偏向：Structure 3 / Timing 4 / Energy 3 / Mind 5 / Action 2
- 主题偏向：career 3 / wealth 4 / relationship 1 / health 1

#### 迁移宫 × 天机

- `baseIndex`: 88
- 正向表现：外地机会多，适应环境变化能力强
- 阴影风险：容易在变化中过度分散
- 五维偏向：Structure 3 / Timing 5 / Energy 3 / Mind 4 / Action 2
- 主题偏向：career 4 / wealth 2 / relationship 1 / health 1

#### 福德宫 × 天机

- `baseIndex`: 90
- 正向表现：思考型人格，内在分析与洞察能力强
- 阴影风险：精神内耗、过度思虑
- 五维偏向：Structure 3 / Timing 3 / Energy 3 / Mind 5 / Action 1
- 主题偏向：career 2 / wealth 1 / relationship 2 / health 3

### 7.3 太阳星 × 宫位

#### 命宫 × 太阳

- `baseIndex`: 88
- 正向表现：光明人格、外向、带动性强
- 阴影风险：过度自信、自我膨胀
- 五维偏向：Structure 4 / Timing 3 / Energy 4 / Mind 3 / Action 4
- 主题偏向：career 4 / wealth 2 / relationship 2 / health 1

#### 官禄宫 × 太阳

- `baseIndex`: 92
- 正向表现：事业成功概率高，适合被看见的岗位
- 阴影风险：追求名声大于结果
- 五维偏向：Structure 4 / Timing 3 / Energy 4 / Mind 3 / Action 4
- 主题偏向：career 5 / wealth 2 / relationship 1 / health 1

#### 财帛宫 × 太阳

- `baseIndex`: 80
- 正向表现：正财运较强，适合靠曝光或表现换收入
- 阴影风险：收入受可见度波动影响大
- 五维偏向：Structure 4 / Timing 3 / Energy 4 / Mind 3 / Action 4
- 主题偏向：career 3 / wealth 4 / relationship 1 / health 1

#### 迁移宫 × 太阳

- `baseIndex`: 90
- 正向表现：外部发展好，在公众环境中更容易成功
- 阴影风险：过度依赖外部认同
- 五维偏向：Structure 4 / Timing 4 / Energy 4 / Mind 3 / Action 4
- 主题偏向：career 4 / wealth 2 / relationship 1 / health 1

#### 夫妻宫 × 太阳

- `baseIndex`: 75
- 正向表现：关系热情，伴侣能见度高或外放
- 阴影风险：关系中自我过强
- 五维偏向：Structure 3 / Timing 2 / Energy 4 / Mind 2 / Action 3
- 主题偏向：career 1 / wealth 1 / relationship 4 / health 1

### 7.4 武曲星 × 宫位

#### 命宫 × 武曲

- `baseIndex`: 84
- 正向表现：行动型人格、现实执行能力强
- 阴影风险：现实冷酷、过度刚硬
- 五维偏向：Structure 4 / Timing 3 / Energy 3 / Mind 3 / Action 5
- 主题偏向：career 4 / wealth 3 / relationship 1 / health 2

#### 官禄宫 × 武曲

- `baseIndex`: 90
- 正向表现：商业能力强、事业推进效率高
- 阴影风险：为结果过度牺牲柔性关系
- 五维偏向：Structure 4 / Timing 3 / Energy 3 / Mind 3 / Action 5
- 主题偏向：career 5 / wealth 4 / relationship 1 / health 1

#### 财帛宫 × 武曲

- `baseIndex`: 95
- 正向表现：财运强，适合管理金钱、资源和交易
- 阴影风险：把财富当成唯一价值尺度
- 五维偏向：Structure 5 / Timing 3 / Energy 3 / Mind 3 / Action 5
- 主题偏向：career 3 / wealth 5 / relationship 1 / health 1

#### 迁移宫 × 武曲

- `baseIndex`: 80
- 正向表现：外地赚钱能力较强，外部行动力高
- 阴影风险：在外界环境中过度拼杀
- 五维偏向：Structure 3 / Timing 4 / Energy 3 / Mind 2 / Action 5
- 主题偏向：career 4 / wealth 3 / relationship 1 / health 1

#### 福德宫 × 武曲

- `baseIndex`: 70
- 正向表现：精神世界仍有现实执行导向
- 阴影风险：压力较大，难真正放松
- 五维偏向：Structure 2 / Timing 2 / Energy 2 / Mind 2 / Action 4
- 主题偏向：career 2 / wealth 2 / relationship 1 / health 3

### 7.5 天同星 × 宫位

#### 命宫 × 天同

- `baseIndex`: 75
- 正向表现：温和、柔软、人际友善
- 阴影风险：懒散、逃避、缺乏推进力
- 五维偏向：Structure 2 / Timing 3 / Energy 4 / Mind 3 / Action 2
- 主题偏向：career 1 / wealth 1 / relationship 4 / health 2

#### 福德宫 × 天同

- `baseIndex`: 90
- 正向表现：福气感强，精神缓冲能力好
- 阴影风险：过度追求舒适，回避现实压力
- 五维偏向：Structure 3 / Timing 3 / Energy 4 / Mind 4 / Action 1
- 主题偏向：career 1 / wealth 1 / relationship 2 / health 4

#### 夫妻宫 × 天同

- `baseIndex`: 82
- 正向表现：感情顺、关系温和、互动柔软
- 阴影风险：关系中回避问题
- 五维偏向：Structure 3 / Timing 2 / Energy 4 / Mind 3 / Action 2
- 主题偏向：career 1 / wealth 1 / relationship 5 / health 1

#### 财帛宫 × 天同

- `baseIndex`: 65
- 正向表现：财富表现普通，偏安稳型而非进攻型
- 阴影风险：财务懒散、缺乏经营意识
- 五维偏向：Structure 2 / Timing 2 / Energy 3 / Mind 2 / Action 1
- 主题偏向：career 1 / wealth 3 / relationship 1 / health 1

### 7.6 廉贞星 × 宫位

#### 命宫 × 廉贞

- `baseIndex`: 78
- 正向表现：权欲感强、控制感强、人格有张力
- 阴影风险：权力斗争、欲望过强
- 五维偏向：Structure 3 / Timing 3 / Energy 3 / Mind 4 / Action 3
- 主题偏向：career 3 / wealth 2 / relationship 2 / health 1

#### 官禄宫 × 廉贞

- `baseIndex`: 85
- 正向表现：政治能力、资源运作能力较强
- 阴影风险：权术过多、组织冲突
- 五维偏向：Structure 4 / Timing 3 / Energy 3 / Mind 4 / Action 3
- 主题偏向：career 5 / wealth 2 / relationship 1 / health 1

#### 夫妻宫 × 廉贞

- `baseIndex`: 70
- 正向表现：关系有吸引力与张力
- 阴影风险：感情复杂、控制与试探并存
- 五维偏向：Structure 2 / Timing 2 / Energy 4 / Mind 3 / Action 2
- 主题偏向：career 1 / wealth 1 / relationship 4 / health 1

#### 财帛宫 × 廉贞

- `baseIndex`: 75
- 正向表现：有投机与资源运作能力
- 阴影风险：过度冒险或财务权力斗争
- 五维偏向：Structure 3 / Timing 3 / Energy 3 / Mind 3 / Action 3
- 主题偏向：career 2 / wealth 4 / relationship 1 / health 1

## 8. V1 扩表规则

V1 不要求一次写满 168 组合，但后续扩表时建议遵循以下顺序：

1. 先补四大主题高优先宫位
2. 再补命宫、福德宫、迁移宫
3. 最后补兄弟宫、奴仆宫、父母宫等辅助宫位

### 8.1 高优先宫位

- 命宫
- 官禄宫
- 财帛宫
- 夫妻宫
- 疾厄宫
- 福德宫
- 迁移宫
- 田宅宫

### 8.2 优先主星

建议补表顺序：

- 紫微
- 武曲
- 天府
- 天机
- 太阳
- 太阴
- 贪狼
- 廉贞
- 天相
- 天梁
- 天同
- 巨门
- 七杀
- 破军

## 9. 数据结构建议

建议最终存成结构化记录：

```json
{
  "palace": "官禄宫",
  "star": "武曲",
  "baseIndex": 90,
  "positiveExpression": ["商业能力强", "推进效率高"],
  "shadowRisk": ["现实冷酷", "关系折损"],
  "dimensionBias": {
    "structure": 4,
    "timing": 3,
    "energy": 3,
    "mind": 3,
    "action": 5
  },
  "themeBias": {
    "career": 5,
    "wealth": 4,
    "relationship": 1,
    "health": 1
  },
  "notes": "适合在事业结构判断中视为高执行型强星组合"
}
```

## 10. 与现有文档的关系

本文件应与以下文档一起使用：

- [docs/five-dimension-destiny-system-v1-parameter-table.md](/Users/rms/Desktop/Ai Project/Ai5Ddestiny/docs/five-dimension-destiny-system-v1-parameter-table.md)
- [docs/five-dimension-destiny-system-v1-rules-mapping.md](/Users/rms/Desktop/Ai Project/Ai5Ddestiny/docs/five-dimension-destiny-system-v1-rules-mapping.md)
- [docs/ziwei-charting-engine-v1.md](/Users/rms/Desktop/Ai Project/Ai5Ddestiny/docs/ziwei-charting-engine-v1.md)

关系分工：

- 参数表：定义主星基础分和边界
- 规则表：定义评分映射逻辑
- 排盘引擎：生成命盘位置
- 本表：定义“主星落入具体宫位后”的组合语义与参考指数

## 11. 当前版本结论

这份文档目前最有价值的地方，不是已经写满全部 168 条，而是已经把：

- 12 宫基础属性
- 星宫组合的数据模型
- 核心高频组合样例
- 扩表顺序

定下来了。

这样后面继续补表时，不会变成一堆风格不一致、评分逻辑不统一的资料。

