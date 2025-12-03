<template>
    <div v-if="showRecommendation" class="recommendation-section">
      <div class="section-header">
        <div class="title">
          <el-icon class="ai-icon"><MagicStick /></el-icon>
          <h3>猜你喜欢</h3>
          <el-tag type="info" size="small" class="ai-tag">AI推荐</el-tag>
        </div>
        
        <div class="actions">
          <span class="hint">基于您的浏览偏好推荐</span>
          <el-button
            type="text"
            :icon="Refresh"
            @click="handleRefresh"
            :loading="refreshing"
            size="small"
          >
            换一批
          </el-button>
        </div>
      </div>
      
      <div v-if="loading" class="recommendation-loading">
        <el-skeleton
          v-for="n in 4"
          :key="n"
          variant="image"
          style="width: 220px; height: 280px; border-radius: 8px;"
          animated
        />
      </div>
      
      <div v-else class="recommendation-list">
        <div
          v-for="product in products"
          :key="product.id"
          class="recommendation-card"
          @click="viewProduct(product)"
        >
          <div class="card-image">
            <el-image
              :src="product.image"
              :alt="product.name"
              fit="cover"
              class="product-image"
            >
              <template #placeholder>
                <div class="image-loading">
                  <el-icon><Loading /></el-icon>
                </div>
              </template>
            </el-image>
            
            <div class="recommendation-badge">
              <el-icon><StarFilled /></el-icon>
              {{ product.recommendationReason || '热门推荐' }}
            </div>
          </div>
          
          <div class="card-content">
            <h4 class="product-name">{{ product.name }}</h4>
            
            <div class="product-price">
              <span class="current">￥{{ product.price }}</span>
              <span v-if="product.originalPrice > product.price" class="original">
                ￥{{ product.originalPrice }}
              </span>
            </div>
            
            <div class="product-rating">
              <el-rate
                v-model="product.rating"
                disabled
                :max="5"
                allow-half
                size="small"
              />
              <span class="rating-value">{{ product.rating.toFixed(1) }}</span>
            </div>
            
            <div class="card-actions">
              <el-button
                type="primary"
                size="small"
                @click.stop="addToCart(product)"
                class="add-btn"
              >
                加入购物车
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { 
    MagicStick, 
    Refresh, 
    StarFilled,
    Loading 
  } from '@element-plus/icons-vue'
  
  const props = defineProps({
    products: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['refresh', 'add-to-cart'])
  
  // 本地状态
  const refreshing = ref(false)
  
  // 计算属性
  const showRecommendation = computed(() => {
    return props.products.length > 0 || props.loading
  })
  
  // 方法
  const handleRefresh = async () => {
    refreshing.value = true
    emit('refresh')
    
    // 模拟刷新延迟
    setTimeout(() => {
      refreshing.value = false
    }, 1000)
  }
  
  const viewProduct = (product) => {
    console.log('查看商品:', product.id)
    // 跳转到商品详情页
  }
  
  const addToCart = (product) => {
    emit('add-to-cart', product)
  }
  </script>
  
  <style scoped>
  .recommendation-section {
    background: linear-gradient(135deg, #f5f7ff 0%, #f0f2ff 100%);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 30px;
    border: 1px solid #e0e7ff;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .title {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .ai-icon {
    font-size: 24px;
    color: #722ed1;
  }
  
  .title h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
  }
  
  .ai-tag {
    font-size: 12px;
  }
  
  .actions {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .hint {
    font-size: 14px;
    color: #666;
  }
  
  .recommendation-loading {
    display: flex;
    gap: 20px;
    overflow-x: auto;
    padding: 10px 0;
  }
  
  .recommendation-list {
    display: flex;
    gap: 20px;
    overflow-x: auto;
    padding: 10px 0;
    scrollbar-width: thin;
    scrollbar-color: #c1c1c1 #f1f1f1;
  }
  
  .recommendation-list::-webkit-scrollbar {
    height: 6px;
  }
  
  .recommendation-list::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  .recommendation-list::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  .recommendation-card {
    flex: 0 0 220px;
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .recommendation-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  .card-image {
    position: relative;
    height: 140px;
    overflow: hidden;
  }
  
  .product-image {
    width: 100%;
    height: 100%;
    transition: transform 0.5s ease;
  }
  
  .recommendation-card:hover .product-image {
    transform: scale(1.05);
  }
  
  .image-loading {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
  }
  
  .image-loading .el-icon {
    font-size: 32px;
    color: #409eff;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .recommendation-badge {
    position: absolute;
    bottom: 10px;
    left: 10px;
    background: linear-gradient(135deg, #ff6b6b, #ff8e53);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .card-content {
    padding: 15px;
  }
  
  .product-name {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin: 0 0 10px 0;
    line-height: 1.4;
    height: 40px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  
  .product-price {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }
  
  .current {
    font-size: 18px;
    font-weight: bold;
    color: #ff4444;
  }
  
  .original {
    font-size: 12px;
    color: #999;
    text-decoration: line-through;
  }
  
  .product-rating {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 15px;
  }
  
  .product-rating :deep(.el-rate__icon) {
    font-size: 14px;
  }
  
  .rating-value {
    font-size: 12px;
    color: #ff9900;
    font-weight: bold;
  }
  
  .card-actions {
    text-align: center;
  }
  
  .add-btn {
    width: 100%;
  }
  
  @media (max-width: 768px) {
    .section-header {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .recommendation-card {
      flex: 0 0 180px;
    }
    
    .card-image {
      height: 120px;
    }
  }
  </style>