<template>
    <div class="skeleton-container">
      <div v-for="n in count" :key="n" class="skeleton-card">
        <div class="skeleton-image"></div>
        <div class="skeleton-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-tags"></div>
          <div class="skeleton-price"></div>
          <div class="skeleton-description"></div>
          <div class="skeleton-button"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    count: {
      type: Number,
      default: 4
    }
  })
  </script>
  
  <style scoped>
  .skeleton-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  .skeleton-card {
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    overflow: hidden;
    background: white;
  }
  
  .skeleton-image {
    height: 160px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
  
  .skeleton-content {
    padding: 1rem;
  }
  
  .skeleton-title {
    height: 20px;
    background: #f0f0f0;
    border-radius: 4px;
    margin-bottom: 0.75rem;
    animation: loading 1.5s infinite 0.2s;
  }
  
  .skeleton-tags {
    height: 24px;
    background: #f0f0f0;
    border-radius: 4px;
    margin-bottom: 0.75rem;
    animation: loading 1.5s infinite 0.4s;
  }
  
  .skeleton-price {
    height: 28px;
    width: 80px;
    background: #f0f0f0;
    border-radius: 4px;
    margin-bottom: 0.75rem;
    animation: loading 1.5s infinite 0.6s;
  }
  
  .skeleton-description {
    height: 48px;
    background: #f0f0f0;
    border-radius: 4px;
    margin-bottom: 1rem;
    animation: loading 1.5s infinite 0.8s;
  }
  
  .skeleton-button {
    height: 36px;
    background: #f0f0f0;
    border-radius: 4px;
    animation: loading 1.5s infinite 1s;
  }
  
  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
  </style>