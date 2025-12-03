/**
 * 防抖函数
 * @param {Function} func 要执行的函数
 * @param {number} wait 等待时间(ms)
 * @param {boolean} immediate 是否立即执行
 * @returns {Function} 防抖处理后的函数
 */
export function debounce(func, wait = 300, immediate = false) {
    let timeout = null
    let result
    
    return function(...args) {
      const context = this
      
      // 清除之前的计时器
      if (timeout) clearTimeout(timeout)
      
      if (immediate) {
        // 如果已经执行过，不再执行
        const callNow = !timeout
        timeout = setTimeout(() => {
          timeout = null
        }, wait)
        if (callNow) result = func.apply(context, args)
      } else {
        // 延迟执行
        timeout = setTimeout(() => {
          func.apply(context, args)
        }, wait)
      }
      
      return result
    }
  }
  
  /**
   * 防抖装饰器（用于类方法）
   */
  export function Debounce(wait, immediate = false) {
    return function(target, key, descriptor) {
      const original = descriptor.value
      descriptor.value = debounce(original, wait, immediate)
      return descriptor
    }
  }