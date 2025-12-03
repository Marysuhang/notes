<template>
    <div 
      ref="scrollContainer" 
      class="virtual-scroll-container"
      @scroll="handleScroll"
    >
      <div 
        class="scroll-content"
        :style="{ height: totalHeight + 'px' }"
      >
        <!-- 可见项渲染 -->
        <div
          v-for="item in visibleItems"
          :key="item.data.id"
          class="virtual-item"
          :style="{
            position: 'absolute',
            top: item.top + 'px',
            left: '0',
            width: '100%',
            height: itemHeight + 'px'
          }"
        >
          <slot :item="item.data" />
        </div>
      </div>
      
      <!-- 滚动到底部提示 -->
      <div v-if="showScrollHint" class="scroll-hint">
        <el-icon><ArrowDown /></el-icon>
        <span>继续滚动加载更多</span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import { ArrowDown } from '@element-plus/icons-vue'
  
  const props = defineProps({
    items: {
      type: Array,
      required: true
    },
    itemHeight: {
      type: Number,
      default: 200
    },
    containerHeight: {
      type: Number,
      default: 600
    },
    buffer: {
      type: Number,
      default: 5
    }
  })
  
  // 响应式数据
  const scrollContainer = ref(null)
  const scrollTop = ref(0)
  const containerHeight = ref(props.containerHeight)
  
  // 计算属性
  const totalHeight = computed(() => {
    return props.items.length * props.itemHeight
  })
  
  const visibleCount = computed(() => {
    return Math.ceil(containerHeight.value / props.itemHeight) + props.buffer * 2
  })
  
  const startIndex = computed(() => {
    let index = Math.floor(scrollTop.value / props.itemHeight) - props.buffer
    return Math.max(0, index)
  })
  
  const endIndex = computed(() => {
    let index = startIndex.value + visibleCount.value
    return Math.min(props.items.length, index)
  })
  
  const visibleItems = computed(() => {
    const items = []
    
    for (let i = startIndex.value; i < endIndex.value; i++) {
      items.push({
        data: props.items[i],
        top: i * props.itemHeight,
        index: i
      })
    }
    
    return items
  })
  
  const showScrollHint = computed(() => {
    if (!scrollContainer.value) return false
    
    const scrollableHeight = totalHeight.value - containerHeight.value
    return scrollableHeight > 100 && scrollTop.value < scrollableHeight - 100
  })
  
  // 方法
  const handleScroll = () => {
    if (scrollContainer.value) {
      scrollTop.value = scrollContainer.value.scrollTop
    }
  }
  
  const updateContainerHeight = () => {
    if (scrollContainer.value) {
      // 获取容器的实际高度
      const height = props.containerHeight || 
                     scrollContainer.value.clientHeight ||
                     scrollContainer.value.parentElement?.clientHeight ||
                     600
      containerHeight.value = height
    }
  }
  
  const scrollToIndex = (index) => {
    if (scrollContainer.value) {
      const top = index * props.itemHeight
      scrollContainer.value.scrollTo({
        top,
        behavior: 'smooth'
      })
    }
  }
  
  const scrollToTop = () => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
  
  // 暴露方法给父组件
  defineExpose({
    scrollToIndex,
    scrollToTop
  })
  
  // 生命周期
  onMounted(() => {
    updateContainerHeight()
    window.addEventListener('resize', updateContainerHeight)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateContainerHeight)
  })
  
  // 监听items变化，重置滚动位置
  watch(() => props.items, () => {
    scrollTop.value = 0
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = 0
    }
  })
  
  // 监听容器高度变化
  watch(() => props.containerHeight, (newHeight) => {
    if (newHeight) {
      containerHeight.value = newHeight
    }
  })
  </script>
  
  <style scoped>
  .virtual-scroll-container {
    height: v-bind('containerHeight + "px"');
    overflow-y: auto;
    position: relative;
    border-radius: 8px;
    background: #fff;
    scroll-behavior: smooth;
  }
  
  .scroll-content {
    position: relative;
  }
  
  .virtual-item {
    padding: 10px;
    box-sizing: border-box;
    transition: transform 0.2s ease;
  }
  
  .virtual-item:hover {
    transform: translateX(5px);
  }
  
  .scroll-hint {
    position: sticky;
    bottom: 20px;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 8px;
    margin: 0 auto;
    width: 200px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    color: #409eff;
    font-size: 14px;
    animation: bounce 2s infinite;
  }
  
  .scroll-hint .el-icon {
    font-size: 20px;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
  
  /* 自定义滚动条样式 */
  .virtual-scroll-container::-webkit-scrollbar {
    width: 8px;
  }
  
  .virtual-scroll-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  .virtual-scroll-container::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  
  .virtual-scroll-container::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
  </style>