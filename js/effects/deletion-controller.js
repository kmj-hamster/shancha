/**
 * 记忆删除动画控制器
 * Memory Deletion Animation Controller
 */

/**
 * 国际化文本
 * Internationalized Texts
 */
const DELETION_TEXTS = {
  en: {
    // DOM Template
    progressLabel: 'DATA DELETION PROGRESS',

    // DeletionAnimation1 - Stage 1: Initialization
    anim1_init_protocol: '> INITIALIZING MEMORY DELETION PROTOCOL...',
    anim1_init_target: '> TARGET: IMPLANTED MEMORY [ID: 19450831-18]',
    anim1_init_loading: '> LOADING NEURAL MAPPING DATA... [OK]',
    anim1_init_ready: '> SYSTEM READY. BEGINNING DELETION...',

    // DeletionAnimation1 - Stage 2: Normal Deletion
    anim1_normal_scanning: '> Scanning memory blocks...',
    anim1_normal_deleting: '> Deleting data segments...',
    anim1_normal_processing: '> Processing memory blocks...',
    anim1_normal_progress28: '> Progress: 28%',
    anim1_normal_continuing: '> Continuing deletion process...',
    anim1_normal_analyzing: '> Analyzing memory interconnections...',
    anim1_normal_progress40: '> Progress: 40%',

    // DeletionAnimation1 - Stage 3: Warnings
    anim1_warn_abnormal: '[WARNING] ABNORMAL MEMORY CONNECTION DETECTED',
    anim1_warn_cannot: '[ALERT] DELETION CANNOT PROCEED SAFELY',

    // DeletionAnimation1 - Stage 4: Report
    anim1_report_integration: '>>> TARGET MEMORY SHOWS ABNORMAL INTEGRATION <<<',
    anim1_report_density: '>>> INTERCONNECTION DENSITY: SIGNIFICANTLY ABOVE THRESHOLD <<<',
    anim1_report_dependency: '>>> DEPENDENCY COUNT: MASSIVE CRITICAL LINKS DETECTED <<<',
    anim1_report_damage: '[CRITICAL] FORCED DELETION WILL CAUSE IRREVERSIBLE DAMAGE',
    anim1_report_risk: '[CRITICAL] LIMBIC SYSTEM AND HIPPOCAMPUS AT RISK',
    anim1_report_cannot: '>>> THIS MEMORY CANNOT BE DELETED INDEPENDENTLY <<<',

    // DeletionAnimation1 - Stage 5: Abort
    anim1_abort_terminated: '> DELETION PROCESS TERMINATED',
    anim1_abort_reason: '> Reason: SAFETY PROTOCOL VIOLATION',

    // DeletionAnimation2 - Stage 1: Fast Deletion
    anim2_fast_reinit: '> REINITIALIZING... MAXIMUM AUTHORITY, SAFETY LIMITS OVERRIDDEN',
    anim2_fast_beginning: '> BEGINNING FORCED DELETION...',
    anim2_fast_blocks: '> Deleting [BLOCK 0001] [BLOCK 0002] [BLOCK 0003]',
    anim2_fast_progress24: '> Progress: 24%',
    anim2_fast_bypass: '> Bypassing safety checks...',
    anim2_fast_progress38: '> Progress: 38%',
    anim2_fast_accelerated: '> Deletion accelerated...',
    anim2_fast_progress50: '> Progress: 50%',

    // DeletionAnimation2 - Stage 2: Light Glitch
    anim2_light_continuing: '> Continuing deletion...',
    anim2_light_notice: '[NOTICE] Minor signal fluctuation detected',
    anim2_light_progress58: '> Pro█ress: 58%',
    anim2_light_block: '> Deleting [BL█CK 14██]',

    // DeletionAnimation2 - Stage 3: Medium Glitch
    anim2_medium_progress64: '> ██ogress: 64%',
    anim2_medium_anomaly: '[WARNING] Data integrity anomaly',
    anim2_medium_block: '> Del█ting [BLO█K ████]',
    anim2_medium_progress73: '> ███gre██: 73%',
    anim2_medium_connection: '[WARNING] ██connection ███table',

    // DeletionAnimation2 - Stage 4: Heavy Glitch
    anim2_heavy_instability: '[ERROR] SYSTEM INSTABILITY',
    anim2_heavy_corrupted1: '█ ████████: ██%',
    anim2_heavy_interference: '[CRITICAL] UNKNOWN INTERFERENCE',
    anim2_heavy_corrupted2: '█ ███████████',
    anim2_heavy_progress90: '> Progress: 90%',

    // DeletionAnimation2 - Stage 5: Connection Unstable
    anim2_unstable_resistance: '[ERROR] RESISTANCE DETECTED',
    anim2_unstable_connection: '[CRITICAL] CONNECTION UNSTABLE',
    anim2_unstable_alert: '[ALERT] CONNECTION INSTABILITY DETECTED',

    // AwakeningAnimation - Stage 1
    awaken_alert: '> SYSTEM ALERT',
    awaken_consciousness: '> Autonomous consciousness detected in patient',
    awaken_neural: '> Neural activity patterns indicate self-awareness',

    // AwakeningAnimation - Stage 2
    awaken_initiating: '> INITIATING MEMORY RESTORATION PROTOCOL',
    awaken_scanning: '> Scanning temporal range: 1920 - 1995',
    awaken_rebuilding: '> Rebuilding neural pathways...',

    // AwakeningAnimation - Stage 3
    awaken_fragments: '> Memory fragments detected:',
    awaken_processing: '> Processing emotional connections...',

    // AwakeningAnimation - Stage 4
    awaken_accessing: '> ACCESSING DEEP MEMORY LAYER',
    awaken_decrypting: '> Rebuilding data...',

    // AwakeningAnimation - Stage 5
    awaken_core_located: '> Core memory located:',
    awaken_core_memory: '  - 19-8pm-blood',
    awaken_integrating: '> Integrating memory structure...',
    awaken_synchronizing: '> Synchronizing consciousness...',

    // AwakeningAnimation - Stage 6
    awaken_complete: '>>> MEMORY RESTORATION COMPLETE <<<',

    // AwakeningAnimation - Stage 7
    awaken_patient: '>>> PATIENT AWAKENING IMMINENT <<<'
  },

  zh: {
    // DOM Template
    progressLabel: '数据删除进度',

    // DeletionAnimation1 - Stage 1: Initialization
    anim1_init_protocol: '> 正在初始化记忆删除协议...',
    anim1_init_target: '> 目标：植入记忆 [ID: 19450831-18]',
    anim1_init_loading: '> 加载神经映射数据... [完成]',
    anim1_init_ready: '> 系统就绪。开始删除...',

    // DeletionAnimation1 - Stage 2: Normal Deletion
    anim1_normal_scanning: '> 扫描记忆块...',
    anim1_normal_deleting: '> 删除数据段...',
    anim1_normal_processing: '> 处理记忆块...',
    anim1_normal_progress28: '> 进度：28%',
    anim1_normal_continuing: '> 继续删除进程...',
    anim1_normal_analyzing: '> 分析记忆关联...',
    anim1_normal_progress40: '> 进度：40%',

    // DeletionAnimation1 - Stage 3: Warnings
    anim1_warn_abnormal: '[警告] 检测到异常记忆连接',
    anim1_warn_cannot: '[警报] 无法安全继续删除',

    // DeletionAnimation1 - Stage 4: Report
    anim1_report_integration: '>>> 目标记忆显示异常整合 <<<',
    anim1_report_density: '>>> 关联密度：显著超过阈值 <<<',
    anim1_report_dependency: '>>> 依赖计数：检测到大量关键连接 <<<',
    anim1_report_damage: '[严重] 强制删除将造成不可逆损伤',
    anim1_report_risk: '[严重] 边缘系统和海马体面临风险',
    anim1_report_cannot: '>>> 此记忆无法独立删除 <<<',

    // DeletionAnimation1 - Stage 5: Abort
    anim1_abort_terminated: '> 删除进程已终止',
    anim1_abort_reason: '> 原因：违反安全协议',

    // DeletionAnimation2 - Stage 1: Fast Deletion
    anim2_fast_reinit: '> 重新初始化... 最高权限，安全限制已覆盖',
    anim2_fast_beginning: '> 开始强制删除...',
    anim2_fast_blocks: '> 删除 [区块 0001] [区块 0002] [区块 0003]',
    anim2_fast_progress24: '> 进度：24%',
    anim2_fast_bypass: '> 绕过安全检查...',
    anim2_fast_progress38: '> 进度：38%',
    anim2_fast_accelerated: '> 删除加速中...',
    anim2_fast_progress50: '> 进度：50%',

    // DeletionAnimation2 - Stage 2: Light Glitch
    anim2_light_continuing: '> 继续删除...',
    anim2_light_notice: '[提示] 检测到轻微信号波动',
    anim2_light_progress58: '> 进█：58%',
    anim2_light_block: '> 删除 [区█ 14██]',

    // DeletionAnimation2 - Stage 3: Medium Glitch
    anim2_medium_progress64: '> ██度：64%',
    anim2_medium_anomaly: '[警告] 数据完整性异常',
    anim2_medium_block: '> 删█ [区█K ████]',
    anim2_medium_progress73: '> ███度██：73%',
    anim2_medium_connection: '[警告] ██接 ███定',

    // DeletionAnimation2 - Stage 4: Heavy Glitch
    anim2_heavy_instability: '[错误] 系统不稳定',
    anim2_heavy_corrupted1: '█ ████████：██%',
    anim2_heavy_interference: '[严重] 未知干扰',
    anim2_heavy_corrupted2: '█ ███████████',
    anim2_heavy_progress90: '> 进度：90%',

    // DeletionAnimation2 - Stage 5: Connection Unstable
    anim2_unstable_resistance: '[错误] 检测到阻抗',
    anim2_unstable_connection: '[严重] 连接不稳定',
    anim2_unstable_alert: '[警报] 检测到连接不稳定',

    // AwakeningAnimation - Stage 1
    awaken_alert: '> 系统警报',
    awaken_consciousness: '> 检测到患者自主意识',
    awaken_neural: '> 神经活动模式显示自主意识',

    // AwakeningAnimation - Stage 2
    awaken_initiating: '> 正在启动记忆恢复协议',
    awaken_scanning: '> 扫描时间范围：1920 - 1995',
    awaken_rebuilding: '> 重建神经通路...',

    // AwakeningAnimation - Stage 3
    awaken_fragments: '> 检测到记忆碎片：',
    awaken_processing: '> 处理情感关联...',

    // AwakeningAnimation - Stage 4
    awaken_accessing: '> 访问深层记忆层',
    awaken_decrypting: '> 重建数据...',

    // AwakeningAnimation - Stage 5
    awaken_core_located: '> 已定位核心记忆：',
    awaken_core_memory: '  - 19-20：00-血',
    awaken_integrating: '> 整合记忆结构...',
    awaken_synchronizing: '> 同步意识...',

    // AwakeningAnimation - Stage 6
    awaken_complete: '>>> 记忆恢复完成 <<<',

    // AwakeningAnimation - Stage 7
    awaken_patient: '>>> 患者即将苏醒 <<<'
  }
}

