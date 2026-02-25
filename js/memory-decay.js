/**
 * 记忆消失特效模块 - Memory Decay Effect
 * 实现文字在20秒内逐渐消失的动态效果
 * 作用范围：.card-scroll 区域内的文本
 */

class MemoryDecayEffect {
    constructor(scrambleEffect) {
        // 关联scramble系统
        this.scramble = scrambleEffect;

        // 时间参数
        this.refreshInterval = 500;   // 0.5秒刷新一次，更流畅的动态效果
        this.totalDuration = 20000;   // 20秒总时长
        this.glitchInterval = 5000;   // 5秒触发一次PowerGlitch

        // 状态控制
        this.startTime = null;
        this.timer = null;
        this.autoStopTimer = null;
        this.glitchTimer = null;      // Glitch定时器
        this.titleScrambleTimer = null; // list title乱码定时器
        this.isActive = false;

        // 目标选择器 - 仅作用于card-scroll区域
        this.targetSelector = '.card-scroll .text-content, .card-scroll p, .card-scroll span:not(.file-name)';

        // 原始文本存储
        this.originalTexts = new Map();
        this.originalTitles = new Map();  // list title的原始文本

        // 删除阶段
        this.deletionTimer = null;        // 删除阶段定时器
        this.hiddenCards = new Set();     // 已隐藏的卡片ID集合

        // 日志控制
        this.lastLogTime = 0;

        console.log('🔥 MemoryDecayEffect initialized');
    }

    /**
     * 计算文字保留率
     * @param {number} elapsed - 经过的时间(毫秒)
     * @returns {number} - 保留率(0.0-1.0)
     */
    getRetentionRate(elapsed) {
        const t = elapsed / 1000; // 转换为秒

        if (t < 8) return 1.0;                       // 0-8s: 100%
        if (t < 14) return 1.0 - (t - 8) * 0.05;    // 8-14s: 100%→70%
        if (t < 18) return 0.7 - (t - 14) * 0.125;  // 14-18s: 70%→20%
        if (t < 20) return 0.2 - (t - 18) * 0.1;    // 18-20s: 20%→0%
        return 0;  // 20s后: 0%
    }

    /**
     * 获取消失替换字符
     * @param {number} rate - 当前保留率
     * @returns {string} - 替换字符
     */
    getDecayChar(rate) {
        if (rate > 0.5) {
            // 早期：空格为主，偶尔有点
            return Math.random() < 0.8 ? ' ' : '·';
        } else if (rate > 0.2) {
            // 中期：多种符号混合
            const chars = [' ', ' ', ' ', '·', '…', '‧'];
            return chars[Math.floor(Math.random() * chars.length)];
        } else {
            // 后期：几乎全是空格
            return Math.random() < 0.95 ? ' ' : '…';
        }
    }

    /**
     * 应用消失效果到乱码文本
     * @param {string} scrambledText - 已经乱码化的文本
     * @param {number} retentionRate - 保留率
     * @returns {string} - 处理后的文本
     */
    applyDecay(scrambledText, retentionRate) {
        if (retentionRate >= 1.0) {
            return scrambledText; // 完整保留
        }

        const chars = scrambledText.split('');
        return chars.map((char, index) => {
            // 保留空格和换行
            if (char === ' ' || char === '\n' || char === '\t') {
                return char;
            }

            // 使用字符索引创建稳定的随机性（每个位置的消失概率相对固定）
            // 但由于scrambledText每次都不同，所以显示的字符会持续变化
            const seed = (index * 137 + this.getSeedOffset()) % 100;
            const threshold = retentionRate * 100;

            if (seed < threshold) {
                return char; // 保留乱码字符（每次刷新都是不同的随机字符）
            } else {
                // 替换为消失效果字符
                return this.getDecayChar(retentionRate);
            }
        }).join('');
    }

    /**
     * 获取种子偏移量（用于创建一些变化）
     */
    getSeedOffset() {
        // 每2秒变化一次种子，让消失的位置有些微变化
        return Math.floor((Date.now() - this.startTime) / 2000) * 17;
    }

    /**
     * 保存原始文本
     * 优先从data-original-text属性读取（渲染器已保存）
     */
    saveOriginalTexts() {
        const elements = document.querySelectorAll(this.targetSelector);
        elements.forEach(element => {
            if (!this.originalTexts.has(element)) {
                // 优先从data属性读取原文（渲染器在decay激活时已保存）
                const originalText = element.getAttribute('data-original-text');
                if (originalText) {
                    this.originalTexts.set(element, originalText);
                } else {
                    // 如果没有data属性，从textContent读取（非decay激活时的情况）
                    this.originalTexts.set(element, element.textContent);
                }
            }
        });
        console.log(`📝 Saved ${this.originalTexts.size} original texts`);
    }

