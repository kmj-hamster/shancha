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

class OpeningScreen {
  constructor(options = {}) {
    this.onComplete = options.onComplete || null
    this.fadeOutDuration = options.fadeOutDuration || 1000
    this.bootDelay = options.bootDelay || 500
    this.isTransitioning = false  // 防止重复触发

    // 国际化
    this.lang = localStorage.getItem('gameLang') || 'en'
    this.texts = OPENING_TEXTS[this.lang] || OPENING_TEXTS.en
  }

  /**
   * 初始化开场界面
   */
  init() {
    const loginButton = document.querySelector('.login-button')
    if (loginButton) {
      loginButton.addEventListener('click', () => this.handleLogin())
    }

    // 添加返回按钮事件
    const backButton = document.querySelector('.back-to-lang-btn')
    if (backButton) {
      backButton.addEventListener('click', (e) => {
        e.stopPropagation()
        this.handleBackToLangSelect()
      })
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

    // 🎵 尝试播放Memory BGM（如果浏览器阻止，等待用户首次点击）
    this.startOpeningBGM()
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

    // 停止BGM
    if (window.audioManager && audioManager.currentMusic) {
      audioManager.stopMusic(500)
    }

    // 移除键盘监听
    document.removeEventListener('keydown', this.keydownHandler)

    // 调用LangSelect的返回方法
    if (typeof LangSelect !== 'undefined') {
      LangSelect.returnToLangSelect()
    }
  }

  /**
   * 启动Opening BGM（Memory）
   * 使用hack方法绕过浏览器自动播放限制
   */
  startOpeningBGM() {
    if (!window.audioManager) {
      console.warn('[BGM] AudioManager not available')
      return
    }

    // 🔓 Hack 1: 静音播放法（成功率最高）
    console.log('[BGM] Attempting autoplay hack: muted playback...')
    this.tryMutedPlayback()
  }

  /**
   * 尝试静音播放hack
   */
  tryMutedPlayback() {
    const audio = new Audio()
    audio.src = `https://cdn.jsdelivr.net/gh/kmj-hamster/shancha@main/sound/Memory.mp3`
    audio.loop = true
    audio.muted = true  // 关键：先静音
    audio.volume = 0.35  // music volume (0.5) * master volume (0.7)

    audio.play()
      .then(() => {
        console.log('[BGM] ✅ Muted playback started, unmuting in 100ms...')

        // 延迟100ms后取消静音
        setTimeout(() => {
          audio.muted = false
          console.log('[BGM] ✅ Audio unmuted, Memory BGM playing!')

          // 将音频实例保存到audioManager
          if (window.audioManager) {
            audioManager.currentMusic = audio
            audioManager.currentMusicId = 'Memory'
          }
        }, 100)
      })
      .catch(err => {
        console.log('[BGM] ❌ Muted playback failed:', err.message)
        console.log('[BGM] Falling back to user interaction triggers...')

        // Hack失败，设置多重fallback
        this.setupMultipleFallbacks()
      })
  }

  /**
   * 设置多重fallback触发点
   */
  setupMultipleFallbacks() {
    const openingScreen = document.querySelector('.opening-screen')
    if (!openingScreen) return

    let musicStarted = false

    const startMusic = () => {
      if (musicStarted) return
      musicStarted = true

      console.log('[BGM] User interaction detected, starting Memory BGM...')
      audioManager.playMusic('Memory', 1, 0)

      // 移除所有监听器
      cleanup()
    }

    const cleanup = () => {
      openingScreen.removeEventListener('click', startMusic)
      openingScreen.removeEventListener('mousemove', startMusic)
      document.removeEventListener('keydown', startMusic)
    }

    // 多个触发点：点击、鼠标移动、按键
    openingScreen.addEventListener('click', startMusic, { once: true })
    openingScreen.addEventListener('mousemove', startMusic, { once: true })
    document.addEventListener('keydown', startMusic, { once: true })

    console.log('[BGM] Fallback triggers ready: click, mousemove, keydown')
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

    // 🎵 淡出Memory BGM，播放Opening音效
    if (window.audioManager) {
      console.log('[BGM] Fading out Memory (1s)...')
      audioManager.stopMusic(1000)  // 1秒淡出

      // 等待1秒淡出完成后播放Opening音效
      await this.delay(1000)
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
