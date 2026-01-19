/**
 * 乱码特效模块 - Scramble Effect
 * 实现文字乱码转换，支持一键开关
 */

class ScrambleEffect {
    constructor() {
        // 特效状态
        this.enabled = false;

        // 豁免文件列表（不受特效影响）
        this.exemptFiles = ['1-city']; // 可以配置

        // 扩展的欧洲语言字符集
        this.charSets = {
            // 基础拉丁字母
            latin: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',

            // 带音标的字母（法语、德语、西班牙语等）
            accented: 'àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ',

            // 拉丁扩展A
            latinExtA: 'ĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁł',

            // 西里尔字母 (俄语等)
            cyrillic: 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя',

            // 希腊字母
            greek: 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψω',

            // 特殊符号
            symbols: '§¶†‡•‰№℗™℠←↑→↓↔↕⇄⇅∀∂∃∅∆∇∈∉∋∌',

            // 数字
            numbers: '0123456789'
        };

        // 组合所有字符（带权重）
        this.buildCharPool();

        // 初始化缓存
        this.charMap = new Map(); // 字符映射缓存
        this.textCache = new Map(); // 文本缓存
        this.originalTexts = new Map(); // 原始文本存储

        // 预生成字符映射表
        this.initCharMap();

        console.log('🎭 ScrambleEffect initialized');
    }

    /**
     * 构建字符池（带权重分配）
     */
    buildCharPool() {
        // 创建带权重的字符池 - 先拼接字符串，再split
        const poolString =
            // 60% 概率 - 常见字符
            this.charSets.latin.repeat(3) +
            this.charSets.numbers.repeat(2) +

            // 25% 概率 - 带音标字符
            this.charSets.accented +

            // 10% 概率 - 特殊字符
            this.charSets.greek.substring(0, 20) +
            this.charSets.cyrillic.substring(0, 20) +

            // 5% 概率 - 符号
            this.charSets.symbols.substring(0, 10);

        // 将字符串转换为字符数组
        this.charPool = poolString.split('');

        // 打乱顺序
        this.shuffleArray(this.charPool);
    }

    /**
     * 初始化字符映射表（预生成以提高性能）
     */
    initCharMap() {
        const commonChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const chinesePattern = /[\u4e00-\u9fa5]/;

        // 为每个常见字符预生成15个替换选项
        for (let char of commonChars) {
            const replacements = [];
            for (let i = 0; i < 15; i++) {
                replacements.push(this.getRandomChar());
            }
            this.charMap.set(char, replacements);
        }

        // 为中文字符创建特殊映射（使用2-3个字符组合）
        this.charMap.set('中文', this.generateChineseReplacements(20));

        console.log('✅ Character map initialized with', this.charMap.size, 'entries');
    }

    /**
     * 生成中文字符的替换选项
     */
    generateChineseReplacements(count) {
        const replacements = [];
        for (let i = 0; i < count; i++) {
            // 中文字符用2-3个随机字符替换
            const len = Math.random() > 0.5 ? 2 : 3;
            let replacement = '';
            for (let j = 0; j < len; j++) {
                replacement += this.getRandomChar();
            }
            replacements.push(replacement);
        }
        return replacements;
    }

    /**
     * 获取随机字符
     */
    getRandomChar() {
        return this.charPool[Math.floor(Math.random() * this.charPool.length)];
    }

    /**
     * 打乱数组
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * 转换文本为乱码
     */
    scrambleText(text, useCache = true) {
        if (!text) return '';

        // 检查缓存
        if (useCache && this.textCache.has(text)) {
            return this.textCache.get(text);
        }

        // 转换文本
        const scrambled = text.split('').map(char => {
            // 保留空白字符
            if (char === ' ' || char === '\n' || char === '\t') {
                return char;
            }

            // 保留某些标点符号以维持可读性
            if ('.,!?;:()[]{}"\'-_/\\'.includes(char)) {
                return Math.random() > 0.7 ? char : this.getRandomChar();
            }

            // 检查是否为中文
            if (/[\u4e00-\u9fa5]/.test(char)) {
                const replacements = this.charMap.get('中文');
                return replacements[Math.floor(Math.random() * replacements.length)];
            }

            // 查找预生成的替换字符
            const replacements = this.charMap.get(char);
            if (replacements) {
                return replacements[Math.floor(Math.random() * replacements.length)];
            }

            // 默认随机字符
            return this.getRandomChar();
        }).join('');

        // 缓存短文本
        if (useCache && text.length < 100) {
            this.textCache.set(text, scrambled);
        }

        return scrambled;
    }

    /**
     * 检查元素是否应该豁免
     */
    isExempt(element) {
        // 检查是否为豁免的文件
        const fileName = element.querySelector('.file-name')?.textContent;
        if (fileName) {
            // 去除序号前缀
            const cleanName = fileName.replace(/^\d+-/, '');
            return this.exemptFiles.some(exempt =>
                fileName.includes(exempt) || cleanName === exempt
            );
        }

        // 检查是否为豁免的区域
        const exemptSelectors = [
            '.command-input',
            '.command-help',
            '.feedback-area',
            '.prompt'
        ];

        return exemptSelectors.some(selector =>
            element.matches(selector) || element.closest(selector)
        );
    }