/**
 * 基础删除序列类
 */
class DeletionSequence {
  constructor(options = {}) {
    this.target = options.target || '.app-container'
    this.onComplete = options.onComplete || (() => {})
    this.container = null
    this.logArea = null
    this.progressFill = null
    this.progressPercent = null
    this.isRunning = false

    // 国际化
    this.lang = localStorage.getItem('gameLang') || 'en'
    this.texts = DELETION_TEXTS[this.lang] || DELETION_TEXTS.en
  }

  /**
   * 创建删除屏幕DOM
   */
  createScreen() {
    const screen = document.createElement('div')
    screen.className = 'deletion-screen'
    screen.innerHTML = `
      <div class="deletion-container">
        <!-- 日志区域 -->
        <div class="log-area">
          <div class="log-scroll"></div>
        </div>

        <!-- 进度条区域 -->
        <div class="progress-area">
          <div class="progress-label">
            <span class="warning-icon">⚠</span>
            ${this.texts.progressLabel}
          </div>

          <div class="progress-container">
            <div class="progress-fill" style="width: 0%"></div>
          </div>

          <div class="progress-info">
            <span class="progress-percent">0%</span>
            <span class="progress-path">DATA//MindMirror//█████//r*.core</span>
          </div>
        </div>

        <!-- 光标 -->
        <div class="cursor-blink">_</div>
      </div>
    `
    return screen
  }

