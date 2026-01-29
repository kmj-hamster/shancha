/**
 * 开场界面控制器
 * Opening Screen Controller
 */

/**
 * 国际化文本
 * Internationalized Texts
 */
const OPENING_TEXTS = {
  en: {
    simpleBoot_starting: '> SYSTEM STARTING...',
    simpleBoot_loading: '> LOADING MEMORIES...',
    simpleBoot_ready: '> READY'
  },
  zh: {
    simpleBoot_starting: '> 系统启动中...',
    simpleBoot_loading: '> 加载记忆中...',
    simpleBoot_ready: '> 就绪'
  }
}

// 英文版 ASCII 艺术（BURNING MEMORY）- 用于语言切换时恢复
const ASCII_ART_EN = `██████╗ ██╗   ██╗██████╗ ███╗   ██╗██╗███╗   ██╗ ██████╗
██╔══██╗██║   ██║██╔══██╗████╗  ██║██║████╗  ██║██╔════╝
██████╔╝██║   ██║██████╔╝██╔██╗ ██║██║██╔██╗ ██║██║  ███╗
██╔══██╗██║   ██║██╔══██╗██║╚██╗██║██║██║╚██╗██║██║   ██║
██████╔╝╚██████╔╝██║  ██║██║ ╚████║██║██║ ╚████║╚██████╔╝
╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚═╝  ╚═══╝ ╚═════╝

███╗   ███╗███████╗███╗   ███╗ ██████╗ ██████╗ ██╗   ██╗
████╗ ████║██╔════╝████╗ ████║██╔═══██╗██╔══██╗╚██╗ ██╔╝
██╔████╔██║█████╗  ██╔████╔██║██║   ██║██████╔╝ ╚████╔╝
██║╚██╔╝██║██╔══╝  ██║╚██╔╝██║██║   ██║██╔══██╗  ╚██╔╝
██║ ╚═╝ ██║███████╗██║ ╚═╝ ██║╚██████╔╝██║  ██║   ██║
╚═╝     ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝`

class OpeningScreen {
  constructor(options = {}) {
    this.onComplete = options.onComplete || null
    this.fadeOutDuration = options.fadeOutDuration || 1000
    this.bootDelay = options.bootDelay || 500
    this.isTransitioning = false  // 防止重复触发

    // 国际化
    this.lang = localStorage.getItem('gameLang') || 'en'
    this.texts = OPENING_TEXTS[this.lang] || OPENING_TEXTS.en

    // 绑定事件处理函数（用于添加/移除监听器，防止重复绑定）
    this._handleLoginClick = this.handleLogin.bind(this)
    this._handleBackClick = (e) => {
      e.stopPropagation()
      this.handleBackToLangSelect()
    }
  }

  /**
   * 初始化开场界面
   */
  init() {
    const loginButton = document.querySelector('.login-button')
    const backButton = document.querySelector('.back-to-lang-btn')

    // 先移除可能存在的旧监听器（防止重复绑定导致Android上卡死）
    if (loginButton) {
      if (window._openingLoginHandler) {
        loginButton.removeEventListener('click', window._openingLoginHandler)
      }
      window._openingLoginHandler = this._handleLoginClick
      loginButton.addEventListener('click', this._handleLoginClick)
    }

    if (backButton) {
      if (window._openingBackHandler) {
        backButton.removeEventListener('click', window._openingBackHandler)
      }
      window._openingBackHandler = this._handleBackClick
      backButton.addEventListener('click', this._handleBackClick)
    }

    // 添加键盘Enter支持
    this.keydownHandler = (e) => {
      if (e.key === 'Enter') {
        this.handleLogin()
      }
    }
    document.addEventListener('keydown', this.keydownHandler)

    // 根据语言设置更新UI文本
    this.updateUIForLanguage()
  }

  /**
   * 根据语言设置更新UI
   */
  updateUIForLanguage() {
    const lang = localStorage.getItem('gameLang') || 'en'
    const loginButton = document.querySelector('.login-button')
    const backButton = document.querySelector('.back-to-lang-btn')
    const subtitle = document.querySelector('.opening-subtitle')
    const asciiArt = document.querySelector('.ascii-art')

    if (lang === 'zh') {
      // 中文版：修改按钮文字
      if (loginButton) {
        loginButton.textContent = '登录'
      }
      if (backButton) {
        backButton.textContent = '语言'
      }
      // 中文版：隐藏 "It's just a" 副标题
      if (subtitle) {
        subtitle.style.display = 'none'
      }
      // 中文版：显示大号"山茶"替代 ASCII 艺术字
      if (asciiArt) {
        asciiArt.textContent = '山  茶'
        asciiArt.classList.add('ascii-art-zh')
      }
      // 中文版：按钮组向左偏移以对齐"山茶"
      const buttonsGroup = document.querySelector('.opening-buttons')
      if (buttonsGroup) {
        buttonsGroup.classList.add('opening-buttons-zh')
      }
    } else {
      // 英文版：保持默认
      if (loginButton) {
        loginButton.textContent = 'Login'
      }
      if (backButton) {
        backButton.textContent = 'Language'
      }
      if (subtitle) {
        subtitle.style.display = 'block'
      }
      if (asciiArt) {
        asciiArt.classList.remove('ascii-art-zh')
        // 使用常量恢复英文 ASCII 艺术
        asciiArt.textContent = ASCII_ART_EN
      }
      // 英文版：移除按钮组偏移
      const buttonsGroup = document.querySelector('.opening-buttons')
      if (buttonsGroup) {
        buttonsGroup.classList.remove('opening-buttons-zh')
      }
    }
  }

