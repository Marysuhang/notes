<template>
  <div class="product-card">
    <!-- 图片区域 -->
    <div class="card-image" @click="viewProductDetail">
      <el-image
        :src="product.image"
        :alt="product.name"
        fit="cover"
        loading="lazy"
        class="product-image"
      >
        <template #placeholder>
          <div class="image-loading">
            <el-icon><Picture /></el-icon>
          </div>
        </template>
        <template #error>
          <div class="image-error">
            <el-icon><Picture /></el-icon>
            <span>加载失败</span>
          </div>
        </template>
      </el-image>
      
      <!-- 标签 -->
      <div class="image-tags">
        <span 
          v-for="tag in product.tags.slice(0, 2)" 
          :key="tag" 
          class="tag"
          :class="getTagClass(tag)"
        >
          {{ tag }}
        </span>
      </div>
      
      <!-- 库存状态 -->
      <div v-if="!product.inStock" class="stock-badge out">
        缺货
      </div>
      <div v-else-if="product.sales > 1000" class="stock-badge hot">
        热销
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="card-content">
      <h3 class="product-name" @click="viewProductDetail">
        {{ product.name }}
      </h3>
      
      <!-- 品牌 -->
      <div class="product-brand">
        <el-icon><OfficeBuilding /></el-icon>
        {{ product.brand }}
      </div>
      
      <!-- 价格 -->
      <div class="product-price">
        <span class="current">￥{{ product.price }}</span>
        <span v-if="product.originalPrice > product.price" class="original">
          ￥{{ product.originalPrice }}
        </span>
        <span v-if="product.originalPrice > product.price" class="discount">
          -{{ calculateDiscount(product.price, product.originalPrice) }}%
        </span>
      </div>
      
      <!-- 评分和销量 -->
      <div class="product-meta">
        <div class="rating">
          <el-rate
            v-model="product.rating"
            disabled
            :max="5"
            allow-half
            size="small"
          />
          <span class="rating-value">{{ product.rating.toFixed(1) }}</span>
          <span class="review-count">({{ product.reviewCount }})</span>
        </div>
        <div class="sales">
          销量: {{ formatSales(product.sales) }}
        </div>
      </div>
      
      <!-- 描述 -->
      <p class="product-desc" v-if="showDescription">
        {{ truncateDescription(product.description) }}
      </p>
      
      <!-- 操作按钮 -->
      <div class="card-actions">
        <el-button
          type="primary"
          :disabled="!product.inStock"
          @click="emit('add-to-cart', product)"
          size="small"
          class="cart-btn"
        >
          <el-icon><ShoppingCart /></el-icon>
          {{ product.inStock ? '加入购物车' : '已售罄' }}
        </el-button>
        
        <el-tooltip content="收藏" placement="top">
          <el-button
            type="text"
            @click="addToWishlist"
            :class="{ 'wishlisted': isWishlisted }"
          >
            <el-icon><Star /></el-icon>
          </el-button>
        </el-tooltip>
        
        <el-tooltip content="快速查看" placement="top">
          <el-button
            type="text"
            @click="quickView"
          >
            <el-icon><View /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Picture, 
  OfficeBuilding, 
  ShoppingCart, 
  Star, 
  View 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart'])

// 本地状态
const isWishlisted = ref(false)

// 计算属性
const showDescription = computed(() => {
  return props.product.description && props.product.description.length > 0
})

// 方法
const getTagClass = (tag) => {
  const tagClassMap = {
    '新品上市': 'new',
    '热销爆款': 'hot',
    '限时特惠': 'sale',
    '官方正品': 'official',
    '旗舰机型': 'premium'
  }
  return tagClassMap[tag] || 'default'
}

const calculateDiscount = (current, original) => {
  return Math.round((1 - current / original) * 100)
}

const formatSales = (sales) => {
  if (sales >= 10000) return (sales / 10000).toFixed(1) + '万'
  if (sales >= 1000) return (sales / 1000).toFixed(1) + '千'
  return sales
}

const truncateDescription = (desc) => {
  if (desc.length > 60) {
    return desc.substring(0, 60) + '...'
  }
  return desc
}

const viewProductDetail = () => {
  console.log('查看商品详情:', props.product.id)
  // 跳转到详情页
}

const addToWishlist = () => {
  isWishlisted.value = !isWishlisted.value
  ElMessage.success(
    isWishlisted.value 
      ? `已收藏 ${props.product.name}`
      : `已取消收藏 ${props.product.name}`
  )
}

const quickView = () => {
  console.log('快速查看:', props.product.id)
  // 打开快速查看弹窗
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  cursor: pointer;
}

.product-image {
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.image-loading,
.image-error {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #999;
}

.image-loading .el-icon,
.image-error .el-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.image-tags {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.tag.new {
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
}

.tag.hot {
  background: linear-gradient(135deg, #ff4444, #ff6b6b);
}

.tag.sale {
  background: linear-gradient(135deg, #409eff, #6cb5ff);
}

.tag.official {
  background: linear-gradient(135deg, #67c23a, #85ce61);
}

.tag.premium {
  background: linear-gradient(135deg, #722ed1, #9254de);
}

.tag.default {
  background: rgba(0, 0, 0, 0.7);
}

.stock-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.stock-badge.out {
  background: rgba(0, 0, 0, 0.7);
}

.stock-badge.hot {
  background: linear-gradient(135deg, #ff4444, #ff6b6b);
}

.card-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
  cursor: pointer;
  transition: color 0.2s;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
}

.product-name:hover {
  color: #409eff;
}

.product-brand {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;
  margin-bottom: 10px;
}

.product-brand .el-icon {
  font-size: 14px;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.current {
  font-size: 22px;
  font-weight: bold;
  color: #ff4444;
}

.original {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.discount {
  background: #ff4444;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating :deep(.el-rate__icon) {
  font-size: 14px;
}

.rating-value {
  font-size: 14px;
  color: #ff9900;
  font-weight: bold;
}

.review-count {
  font-size: 12px;
  color: #999;
}

.sales {
  font-size: 13px;
  color: #666;
}

.product-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 16px 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.cart-btn {
  flex: 1;
}

.cart-btn .el-icon {
  margin-right: 4px;
}

.card-actions .el-button--text {
  padding: 8px;
  min-width: auto;
}

.card-actions .el-button--text:hover {
  color: #409eff;
}

.card-actions .wishlisted {
  color: #ff6b6b;
}
</style>