  /**
   * 显示日志行
   */
  async showLog(text, className = 'log-normal', delay = 200) {
    if (!this.logArea) return

    const line = document.createElement('div')
    line.className = `log-line ${className}`
    line.textContent = text
    this.logArea.appendChild(line)

    // 自动滚动到底部
    this.logArea.scrollTo({
      top: this.logArea.scrollHeight,
      behavior: 'smooth'
    })

    return this.delay(delay)
  }

  /**
   * 更新进度条
   */
  updateProgress(percent) {
    if (this.progressFill) {
      this.progressFill.style.width = `${percent}%`
    }
    if (this.progressPercent) {
      this.progressPercent.textContent = `${percent}%`
    }
  }

  /**
   * 进度条倒退动画（从当前值倒退到0）
   */
  async regressProgress(duration = 2000) {
    const currentPercent = parseInt(this.progressPercent.textContent) || 0
    const steps = 20 // 分20步倒退
    const stepDuration = duration / steps
    const stepDecrement = currentPercent / steps

    for (let i = 0; i < steps; i++) {
      const newPercent = Math.max(0, currentPercent - stepDecrement * (i + 1))
      this.updateProgress(Math.round(newPercent))
      await this.delay(stepDuration)
    }

    // 确保最后是0%
    this.updateProgress(0)
  }

