/**
 * 屏幕抖动/故障触发器
 * Glitch Trigger Controller
 */

class GlitchTrigger {
  constructor(options = {}) {
    this.target = options.target || '.app-container'
    this.weakGlitchInterval = options.weakGlitchInterval || 5000 // 5秒一次微弱抖动
    this.autoStart = options.autoStart !== false
    this.intervalId = null
    this.isActive = false
  }

  /**
   * 启动自动微弱抖动
   */
  start() {
    if (this.isActive) return

    this.isActive = true
    this.intervalId = setInterval(() => {
      this.triggerWeak()
    }, this.weakGlitchInterval)

    console.log('Glitch trigger started')
  }

  /**
   * 停止自动抖动
   */
  stop() {
    if (!this.isActive) return

    this.isActive = false
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }

    console.log('Glitch trigger stopped')
  }

  /**
   * 触发微弱抖动
   */
  triggerWeak() {
    const element = document.querySelector(this.target)
    if (!element) return

    element.style.animation = 'weak-glitch 0.3s'

    setTimeout(() => {
      element.style.animation = ''
    }, 300)
  }

  /**
   * 触发强烈抖动
   */
  triggerStrong(duration = 500) {
    const element = document.querySelector(this.target)
    if (!element) return

    element.classList.add('glitch-strong')

    setTimeout(() => {
      element.classList.remove('glitch-strong')
    }, duration)
  }

  /**
   * 触发RGB色彩分离效果
   * @param {string} text - 要显示的文本
   */
  triggerRGB(text, duration = 300) {
    const element = document.querySelector(this.target)
    if (!element) return

    // 保存原始文本
    const originalText = element.getAttribute('data-text')

    // 设置data-text属性
    element.setAttribute('data-text', text || element.textContent)
    element.classList.add('glitch-rgb')

    setTimeout(() => {
      element.classList.remove('glitch-rgb')
      // 恢复原始文本属性
      if (originalText) {
        element.setAttribute('data-text', originalText)
      } else {
        element.removeAttribute('data-text')
      }
    }, duration)
  }

  /**
   * 触发画面撕裂效果
   */
  triggerTear(duration = 500) {
    const element = document.querySelector(this.target)
    if (!element) return

    element.classList.add('glitch-tear')

    setTimeout(() => {
      element.classList.remove('glitch-tear')
    }, duration)
  }

  /**
   * 触发信号丢失效果
   */
  triggerSignalLoss(duration = 600) {
    const element = document.querySelector(this.target)
    if (!element) return

    element.classList.add('glitch-signal-loss')

    setTimeout(() => {
      element.classList.remove('glitch-signal-loss')
    }, duration)
  }

  /**
   * 触发完整故障组合效果
   */
  triggerFull(duration = 1000) {
    const element = document.querySelector(this.target)
    if (!element) return

    element.classList.add('glitch-full')

    setTimeout(() => {
      element.classList.remove('glitch-full')
    }, duration)
  }

  /**
   * 随机触发抖动效果
   */
  triggerRandom() {
    const effects = [
      () => this.triggerWeak(),
      () => this.triggerStrong(400),
      () => this.triggerTear(500),
      () => this.triggerSignalLoss(600)
    ]

    const randomEffect = effects[Math.floor(Math.random() * effects.length)]
    randomEffect()
  }
}


/**
 * 区域特定抖动控制器
 * 可以针对特定元素触发抖动
 */
class ZoneGlitch {
  constructor(selector) {
    this.element = document.querySelector(selector)
  }

  /**
   * 触发单次抖动
   */
  trigger(type = 'weak', duration = 300) {
    if (!this.element) return

    const classMap = {
      'weak': 'glitch-weak',
      'strong': 'glitch-strong',
      'rgb': 'glitch-rgb',
      'tear': 'glitch-tear',
      'signal': 'glitch-signal-loss',
      'full': 'glitch-full'
    }

    const className = classMap[type] || 'glitch-trigger'
    this.element.classList.add(className)

    setTimeout(() => {
      this.element.classList.remove(className)
    }, duration)
  }

  /**
   * 抖动闪烁（多次快速抖动）
   */
  async flicker(times = 3, interval = 200) {
    for (let i = 0; i < times; i++) {
      this.trigger('weak', 100)
      await this.delay(interval)
    }
  }

  /**
   * 延迟工具函数
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}


/**
 * 事件触发的抖动效果
 * 在特定游戏事件发生时触发
 */
class EventGlitch {
  constructor() {
    this.glitchTrigger = new GlitchTrigger({ autoStart: false })
  }

  /**
   * 发现新卡片时的抖动
   */
  onCardDiscovered() {
    this.glitchTrigger.triggerWeak()
  }

  /**
   * 解锁卡片时的强烈抖动
   */
  onCardUnlocked() {
    this.glitchTrigger.triggerStrong(400)
  }

  /**
   * 记忆消失时的信号丢失效果
   */
  onMemoryDecay() {
    this.glitchTrigger.triggerSignalLoss(600)
  }

  /**
   * 搜索失败时的抖动
   */
  onSearchFailed() {
    this.glitchTrigger.triggerWeak()
  }

  /**
   * 故事转折点的完整故障效果
   */
  onStoryPivot() {
    this.glitchTrigger.triggerFull(1000)
  }

  /**
   * 错误输入时的微弱抖动
   */
  onInputError() {
    const inputArea = new ZoneGlitch('.input-box-area')
    inputArea.trigger('weak', 200)
  }
}


// 导出到全局
if (typeof window !== 'undefined') {
  window.GlitchTrigger = GlitchTrigger
  window.ZoneGlitch = ZoneGlitch
  window.EventGlitch = EventGlitch
}
