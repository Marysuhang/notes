# 电商商品列表页项目

一个基于Vue 3、Element Plus和Pinia的现代化电商商品列表页，包含完整的前端功能和优化的用户体验。

## 功能特性

### 核心功能
- **商品筛选** - 支持分类、品牌、价格范围、评分、库存状态多维度筛选
- **智能排序** - 价格（升序/降序）、评分、销量、最新上架等多种排序方式
- **分页功能** - 完整的分页控制，支持自定义每页显示数量
- **搜索功能** - 实时搜索商品名称、品牌和描述

### 高级功能
- **防抖处理** - 搜索和筛选操作应用防抖，避免频繁请求
- **骨架屏** - 数据加载时显示骨架屏提升用户体验
- **虚拟滚动** - 商品数量多时启用虚拟滚动，优化渲染性能
- **猜你喜欢** - AI推荐模块，模拟个性化推荐
- **响应式设计** - 完美适配桌面端和移动端

## 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **Pinia** - Vue状态管理库
- **Element Plus** - UI组件库
- **Vite** - 构建工具和开发服务器

##  项目结构

```
src/
├── components/           # Vue组件
│   ├── ProductCard.vue      # 商品卡片组件
│   ├── ProductSkeleton.vue  # 骨架屏组件
│   ├── Recommendation.vue   # 猜你喜欢组件
│   └── VirtualScroll.vue    # 虚拟滚动组件
├── stores/              # Pinia状态管理
│   └── productStore.js     # 商品状态管理
├── utils/               # 工具函数
│   └──debounce.js         # 防抖函数
├── views/               # 页面组件
│   └── ProductList.vue     # 商品列表页
├── data/                # 数据文件
│   └── mockData.js         # 模拟数据
├── App.vue              # 根组件
└── main.js              # 应用入口
```

### 前置要求
- Node.js 16.x 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆项目或下载代码**

```bash
git clone <repository-url>
```

2. **安装依赖**

```bash
npm install
# 或使用yarn
yarn install
```

3. **运行开发服务器**

```bash
npm run dev
# 或
yarn dev
```

4. **访问应用**

打开浏览器，访问 `http://localhost:8080`

### 构建生产版本

```bash
npm run build
# 构建产物在 dist/ 目录中

# 预览生产版本
npm run preview
```

## 使用说明

### 1. 商品筛选
- **分类筛选**：选择电子产品、服装或家居类别
- **品牌筛选**：选择特定品牌
- **价格范围**：使用滑块选择价格区间
- **评分筛选**：选择最低评分要求
- **库存筛选**：仅显示有货商品

### 2. 排序功能
- 默认排序
- 价格从低到高 / 从高到低
- 评分从高到低
- 销量从高到低
- 最新上架

### 3. 搜索功能
- 在搜索框中输入关键词
- 支持商品名称、品牌、描述搜索
- 防抖处理，输入后500ms自动搜索

### 4. 分页控制
- 底部显示分页器
- 可调整每页显示数量（20/50/100条）
- 支持页码跳转

### 5. 虚拟滚动
- 当商品数量超过100条时自动启用
- 可手动开启/关闭
- 优化大数据量下的滚动性能

### 6. 猜你喜欢
- 顶部显示个性化推荐商品
- 支持刷新推荐列表
- 显示推荐理由

## 🧪 模拟数据

项目使用模拟数据进行开发，包含：
- 200个模拟商品
- 6个推荐商品
- 随机生成的价格、评分、销量等数据
- 使用Lorem Picsum服务提供随机商品图片

### 替换真实数据
要连接真实API，修改 `src/stores/productStore.js` 中的 `fetchProducts` 方法：

```javascript
// 替换为真实的API调用
const response = await fetch('https://api.yourdomain.com/products')
const data = await response.json()
products.value = data.products
```

## 配置选项

### 端口配置
如需修改端口，编辑 `vite.config.js`：

```javascript
export default defineConfig({
  server: {
    port: 3000,  // 修改端口号
    host: '0.0.0.0'  // 允许局域网访问
  }
})
```

### 虚拟滚动配置
在 `src/components/VirtualScroll.vue` 中可调整：
- `itemHeight` - 每个商品项的高度
- `containerHeight` - 滚动容器高度
- `buffer` - 预渲染的额外项数

##  响应式设计

项目已针对不同设备进行优化：
- **桌面端**：多列网格布局
- **平板端**：自适应列数
- **移动端**：单列垂直布局，触摸友好

##  自定义样式

### 修改主题颜色
编辑 `src/App.vue` 中的CSS变量：

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #ff4444;
}
```

### 调整商品卡片样式
修改 `src/components/ProductCard.vue` 中的样式变量。

##  常见问题

### 1. 端口被占用
```bash
# 修改端口
npm run dev -- --port 3000
```

### 2. 依赖安装失败
```bash
# 清除缓存并重新安装
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 3. 图片加载失败
- 检查网络连接
- 确认 `src/data/mockData.js` 中的图片URL格式正确
- 可替换为本地图片或CDN图片

### 4. 样式不显示
确保在 `src/main.js` 中正确引入Element Plus样式：
```javascript
import 'element-plus/dist/index.css'
```

## 📈 性能优化

1. **组件懒加载** - 按需加载组件
2. **图片懒加载** - 使用 `loading="lazy"` 属性
3. **代码分割** - Vite自动分割代码块
4. **状态管理** - 使用Pinia进行高效状态管理
5. **虚拟滚动** - 减少DOM节点数量

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 支持

如有问题或建议，请：
1. 查看 [常见问题](#常见问题) 部分
2. 提交 Issue
3. 或联系项目维护者

## 下一步计划

- [ ] 添加购物车功能
- [ ] 集成真实支付接口
- [ ] 添加用户登录/注册
- [ ] 实现商品详情页
- [ ] 添加订单管理系统
- [ ] 集成评论和评分系统

---
如果有任何问题，请查看上述文档或提交Issue。祝你使用愉快！