  /**
   * 清空日志
   */
  clearLogs() {
    if (this.logArea) {
      this.logArea.innerHTML = ''
    }
  }

  /**
   * 延迟工具函数
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 淡入屏幕
   */
  async fadeIn() {
    this.container.classList.add('fade-in')
    await this.delay(1000)
  }

  /**
   * 淡出屏幕
   */
  async fadeOut() {
    this.container.classList.add('fade-out')
    await this.delay(2000)
    this.container.remove()
  }
}


/**
 * 第一段删除动画（失败：记忆关联度过高）
 * 时长：约10秒
 */
class DeletionAnimation1 extends DeletionSequence {
  constructor(options = {}) {
    super(options)
  }

  /**
   * 执行第一段删除动画
   */
  async run() {
    if (this.isRunning) return
    this.isRunning = true

    // 创建并显示删除屏幕
    this.container = this.createScreen()
    document.body.appendChild(this.container)

    this.logArea = this.container.querySelector('.log-scroll')
    this.progressFill = this.container.querySelector('.progress-fill')
    this.progressPercent = this.container.querySelector('.progress-percent')

    await this.delay(50)
    await this.fadeIn()

    // 阶段1：初始化 (0-2s, 0-10%)
    await this.stage1_initialization()

    // 阶段2：正常删除 (2-5s, 10-40%)
    await this.stage2_normalDeletion()

    // 阶段3：警告触发 (5-6s, 40%)
    await this.stage3_warnings()

    // 阶段4：系统报告 (6-9s, 40%)
    await this.stage4_report()

    // 阶段5：终止 (9-10s)
    await this.stage5_abort()

    // 等待5秒让用户看到终止消息
    await this.delay(5000)

    // 进度条倒退回0
    await this.regressProgress(2000)

    // 淡出并清理
    await this.delay(500)
    await this.fadeOut()

    this.isRunning = false
    this.onComplete()
  }

  /**
   * 阶段1：初始化 (0-2s, 0-10%)
   */
  async stage1_initialization() {
    await this.showLog(this.texts.anim1_init_protocol, 'log-normal', 100)
    this.updateProgress(2)

    await this.showLog(this.texts.anim1_init_target, 'log-normal', 100)
    this.updateProgress(5)

    await this.showLog(this.texts.anim1_init_loading, 'log-normal', 100)
    this.updateProgress(8)

    await this.showLog(this.texts.anim1_init_ready, 'log-normal', 150)
    this.updateProgress(10)
  }

  /**
   * 阶段2：正常删除 (2-5s, 10-40%)
   */
  async stage2_normalDeletion() {
    await this.showLog(this.texts.anim1_normal_scanning, 'log-normal', 150)
    this.updateProgress(15)

    await this.showLog(this.texts.anim1_normal_deleting, 'log-normal', 150)
    this.updateProgress(20)

    await this.showLog(this.texts.anim1_normal_processing, 'log-normal', 150)
    this.updateProgress(25)

    await this.showLog(this.texts.anim1_normal_progress28, 'log-normal', 150)
    this.updateProgress(28)

    await this.showLog(this.texts.anim1_normal_continuing, 'log-normal', 150)
    this.updateProgress(33)

    await this.showLog(this.texts.anim1_normal_analyzing, 'log-normal', 150)
    this.updateProgress(38)

    await this.showLog(this.texts.anim1_normal_progress40, 'log-normal', 150)
    this.updateProgress(40)
  }

