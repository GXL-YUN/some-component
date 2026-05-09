# 宠觅 App 设计指南

## 1. 品牌定位

**应用名称**：宠觅  
**定位**：宠物交易与服务一站式平台  
**设计风格**：温暖、信任、专业、亲和  
**目标用户**：养宠用户、潜在宠物购买者（25-40岁，注重品质与服务）  

## 2. 配色方案

### 主色调（Primary）
- **品牌主色**：`#FF6B35`（活力橙，代表温暖与活力）
  - `bg-primary` / `text-primary` / `border-primary`
  - Tailwind: `bg-orange-500` / `text-orange-500`
  
- **品牌辅助色**：`#4ECDC4`（清新蓝绿，代表信任与健康）
  - `bg-secondary` / `text-secondary`
  - Tailwind: `bg-teal-400` / `text-teal-400`

### 中性色（Neutral）
- **深色文字**：`#1F2937` (gray-800)
- **正文文字**：`#374151` (gray-700)
- **次要文字**：`#6B7280` (gray-500)
- **占位符文字**：`#9CA3AF` (gray-400)
- **边框颜色**：`#E5E7EB` (gray-200)
- **背景色**：`#F9FAFB` (gray-50)

### 语义色（Semantic）
- **成功**：`#10B981` (emerald-500)
- **警告**：`#F59E0B` (amber-500)
- **错误**：`#EF4444` (red-500)
- **信息**：`#3B82F6` (blue-500)

### 功能色
- **猫宠标签**：`#F472B6` (pink-400)
- **狗宠标签**：`#60A5FA` (blue-400)
- **待报价**：`#FBBF24` (amber-400)
- **报价中**：`#3B82F6` (blue-500)
- **已成交**：`#10B981` (emerald-500)
- **已过期**：`#9CA3AF` (gray-400)

## 3. 字体规范

### 标题层级
- **H1 页面标题**：`text-2xl font-bold` (24px)
- **H2 区块标题**：`text-xl font-semibold` (20px)
- **H3 卡片标题**：`text-lg font-medium` (18px)
- **H4 小标题**：`text-base font-medium` (16px)

### 正文层级
- **正文**：`text-sm` (14px)
- **辅助文字**：`text-xs` (12px)
- **大号正文**：`text-base` (16px)

## 4. 间距系统

### 页面边距
- **页面水平边距**：`px-4` (16px)
- **页面顶部边距**：`pt-4` (16px)

### 卡片与容器
- **卡片内边距**：`p-4` (16px)
- **卡片间距**：`gap-3` (12px) 或 `mb-3`
- **列表项间距**：`gap-2` (8px)

### 组件间距
- **按钮组间距**：`gap-3` (12px)
- **表单项间距**：`space-y-3` (12px)
- **图标与文字间距**：`gap-2` (8px)

## 5. 组件使用原则

### 组件选型约束
- **按钮**：优先使用 `@/components/ui/button`，禁止用 View/Text 手搓
- **输入框**：优先使用 `@/components/ui/input` 或 `@/components/ui/textarea`
- **选择器**：优先使用 `@/components/ui/select` 或 `@/components/ui/radio-group`
- **卡片**：优先使用 `@/components/ui/card`
- **弹窗**：优先使用 `@/components/ui/dialog` 或 `@/components/ui/drawer`
- **标签页**：优先使用 `@/components/ui/tabs`
- **提示**：优先使用 `@/components/ui/toast` 或 `@/components/ui/sonner`
- **加载态**：优先使用 `@/components/ui/skeleton`
- **标签**：优先使用 `@/components/ui/badge`
- **分隔线**：优先使用 `@/components/ui/separator`
- **进度条**：优先使用 `@/components/ui/progress`

### 页面组件选型前置（CRITICAL）
在创建或重写页面前，必须先判断页面需要哪些 UI 单元，并优先复用 `@/components/ui/*`：
- 按钮、输入框、卡片、标签、Tabs、弹窗、Toast、Skeleton 等
- 不要用 View/Text 手搓通用 UI 组件

## 6. 导航结构

### TabBar 页面
1. **首页** (`pages/home/index`) - 主入口、推荐、快捷功能
2. **需求** (`pages/demand/index`) - 买宠需求发布与管理
3. **洗护** (`pages/grooming/index`) - 洗护预约服务
4. **我的** (`pages/profile/index`) - 个人中心

### 主要页面跳转流程
- 首页 → 需求详情 → 报价列表 → 报价详情 → IM 聊天
- 首页 → 门店列表 → 门店详情 → 预约 → 预约详情
- 我的 → 订单列表 → 订单详情 → 物流跟踪
- 我的 → 宠物档案 → 档案详情 → 成长记录

## 7. 容器样式原则

### 卡片容器
- **圆角**：`rounded-xl` (12px)
- **阴影**：`shadow-sm`（轻阴影）
- **背景**：`bg-white`
- **边框**：`border border-gray-100`（可选）

### 按钮样式
- **主按钮**：`bg-orange-500 text-white rounded-lg`
- **次按钮**：`bg-gray-100 text-gray-700 rounded-lg`
- **禁用态**：`opacity-50 cursor-not-allowed`

### 输入框样式
- **默认态**：`bg-gray-50 rounded-lg border border-gray-200`
- **聚焦态**：`border-orange-500 ring-2 ring-orange-100`

## 8. 状态展示原则

### 空状态
- 使用居中布局 + 图标 + 提示文字
- 颜色：`text-gray-400`
- 提供"去发布"等引导按钮

### 加载态
- 列表加载：使用 `Skeleton` 组件展示占位内容
- 按钮加载：按钮内显示 Spinner + "加载中..."文字

### 错误态
- 使用 `Alert` 组件展示错误信息
- 提供重试按钮

## 9. 小程序约束

### 包体积限制
- 主包控制在 2MB 以内
- 分包按功能模块划分（需求、洗护、订单）

### 图片策略
- 商品图片、用户头像等使用 TOS 对象存储
- TabBar 图标使用本地 PNG（微信小程序要求）

### 性能优化
- 长列表使用虚拟滚动
- 图片懒加载
- 接口数据缓存

## 10. 设计清单（开发前必查）

- [ ] 主色/辅色使用 Tailwind 类名（`bg-orange-500`、`text-teal-400`）
- [ ] 通用组件优先使用 `@/components/ui/*`
- [ ] 不用 View/Text 手搓按钮、输入框、卡片等通用 UI
- [ ] 容器样式遵循圆角、阴影、边距规范
- [ ] 页面边距使用 `px-4`、`pt-4`
- [ ] TabBar 配置完整且图标已生成
- [ ] 空状态、加载态有明确的视觉风格
- [ ] 状态颜色符合语义色定义（成功绿、错误红等）
