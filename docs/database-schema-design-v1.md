# 数据库表设计 V1

## 1. 文档定位

本文件定义五维命运系统 Web 平台的数据库表设计。

目标是把现有文档中的对象模型落到可以实现的表结构层。

本版本以 PostgreSQL 为目标数据库。

## 2. 设计原则

- 先支持核心产品闭环
- 表结构围绕真实业务对象
- 结构化结果与 AI 文本分开存储
- 规则与版本号可追踪
- 便于会员、课程、认证扩展

## 3. 核心业务对象

平台至少围绕以下对象设计：

- users
- birth_profiles
- destiny_readings
- card_draws
- questionnaire_results
- destiny_reports
- memberships
- courses
- enrollments
- certifications

## 4. 用户与身份表

### 4.1 users

建议字段：

- `id`
- `email`
- `password_hash`
- `display_name`
- `role`
- `status`
- `created_at`
- `updated_at`

角色建议：

- `user`
- `member`
- `reader`
- `mentor`
- `admin`

### 4.2 user_sessions

建议字段：

- `id`
- `user_id`
- `token_hash`
- `expires_at`
- `created_at`

## 5. 出生资料与命盘表

### 5.1 birth_profiles

建议字段：

- `id`
- `user_id`
- `birth_date`
- `birth_time`
- `birth_location`
- `timezone`
- `gender`
- `source`
- `created_at`
- `updated_at`

### 5.2 ziwei_charts

建议字段：

- `id`
- `birth_profile_id`
- `engine_version`
- `school`
- `chart_json`
- `created_at`

说明：

- `chart_json` 存排盘引擎输出的完整结构化命盘
- 不建议拆到过细表，V1 先 JSON 化存储更稳

## 6. 占卜与评分表

### 6.1 destiny_readings

建议字段：

- `id`
- `user_id`
- `birth_profile_id`
- `question`
- `theme`
- `reading_type`
- `status`
- `created_at`
- `completed_at`

`reading_type` 建议：

- `quick`
- `standard`
- `deep`
- `daily`

### 6.2 five_dimension_inputs

建议字段：

- `id`
- `reading_id`
- `structure_value`
- `timing_value`
- `energy_value`
- `mind_value`
- `action_value`
- `input_json`
- `created_at`

说明：

- 既存拆开的值，也存完整 `input_json`
- 方便查询，也方便回溯版本

### 6.3 five_dimension_scores

建议字段：

- `id`
- `reading_id`
- `career_score`
- `wealth_score`
- `love_score`
- `health_score`
- `dominant_factor`
- `risk_flags_json`
- `breakdown_json`
- `engine_version`
- `created_at`

## 7. 卡牌相关表

### 7.1 destiny_cards

建议字段：

- `id`
- `card_key`
- `name`
- `category`
- `value_mode`
- `base_value`
- `positive_value`
- `negative_value`
- `keywords_json`
- `positive_meaning`
- `shadow_meaning`
- `interpretation_hint`
- `theme_bias_json`
- `prompt_text`
- `status`

### 7.2 card_draws

建议字段：

- `id`
- `reading_id`
- `archetype_card_id`
- `energy_card_1_id`
- `energy_card_2_id`
- `event_card_id`
- `raw_energy_score`
- `mapped_energy_score`
- `draw_json`
- `created_at`

## 8. 问卷相关表

### 8.1 questionnaire_results

建议字段：

- `id`
- `reading_id`
- `mind_answers_json`
- `mind_average`
- `mind_level`
- `mind_factor`
- `action_answers_json`
- `action_total`
- `action_raw`
- `action_label`
- `created_at`

## 9. 报告表

### 9.1 destiny_reports

建议字段：

- `id`
- `reading_id`
- `report_type`
- `report_version`
- `report_json`
- `report_text`
- `pdf_url`
- `created_at`

`report_type` 建议：

- `light`
- `single_theme`
- `full`
- `member_daily`
- `member_weekly`
- `member_monthly`

## 10. 会员与支付表

### 10.1 memberships

建议字段：

- `id`
- `user_id`
- `plan_key`
- `status`
- `started_at`
- `expires_at`
- `provider`
- `provider_ref`

### 10.2 payments

建议字段：

- `id`
- `user_id`
- `reading_id`
- `membership_id`
- `amount`
- `currency`
- `status`
- `provider`
- `provider_ref`
- `created_at`

## 11. 课程与认证表

### 11.1 courses

建议字段：

- `id`
- `course_key`
- `title`
- `level`
- `status`
- `price`
- `currency`
- `meta_json`

### 11.2 enrollments

建议字段：

- `id`
- `user_id`
- `course_id`
- `status`
- `enrolled_at`
- `completed_at`

### 11.3 certifications

建议字段：

- `id`
- `user_id`
- `level`
- `status`
- `cert_number`
- `issued_at`
- `expires_at`
- `review_notes`
- `created_at`

## 12. 版本与配置表

### 12.1 engine_versions

建议字段：

- `id`
- `engine_name`
- `version`
- `notes`
- `created_at`

### 12.2 rule_sets

建议字段：

- `id`
- `rule_type`
- `version`
- `school`
- `config_json`
- `created_at`

## 13. 关系概要

核心关系建议：

- `users 1:N birth_profiles`
- `birth_profiles 1:N ziwei_charts`
- `users 1:N destiny_readings`
- `destiny_readings 1:1 card_draws`
- `destiny_readings 1:1 questionnaire_results`
- `destiny_readings 1:1 five_dimension_inputs`
- `destiny_readings 1:1 five_dimension_scores`
- `destiny_readings 1:N destiny_reports`
- `users 1:N enrollments`
- `users 1:N certifications`

## 14. V1 建表优先级

MVP 先建：

1. users
2. birth_profiles
3. destiny_readings
4. ziwei_charts
5. destiny_cards
6. card_draws
7. questionnaire_results
8. five_dimension_inputs
9. five_dimension_scores
10. destiny_reports
11. memberships
12. payments

第二阶段再建：

- courses
- enrollments
- certifications
- rule_sets
- engine_versions

## 15. 当前版本结论

本表设计优先支持：

- 占卜闭环
- 报告闭环
- 会员闭环
- 后续课程/认证扩展

它不是最终数据库 migration 文件，但已经足够作为实现时的结构底稿。