  /**
   * 阶段3：警告触发 (5-6s, 40%)
   */
  async stage3_warnings() {
    await this.delay(200)
    await this.showLog(this.texts.anim1_warn_abnormal, 'log-warning', 300)
    await this.showLog(this.texts.anim1_warn_cannot, 'log-warning', 300)
  }

  /**
   * 阶段4：系统报告 (6-9s, 40%)
   */
  async stage4_report() {
    await this.delay(200)
    await this.showLog('', 'log-normal', 100)
    await this.showLog(this.texts.anim1_report_integration, 'log-critical', 300)
    await this.showLog(this.texts.anim1_report_density, 'log-critical', 300)
    await this.showLog(this.texts.anim1_report_dependency, 'log-critical', 300)

    await this.delay(200)
    await this.showLog('', 'log-normal', 100)
    await this.showLog(this.texts.anim1_report_damage, 'log-warning', 300)
    await this.showLog(this.texts.anim1_report_risk, 'log-warning', 300)

    await this.delay(200)
    await this.showLog('', 'log-normal', 100)
    await this.showLog(this.texts.anim1_report_cannot, 'log-system', 500)
  }

  /**
   * 阶段5：终止 (9-10s)
   */
  async stage5_abort() {
    await this.delay(300)
    await this.showLog('', 'log-normal', 100)
    await this.showLog(this.texts.anim1_abort_terminated, 'log-error', 200)
    await this.showLog(this.texts.anim1_abort_reason, 'log-normal', 200)
  }
}


/**
 * 第二段删除动画（失败：意识觉醒）
 * 时长：约20秒
 */
class DeletionAnimation2 extends DeletionSequence {
  constructor(options = {}) {
    super(options)
    this.glitchEnabled = options.glitchEnabled !== false
    this.glitchController = null
    this.progressContainer = null
  }

  /**
   * 执行第二段删除动画
   */
  async run() {
    if (this.isRunning) return
    this.isRunning = true

    // 创建并显示删除屏幕
    this.container = this.createScreen()
    document.body.appendChild(this.container)

    this.logArea = this.container.querySelector('.log-scroll')
    this.progressFill = this.container.querySelector('.progress-fill')
    this.progressPercent = this.container.querySelector('.progress-percent')
    this.progressContainer = this.container.querySelector('.progress-container')

    // 初始化故障控制器（只影响日志区域，不影响进度条）
    if (this.glitchEnabled && typeof PowerGlitch !== 'undefined') {
      const logTarget = this.container.querySelector('.log-area')
      this.glitchController = new GlitchController(logTarget || this.container)
    }

    await this.delay(50)
    await this.fadeIn()

    // 阶段1：快速删除 (0-10s, 0-50%)
    await this.stage1_fastDeletion()

    // 阶段2：轻度故障 (10-13s, 50-60%)
    await this.stage2_lightGlitch()

    // 阶段3：中度故障 (13-18s, 60-75%)
    await this.stage3_mediumGlitch()

    // 阶段4：重度故障 (18-23s, 75-90%)
    await this.stage4_heavyGlitch()

    // 阶段5：连接不稳 (23-25s, 90%)
    await this.stage5_connectionUnstable()

    // ECG联动：连接不稳定阶段，最快速度最大起伏
    if (window.ecgController) {
      window.ecgController.setSpeed(5)
      window.ecgController.setAmplitude(1.0)
    }

    // 在淡出前1秒启动scramble decay
    setTimeout(() => {
      console.log('[DeletionAnimation2] Starting scramble decay...')
      // ECG联动：memoryDecay启动前，变慢起伏变小
      if (window.ecgController) {
        window.ecgController.setSpeed(1)
        window.ecgController.setAmplitude(0.3)
      }
      if (typeof window.memoryDecay !== 'undefined') {
        window.memoryDecay.start()
      } else {
        console.warn('[DeletionAnimation2] memoryDecay not found')
      }
    }, 1000) // 1秒后启动（淡出前1秒）

    // 清理故障效果
    if (this.glitchController) {
      this.glitchController.stopAll()
    }

    // 等待2秒让用户看到消息（不倒退进度条）
    await this.delay(2000)

    // 淡出并清理
    await this.fadeOut()

    this.isRunning = false
    this.onComplete()
  }