  /**
   * 处理返回语言选择
   */
  handleBackToLangSelect() {
    if (this.isTransitioning) return

    console.log('[Opening] Returning to language selection...')

    // 移除键盘监听
    document.removeEventListener('keydown', this.keydownHandler)

    // 移除按钮监听器（防止返回后再次选择语言时重复绑定）
    const loginButton = document.querySelector('.login-button')
    const backButton = document.querySelector('.back-to-lang-btn')

    if (loginButton && window._openingLoginHandler) {
      loginButton.removeEventListener('click', window._openingLoginHandler)
      window._openingLoginHandler = null
    }
    if (backButton && window._openingBackHandler) {
      backButton.removeEventListener('click', window._openingBackHandler)
      window._openingBackHandler = null
    }

    // 调用LangSelect的返回方法
    if (typeof LangSelect !== 'undefined') {
      LangSelect.returnToLangSelect()
    }
  }

  /**
   * 处理Login点击
   */
  async handleLogin() {
    // 防止重复触发
    if (this.isTransitioning) {
      return
    }
    this.isTransitioning = true

    console.log('Login clicked, starting transition...')

    // 📱 安卓端请求全屏
    if (window.requestFullscreenOnAndroid) {
      window.requestFullscreenOnAndroid()
    }

    // 🎵 播放Opening音效
    if (window.audioManager) {
      console.log('[BGM] Playing Opening SFX (12s)...')
      audioManager.playSFX('Opening.wav', 1, true)  // 使用customSfxPath，完整文件名

      // 12秒后（Opening音效结束）播放Atmosphere BGM（带交叉淡入淡出循环）
      setTimeout(() => {
        console.log('[BGM] Opening SFX finished, playing Atmosphere with crossfade...')
        audioManager.playMusicWithLoopFade('Atmosphere', 2000, 3000)  // 2秒初始淡入，3秒交叉淡入淡出
      }, 12000)
    }

    // 移除Enter键监听器
    document.removeEventListener('keydown', this.keydownHandler)

    // 1. 开场界面淡出
    await this.fadeOutOpening()

    // 2. 关闭CRT效果
    this.disableCRT()

    // 3. 延迟后播放开机动画
    await this.delay(this.bootDelay)

    // 4. 播放开机序列
    await this.playBootSequence()

    // 5. 显示主界面
    await this.showMainApp()

    // 6. 回调
    if (this.onComplete) {
      this.onComplete()
    }
  }

  /**
   * 淡出开场界面
   */
  fadeOutOpening() {
    return new Promise((resolve) => {
      const openingScreen = document.querySelector('.opening-screen')
      if (!openingScreen) {
        resolve()
        return
      }

      openingScreen.classList.add('fade-out')
      setTimeout(() => {
        openingScreen.style.display = 'none'
        resolve()
      }, this.fadeOutDuration)
    })
  }

  /**
   * 关闭CRT效果
   */
  disableCRT() {
    const openingScreen = document.querySelector('.opening-screen')
    if (openingScreen) {
      openingScreen.classList.remove('crt-active')
    }
  }

  /**
   * 播放开机序列
   */
  async playBootSequence() {
    console.log('Playing boot sequence...')

    // 检查是否有PowerManager
    if (typeof PowerManager !== 'undefined') {
      const power = new PowerManager()
      await power.powerOn()
    } else {
      // 如果没有PowerManager，使用简单的开机效果
      await this.simpleBootEffect()
    }
  }

  /**
   * 简单开机效果（备用）
   */
  async simpleBootEffect() {
    const bootScreen = document.createElement('div')
    bootScreen.className = 'boot-screen'
    bootScreen.innerHTML = `
      <div class="boot-container">
        <div class="boot-messages">
          <div class="boot-text" style="animation-delay: 0s">${this.texts.simpleBoot_starting}</div>
          <div class="boot-text" style="animation-delay: 0.3s">${this.texts.simpleBoot_loading}</div>
          <div class="boot-text" style="animation-delay: 0.6s">${this.texts.simpleBoot_ready}</div>
        </div>
      </div>
    `
    document.body.appendChild(bootScreen)

    await this.delay(2000)

    bootScreen.classList.add('fade-out')
    await this.delay(800)
    bootScreen.remove()
  }

  /**
   * 显示主应用界面
   */
  async showMainApp() {
    console.log('Showing main app...')

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

// 导出到全局
if (typeof window !== 'undefined') {
  window.OpeningScreen = OpeningScreen
}
