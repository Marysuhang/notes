<template>
  <div id="app">
    <!-- 头部 -->
    <header class="app-header">
      <div class="header-content">
        <div class="logo">
          <el-icon class="logo-icon"><ShoppingBag /></el-icon>
          <h1>电商商品列表</h1>
        </div>
        <div class="header-stats">
          <span class="stat-item">
            <el-icon><Goods /></el-icon>
            商品数: {{ totalProducts }}
          </span>
          <span class="stat-item">
            <el-icon><Star /></el-icon>
            推荐: {{ recommendationCount }}
          </span>
        </div>
      </div>
      <p class="subtitle">Vue3 + Element Plus + Pinia 完整实现</p>
    </header>
    
    <!-- 主内容 -->
    <main class="app-main">
      <ProductList />
    </main>
    
    <!-- 底部 -->
    <footer class="app-footer">
      <div class="footer-content">
        <p>© 2024 电商商品列表演示项目 - 包含筛选、排序、分页、防抖、骨架屏、虚拟滚动、猜你喜欢等完整功能</p>
        <div class="tech-stack">
          <el-tag size="small" type="info">Vue 3</el-tag>
          <el-tag size="small" type="info">Pinia</el-tag>
          <el-tag size="small" type="info">Element Plus</el-tag>
          <el-tag size="small" type="info">Vite</el-tag>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ShoppingBag, Goods, Star } from '@element-plus/icons-vue'
import { useProductStore } from './stores/productStore'
import ProductList from './views/ProductList.vue'
import { computed } from 'vue'

const store = useProductStore()

const totalProducts = computed(() => store.products.length)
const recommendationCount = computed(() => store.recommendations.length)
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 0;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-icon {
  font-size: 32px;
}

.app-header h1 {
  font-size: 28px;
  margin: 0;
}

.subtitle {
  margin-top: 10px;
  opacity: 0.9;
  font-size: 16px;
}

.header-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  opacity: 0.9;
}

.app-main {
  flex: 1;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  background: white;
  padding: 20px;
  margin-top: 40px;
  border-top: 1px solid #e4e7ed;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  text-align: center;
  color: #666;
  font-size: 14px;
}

.footer-content p {
  margin-bottom: 15px;
}

.tech-stack {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .header-stats {
    justify-content: center;
  }
  
  .app-main {
    padding: 10px;
  }
}
</style>