    /**
     * 保存list title和title-bar的原始文本
     */
    saveOriginalTitles() {
        // 保存list title
        const titleElements = document.querySelectorAll('.file-list .file-name');
        titleElements.forEach(element => {
            if (!this.originalTitles.has(element)) {
                this.originalTitles.set(element, element.textContent);
            }
        });

        // 保存title-bar的元素
        const titleBar = document.querySelector('.title-bar');
        if (titleBar) {
            const fileName = titleBar.querySelector('.card-filename');
            const timestamp = titleBar.querySelector('.card-timestamp');
            const year = titleBar.querySelector('.card-year');

            if (fileName && !this.originalTitles.has(fileName)) {
                this.originalTitles.set(fileName, fileName.textContent);
            }
            if (timestamp && !this.originalTitles.has(timestamp)) {
                this.originalTitles.set(timestamp, timestamp.textContent);
            }
            if (year && !this.originalTitles.has(year)) {
                this.originalTitles.set(year, year.textContent);
            }
        }

        console.log(`📝 Saved ${this.originalTitles.size} original titles`);
    }

    /**
     * 更新list title和title-bar的乱码效果（保持长度稳定）
     */
    updateTitleScramble() {
        if (!this.isActive) return;

        // 重新保存titles（处理DOM更新的情况）
        this.resaveTitles();

        this.originalTitles.forEach((originalText, element) => {
            if (element && element.parentNode && this.scramble) {
                // 生成乱码，但保持长度一致
                const scrambled = this.scramble.scrambleText(originalText, false);
                element.textContent = scrambled;
            }
        });
    }

    /**
     * 重新保存titles（处理DOM刷新后的情况）
     * 从data-original-text属性读取原文（渲染器已保存）
     */
    resaveTitles() {
        // 更新list titles（因为可能被refreshFileList()重新渲染）
        const titleElements = document.querySelectorAll('.file-list .file-name');
        titleElements.forEach(element => {
            if (!this.originalTitles.has(element)) {
                // 从data属性获取原文（渲染器已经保存）
                const originalText = element.getAttribute('data-original-text');
                if (originalText) {
                    this.originalTitles.set(element, originalText);
                    // 渲染器已经应用了乱码，这里不需要再处理
                }
            }
        });

        // 更新title-bar元素
        const titleBar = document.querySelector('.title-bar');
        if (titleBar) {
            const fileName = titleBar.querySelector('.card-filename');
            const timestamp = titleBar.querySelector('.card-timestamp');
            const year = titleBar.querySelector('.card-year');

            if (fileName && !this.originalTitles.has(fileName)) {
                const originalText = fileName.getAttribute('data-original-text');
                if (originalText) {
                    this.originalTitles.set(fileName, originalText);
                }
            }
            if (timestamp && !this.originalTitles.has(timestamp)) {
                const originalText = timestamp.getAttribute('data-original-text');
                if (originalText) {
                    this.originalTitles.set(timestamp, originalText);
                }
            }
            if (year && !this.originalTitles.has(year)) {
                const originalText = year.getAttribute('data-original-text');
                if (originalText) {
                    this.originalTitles.set(year, originalText);
                }
            }
        }
    }

    /**
     * 恢复list title的原始文本
     */
    restoreOriginalTitles() {
        this.originalTitles.forEach((text, element) => {
            if (element && element.parentNode) {
                element.textContent = text;
                // 清除data属性
                element.removeAttribute('data-original-text');
            }
        });
        this.originalTitles.clear();
        console.log('✨ Original titles restored');
    }

    /**
     * 触发Glitch效果（短暂闪烁）- 使用CSS遮罩层，不破坏DOM
     */
    triggerGlitch() {
        // 检查是否已存在遮罩层，避免重复创建
        let overlay = document.querySelector('.glitch-overlay');

        if (!overlay) {
            // 创建遮罩层
            overlay = document.createElement('div');
            overlay.className = 'glitch-overlay';

            // 添加黑色故障条带
            const darkBands = document.createElement('div');
            darkBands.className = 'dark-bands';
            overlay.appendChild(darkBands);

            // 添加扫描线
            const scanlines = document.createElement('div');
            scanlines.className = 'scanlines';
            overlay.appendChild(scanlines);

            // 添加条纹
            const stripes = document.createElement('div');
            stripes.className = 'stripes';
            overlay.appendChild(stripes);

            // 添加闪烁块容器
            const blocks = document.createElement('div');
            blocks.className = 'blocks';
            for (let i = 0; i < 4; i++) {
                const block = document.createElement('div');
                block.className = 'block';
                blocks.appendChild(block);
            }
            overlay.appendChild(blocks);

            // 添加色彩失真
            const chromatic = document.createElement('div');
            chromatic.className = 'chromatic';
            overlay.appendChild(chromatic);

            // 添加到body
            document.body.appendChild(overlay);
            console.log('✅ Glitch overlay created with dark bands');
        }

        // 移除之前的active类（如果有）
        overlay.classList.remove('active');

        // 强制重排，确保动画重新触发
        void overlay.offsetWidth;

        // 激活动画
        overlay.classList.add('active');

        // 0.5秒后移除active类
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 500);

