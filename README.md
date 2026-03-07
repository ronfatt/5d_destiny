# 5D Destiny

五维算命系统项目仓库。

这个仓库用于沉淀“五维命运系统 / Five-Dimension Destiny System”的底层方法论、参数表、规则映射、问卷系统，以及后续的卡牌、AI 报告和产品结构设计。

## 项目定位

五维系统不是传统单一算命模型，而是一个多变量趋势计算系统。

核心变量：

- `Structure`：命格结构
- `Timing`：时运周期
- `Energy`：当下能量
- `Mind`：心念频率
- `Action`：行动变量

系统目标不是输出“注定结果”，而是输出：

- 趋势判断
- 主导变量
- 风险提示
- 行动建议

## 当前文档

### 核心底层

- [docs/five-dimension-destiny-system-v1-math-spec.md](/Users/rms/Desktop/Ai Project/Ai5Ddestiny/docs/five-dimension-destiny-system-v1-math-spec.md)
  - 五维系统 v1 数学模型规格书
  - 定义变量、标准化、引擎公式、主题分数、输出结构

- [docs/five-dimension-destiny-system-v1-rules-mapping.md](/Users/rms/Desktop/Ai Project/Ai5Ddestiny/docs/five-dimension-destiny-system-v1-rules-mapping.md)
  - 五维系统 v1 规则映射表
  - 定义紫微、卡牌、频率、行为如何映射到五维变量

- [docs/five-dimension-destiny-system-v1-parameter-table.md](/Users/rms/Desktop/Ai Project/Ai5Ddestiny/docs/five-dimension-destiny-system-v1-parameter-table.md)
  - 五维系统参数表 V1
  - 固定主星、辅星、四化、宫位权重、时运、心念、行动参数范围

### 输入层

- [docs/five-dimension-destiny-system-v1-questionnaire-design.md](/Users/rms/Desktop/Ai Project/Ai5Ddestiny/docs/five-dimension-destiny-system-v1-questionnaire-design.md)
  - 主题问卷设计表
  - 定义 `Mind` 与 `Action` 的问卷结构、题目、评分和接口建议

## 推荐阅读顺序

1. 参数表：先看系统参数边界
2. 规则映射表：再看输入如何转成五维变量
3. 数学模型规格书：最后看总公式、输出与报告结构
4. 问卷设计表：查看前端输入和 AI 对话输入接口

## 当前系统结构

```text
紫微命盘 ------> Structure
大运流年流月 --> Timing
牌阵/卡牌 -----> Energy
频率/问卷 -----> Mind
行为问答 -----> Action

五维变量 ------> 评分引擎 ------> 趋势结果 / 风险 / 建议
```

## 当前阶段

已完成：

- 五维数学模型 v1
- 规则映射层 v1
- 参数表 v1
- 问卷输入层 v1

待完成：

- 50 张命运卡定义表
- AI 报告输出模板
- Web 产品信息架构
- 课程体系拆解

## 工程原则

- 对外表达可以简洁，但对内引擎必须稳定
- 叙事模型与计算模型可以分层
- 所有乘数必须收敛，避免假精确
- 所有评分必须可追溯到来源与规则

