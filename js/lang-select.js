/**
 * 语言选择模块
 * Language Selection Module
 */

// 警告界面文案
const WARNING_TEXTS = {
  en: {
    title: 'WARNING',
    text: 'This game contains intense flashing lights and strobe effects which may affect photosensitive individuals. Viewer discretion is advised.'
  },
  zh: {
    title: '警告',
    text: '本游戏包含强烈的高频闪烁画面与光效，可能会引起光敏性不适。请光敏性癫痫患者或敏感人群谨慎游玩。'
  }
}

// 耳机建议界面文案
const HEADPHONE_TEXTS = {
  en: {
    text: 'For the best experience, we recommend using headphones.'
  },
  zh: {
    text: '建议佩戴耳机，以获得最佳游戏体验。'
  }
}

// 每个界面强制显示时间（毫秒）
const SCREEN_DISPLAY_DURATION = 5000

class LangSelect {
  constructor(options = {}) {
    this.onLanguageSelected = options.onLanguageSelected || null
    this.fadeOutDuration = options.fadeOutDuration || 800
    this.isTransitioning = false
  }

  /**
   * 初始化语言选择界面
   */
  init() {
    // 保存实例到全局，以便返回时重置状态
    window._langSelectInstance = this

    const langBtns = document.querySelectorAll('.lang-btn')
    langBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang
        if (lang) {
          this.selectLanguage(lang)
        }
      })
    })

    console.log('[LangSelect] Initialized')
  }

  /**
   * 检查是否应该跳过语言选择
   * @returns {Object} { skip: boolean, reason: string, lang: string|null }
   */
  static checkSkipCondition() {
    const hasSave = localStorage.getItem('gameState') !== null
    const savedLang = localStorage.getItem('gameLang')

    // 有存档 → 跳过语言选择和Opening，直接进入游戏
    if (hasSave && savedLang) {
      return {
        skip: true,
        skipOpening: true,
        reason: 'saved_game',
        lang: savedLang
      }
    }

    // 有语言设置但无存档 → 跳过语言选择，显示Opening
    if (savedLang && !hasSave) {
      return {
        skip: true,
        skipOpening: false,
        reason: 'lang_selected',
        lang: savedLang
      }
    }

    // 无语言设置 → 显示语言选择界面
    return {
      skip: false,
      skipOpening: false,
      reason: 'first_visit',
      lang: null
    }
  }

  /**
   * 获取当前语言设置
   * @returns {string} 'en' 或 'zh'，默认 'en'
   */
  static getCurrentLang() {
    return localStorage.getItem('gameLang') || 'en'
  }

  /**
   * 动态加载游戏数据文件
   * @param {string} lang - 'en' 或 'zh'
   * @returns {Promise} 加载完成的Promise
   */
  static loadGameData(lang) {
    return new Promise((resolve, reject) => {
      // 检查是否已加载
      if (window.CARDS_DATA) {
        console.log('[LangSelect] Game data already loaded')
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = `./data/cards-data-${lang}.js`
      script.onload = () => {
        console.log(`[LangSelect] Loaded ${lang} game data`)
        resolve()
      }
      script.onerror = () => {
        console.error(`[LangSelect] Failed to load ${lang} game data`)
        reject(new Error(`Failed to load cards-data-${lang}.js`))
      }
      document.head.appendChild(script)
    })
  }

  /**
   * 选择语言
   * @param {string} lang - 'en' 或 'zh'
   */
  async selectLanguage(lang) {
    if (this.isTransitioning) return
    this.isTransitioning = true

    console.log(`[LangSelect] Language selected: ${lang}`)

    // 存储语言设置
    localStorage.setItem('gameLang', lang)

    // 立即设置body语言类名（用于opening界面的语言切换显示）
    document.body.classList.remove('lang-zh', 'lang-en')
    document.body.classList.add(`lang-${lang}`)

    // 加载对应语言的游戏数据
    try {
      await LangSelect.loadGameData(lang)
    } catch (error) {
      console.error('[LangSelect] Failed to load game data:', error)
      this.isTransitioning = false
      return
    }

    // 过渡到Opening
    this.transitionToOpening(lang)
  }

  /**
   * 过渡到Opening界面（经过警告和耳机界面）
   * @param {string} lang - 选择的语言
   */
  transitionToOpening(lang) {
    const langScreen = document.querySelector('.lang-select-screen')
    const warningScreen = document.querySelector('.warning-screen')
    const headphoneScreen = document.querySelector('.headphone-screen')
    const openingScreen = document.querySelector('.opening-screen')

    if (!langScreen || !openingScreen) {
      console.error('[LangSelect] Required screens not found')
      return
    }

    // 检查是否已经看过警告和耳机动画
    const introShown = localStorage.getItem('introAnimationShown') === 'true'

    if (introShown) {
      // 跳过动画，直接显示 Opening
      console.log('[LangSelect] Intro animation already shown, skipping...')
      langScreen.classList.add('fade-out')

      setTimeout(() => {
        langScreen.classList.add('hidden')
        langScreen.classList.remove('fade-out')

        openingScreen.style.display = 'flex'
        openingScreen.style.opacity = '0'
        openingScreen.style.animation = 'opening-fade-in 0.5s forwards'

        if (this.onLanguageSelected) {
          this.onLanguageSelected(lang)
        }

        this.isTransitioning = false
        console.log('[LangSelect] Transitioned to Opening (skipped intro)')
      }, this.fadeOutDuration)
      return
    }

    // 首次显示完整动画序列
    // 先显示警告界面（在语言选择界面下方，z-index 5800 < 6000）
    // 然后再淡出语言选择界面，这样就不会看到灰色边框
    this.prepareWarningScreen(lang)

    // 淡出语言选择界面
    langScreen.classList.add('fade-out')

    setTimeout(() => {
      // 隐藏语言选择界面
      langScreen.classList.add('hidden')
      langScreen.classList.remove('fade-out')

      // 开始警告界面倒计时（界面已经显示）
      this.startWarningCountdown(() => {
        // 警告界面结束后，显示耳机界面
        this.showHeadphoneScreen(lang, () => {
          // 动画完成，设置标志（下次跳过）
          localStorage.setItem('introAnimationShown', 'true')
          console.log('[LangSelect] Intro animation shown, flag set')

          // 耳机界面结束后，显示Opening界面
          openingScreen.style.display = 'flex'
          openingScreen.style.opacity = '0'
          openingScreen.style.animation = 'opening-fade-in 0.5s forwards'

          // 回调
          if (this.onLanguageSelected) {
            this.onLanguageSelected(lang)
          }

          this.isTransitioning = false
          console.log('[LangSelect] Transitioned to Opening')
        })
      })
    }, this.fadeOutDuration)
  }

  /**
   * 准备警告界面（设置文案并显示，但不开始倒计时）
   * @param {string} lang - 语言
   */
  prepareWarningScreen(lang) {
    const warningScreen = document.querySelector('.warning-screen')
    if (!warningScreen) {
      console.warn('[LangSelect] Warning screen not found')
      return
    }

    // 设置文案
    const texts = WARNING_TEXTS[lang] || WARNING_TEXTS.en
    const titleEl = warningScreen.querySelector('.warning-title')
    const textEl = warningScreen.querySelector('.warning-text')

    if (titleEl) titleEl.textContent = texts.title
    if (textEl) textEl.textContent = texts.text

    // 显示警告界面（会被语言选择界面遮住，因为 z-index 更低）
    warningScreen.style.display = 'flex'
    warningScreen.style.opacity = '1'

    console.log('[LangSelect] Warning screen prepared')
  }

  /**
   * 开始警告界面倒计时
   * @param {Function} onComplete - 完成回调
   */
  startWarningCountdown(onComplete) {
    const warningScreen = document.querySelector('.warning-screen')
    if (!warningScreen || warningScreen.style.display === 'none') {
      console.warn('[LangSelect] Warning screen not ready, skipping...')
      if (onComplete) onComplete()
      return
    }

    console.log('[LangSelect] Warning screen showing for 5 seconds...')

    // 5秒后回调（淡出由 showHeadphoneScreen 处理）
    setTimeout(() => {
      console.log('[LangSelect] Warning screen countdown completed')
      if (onComplete) onComplete()
    }, SCREEN_DISPLAY_DURATION)
  }

  /**
   * 显示耳机建议界面
   * @param {string} lang - 语言
   * @param {Function} onComplete - 完成回调
   */
  showHeadphoneScreen(lang, onComplete) {
    const headphoneScreen = document.querySelector('.headphone-screen')
    const warningScreen = document.querySelector('.warning-screen')

    if (!headphoneScreen) {
      console.warn('[LangSelect] Headphone screen not found, skipping...')
      if (onComplete) onComplete()
      return
    }

    // 设置文案
    const texts = HEADPHONE_TEXTS[lang] || HEADPHONE_TEXTS.en
    const textEl = headphoneScreen.querySelector('.headphone-text')

    if (textEl) textEl.textContent = texts.text

    // 先显示耳机界面（在警告界面下方）
    headphoneScreen.style.display = 'flex'
    headphoneScreen.style.opacity = '1'

    // 淡出警告界面
    if (warningScreen) {
      warningScreen.classList.add('fade-out')
      setTimeout(() => {
        warningScreen.style.display = 'none'
        warningScreen.classList.remove('fade-out')
      }, 400)
    }

    console.log('[LangSelect] Showing headphone screen for 5 seconds...')

    // 5秒后淡出并回调
    setTimeout(() => {
      headphoneScreen.classList.add('fade-out')

      setTimeout(() => {
        headphoneScreen.style.display = 'none'
        headphoneScreen.classList.remove('fade-out')
        console.log('[LangSelect] Headphone screen completed')
        if (onComplete) onComplete()
      }, 400)
    }, SCREEN_DISPLAY_DURATION)
  }

  /**
   * 返回到语言选择界面（从Opening调用）
   */
  static returnToLangSelect() {
    const langScreen = document.querySelector('.lang-select-screen')
    const openingScreen = document.querySelector('.opening-screen')

    if (!langScreen || !openingScreen) {
      console.error('[LangSelect] Required screens not found')
      return
    }

    // 清除语言设置
    localStorage.removeItem('gameLang')

    // 确保 LangSelect 实例存在并初始化
    // 路径2（有语言无存档）进入时不会创建 LangSelect，需要在这里创建
    if (!window._langSelectInstance) {
      const langSelect = new LangSelect({
        fadeOutDuration: 400,
        onLanguageSelected: (lang) => {
          console.log(`[LangSelect] Language selected: ${lang}, initializing Opening...`)
          const opening = new OpeningScreen({
            fadeOutDuration: 1000,
            bootDelay: 500,
            onComplete: () => {
              console.log('[Init] Opening completed, starting game...')
              window.openingActive = false
              if (typeof initApp === 'function') {
                initApp()
              }
            }
          })
          opening.init()
        }
      })
      langSelect.init()
      console.log('[LangSelect] Created new instance for return flow')
    } else {
      // 已有实例，重置状态
      window._langSelectInstance.isTransitioning = false
    }

    // 淡出Opening
    openingScreen.classList.add('fade-out')

    setTimeout(() => {
      // 隐藏Opening
      openingScreen.style.display = 'none'
      openingScreen.classList.remove('fade-out')
      openingScreen.style.opacity = '1'
      openingScreen.style.animation = ''

      // 显示语言选择界面
      langScreen.classList.remove('hidden')
      langScreen.classList.add('fade-in')

      setTimeout(() => {
        langScreen.classList.remove('fade-in')
      }, 500)

      console.log('[LangSelect] Returned to language selection')
    }, 800)
  }

  /**
   * 显示语言选择界面
   */
  show() {
    const langScreen = document.querySelector('.lang-select-screen')
    if (langScreen) {
      langScreen.classList.remove('hidden')
    }
  }

  /**
   * 隐藏语言选择界面
   */
  hide() {
    const langScreen = document.querySelector('.lang-select-screen')
    if (langScreen) {
      langScreen.classList.add('hidden')
    }
  }
}

// 添加 Opening 淡入动画（如果不存在）
const styleSheet = document.createElement('style')
styleSheet.textContent = `
  @keyframes opening-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`
document.head.appendChild(styleSheet)

// 导出到全局
if (typeof window !== 'undefined') {
  window.LangSelect = LangSelect
}