        console.log('⚡ CSS Glitch triggered');
    }

    /**
     * 禁用阅读锁定机制（decay期间点击卡片不锁定）
     */
    bypassReadingLock() {
        // 检查是否可以访问全局对象
        if (typeof readingLockManager === 'undefined') {
            console.warn('⚠️ readingLockManager not available');
            return;
        }

        readingLockManager.bypass();
        console.log('🔓 Reading lock bypassed during decay');
    }

    /**
     * 恢复阅读锁定机制
     */
    restoreReadingLock() {
        // 检查是否可以访问全局对象
        if (typeof readingLockManager === 'undefined') {
            console.warn('⚠️ readingLockManager not available');
            return;
        }

        readingLockManager.restore();
        console.log('🔒 Reading lock restored');
    }

    /**
     * 禁用 clue tab（decay期间无法跳转到clue）
     */
    disableClueTab() {
        const clueTabBtn = document.querySelector('.tab-btn[data-type="clue"]');
        if (!clueTabBtn) {
            console.warn('⚠️ Clue tab button not found');
            return;
        }

        // 添加禁用样式
        clueTabBtn.style.opacity = '0.3';
        clueTabBtn.style.cursor = 'not-allowed';
        clueTabBtn.setAttribute('data-decay-disabled', 'true');
        console.log('🚫 Clue tab disabled during decay');
    }

    /**
     * 恢复 clue tab
     */
    enableClueTab() {
        const clueTabBtn = document.querySelector('.tab-btn[data-type="clue"]');
        if (!clueTabBtn) {
            console.warn('⚠️ Clue tab button not found');
            return;
        }

        // 移除禁用样式
        clueTabBtn.style.opacity = '';
        clueTabBtn.style.cursor = '';
        clueTabBtn.removeAttribute('data-decay-disabled');
        console.log('✅ Clue tab enabled');
    }

    /**
     * 禁用 terminal 输入和功能按钮（decay期间）
     * 注意：保留重置按钮可用，允许玩家在乱码阶段和倒计时期间重置游戏
     */
    disableTerminal() {
        // 禁用输入框
        const input = document.querySelector('.command-input');
        if (input) {
            input.disabled = true;
            input.setAttribute('data-decay-disabled', 'true');
        }

        // 禁用功能按钮（排除重置按钮）
        const funcBtns = document.querySelectorAll('.func-btn');
        funcBtns.forEach(btn => {
            // 保留重置按钮可用
            if (btn.dataset.mode === 'reset') {
                return;
            }
            btn.style.pointerEvents = 'none';
            btn.setAttribute('data-decay-disabled', 'true');
        });

        console.log('🚫 Terminal disabled during decay (reset button preserved)');
    }

    /**
     * 恢复原始文本
     */
    restoreOriginalTexts() {
        this.originalTexts.forEach((text, element) => {
            if (element && element.parentNode) { // 确保元素仍在DOM中
                element.textContent = text;
                // 清除data属性
                element.removeAttribute('data-original-text');
                // 移除所有特效类
                element.classList.remove(
                    'decay-active',
                    'decay-stage-1',
                    'decay-stage-2',
                    'decay-stage-3',
                    'decay-stage-4',
                    'decay-complete'
                );
            }
        });
        this.originalTexts.clear();
        console.log('✨ Original texts restored');
    }

    /**
     * 更新CSS阶段类
     * @param {HTMLElement} element - 目标元素
     * @param {number} progress - 进度(0-1)
     */
    updateStageClass(element, progress) {
        // 移除所有阶段类
        element.classList.remove(
            'decay-stage-1',
            'decay-stage-2',
            'decay-stage-3',
            'decay-stage-4',
            'decay-complete'
        );

        // 添加active标记
        element.classList.add('decay-active');

        // 根据进度添加阶段类
        if (progress < 0.4) {          // 0-8秒
            element.classList.add('decay-stage-1');
        } else if (progress < 0.7) {   // 8-14秒
            element.classList.add('decay-stage-2');
        } else if (progress < 0.9) {   // 14-18秒
            element.classList.add('decay-stage-3');
        } else if (progress < 1.0) {   // 18-20秒
            element.classList.add('decay-stage-4');
        } else {                        // 20秒后
            element.classList.add('decay-complete');
        }
    }

    /**
     * 更新显示
     */
    update() {
        if (!this.isActive) return;

        const elapsed = Date.now() - this.startTime;
        const progress = Math.min(elapsed / this.totalDuration, 1.0);
        const retentionRate = this.getRetentionRate(elapsed);

        // 每5秒输出一次日志，避免日志刷屏（0.5秒刷新太频繁）
        if (Date.now() - this.lastLogTime > 5000) {
            console.log(`⏱️ Progress: ${(progress * 100).toFixed(1)}%, Retention: ${(retentionRate * 100).toFixed(1)}%`);
            this.lastLogTime = Date.now();
        }

        const elements = document.querySelectorAll(this.targetSelector);

        requestAnimationFrame(() => {
            elements.forEach(element => {
                // 获取原始文本
                const originalText = this.originalTexts.get(element);
                if (!originalText) return;

                // 先应用scramble（在decay过程中始终应用乱码）
                let processedText = originalText;
                if (this.scramble) {
                    // 不使用缓存，确保每次都生成新的乱码
                    processedText = this.scramble.scrambleText(originalText, false);
                }

                // 再应用消失效果
                const decayedText = this.applyDecay(processedText, retentionRate);

                // 更新DOM
                element.textContent = decayedText;

                // 更新CSS类
                this.updateStageClass(element, progress);
            });
        });
    }

    /**
     * 启动特效
     */
    start() {
        if (this.isActive) {
            console.log('⚠️ Memory decay already active');
            return;
        }

        console.log('🔥 Starting memory decay effect...');
        console.log('📍 Target: .card-scroll area + list titles');

        this.isActive = true;
        this.startTime = Date.now();

        // 功能1: 禁用阅读锁定机制（decay期间点击卡片不锁定）
        this.bypassReadingLock();

        // 功能2: 禁用clue tab（decay期间无法跳转到clue）
        this.disableClueTab();

        // 功能3: 禁用terminal输入和功能按钮
        this.disableTerminal();

        // 保存原始文本（正文和list titles）
        this.saveOriginalTexts();
        this.saveOriginalTitles();

        // 立即执行第一次更新
        this.update();
        this.updateTitleScramble();

        // 启动定时更新循环（正文decay效果）
        this.timer = setInterval(() => {
            this.update();
        }, this.refreshInterval);

        // 启动list title乱码循环（每0.5秒切换）
        this.titleScrambleTimer = setInterval(() => {
            this.updateTitleScramble();
        }, this.refreshInterval);

        // 功能2: 启动PowerGlitch定时器（每5秒触发一次）
        this.glitchTimer = setInterval(() => {
            this.triggerGlitch();
        }, this.glitchInterval);

        // 立即触发一次glitch
        this.triggerGlitch();

        // 20秒后自动停止
        this.autoStopTimer = setTimeout(() => {
            console.log('⏰ Auto-stopping after 20 seconds');
            this.complete();
        }, this.totalDuration);
    }

    /**
     * 停止特效
     */
    stop() {
        if (!this.isActive) {
            console.log('⚠️ Memory decay is not active');
            return;
        }

        console.log('🛑 Stopping memory decay effect...');

        // 清理所有定时器
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        if (this.titleScrambleTimer) {
            clearInterval(this.titleScrambleTimer);
            this.titleScrambleTimer = null;
        }

        if (this.glitchTimer) {
            clearInterval(this.glitchTimer);
            this.glitchTimer = null;
        }

        if (this.autoStopTimer) {
            clearTimeout(this.autoStopTimer);
            this.autoStopTimer = null;
        }

        if (this.deletionTimer) {
            clearInterval(this.deletionTimer);
            this.deletionTimer = null;
        }

        // 停止当前的glitch效果（移除遮罩层的active类）
        const overlay = document.querySelector('.glitch-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }

        // 恢复原始文本
        this.restoreOriginalTexts();
        this.restoreOriginalTitles();

        // 清空隐藏列表
        this.hiddenCards.clear();

        // 恢复阅读锁定机制
        this.restoreReadingLock();

        // 恢复clue tab
        this.enableClueTab();

        // 禁用最终锁定（如果启用了）
        this.disableFinalLock();

        // 重置状态
        this.isActive = false;
        this.startTime = null;

        console.log('✅ Memory decay stopped');
    }

    /**
     * 完成特效（20秒后自动调用）
     */
    complete() {
        console.log('✨ Memory decay complete - starting deletion phase');

        // 将所有正文文本设置为空
        const elements = document.querySelectorAll(this.targetSelector);
        elements.forEach(element => {
            element.textContent = '';
            element.classList.remove(
                'decay-stage-1',
                'decay-stage-2',
                'decay-stage-3',
                'decay-stage-4'
            );
            element.classList.add('decay-complete');
        });

        // list titles保持乱码但不消失
        // 不清空，继续显示最后的乱码状态

        // 清理decay阶段的定时器（保留glitch继续闪烁）
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        if (this.titleScrambleTimer) {
            clearInterval(this.titleScrambleTimer);
            this.titleScrambleTimer = null;
        }

        if (this.autoStopTimer) {
            clearTimeout(this.autoStopTimer);
            this.autoStopTimer = null;
        }

        // 启动删除阶段（10秒）
        this.startDeletionPhase();
    }

    /**
     * 启动删除阶段（20-30秒）
     * 逐步隐藏list中的文件，直至清空
     */
    startDeletionPhase() {
        console.log('🗑️ Starting deletion phase (10 seconds)...');

        const deletionDuration = 10000; // 10秒
        const deleteInterval = 300;     // 每0.3秒隐藏一些

        // 获取当前tab的所有卡片
        // 需要从gameState获取discovered_cards
        if (typeof gameState === 'undefined') {
            console.error('❌ gameState not available for deletion phase');
            this.completeDeletion();
            return;
        }

        const allCards = [...gameState.getState().discovered_cards];
        const totalItems = allCards.length;

        if (totalItems === 0) {
            console.log('No cards to delete');
            this.completeDeletion();
            return;
        }

        console.log(`Will delete ${totalItems} cards over ${deletionDuration}ms`);

        // 计算每次删除几个
        const totalCycles = deletionDuration / deleteInterval;
        const itemsPerCycle = Math.max(1, Math.ceil(totalItems / totalCycles));

        let deletedCount = 0;

        // 删除定时器
        this.deletionTimer = setInterval(() => {
            // 隐藏一批items
            for (let i = 0; i < itemsPerCycle && deletedCount < totalItems; i++) {
                const cardId = allCards[deletedCount];
                if (cardId) {
                    this.hiddenCards.add(cardId);
                    console.log(`[Deletion] Hiding card ${deletedCount + 1}/${totalItems}: ${cardId}`);
                }
                deletedCount++;
            }

            // 触发UI刷新（会重新渲染，根据hiddenCards隐藏）
            if (typeof refreshUI === 'function') {
                refreshUI();
            }

            // 检查是否完成
            if (deletedCount >= totalItems) {
                clearInterval(this.deletionTimer);
                this.deletionTimer = null;
                this.completeDeletion();
            }
        }, deleteInterval);
    }

    /**
     * 完成删除阶段
     */
    completeDeletion() {
        console.log('✅ Deletion complete - all memories erased');

        // 🎵 淡出Error BGM（3秒），让"."出现时保持安静
        if (window.audioManager) {
            console.log('[BGM] Fading out Error BGM (3s) before showing "."...');
            audioManager.stopMusic(3000);
        }

        // 停止glitch效果（立即停止）
        if (this.glitchTimer) {
            clearInterval(this.glitchTimer);
            this.glitchTimer = null;
        }

        const overlay = document.querySelector('.glitch-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }

        // 清空card显示区域
        const textContent = document.querySelector('.text-content');
        if (textContent) {
            textContent.innerHTML = '';
        }

        // 清空title bar
        const titleBar = document.querySelector('.title-bar');
        if (titleBar) {
            const fileName = titleBar.querySelector('.card-filename');
            const timestamp = titleBar.querySelector('.card-timestamp');
            const year = titleBar.querySelector('.card-year');
            if (fileName) fileName.textContent = '';
            if (timestamp) timestamp.textContent = '';
            if (year) year.style.display = 'none';
        }

        // 启动加载演出动画
        // 3秒后显示'.'
        setTimeout(() => {
            // ECG联动：显示省略号时变成直线
            if (window.ecgController) window.ecgController.setMode('flatline');
            if (typeof showFeedback === 'function') {
                showFeedback('.', 'info');
            }
        }, 3000);

        // 6秒后显示'..'
        setTimeout(() => {
            if (typeof showFeedback === 'function') {
                showFeedback('..', 'info');
            }
        }, 6000);

        // 9秒后显示'...'
        setTimeout(() => {
            if (typeof showFeedback === 'function') {
                showFeedback('...', 'info');
            }
        }, 9000);

        // 12秒后显示第一条消息
        const currentLang = localStorage.getItem('gameLang') || 'en';
        setTimeout(() => {
            if (typeof showFeedback === 'function') {
                const msg1 = currentLang === 'zh' ? '患者信号连接不稳定。' : 'Connection to the patient is unstable.';
                showFeedback(msg1, 'info');
            }

            // 5秒后显示第二条消息并解锁mem_025
            setTimeout(() => {
                if (typeof showFeedback === 'function') {
                    const msg2 = currentLang === 'zh' ? '监测到未知意识。' : 'Autonomous consciousness detected.';
                    showFeedback(msg2, 'info');
                }

                // 短暂延迟后开始解锁序列
                setTimeout(() => {
                    this.unlockMem025Sequence();
                }, 1000);
            }, 5000);
        }, 12000);
    }

    /**
     * 解锁mem_025序列
     */
    unlockMem025Sequence() {
        console.log('🔓 Starting mem_025 unlock sequence...');

        // 停止glitch效果
        if (this.glitchTimer) {
            clearInterval(this.glitchTimer);
            this.glitchTimer = null;
        }

        const overlay = document.querySelector('.glitch-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }

        // 停止乱码效果
        if (this.scramble && this.scramble.enabled) {
            this.scramble.disable();
            console.log('🔓 Scramble effect disabled');
        }

        // 从hiddenCards中移除mem_025
        this.hiddenCards.delete('mem_025');
        console.log('🔓 mem_025 removed from hidden cards');

        // 强制发现并解锁mem_025
        if (typeof gameState !== 'undefined' && typeof cardManager !== 'undefined') {
            // 发现卡片
            if (!gameState.isCardDiscovered('mem_025')) {
                gameState.discoverCard('mem_025');
                cardManager.updateCardDiscoveredStatus('mem_025', true);
                console.log('🔓 mem_025 discovered');

                // 🎵 播放发现音效
                if (window.audioManager) {
                    audioManager.playSFX('discover', 0.5, true);
                }
            }

            // 解锁卡片
            if (!gameState.isCardUnlocked('mem_025')) {
                gameState.unlockCard('mem_025');
                cardManager.updateCardStatus('mem_025', 'unlocked');
                console.log('🔓 mem_025 unlocked');
            }
        }

        // 切换到memory tab
        if (typeof gameState !== 'undefined') {
            gameState.setTab('memory');
        }

        // 更新tab按钮视觉状态
        if (typeof updateTabUI === 'function') {
            updateTabUI('memory');
        }

        // 刷新UI（此时只会显示mem_025，其他文件仍在hiddenCards中）
        if (typeof refreshUI === 'function') {
            refreshUI();
        }

        // 修正mem_025的标题显示为"Gregor"/"戈尔"（而不是乱码）
        setTimeout(() => {
            // ECG联动：Gregor解锁时恢复微弱运动
            if (window.ecgController) {
                window.ecgController.setMode('normal');
                window.ecgController.setSpeed(0.5);
                window.ecgController.setAmplitude(0.2);
            }
            const mem025Item = document.querySelector('.file-item[data-card-id="mem_025"]');
            if (mem025Item) {
                const fileNameElement = mem025Item.querySelector('.file-name');
                if (fileNameElement) {
                    const lang = localStorage.getItem('gameLang') || 'en';
                    const displayName = lang === 'zh' ? '戈尔' : 'Gregor';
                    fileNameElement.textContent = displayName;
                    fileNameElement.removeAttribute('data-original-text');
                    console.log(`🔓 mem_025 title set to "${displayName}"`);
                }
            }
        }, 50); // 轻微延迟确保DOM已渲染

        // 先恢复clue tab（解除decay期间的禁用）
        this.enableClueTab();

        // 然后启用交互锁定（半透明，禁止所有操作但允许点击文件）
        this.enableFinalLock();

        // 清空存储
        this.originalTexts.clear();
        this.originalTitles.clear();

        // 重置decay状态（但保持hiddenCards）
        this.isActive = false;
        this.startTime = null;

        console.log('✅ mem_025 unlock sequence complete');
    }

    /**
     * 启用最终锁定（半透明，只允许与mem_025交互）
     */
    enableFinalLock() {
        // 禁用输入框
        const input = document.querySelector('.command-input');
        if (input) {
            input.disabled = true;
            input.placeholder = ''; // P4 修复：不显示 placeholder
            input.style.opacity = '0.3';
        }

        // 禁用Tab切换（半透明）
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.style.opacity = '0.3';
            tab.style.pointerEvents = 'none';
        });

        // 添加body类用于样式控制
        document.body.classList.add('final-lock-mode');

        console.log('🔒 Final lock enabled - only mem_025 interaction allowed');
    }

    /**
     * 禁用最终锁定
     */
    disableFinalLock() {
        // 恢复输入框
        const input = document.querySelector('.command-input');
        if (input) {
            input.disabled = false;
            input.placeholder = ''; // P4 修复：不显示 placeholder
            input.style.opacity = '';
        }

        // 恢复Tab切换
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.style.opacity = '';
            tab.style.pointerEvents = '';
        });

        // 移除body类
        document.body.classList.remove('final-lock-mode');

        console.log('🔓 Final lock disabled');
    }

    /**
     * 触发苏醒动画序列（mem_025阅读完成后调用）
     */
    triggerAwakeningSequence() {
        console.log('🌅 Starting awakening sequence...');

        // 🎵 强制重置音频状态（iOS 修复：清理所有残留的 interval 和状态）
        if (window.audioManager) {
            console.log('[BGM] Force resetting audio state for awakening sequence...');
            if (typeof audioManager._clearAllIntervals === 'function') {
                audioManager._clearAllIntervals();
            }
            audioManager.stopLoopFade();
            audioManager.stopMusic(0);
        }

        // 清空内容显示框（右侧区域）
        const textContent = document.querySelector('.text-content');
        if (textContent) {
            textContent.innerHTML = '';
        }

        // 清空title bar
        const titleBar = document.querySelector('.title-bar');
        if (titleBar) {
            const fileName = titleBar.querySelector('.card-filename');
            const timestamp = titleBar.querySelector('.card-timestamp');
            const year = titleBar.querySelector('.card-year');
            if (fileName) fileName.textContent = '';
            if (timestamp) timestamp.textContent = '';
            if (year) year.style.display = 'none';
        }

        // 清空 system 输出区域
        const systemOutput = document.querySelector('.system-output');
        if (systemOutput) {
            const outputLines = systemOutput.querySelectorAll('.output-line');
            outputLines.forEach(line => {
                line.textContent = '';
                line.classList.remove('confirm-highlight');
            });
        }

        // 1. 先播放苏醒动画（遮盖屏幕）
        if (typeof AwakeningAnimation !== 'undefined') {
            const awakening = new AwakeningAnimation({
                finalMemories: [
                    'sunflower', 'photo', 'Mozart', 'Firework',
                    'cat', 'Wagner'
                ],
                onComplete: () => {
                    console.log('✅ Awakening animation completed');
                    console.log('🌅 Player can now read the 8 new memories');

                    // 动画完成后启动倒计时
                    this.startConnectionTerminatingCountdown();
                }
            });
            awakening.run();

            // 🎵 复苏动画BGM序列
            // 2秒后播放Opening音效（12秒）
            setTimeout(() => {
                console.log('[BGM] Playing Opening SFX (12s)...');
                if (window.audioManager) {
                    audioManager.playSFX('Opening.m4a', 1, true);
                }
            }, 2000);

            // 14秒后（2s延迟 + 12s音效）播放Heartache BGM（3秒淡入）
            setTimeout(() => {
                console.log('[BGM] Playing Heartache BGM with 3s fade-in...');
                if (window.audioManager) {
                    audioManager.playMusic('Heartache', 1, 3000);
                }
            }, 14000);

            // 2. 动画启动后2秒更新数据和UI（动画会遮盖变化过程，确保淡入完成）
            setTimeout(() => {
                // 隐藏 mem_025
                this.hiddenCards.add('mem_025');
                console.log('[Awakening] mem_025 hidden from list');

                // 解锁 6 个新记忆 + mem_019 (19-8pm-blood)
                // 注：mem_030(Toast)不存在，mem_032(Cigarette)已移除
                const newMemories = [
                    'mem_026', 'mem_027', 'mem_028', 'mem_029',
                    'mem_031', 'mem_033',
                    'mem_019'  // 19-8pm-blood
                ];

                if (typeof gameState !== 'undefined' && typeof cardManager !== 'undefined') {
                    newMemories.forEach(memId => {
                        // 发现并解锁
                        if (!gameState.isCardDiscovered(memId)) {
                            gameState.discoverCard(memId);
                            cardManager.updateCardDiscoveredStatus(memId, true);

                            // 🎵 播放发现音效
                            if (window.audioManager) {
                                audioManager.playSFX('discover', 0.5, true);
                            }
                        }
                        if (!gameState.isCardUnlocked(memId)) {
                            gameState.unlockCard(memId);
                            cardManager.updateCardStatus(memId, 'unlocked');
                        }
                        // 确保是未读状态
                        if (gameState.isCardRead(memId)) {
                            // 如果已读，重置为未读
                            const state = gameState.getState();
                            const index = state.read_cards.indexOf(memId);
                            if (index > -1) {
                                state.read_cards.splice(index, 1);
                            }
                            cardManager.updateCardReadStatus(memId, false);
                        }
                        console.log(`[Awakening] ${memId} unlocked and set to unread`);
                    });
                }

                // 清除 file tab 的未读小蓝点
                this.clearFileTabUnreadIndicator();

                // 永久禁用 file 和 clue tab
                if (typeof window.permanentlyDisableTabs === 'function') {
                    window.permanentlyDisableTabs(['file', 'clue']);
                    console.log('[Awakening] file and clue tabs permanently disabled');
                }

                // 开启年份显示（显示9个新记忆的年份）
                if (typeof gameState !== 'undefined') {
                    gameState.setShowYear(true);
                    console.log('[Awakening] Year display enabled');
                }

                // 刷新 UI（显示新的 9 个记忆）
                if (typeof refreshUI === 'function') {
                    refreshUI();
                }
            }, 2000); // 动画启动后2秒更新，确保淡入完成
        } else {
            console.warn('[Awakening] AwakeningAnimation class not found');
        }

        console.log('✅ Awakening sequence initialized');
    }

    /**
     * 清除 file tab 的未读提示小蓝点
     */
    clearFileTabUnreadIndicator() {
        const fileTabBtn = document.querySelector('.tab-btn[data-type="file"]');
        if (fileTabBtn) {
            const unreadDot = fileTabBtn.querySelector('.unread-dot');
            if (unreadDot) {
                unreadDot.remove();
                console.log('[Awakening] File tab unread indicator cleared');
            }
        }
    }

    /**
     * 启动连接终止倒计时
     */
    startConnectionTerminatingCountdown() {
        console.log('[Countdown] Starting connection terminating countdown...');

        let remainingSeconds = 100;
        const currentLang = localStorage.getItem('gameLang') || 'en';

        // 获取 system-output 区域
        const systemOutput = document.querySelector('.system-output');

        if (!systemOutput) {
            console.warn('[Countdown] system-output not found');
            return;
        }

        const outputLines = systemOutput.querySelectorAll('.output-line');
        if (outputLines.length < 2) {
            console.warn('[Countdown] output-line elements not found');
            return;
        }

        // 检测手机横屏模式（isMobileLandscape 定义在 app.js）
        const isMobile = typeof isMobileLandscape === 'function' && isMobileLandscape();

        // 手机端使用 lines[1]（唯一可见行），PC端使用 lines[0]
        const countdownLine = isMobile ? outputLines[1] : outputLines[0];
        const otherLine = isMobile ? outputLines[0] : outputLines[1];

        // 隐藏 SEARCH 和 SAVE 按钮
        const searchBtn = document.querySelector('.func-btn[data-mode="search"]');
        const saveBtn = document.querySelector('.func-btn[data-mode="save"]');
        if (searchBtn) searchBtn.style.display = 'none';
        if (saveBtn) saveBtn.style.display = 'none';
        console.log('[Countdown] SEARCH and SAVE buttons hidden');

        // 清空两行内容
        countdownLine.textContent = '';
        otherLine.textContent = '';

        // 本地化文本
        const terminatingText = currentLang === 'zh' ? '连接即将断开' : 'Connection terminating';
        const terminatedText = currentLang === 'zh' ? '连接已断开。' : 'Connection terminated.';

        // 显示初始倒计时（带前缀）
        countdownLine.textContent = `> SYSTEM: ${terminatingText}, ${remainingSeconds}s...`;

        console.log('[Countdown] Countdown display started in line ' + (isMobile ? '2' : '1'));

        // 每秒更新一次
        const countdownInterval = setInterval(() => {
            remainingSeconds--;

            if (remainingSeconds > 0) {
                countdownLine.textContent = `> SYSTEM: ${terminatingText}, ${remainingSeconds}s...`;
            } else {
                // 倒计时结束
                countdownLine.textContent = `> SYSTEM: ${terminatedText}`;
                clearInterval(countdownInterval);
                console.log('[Countdown] Connection terminating countdown completed');

                // 启动结束序列
                this.startEndingSequence();
            }
        }, 1000);

        // 保存倒计时间隔ID，以便需要时可以清除
        this.countdownInterval = countdownInterval;
    }

    /**
     * 启动结束序列（倒计时结束后调用）
     * 关机动画 -> 字幕 -> 结束界面
     */
    async startEndingSequence() {
        console.log('[Ending] Starting ending sequence...');

        // 🎵 淡出Heartache BGM（2秒）
        if (window.audioManager) {
            console.log('[BGM] Fading out Heartache BGM (2s) for shutdown...');
            audioManager.stopMusic(2000);
        }

        // 1. 播放关机动画
        console.log('[Ending] Playing shutdown animation...');
        if (typeof ShutdownSequence !== 'undefined') {
            const shutdownSeq = new ShutdownSequence();
            const overlay = await shutdownSeq.start();
            console.log('[Ending] Shutdown animation completed');

            // 2. 等待3秒后显示第一条字幕
            await this.delay(3000);
            console.log('[Ending] Showing first subtitle: Camellia?');

            // 本地化文本
            const currentLang = localStorage.getItem('gameLang') || 'en';
            const firstSubtitle = currentLang === 'zh' ? '山茶？' : 'Camellia?';
            const secondSubtitle = currentLang === 'zh' ? '是你吗……珂赛特？' : 'Or should I say... Carol?';

            // 确保字幕系统存在
            if (typeof SubtitleSystem !== 'undefined') {
                if (!window.subtitleSystem) {
                    window.subtitleSystem = new SubtitleSystem();
                }

                // 显示第一条字幕（自定义样式：白色，大字体，普通字体）
                window.subtitleSystem.show(firstSubtitle, {
                    position: 'bottom',
                    duration: 3000,
                    animation: 'fade',
                    customStyle: {
                        fontFamily: 'Georgia, serif',
                        fontSize: '36px',
                        color: '#FFFFFF',
                        fontWeight: '400',
                        textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
                        background: 'transparent',
                        border: 'none',
                        boxShadow: 'none',
                        backdropFilter: 'none'
                    }
                });

                // 3. 等待3秒让第一句自动消失，再等600ms让淡出动画完成
                await this.delay(3000 + 600);
                console.log('[Ending] Showing second subtitle: Or should I say.. Carol');

                window.subtitleSystem.show(secondSubtitle, {
                    position: 'bottom',
                    duration: 4000, // 自动消失，显示4秒
                    animation: 'fade',
                    customStyle: {
                        fontFamily: 'Georgia, serif',
                        fontSize: '36px',
                        color: '#FFFFFF',
                        fontWeight: '400',
                        textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
                        background: 'transparent',
                        border: 'none',
                        boxShadow: 'none',
                        backdropFilter: 'none'
                    }
                });

                // 4. 等待字幕显示4秒 + 淡出动画0.8秒 + 黑屏1秒
                await this.delay(4000 + 800 + 1000);
                console.log('[Ending] Black screen pause complete, showing ending screen...');

                // 🎵 播放Heartache-2 BGM（2秒淡入）
                if (window.audioManager) {
                    console.log('[BGM] Playing Heartache-2 BGM with 2s fade-in...');
                    audioManager.playMusic('Heartache-2', 1, 2000);
                }

                // 显示结束界面
                if (typeof EndingScreen !== 'undefined') {
                    const endingScreen = new EndingScreen();
                    endingScreen.show();
                } else {
                    console.error('[Ending] EndingScreen class not found');
                }
            } else {
                console.error('[Ending] SubtitleSystem not found');
            }
        } else {
            console.error('[Ending] ShutdownSequence not found');
        }
    }

    /**
     * 延迟工具函数
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 重置特效（恢复到初始状态）
     */
    reset() {
        console.log('🔄 Resetting memory decay...');

        // 如果特效正在运行，先停止
        if (this.isActive) {
            this.stop();
        } else {
            // 如果特效已完成，仍需恢复文本和清理隐藏列表
            this.restoreOriginalTexts();
            this.restoreOriginalTitles();
            this.hiddenCards.clear();
            this.disableFinalLock();
        }

        console.log('✅ Memory decay reset complete');
    }

    /**
     * 获取状态信息
     */
    getStatus() {
        const elapsed = this.isActive ? Date.now() - this.startTime : 0;
        const progress = this.isActive ? Math.min(elapsed / this.totalDuration, 1.0) : 0;
        const retentionRate = this.isActive ? this.getRetentionRate(elapsed) : 1.0;

        return {
            isActive: this.isActive,
            elapsed: elapsed,
            progress: (progress * 100).toFixed(1) + '%',
            retentionRate: (retentionRate * 100).toFixed(1) + '%',
            timeRemaining: this.isActive ? Math.max(0, this.totalDuration - elapsed) / 1000 + 's' : '0s'
        };
    }
}

/**
 * 初始化记忆消失特效
 */
function initMemoryDecay(scrambleEffect) {
    // 检查是否已存在实例
    if (!window.memoryDecay) {
        if (!scrambleEffect) {
            console.error('❌ ScrambleEffect instance required for MemoryDecay');
            return null;
        }
        window.memoryDecay = new MemoryDecayEffect(scrambleEffect);
        console.log('🔥 Memory decay system ready');
    }
    return window.memoryDecay;
}

// 导出到全局作用域
window.MemoryDecayEffect = MemoryDecayEffect;
window.initMemoryDecay = initMemoryDecay;