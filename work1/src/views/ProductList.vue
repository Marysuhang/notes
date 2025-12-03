<template>
  <div class="product-list-page">
    <!-- 猜你喜欢模块 -->
    <Recommendation 
      :products="store.recommendations" 
      :loading="store.loading"
      @refresh="store.fetchRecommendations"
      @add-to-cart="addToCart"
    />
    
    <!-- 筛选工具栏 -->
    <div class="filter-toolbar">
      <div class="search-section">
        <el-input
          v-model="searchInput"
          placeholder="搜索商品名称、品牌或描述..."
          :prefix-icon="Search"
          clearable
          @input="handleSearchInput"
          @clear="handleSearchClear"
          :loading="store.searchLoading"
          class="search-input"
        >
          <template #append>
            <el-button :icon="Search" @click="store.setSearchQuery(searchInput)" />
          </template>
        </el-input>
      </div>
      
      <div class="filter-controls">
        <!-- 分类筛选 -->
        <el-select
          v-model="store.filters.category"
          placeholder="所有分类"
          clearable
          @change="handleFilterChange"
          class="filter-select"
        >
          <el-option
            v-for="category in store.availableCategories"
            :key="category"
            :label="getCategoryLabel(category)"
            :value="category"
          />
        </el-select>
        
        <!-- 品牌筛选 -->
        <el-select
          v-model="store.filters.brand"
          placeholder="所有品牌"
          clearable
          @change="handleFilterChange"
          class="filter-select"
        >
          <el-option
            v-for="brand in store.availableBrands"
            :key="brand"
            :label="brand"
            :value="brand"
          />
        </el-select>
        
        <!-- 价格范围 -->
        <div class="price-filter">
          <span class="price-label">价格:</span>
          <el-slider
            v-model="store.filters.priceRange"
            range
            :min="0"
            :max="5000"
            :step="100"
            @change="handlePriceChange"
            class="price-slider"
          />
          <span class="price-value">
            ￥{{ store.filters.priceRange[0] }} - ￥{{ store.filters.priceRange[1] }}
          </span>
        </div>
        
        <!-- 评分筛选 -->
        <el-select
          v-model="store.filters.rating"
          placeholder="最低评分"
          clearable
          @change="handleFilterChange"
          class="filter-select"
        >
          <el-option label="不限" :value="0" />
          <el-option label="3星以上" :value="3" />
          <el-option label="4星以上" :value="4" />
          <el-option label="4.5星以上" :value="4.5" />
        </el-select>
        
        <!-- 库存筛选 -->
        <el-checkbox
          v-model="store.filters.inStock"
          @change="handleFilterChange"
          class="stock-checkbox"
        >
          仅显示有货
        </el-checkbox>
        
        <!-- 排序 -->
        <el-select
          v-model="store.sortBy"
          placeholder="排序方式"
          @change="store.setSort"
          class="sort-select"
        >
          <el-option label="默认排序" value="default" />
          <el-option label="价格从低到高" value="price_asc" />
          <el-option label="价格从高到低" value="price_desc" />
          <el-option label="评分从高到低" value="rating_desc" />
          <el-option label="销量从高到低" value="sales_desc" />
          <el-option label="最新上架" value="newest" />
        </el-select>
        
        <!-- 重置按钮 -->
        <el-button
          type="info"
          plain
          @click="store.resetFilters"
          class="reset-btn"
        >
          重置筛选
        </el-button>
      </div>
    </div>
    
    <!-- 结果统计 -->
    <div v-if="!store.loading" class="result-info">
      <div class="result-count">
        找到 {{ store.pagination.total }} 件商品
        <span v-if="store.searchQuery" class="search-query">
          (搜索: "{{ store.searchQuery }}")
        </span>
      </div>
      
      <div class="view-controls">
        <span>每页显示:</span>
        <el-select
          v-model="pageSize"
          @change="handlePageSizeChange"
          size="small"
          class="page-size-select"
        >
          <el-option :value="20" label="20条" />
          <el-option :value="50" label="50条" />
          <el-option :value="100" label="100条" />
        </el-select>
      </div>
    </div>
    
    <!-- 商品列表 -->
    <div class="product-list-container">
      <!-- 加载状态 -->
      <div v-if="store.loading" class="loading-state">
        <ProductSkeleton :count="store.pagination.pageSize" />
      </div>
      
      <!-- 虚拟滚动（商品数量多时启用） -->
      <template v-else-if="enableVirtualScroll && store.filteredProducts.length > 100">
        <VirtualScroll
          :items="store.filteredProducts"
          :item-height="350"
          :container-height="600"
          :buffer="10"
          class="virtual-list"
        >
          <template #default="{ item }">
            <ProductCard :product="item" @add-to-cart="addToCart" />
          </template>
        </VirtualScroll>
      </template>
      
      <!-- 普通网格布局 -->
      <template v-else-if="store.filteredProducts.length > 0">
        <div class="product-grid">
          <ProductCard
            v-for="product in store.currentProducts"
            :key="product.id"
            :product="product"
            @add-to-cart="addToCart"
          />
        </div>
      </template>
      
      <!-- 空状态 -->
      <div v-else class="empty-state">
        <el-empty description="没有找到符合条件的商品">
          <template #image>
            <el-icon size="100"><Search /></el-icon>
          </template>
          <template #description>
            <p>尝试修改搜索条件或重置筛选</p>
            <el-button type="primary" @click="store.resetFilters">
              重置筛选条件
            </el-button>
          </template>
        </el-empty>
      </div>
    </div>
    
    <!-- 分页 -->
    <div v-if="!store.loading && store.pagination.total > store.pagination.pageSize" class="pagination-container">
      <el-pagination
        v-model:current-page="store.pagination.page"
        :page-size="store.pagination.pageSize"
        :total="store.pagination.total"
        :page-sizes="[20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="store.setPage"
        @size-change="store.setPageSize"
        background
      />
    </div>
    
    <!-- 性能优化开关 -->
    <div class="performance-toggle">
      <el-switch
        v-model="enableVirtualScroll"
        active-text="启用虚拟滚动"
        inactive-text="关闭虚拟滚动"
      />
      <span class="tip">(商品超过100条时自动启用)</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useProductStore } from '../stores/productStore'
