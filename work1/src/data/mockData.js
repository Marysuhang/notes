// 模拟数据
const categories = ['electronics', 'clothing', 'home']
const brands = {
  electronics: ['Apple', '华为', '小米', 'Samsung', 'Sony', '联想', '戴尔'],
  clothing: ['Nike', 'Adidas', '优衣库', 'ZARA', '李宁', '安踏'],
  home: ['小米', '美的', '海尔', '苏泊尔', 'IKEA', '网易严选']
}

const productNames = {
  electronics: [
    '智能手机', '笔记本电脑', '平板电脑', '智能手表', 
    '无线耳机', '数码相机', '游戏主机', '显示器'
  ],
  clothing: [
    'T恤', '衬衫', '牛仔裤', '外套', '连衣裙', 
    '运动鞋', '休闲裤', '卫衣'
  ],
  home: [
    '沙发', '床垫', '餐桌', '椅子', '灯具',
    '厨具', '收纳箱', '装饰画'
  ]
}

// 生成200个商品
export const mockProducts = Array.from({ length: 200 }, (_, i) => {
  const category = categories[i % categories.length]
  const brandList = brands[category]
  const nameList = productNames[category]
  
  const brand = brandList[i % brandList.length]
  const name = nameList[i % nameList.length]
  
  const price = Math.floor(Math.random() * 3000) + 100
  const originalPrice = price * (1 + Math.random() * 0.5)
  const rating = parseFloat((3 + Math.random() * 2).toFixed(1)) // 3-5星
  const sales = Math.floor(Math.random() * 10000) + 100
  const reviewCount = Math.floor(sales * 0.3) + Math.floor(Math.random() * 1000)
  
  const tags = getTags(category, i)
  const inStock = Math.random() > 0.2 // 80%有货
  
  return {
    id: i + 1001,
    name: `${brand} ${name} ${i + 1}`,
    description: `这是一款高品质的${brand}${name}，采用先进技术制造，提供卓越的用户体验和可靠的性能。适用于多种场景，满足您的日常需求。`,
    price,
    originalPrice: Math.round(originalPrice),
    category,
    brand,
    rating,
    reviewCount,
    sales,
    inStock,
    image: `https://picsum.photos/400/300?random=${i}&category=${category}`,
    tags,
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
})

function getTags(category, index) {
  const baseTags = {
    electronics: ['新品上市', '旗舰机型', '智能科技', '官方正品'],
    clothing: ['新品上市', '热销爆款', '时尚潮流', '舒适面料'],
    home: ['新品上市', '热销爆款', '家居必备', '环保材料']
  }
  
  const tags = [...baseTags[category]]
  
  // 添加一些特殊标签
  if (index % 5 === 0) tags.push('限时特惠')
  if (index % 7 === 0) tags.push('会员专享')
  if (index % 10 === 0) tags.push('设计师推荐')
  
  // 随机选择1-3个标签
  const selected = []
  const count = Math.floor(Math.random() * 3) + 1
  
  for (let i = 0; i < count && tags.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * tags.length)
    selected.push(tags[randomIndex])
  }
  
  return selected
}

// 生成推荐商品（从商品中随机选择6个）
export const mockRecommendations = mockProducts
  .sort(() => Math.random() - 0.5)
  .slice(0, 6)
  .map(product => ({
    ...product,
    recommendationReason: ['根据您的浏览记录', '同类商品热销', '限时特惠', '好评如潮'][
      Math.floor(Math.random() * 4)
    ]
  }))