  /**
   * 阶段1：快速删除 (0-10s, 0-50%)
   */
  async stage1_fastDeletion() {
    await this.showLog(this.texts.anim2_fast_reinit, 'log-warning', 500)
    this.updateProgress(5)

    await this.showLog(this.texts.anim2_fast_beginning, 'log-normal', 480)
    this.updateProgress(10)

    await this.showLog(this.texts.anim2_fast_blocks, 'log-normal', 450)
    this.updateProgress(18)

    await this.showLog(this.texts.anim2_fast_progress24, 'log-normal', 450)
    this.updateProgress(24)

    await this.showLog(this.texts.anim2_fast_bypass, 'log-normal', 450)
    this.updateProgress(32)

    await this.showLog(this.texts.anim2_fast_progress38, 'log-normal', 450)
    this.updateProgress(38)

    await this.showLog(this.texts.anim2_fast_accelerated, 'log-normal', 450)
    this.updateProgress(45)

    await this.showLog(this.texts.anim2_fast_progress50, 'log-normal', 500)
    this.updateProgress(50)
  }

  /**
   * 阶段2：轻度故障 (10-13s, 50-60%)
   */
  async stage2_lightGlitch() {
    // 启动轻度故障
    if (this.glitchController) {
      this.glitchController.startLight()
    }

    await this.showLog(this.texts.anim2_light_continuing, 'log-normal', 550)
    this.updateProgress(53)

    await this.showLog(this.texts.anim2_light_notice, 'log-normal', 550)
    this.updateProgress(56)

    await this.showLog(this.texts.anim2_light_progress58, 'log-corrupted', 550)
    this.updateProgress(58)

    await this.showLog(this.texts.anim2_light_block, 'log-corrupted', 550)
    this.updateProgress(60)
  }

  /**
   * 阶段3：中度故障 (13-18s, 60-75%)
   */
  async stage3_mediumGlitch() {
    // 升级到中度故障
    if (this.glitchController) {
      this.glitchController.startMedium()
    }

    // 进度条开始抖动
    if (this.progressContainer) {
      this.progressContainer.classList.add('glitch-shake')
    }

    await this.showLog(this.texts.anim2_medium_progress64, 'log-corrupted', 500)
    this.updateProgress(64)

    await this.showLog(this.texts.anim2_medium_anomaly, 'log-warning', 500)
    this.updateProgress(67)

    await this.showLog(this.texts.anim2_medium_block, 'log-corrupted', 500)
    this.updateProgress(70)

    await this.showLog(this.texts.anim2_medium_progress73, 'log-corrupted', 500)
    this.updateProgress(73)

    await this.showLog(this.texts.anim2_medium_connection, 'log-corrupted', 500)
    this.updateProgress(75)
  }

  /**
   * 阶段4：重度故障 (18-23s, 75-90%)
   */
  async stage4_heavyGlitch() {
    // 升级到重度故障
    if (this.glitchController) {
      this.glitchController.startHeavy()
    }

    // 进度条剧烈抖动
    if (this.progressContainer) {
      this.progressContainer.classList.remove('glitch-shake')
      this.progressContainer.classList.add('glitch-shake-heavy')
    }

    await this.showLog(this.texts.anim2_heavy_instability, 'log-error', 450)
    this.updateProgress(78)

    await this.showLog(this.texts.anim2_heavy_corrupted1, 'log-corrupted', 450)
    this.updateProgress(82)

    await this.showLog(this.texts.anim2_heavy_interference, 'log-error', 450)
    this.updateProgress(85)

    await this.showLog(this.texts.anim2_heavy_corrupted2, 'log-corrupted', 450)
    this.updateProgress(87)

    await this.showLog(this.texts.anim2_heavy_progress90, 'log-normal', 450)
    this.updateProgress(90)
  }

  /**
   * 阶段5：连接不稳 (23-25s, 90%)
   */
  async stage5_connectionUnstable() {
    // 开始刷屏
    for (let i = 0; i < 6; i++) {
      await this.showLog(this.texts.anim2_unstable_resistance, 'log-error', 50)
    }

    await this.delay(100)

    await this.showLog(this.texts.anim2_unstable_connection, 'log-error', 50)
    await this.showLog(this.texts.anim2_unstable_connection, 'log-error', 50)

    await this.delay(100)

    // 停止故障效果
    if (this.glitchController) {
      this.glitchController.stopAll()
    }

    // 移除进度条抖动
    if (this.progressContainer) {
      this.progressContainer.classList.remove('glitch-shake-heavy')
    }

    await this.delay(300)
    await this.showLog('', 'log-normal', 100)
    await this.showLog(this.texts.anim2_unstable_alert, 'log-warning', 400)
  }
}


