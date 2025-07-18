# 前端监控平台管理系统设置文档

## 1. 系统概述

前端监控平台管理系统用于统一管理各业务前端应用的监控配置、数据分析、权限分配、告警策略等，提升监控的灵活性和可运维性。

## 2. 系统设置项页面设计

### 2.1 应用管理

#### 2.1.1 应用列表页

- 表格字段：AppKey、应用名称、负责人、状态、创建时间、操作（编辑/删除/详情/配置监控）
- 支持搜索（按名称、AppKey、负责人）、分页、分组筛选
- 操作按钮：新增应用、批量删除
- **个性化监控配置入口：每行“配置监控”按钮，跳转到该应用的监控配置页面（与AppKey绑定）**

#### 2.1.2 新增/编辑应用弹窗

- 字段：应用名称（必填）、负责人（下拉/输入）、分组（可选）、标签（多选）、描述
- 自动生成AppKey（只读/复制）
- 提交/取消按钮

#### 2.1.3 应用详情页

- 展示应用基本信息、分组、标签、AppKey、创建/更新时间
- 支持编辑、删除、查看关联监控配置
- **“监控配置”Tab：直接进入该AppKey的个性化监控配置页面**

---

### 2.2 监控配置管理

#### 2.2.1 配置列表页

- 表格字段：应用名称、AppKey、配置版本、启用状态、更新时间、操作（编辑/回滚/详情）
- 支持按应用/状态筛选、搜索
- 操作按钮：新建配置、批量操作
- **每条配置都与AppKey强关联，配置下发即为该AppKey的个性化监控策略**

#### 2.2.2 配置编辑页

- 选择应用（AppKey，或由入口自动带入）
- 监控项开关（错误、性能、行为、网络等，Switch组件）
- 采集频率/采样率（InputNumber/Slider）
- 自定义埋点（动态表单，事件名、描述、参数等）
- 配置预览与JSON编辑
- 保存、发布、回滚按钮
- **说明：所有配置项均为该AppKey（应用）专属，支持动态调整，前端SDK会定时/实时拉取最新配置**

#### 2.2.3 配置历史页

- 配置变更记录（时间、操作人、变更内容、回滚操作）
- 支持按AppKey/应用筛选

---

### 2.3 告警与通知设置

#### 2.3.1 告警规则页

- 表格字段：规则名称、类型（错误/性能等）、阈值、启用状态、操作（编辑/删除）
- 新建/编辑规则弹窗：
    - 字段：规则名称、类型、监控项、阈值、通知方式、告警分组、静默时段
    - 启用/禁用开关
    - 保存/取消

#### 2.3.2 告警渠道页

- 渠道类型（邮件、短信、Webhook、IM）、目标、状态、操作
- 新增/编辑渠道弹窗

#### 2.3.3 告警历史页

- 表格字段：告警时间、应用、类型、内容、处理状态、处理人、操作
- 支持筛选、导出

---

### 2.4 权限与成员管理

#### 2.4.1 成员列表页

- 表格字段：成员姓名、账号、角色、所属应用/分组、状态、操作
- 邀请成员（弹窗，输入邮箱/账号、分配角色、分组）
- 批量移除、角色变更

#### 2.4.2 角色权限页

- 角色列表（管理员、开发、运维、只读等）
- 权限分配（树形/多选，页面/操作级权限）
- 新建/编辑角色

#### 2.4.3 操作日志页

- 表格字段：操作时间、操作人、操作类型、对象、详情
- 支持筛选、导出

---

### 2.5 数据分析与可视化

#### 2.5.1 监控大盘页

- 可视化卡片：PV、UV、错误率、性能分布、告警趋势等
- 图表类型：折线、柱状、饼图、热力图
- 支持自定义指标、时间范围筛选、导出报表

#### 2.5.2 多维分析页

- 维度选择（应用、时间、用户、地区、终端等）
- 筛选条件、对比分析、数据明细表

---

### 2.6 插件与扩展管理

#### 2.6.1 插件市场页

- 插件列表（名称、简介、状态、操作）
- 支持搜索、分类筛选、安装/卸载/配置

#### 2.6.2 插件配置页

- 插件详情、参数配置表单、启用/禁用开关

---

### 2.7 系统设置

#### 2.7.1 平台信息页

- 字段：平台名称、Logo上传、主题色选择、描述
- 保存按钮

#### 2.7.2 国际化设置

- 语言列表、默认语言、添加/编辑语言包

#### 2.7.3 登录与认证

- 登录方式（本地、单点登录、OAuth等）
- 第三方认证配置表单

#### 2.7.4 日志与存储

- 日志级别、存储周期、导出/清理
- 数据备份与恢复操作

---

## 3. 页面路由建议

- /apps 应用管理
- /apps/:id 应用详情
- /configs 监控配置
- /configs/:id 配置编辑
- /alerts/rules 告警规则
- /alerts/history 告警历史
- /members 成员管理
- /roles 角色权限
- /logs 操作日志
- /dashboard 监控大盘
- /analysis 多维分析
- /plugins 插件市场
- /settings/platform 平台信息
- /settings/i18n 国际化
- /settings/auth 登录认证
- /settings/storage 日志与存储

## 4. 交互与UI建议

- 表格、弹窗、抽屉、Tab、树形、卡片、图表等常用组件
- 支持批量操作、筛选、导出、权限控制
- 重要操作需二次确认，表单需校验
- 支持响应式布局，适配PC与大屏

## 5. 附录

- 可附带页面原型图、字段字典、接口文档等
- 推荐使用Ant Design、Element Plus等主流UI框架

---

> 本文档为页面级详细设计，前端开发可直接按各页面结构与字段实现，满足监控平台管理系统的全功能需求。
