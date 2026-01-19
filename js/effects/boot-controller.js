/**
 * 开机启动序列控制器
 * Boot Sequence Controller
 */

/**
 * 国际化文本
 * Internationalized Texts
 */
const BOOT_TEXTS = {
  en: {
    boot_init: '> INITIALIZING MEMORY SYSTEM...',
    boot_core: '> LOADING CORE MODULES... [OK]',
    boot_database: '> CHECKING DATABASE INTEGRITY... [OK]',
    boot_filesystem: '> MOUNTING FILE SYSTEM... [OK]',
    boot_cards: '> ANALYZING NEURAL SIGNALS... [OK]',
    boot_ready: '> SYSTEM READY'
  },
  zh: {
    boot_init: '> 正在初始化记忆系统...',
    boot_core: '> 加载核心模块... [完成]',
    boot_database: '> 检查数据库完整性... [完成]',
    boot_filesystem: '> 挂载文件系统... [完成]',
    boot_cards: '> 分析神经信号... [完成]',
    boot_ready: '> 系统就绪'
  }
}

class BootSequence {
  constructor(options = {}) {
    // 国际化
    this.lang = localStorage.getItem('gameLang') || 'en'
    this.texts = BOOT_TEXTS[this.lang] || BOOT_TEXTS.en

    this.bootMessages = options.bootMessages || [
      this.texts.boot_init,
      this.texts.boot_core,
      this.texts.boot_database,
      this.texts.boot_filesystem,
      this.texts.boot_cards,
      this.texts.boot_ready
    ]

    this.messageDelay = options.messageDelay || 400
    this.messageAppearDuration = options.messageAppearDuration || 300
    this.finalDelay = options.finalDelay || 600
    this.fadeOutDuration = options.fadeOutDuration || 800
  }

  /**
   * 启动开机序列
   */
  async start() {
    // 创建开机屏幕
    const bootScreen = this.createBootScreen()
    document.body.appendChild(bootScreen)

    // 等待DOM渲染
    await this.delay(50)

    // 可选：电源按钮效果
    // this.showPowerButton()

    // 显示启动消息
    for (let i = 0; i < this.bootMessages.length; i++) {
      await this.showMessage(this.bootMessages[i])
      await this.delay(this.messageDelay)
    }

    // 等待一段时间后淡出
    await this.delay(this.finalDelay)

    // 淡出开机界面
    bootScreen.classList.add('fade-out')
    await this.delay(this.fadeOutDuration)

    // 移除开机屏幕
    bootScreen.remove()

    // 显示主应用界面
    this.showMainApp()
  }

  /**
   * 创建开机屏幕DOM
   */
  createBootScreen() {
    const screen = document.createElement('div')
    screen.className = 'boot-screen'
    screen.innerHTML = `
      <div class="boot-container">
        <div class="boot-messages"></div>
        <span class="boot-cursor"></span>
      </div>
    `
    return screen
  }

  /**
   * 显示单条启动消息
   */
  async showMessage(text) {
    const container = document.querySelector('.boot-messages')
    if (!container) return

    const line = document.createElement('div')
    line.className = 'boot-text'
    line.textContent = text
    container.appendChild(line)

    // 等待动画完成
    return this.delay(this.messageAppearDuration)
  }

  /**
   * 显示电源按钮效果（可选）
   */
  showPowerButton() {
    const button = document.createElement('div')
    button.className = 'power-button-effect'
    document.body.appendChild(button)

    setTimeout(() => button.remove(), 1000)
  }

  /**
   * 显示主应用界面
   */
  showMainApp() {
    const appContainer = document.querySelector('.app-container')
    if (appContainer) {
      appContainer.classList.remove('app-hidden')
      appContainer.classList.add('app-fade-in')
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
 * 关机序列控制器
 * Shutdown Sequence Controller
 */

class ShutdownSequence {
  constructor(options = {}) {
    this.preFadeDuration = options.preFadeDuration || 300
    this.shrinkDuration = options.shrinkDuration || 800
    this.glowDuration = options.glowDuration || 1500
    this.overlayDelay = options.overlayDelay || 500
  }

  /**
   * 启动关机序列
   */
  async start() {
    const appContainer = document.querySelector('.app-container')
    if (!appContainer) {
      console.warn('App container not found')
      return
    }

    // 阶段1：内容淡出
    appContainer.classList.add('app-pre-shutdown')
    await this.delay(this.preFadeDuration)

    // 阶段2：画面收缩
    appContainer.classList.add('shutdown-active')
    await this.delay(this.shrinkDuration)

    // 阶段3：创建余辉效果
    const glow = this.createGlow()
    document.body.appendChild(glow)

    // 阶段4：添加黑屏覆盖层
    await this.delay(this.overlayDelay)
    const overlay = this.createOverlay()
    document.body.appendChild(overlay)

    // 激活覆盖层
    await this.delay(50)
    overlay.classList.add('active')

    // 等待余辉消失
    await this.delay(this.glowDuration)

    // 清理元素
    glow.remove()

    // 重置应用状态
    appContainer.classList.remove('app-pre-shutdown', 'shutdown-active')
    appContainer.classList.add('app-hidden')

    // 返回覆盖层引用（可用于后续重启）
    return overlay
  }

  /**
   * 创建余辉光点
   */
  createGlow() {
    const glow = document.createElement('div')
    glow.className = 'shutdown-glow'
    return glow
  }

  /**
   * 创建黑屏覆盖层
   */
  createOverlay() {
    const overlay = document.createElement('div')
    overlay.className = 'shutdown-overlay'
    return overlay
  }

  /**
   * 延迟工具函数
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}


/**
 * 电源管理器（整合开机/关机）
 * Power Manager
 */

class PowerManager {
  constructor(bootOptions = {}, shutdownOptions = {}) {
    this.bootController = new BootSequence(bootOptions)
    this.shutdownController = new ShutdownSequence(shutdownOptions)
    this.state = 'off' // 'off', 'booting', 'on', 'shutting-down'
  }

  /**
   * 开机
   */
  async powerOn() {
    if (this.state !== 'off') {
      console.warn('System is already on or in transition')
      return
    }

    this.state = 'booting'

    try {
      await this.bootController.start()
      this.state = 'on'
      console.log('System powered on')
    } catch (error) {
      console.error('Boot sequence failed:', error)
      this.state = 'off'
    }
  }

  /**
   * 关机
   */
  async powerOff() {
    if (this.state !== 'on') {
      console.warn('System is not on')
      return
    }

    this.state = 'shutting-down'

    try {
      await this.shutdownController.start()
      this.state = 'off'
      console.log('System powered off')
    } catch (error) {
      console.error('Shutdown sequence failed:', error)
      this.state = 'on'
    }
  }

  /**
   * 重启
   */
  async reboot() {
    await this.powerOff()
    await this.delay(500) // 等待片刻再重启
    await this.powerOn()
  }

  /**
   * 获取当前状态
   */
  getState() {
    return this.state
  }

  /**
   * 延迟工具函数
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}


// 导出到全局（如果需要）
if (typeof window !== 'undefined') {
  window.BootSequence = BootSequence
  window.ShutdownSequence = ShutdownSequence
  window.PowerManager = PowerManager
}