/**
 * 故障控制器
 * 管理PowerGlitch效果
 */
class GlitchController {
  constructor(targetElement) {
    this.target = targetElement
    this.currentGlitch = null
  }

  /**
   * 启动轻度故障
   */
  startLight() {
    this.stopCurrent()

    if (typeof PowerGlitch === 'undefined') return

    this.currentGlitch = PowerGlitch.glitch(this.target, {
      createContainers: false,  // 禁用容器创建，避免DOM结构变化
      hideOverflow: false,      // 不隐藏溢出
      timing: {
        duration: 4000,  // 延长周期，更平滑
        iterations: Infinity
      },
      glitchTimeSpan: {
        start: 0.7,   // 70%时间正常
        end: 0.85     // 只有15%时间故障
      },
      shake: {
        velocity: 3,          // 降低速度
        amplitudeX: 0.008,    // 大幅降低振幅
        amplitudeY: 0.008
      },
      slice: {
        count: 2,             // 减少切片数量
        velocity: 5,          // 降低速度
        minHeight: 0.02,
        maxHeight: 0.08       // 减小切片高度
      }
    })
  }

  /**
   * 启动中度故障
   */
  startMedium() {
    this.stopCurrent()

    if (typeof PowerGlitch === 'undefined') return

    this.currentGlitch = PowerGlitch.glitch(this.target, {
      createContainers: false,  // 禁用容器创建
      hideOverflow: false,      // 不隐藏溢出
      timing: {
        duration: 2500,       // 延长周期
        iterations: Infinity
      },
      glitchTimeSpan: {
        start: 0.5,           // 50%时间正常
        end: 0.75             // 25%时间故障
      },
      shake: {
        velocity: 6,          // 降低速度
        amplitudeX: 0.03,     // 大幅降低振幅
        amplitudeY: 0.02
      },
      slice: {
        count: 4,             // 减少切片
        velocity: 10,         // 降低速度
        minHeight: 0.02,
        maxHeight: 0.12       // 适度增加高度
      }
    })
  }

  /**
   * 启动重度故障
   */
  startHeavy() {
    this.stopCurrent()

    if (typeof PowerGlitch === 'undefined') return

    this.currentGlitch = PowerGlitch.glitch(this.target, {
      createContainers: false,  // 禁用容器创建
      hideOverflow: false,      // 不隐藏溢出
      timing: {
        duration: 800,        // 延长周期，避免太快
        iterations: Infinity
      },
      glitchTimeSpan: {
        start: 0.2,           // 20%时间正常（即使在重度故障）
        end: 0.9              // 70%时间故障
      },
      shake: {
        velocity: 12,         // 大幅降低速度
        amplitudeX: 0.08,     // 大幅降低振幅
        amplitudeY: 0.06
      },
      slice: {
        count: 8,             // 大幅减少切片
        velocity: 15,         // 降低速度
        minHeight: 0.02,
        maxHeight: 0.18       // 适度减小高度
      },
      pulse: false
    })
  }

  /**
   * 停止当前故障
   */
  stopCurrent() {
    if (this.currentGlitch && this.currentGlitch.stopGlitch) {
      this.currentGlitch.stopGlitch()
      this.currentGlitch = null
    }
  }

  /**
   * 停止所有故障
   */
  stopAll() {
    this.stopCurrent()
  }
}


/**
 * 苏醒动画（绿色主题，无进度条）
 * Awakening Animation
 * 时长：约15-20秒
 */
class AwakeningAnimation extends DeletionSequence {
  constructor(options = {}) {
    super(options)
    this.finalMemories = options.finalMemories || [
      'sunflower',
      'photo',
      'Mozart',
      'Firework',
      'cat',
      'Wagner'
    ]
  }

  /**
   * 创建苏醒屏幕DOM（绿色主题，无进度条）
   */
  createScreen() {
    const screen = document.createElement('div')
    screen.className = 'deletion-screen awakening-screen'
    screen.innerHTML = `
      <div class="deletion-container">
        <!-- 日志区域 -->
        <div class="log-area">
          <div class="log-scroll"></div>
        </div>

        <!-- 光标 -->
        <div class="cursor-blink awakening-cursor">_</div>
      </div>
    `
    return screen
  }