    /**
     * 处理文本节点
     */
    processTextNode(node, restore = false) {
        if (node.nodeType !== Node.TEXT_NODE) return;

        const text = node.textContent.trim();
        if (!text) return;

        if (restore) {
            // 恢复原始文本
            const original = this.originalTexts.get(node);
            if (original !== undefined) {
                node.textContent = original;
            }
        } else {
            // 保存原始文本
            if (!this.originalTexts.has(node)) {
                this.originalTexts.set(node, node.textContent);
            }

            // 应用乱码
            node.textContent = this.scrambleText(node.textContent);
        }
    }

    /**
     * 递归处理元素及其子节点
     */
    processElement(element, restore = false) {
        // 跳过豁免元素
        if (this.isExempt(element)) {
            return;
        }

        // 处理子节点
        for (let node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                this.processTextNode(node, restore);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // 跳过特定标签
                if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') {
                    continue;
                }
                this.processElement(node, restore);
            }
        }
    }

    /**
     * 获取需要处理的目标元素
     */
    getTargetElements() {
        const selectors = [
            '.file-list',           // 左侧文件列表
            // '.tab-btn',          // Tab按钮 - 移除，不应scramble功能性按钮
            '.title-bar',          // 标题栏
            '.text-content',       // 卡片文本内容
            '.statistics'          // 统计信息
        ];

        const elements = [];
        selectors.forEach(selector => {
            const found = document.querySelectorAll(selector);
            elements.push(...found);
        });

        return elements;
    }

    /**
     * 启用特效
     */
    enable() {
        if (this.enabled) return;

        console.log('🎭 Enabling scramble effect...');

        const startTime = performance.now();

        // 获取所有目标元素
        const elements = this.getTargetElements();

        // 批量处理
        requestAnimationFrame(() => {
            elements.forEach(element => {
                this.processElement(element, false);
            });

            const endTime = performance.now();
            console.log(`✅ Scramble effect enabled in ${(endTime - startTime).toFixed(2)}ms`);
        });

        this.enabled = true;
    }

    /**
     * 禁用特效
     */
    disable() {
        if (!this.enabled) return;

        console.log('🎭 Disabling scramble effect...');

        const startTime = performance.now();

        // 获取所有目标元素
        const elements = this.getTargetElements();

        // 批量恢复
        requestAnimationFrame(() => {
            elements.forEach(element => {
                this.processElement(element, true);
            });

            // 清理缓存的原始文本
            this.originalTexts.clear();

            const endTime = performance.now();
            console.log(`✅ Scramble effect disabled in ${(endTime - startTime).toFixed(2)}ms`);
        });

        this.enabled = false;
    }

    /**
     * 切换特效状态
     */
    toggle() {
        if (this.enabled) {
            this.disable();
        } else {
            this.enable();
        }
        return this.enabled;
    }

    /**
     * 设置豁免文件
     */
    setExemptFiles(files) {
        this.exemptFiles = files;
        console.log('📝 Exempt files updated:', files);

        // 如果特效已启用，刷新显示
        if (this.enabled) {
            this.disable();
            this.enable();
        }
    }

    /**
     * 清理缓存
     */
    clearCache() {
        this.textCache.clear();
        console.log('🗑️ Text cache cleared');
    }

    /**
     * 获取状态信息
     */
    getStatus() {
        return {
            enabled: this.enabled,
            exemptFiles: this.exemptFiles,
            cacheSize: this.textCache.size,
            originalTextsStored: this.originalTexts.size
        };
    }

    /**
     * 刷新特效（用于动态内容更新后）
     * 只处理新的DOM元素，避免重复scramble
     */
    refresh() {
        if (!this.enabled) return;

        console.log('🔄 Applying scramble to new content...');

        // 获取所有目标元素
        const elements = this.getTargetElements();

        // 只处理新的元素（不在originalTexts中的）
        elements.forEach(element => {
            this.processNewElement(element);
        });

        console.log('✅ New content scrambled');
    }

    /**
     * 只处理新的元素和节点
     */
    processNewElement(element) {
        // 跳过豁免元素
        if (this.isExempt(element)) {
            return;
        }

        // 处理子节点
        for (let node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                // 只处理未在Map中的新节点
                if (!this.originalTexts.has(node)) {
                    const text = node.textContent.trim();
                    if (text) {
                        // 保存原始文本并应用scramble
                        this.originalTexts.set(node, node.textContent);
                        node.textContent = this.scrambleText(node.textContent);
                    }
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // 跳过特定标签
                if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') {
                    continue;
                }
                this.processNewElement(node);  // 递归处理
            }
        }
    }
}

/**
 * 初始化乱码特效
 */
function initScrambleEffect() {
    // 检查是否已存在实例
    if (!window.scrambleEffect) {
        window.scrambleEffect = new ScrambleEffect();
        console.log('🎭 Scramble effect system ready');
    }
    return window.scrambleEffect;
}

// 导出到全局作用域
window.ScrambleEffect = ScrambleEffect;
window.initScrambleEffect = initScrambleEffect;