import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockProducts, mockRecommendations } from '../data/mockData'
import { debounce } from '../utils/debounce'

export const useProductStore = defineStore('product', () => {
  // ========== 状态定义 ==========
  const products = ref([])
  const filteredProducts = ref([])
  const recommendations = ref([])
  const loading = ref(false)
  const searchLoading = ref(false)
  
  // 分页状态
  const pagination = ref({
    page: 1,
    pageSize: 20,
    total: 0
  })
  
  // 筛选条件
  const filters = ref({
    category: '',
    priceRange: [0, 5000],
    rating: 0,
    inStock: false,
    brand: ''
  })
  
  // 排序状态
  const sortBy = ref('default')
  
  // 搜索状态
  const searchQuery = ref('')
  
  // ========== 计算属性 ==========
  const totalPages = computed(() => {
    return Math.ceil(pagination.value.total / pagination.value.pageSize)
  })
  
  const currentProducts = computed(() => {
    const start = (pagination.value.page - 1) * pagination.value.pageSize
    const end = start + pagination.value.pageSize
    return filteredProducts.value.slice(start, end)
  })
  
  const availableBrands = computed(() => {
    const brands = new Set()
    products.value.forEach(product => {
      if (product.brand) brands.add(product.brand)
    })
    return Array.from(brands)
  })
  
  const availableCategories = computed(() => {
    const categories = new Set()
    products.value.forEach(product => {
      if (product.category) categories.add(product.category)
    })
    return Array.from(categories)
  })
  
  // ========== 方法 ==========
  
  // 获取商品列表（防抖处理）
  const fetchProducts = debounce(async () => {
    loading.value = true
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 800))
      
      let result = [...mockProducts]
      
      // 搜索筛选
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim()
        result = result.filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query)
        )
      }
      
      // 分类筛选
      if (filters.value.category) {
        result = result.filter(p => p.category === filters.value.category)
      }
      
      // 品牌筛选
      if (filters.value.brand) {
        result = result.filter(p => p.brand === filters.value.brand)
      }
      
      // 价格范围筛选
      result = result.filter(p => 
        p.price >= filters.value.priceRange[0] && 
        p.price <= filters.value.priceRange[1]
      )
      
      // 评分筛选
      if (filters.value.rating > 0) {
        result = result.filter(p => p.rating >= filters.value.rating)
      }
      
      // 库存筛选
      if (filters.value.inStock) {
        result = result.filter(p => p.inStock)
      }
      
      // 排序
      switch (sortBy.value) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price)
          break
        case 'price_desc':
          result.sort((a, b) => b.price - a.price)
          break
        case 'rating_desc':
          result.sort((a, b) => b.rating - a.rating)
          break
        case 'sales_desc':
          result.sort((a, b) => b.sales - a.sales)
          break
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          break
        default:
          result.sort((a, b) => a.id - b.id)
      }
      
      // 更新状态
      products.value = result
      filteredProducts.value = result
      pagination.value.total = result.length
      pagination.value.page = 1 // 重置到第一页
      
    } catch (error) {
      console.error('获取商品失败:', error)
    } finally {
      loading.value = false
      searchLoading.value = false
    }
  }, 500) // 防抖延迟500ms
  
  // 获取推荐商品
  const fetchRecommendations = async () => {
    try {
      // 模拟AI推荐接口
      await new Promise(resolve => setTimeout(resolve, 300))
      recommendations.value = mockRecommendations
    } catch (error) {
      console.error('获取推荐失败:', error)
    }
  }
  
  // 设置搜索查询（带防抖）
  const setSearchQuery = debounce((query) => {
    searchQuery.value = query
    searchLoading.value = true
    fetchProducts()
  }, 500)
  
  // 应用筛选条件
  const applyFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
    fetchProducts()
  }
  
  // 重置筛选条件
  const resetFilters = () => {
    filters.value = {
      category: '',
      priceRange: [0, 5000],
      rating: 0,
      inStock: false,
      brand: ''
    }
    sortBy.value = 'default'
    searchQuery.value = ''
    fetchProducts()
  }
  
  // 设置排序
  const setSort = (sortType) => {
    sortBy.value = sortType
    fetchProducts()
  }
  
  // 设置分页
  const setPage = (page) => {
    pagination.value.page = page
  }
  
  // 设置每页显示数量
  const setPageSize = (size) => {
    pagination.value.pageSize = size
    pagination.value.page = 1
    fetchProducts()
  }
  
  // 初始化
  const init = () => {
    fetchProducts()
    fetchRecommendations()
  }
  
  return {
    // 状态
    products,
    filteredProducts,
    recommendations,
    loading,
    searchLoading,
    pagination,
    filters,
    sortBy,
    searchQuery,
    
    // 计算属性
    totalPages,
    currentProducts,
    availableBrands,
    availableCategories,
    
    // 方法
    fetchProducts,
    fetchRecommendations,
    setSearchQuery,
    applyFilters,
    resetFilters,
    setSort,
    setPage,
    setPageSize,
    init
  }
})