  /**
   * 执行苏醒动画
   */
  async run() {
    if (this.isRunning) return
    this.isRunning = true

    // 创建并显示屏幕
    this.container = this.createScreen()
    document.body.appendChild(this.container)

    this.logArea = this.container.querySelector('.log-scroll')

    await this.delay(50)
    await this.fadeIn()

    // 阶段1：检测自主意识
    await this.stage1_consciousnessDetected()

    // 阶段2：记忆恢复初始化
    await this.stage2_memoryRecovery()

    // 阶段3：发现8个记忆
    await this.stage3_discoverMemories()

    // 阶段4：深层记忆恢复
    await this.stage4_deepMemoryRecovery()

    // 阶段5：发现核心记忆
    await this.stage5_coreMemory()

    // 阶段6：恢复完成
    await this.stage6_recoveryComplete()

    // 阶段7：患者即将苏醒（大字号）
    await this.stage7_patientAwakening()

    // 等待3秒让用户看完
    await this.delay(3000)

    // ECG联动：Recovery动画完成后恢复正常（瞬间变色，重置速度和幅度）
    if (window.ecgController) {
      window.ecgController.setMode('normal')
      window.ecgController.setSpeed(1)
      window.ecgController.setAmplitude(0.8)
    }

    // 淡出并清理
    await this.fadeOut()

    this.isRunning = false
    this.onComplete()
  }

  /**
   * 阶段1：检测自主意识
   */
  async stage1_consciousnessDetected() {
    await this.showLog(this.texts.awaken_alert, 'log-awakening-normal', 300)
    await this.showLog(this.texts.awaken_consciousness, 'log-awakening-normal', 400)
    await this.showLog(this.texts.awaken_neural, 'log-awakening-normal', 400)
    await this.showLog('', 'log-awakening-normal', 100)
  }

  /**
   * 阶段2：记忆恢复初始化
   */
  async stage2_memoryRecovery() {
    await this.showLog(this.texts.awaken_initiating, 'log-awakening-highlight', 500)
    await this.showLog(this.texts.awaken_scanning, 'log-awakening-normal', 400)
    await this.showLog(this.texts.awaken_rebuilding, 'log-awakening-normal', 400)
    await this.showLog('', 'log-awakening-normal', 100)
  }

  /**
   * 阶段3：发现8个记忆
   */
  async stage3_discoverMemories() {
    await this.showLog(this.texts.awaken_fragments, 'log-awakening-normal', 300)

    // 逐个显示8个记忆
    for (const memory of this.finalMemories) {
      await this.showLog(`  - ${memory}`, 'log-awakening-memory', 250)
    }

    await this.showLog('', 'log-awakening-normal', 100)
    await this.showLog(this.texts.awaken_processing, 'log-awakening-normal', 400)
    await this.showLog('', 'log-awakening-normal', 100)
  }

  /**
   * 阶段4：深层记忆恢复
   */
  async stage4_deepMemoryRecovery() {
    await this.showLog(this.texts.awaken_accessing, 'log-awakening-highlight', 500)
    await this.showLog(this.texts.awaken_decrypting, 'log-awakening-normal', 400)
    await this.showLog('', 'log-awakening-normal', 200)
  }

  /**
   * 阶段5：发现核心记忆
   */
  async stage5_coreMemory() {
    await this.showLog(this.texts.awaken_core_located, 'log-awakening-normal', 300)
    await this.showLog(this.texts.awaken_core_memory, 'log-awakening-critical', 600)
    await this.showLog('', 'log-awakening-normal', 100)
    await this.showLog(this.texts.awaken_integrating, 'log-awakening-normal', 400)
    await this.showLog(this.texts.awaken_synchronizing, 'log-awakening-normal', 400)
    await this.showLog('', 'log-awakening-normal', 200)
  }

  /**
   * 阶段6：恢复完成
   */
  async stage6_recoveryComplete() {
    await this.showLog(this.texts.awaken_complete, 'log-awakening-system', 600)
    await this.showLog('', 'log-awakening-normal', 300)
  }

  /**
   * 阶段7：患者即将苏醒（大字号）
   */
  async stage7_patientAwakening() {
    await this.showLog(this.texts.awaken_patient, 'log-awakening-final', 800)
  }
}


// 导出到全局
if (typeof window !== 'undefined') {
  window.DeletionSequence = DeletionSequence
  window.DeletionAnimation1 = DeletionAnimation1
  window.DeletionAnimation2 = DeletionAnimation2
  window.GlitchController = GlitchController
  window.AwakeningAnimation = AwakeningAnimation
}