import { debounce } from '../utils/debounce'

// 组件导入
import Recommendation from '../components/Recommendation.vue'
import ProductCard from '../components/ProductCard.vue'
import ProductSkeleton from '../components/ProductSkeleton.vue'
import VirtualScroll from '../components/VirtualScroll.vue'

const store = useProductStore()

// 本地状态
const searchInput = ref('')
const pageSize = ref(20)
const enableVirtualScroll = ref(true)

// 计算属性
const getCategoryLabel = (category) => {
  const labels = {
    'electronics': '电子产品',
    'clothing': '服装服饰',
    'home': '家居用品'
  }
  return labels[category] || category
}

// 方法
const handleSearchInput = debounce(() => {
  store.setSearchQuery(searchInput.value)
}, 500)

const handleSearchClear = () => {
  store.setSearchQuery('')
}

const handleFilterChange = debounce(() => {
  store.fetchProducts()
}, 300)

const handlePriceChange = debounce(() => {
  store.fetchProducts()
}, 300)

const handlePageSizeChange = (size) => {
  store.setPageSize(size)
}

const addToCart = (product) => {
  ElMessage.success(`已添加 ${product.name} 到购物车`)
  // 这里可以调用购物车store
}

// 监听搜索输入变化
watch(() => store.searchQuery, (newVal) => {
  if (newVal !== searchInput.value) {
    searchInput.value = newVal
  }
})

// 监听分页变化，滚动到顶部
watch(() => store.pagination.page, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// 初始化
onMounted(() => {
  store.init()
})
</script>

<style scoped>
.product-list-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

/* 筛选工具栏 */
.filter-toolbar {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.search-section {
  margin-bottom: 20px;
}

.search-input {
  max-width: 600px;
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

.filter-select,
.sort-select {
  width: 160px;
}

.price-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
}

.price-label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.price-slider {
  flex: 1;
  min-width: 200px;
}

.price-value {
  font-size: 14px;
  color: #409eff;
  min-width: 140px;
  white-space: nowrap;
}

.stock-checkbox {
  margin-left: 10px;
}

.reset-btn {
  margin-left: auto;
}

/* 结果统计 */
.result-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.05);
}

.result-count {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.search-query {
  color: #409eff;
  font-weight: normal;
}

.view-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #666;
}

.page-size-select {
  width: 100px;
}

/* 商品列表容器 */
.product-list-container {
  min-height: 600px;
}

.loading-state {
  padding: 40px 0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.virtual-list {
  background: white;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.empty-state {
  padding: 80px 0;
  background: white;
  border-radius: 12px;
  text-align: center;
}

/* 分页 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

/* 性能优化开关 */
.performance-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 14px;
}

.tip {
  color: #888;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .product-list-page {
    padding: 15px;
  }
  
  .price-filter {
    min-width: 250px;
  }
}

@media (max-width: 992px) {
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-select,
  .sort-select,
  .price-filter {
    width: 100%;
  }
  
  .reset-btn {
    margin-left: 0;
    width: 100%;
  }
  
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }
}

@media (max-width: 768px) {
  .result-info {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>