/**
 * 字幕系统模块
 * 提供独立于游戏主界面的字幕显示功能
 */

class SubtitleSystem {
    constructor() {
        // 字幕类型配置
        this.types = {
            NARRATION: {      // 旁白
                position: 'bottom',
                style: 'narration',
                duration: 4000,
                animation: 'fade'
            },
            THOUGHT: {        // 内心独白
                position: 'middle',
                style: 'thought',
                duration: 3000,
                animation: 'blur'
            },
            SYSTEM: {         // 系统信息
                position: 'top',
                style: 'system',
                duration: 2000,
                animation: 'slide'
            },
            MEMORY: {         // 记忆片段
                position: 'middle',
                style: 'memory',
                duration: 5000,
                animation: 'glitch'
            },
            ENVIRONMENT: {    // 环境描述
                position: 'top',
                style: 'environment',
                duration: 3000,
                animation: 'fade'
            }
        };

        // 位置配置
        this.positions = {
            top: { top: '10%', left: '50%', transform: 'translateX(-50%)' },
            middle: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
            bottom: { bottom: '15%', left: '50%', transform: 'translateX(-50%)' }
        };

        // 动画配置
        this.animations = {
            fade: {
                in: { animation: 'subtitleFadeIn 0.5s ease-out forwards' },
                out: { animation: 'subtitleFadeOut 0.5s ease-in forwards' }
            },
            blur: {
                in: { animation: 'subtitleBlurIn 0.6s ease-out forwards' },
                out: { animation: 'subtitleBlurOut 0.4s ease-in forwards' }
            },
            slide: {
                in: { animation: 'subtitleSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards' },
                out: { animation: 'subtitleSlideOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards' }
            },
            glitch: {
                in: { animation: 'subtitleGlitchIn 0.8s steps(4) forwards' },
                out: { animation: 'subtitleGlitchOut 0.6s steps(4) forwards' }
            },
            typewriter: {
                in: { animation: 'none' },  // 打字机效果需要JS实现
                out: { animation: 'subtitleFadeOut 0.3s ease-in forwards' }
            }
        };

        // 样式主题
        this.themes = {
            terminal: {
                fontFamily: '"Fira Code", monospace',
                fontSize: '16px',
                color: '#00FF00',
                textShadow: '0 0 5px rgba(0, 255, 0, 0.5)'
            },
            memory: {
                fontFamily: 'Georgia, serif',
                fontSize: '18px',
                color: '#FFE4B5',
                textShadow: '0 0 10px rgba(255, 228, 181, 0.3)',
                filter: 'sepia(0.3)'
            },
            system: {
                fontFamily: 'Consolas, monospace',
                fontSize: '14px',
                color: '#00FFFF',
                textShadow: '0 0 3px rgba(0, 255, 255, 0.6)'
            },
            danger: {
                fontFamily: 'Impact, sans-serif',
                fontSize: '20px',
                color: '#FF3333',
                textShadow: '0 0 8px rgba(255, 51, 51, 0.8)'
            },
            narration: {
                fontFamily: '"Fira Code", monospace',
                fontSize: '16px',
                color: '#CCCCCC',
                textShadow: '0 0 4px rgba(255, 255, 255, 0.3)'
            },
            thought: {
                fontFamily: '"Fira Code", monospace',
                fontSize: '16px',
                color: '#AAAAAA',
                fontStyle: 'italic',
                textShadow: '0 0 6px rgba(170, 170, 170, 0.4)'
            },
            environment: {
                fontFamily: '"Fira Code", monospace',
                fontSize: '14px',
                color: '#88FF88',
                textShadow: '0 0 4px rgba(136, 255, 136, 0.5)'
            }
        };

        // 当前显示的字幕
        this.activeSubtitles = {
            top: null,
            middle: null,
            bottom: null
        };

        // 字幕队列
        this.queue = [];
        this.isProcessingQueue = false;

        // 初始化
        this.init();
    }

    /**
     * 初始化字幕系统
     */
    init() {
        // 检查是否已存在字幕层
        if (!document.getElementById('subtitleLayer')) {
            this.createSubtitleLayer();
        }

        // 绑定到window对象以便全局访问
        window.subtitleSystem = this;
    }

    /**
     * 创建字幕层DOM结构
     */
    createSubtitleLayer() {
        const layer = document.createElement('div');
        layer.className = 'subtitle-layer';
        layer.id = 'subtitleLayer';

        // 创建三个位置的字幕区域
        ['top', 'middle', 'bottom'].forEach(position => {
            const zone = document.createElement('div');
            zone.className = `subtitle-zone subtitle-${position}`;
            zone.dataset.position = position;

            const content = document.createElement('div');
            content.className = 'subtitle-content';

            zone.appendChild(content);
            layer.appendChild(zone);
        });

        document.body.appendChild(layer);
    }

    /**
     * 显示字幕
     * @param {string} text - 字幕文本
     * @param {Object} options - 配置选项
     */
    show(text, options = {}) {
        // 处理字符串类型的type参数
        if (typeof options === 'string') {
            options = { type: options };
        }

        // 获取类型配置
        const typeConfig = options.type ? this.types[options.type] : this.types.NARRATION;

        // 合并配置
        const config = {
            ...typeConfig,
            ...options,
            text: text,
            id: `subtitle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };

        // 获取显示位置
        const position = config.position || 'bottom';
        const zone = document.querySelector(`.subtitle-${position}`);

        if (!zone) {
            console.error(`Subtitle position not found: ${position}`);
            return;
        }

        // 如果该位置已有字幕，先清除
        if (this.activeSubtitles[position]) {
            this.clear(position);
        }

        // 显示新字幕
        this.displaySubtitle(zone, config);

        // 记录活动字幕
        this.activeSubtitles[position] = {
            id: config.id,
            zone: zone,
            config: config,
            timeout: null
        };

        // 设置自动隐藏
        if (config.duration && config.duration > 0) {
            this.activeSubtitles[position].timeout = setTimeout(() => {
                this.clear(position);
                if (config.callback) {
                    config.callback();
                }
            }, config.duration);
        }

        return config.id;
    }

    /**
     * 显示字幕内容
     * @param {HTMLElement} zone - 字幕区域
     * @param {Object} config - 配置
     */
    displaySubtitle(zone, config) {
        const content = zone.querySelector('.subtitle-content');

        // 清空内容
        content.innerHTML = '';
        content.style.cssText = '';

        // 应用位置样式
        Object.assign(zone.style, this.positions[config.position]);

        // 应用主题样式
        const theme = this.themes[config.style] || this.themes.terminal;
        Object.assign(content.style, theme);

        // 应用自定义样式
        if (config.customStyle) {
            Object.assign(content.style, config.customStyle);
        }

        // 设置文本
        if (config.animation === 'typewriter') {
            // 打字机效果
            this.typewriterEffect(content, config.text, config.typeSpeed || 50);
        } else {
            // 普通显示
            content.textContent = config.text;
        }

        // 应用进入动画
        const animation = this.animations[config.animation] || this.animations.fade;
        Object.assign(content.style, animation.in);

        // 显示区域
        zone.style.opacity = '1';
        zone.style.display = 'flex';
    }

    /**
     * 打字机效果
     * @param {HTMLElement} element - 目标元素
     * @param {string} text - 文本
     * @param {number} speed - 速度（毫秒/字符）
     */
    typewriterEffect(element, text, speed) {
        element.textContent = '';
        let index = 0;

        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        };

        type();
    }

    /**
     * 清除字幕
     * @param {string} position - 位置（top/middle/bottom/all）
     */
    clear(position = 'all') {
        const positions = position === 'all' ? ['top', 'middle', 'bottom'] : [position];

        positions.forEach(pos => {
            const subtitle = this.activeSubtitles[pos];
            if (subtitle) {
                // 清除定时器
                if (subtitle.timeout) {
                    clearTimeout(subtitle.timeout);
                }

                // 应用退出动画
                const content = subtitle.zone.querySelector('.subtitle-content');
                const animation = this.animations[subtitle.config.animation] || this.animations.fade;
                Object.assign(content.style, animation.out);

                // 动画结束后隐藏
                setTimeout(() => {
                    subtitle.zone.style.opacity = '0';
                    subtitle.zone.style.display = 'none';
                    content.innerHTML = '';
                }, 500);

                // 清除记录
                this.activeSubtitles[pos] = null;
            }
        });
    }

    /**
     * 显示字幕序列
     * @param {Array} subtitles - 字幕数组
     */
    showSequence(subtitles) {
        // 添加到队列
        this.queue.push(...subtitles);

        // 如果没有在处理队列，开始处理
        if (!this.isProcessingQueue) {
            this.processQueue();
        }
    }

    /**
     * 处理字幕队列
     */
    async processQueue() {
        this.isProcessingQueue = true;

        while (this.queue.length > 0) {
            const subtitle = this.queue.shift();

            // 显示字幕
            await new Promise(resolve => {
                const config = typeof subtitle === 'string'
                    ? { text: subtitle, callback: resolve }
                    : { ...subtitle, callback: resolve };

                this.show(config.text || config, config);
            });

            // 等待间隔
            if (subtitle.delay) {
                await new Promise(resolve => setTimeout(resolve, subtitle.delay));
            }
        }

        this.isProcessingQueue = false;
    }

    /**
     * 设置全局主题
     * @param {string} themeName - 主题名称
     */
    setTheme(themeName) {
        const theme = this.themes[themeName];
        if (theme) {
            // 更新所有活动字幕的样式
            Object.keys(this.activeSubtitles).forEach(position => {
                const subtitle = this.activeSubtitles[position];
                if (subtitle) {
                    const content = subtitle.zone.querySelector('.subtitle-content');
                    Object.assign(content.style, theme);
                }
            });
        }
    }

    /**
     * 暂停所有字幕
     */
    pause() {
        Object.keys(this.activeSubtitles).forEach(position => {
            const subtitle = this.activeSubtitles[position];
            if (subtitle && subtitle.timeout) {
                clearTimeout(subtitle.timeout);
                subtitle.timeout = null;
            }
        });
    }

    /**
     * 恢复所有字幕
     */
    resume() {
        // 重新设置超时（需要记录剩余时间来实现完整的暂停/恢复）
        // 这里简化处理，直接清除
        this.clear('all');
    }

    /**
     * 销毁字幕系统
     */
    destroy() {
        this.clear('all');
        const layer = document.getElementById('subtitleLayer');
        if (layer) {
            layer.remove();
        }
    }

    /**
     * 预设字幕效果
     */

    // 记忆闪回效果
    memoryFlash(text) {
        this.show(text, {
            type: 'MEMORY',
            animation: 'glitch',
            customStyle: {
                backgroundColor: 'rgba(255, 228, 181, 0.1)',
                border: '1px solid rgba(255, 228, 181, 0.3)',
                filter: 'sepia(0.4) blur(0.5px)'
            }
        });
    }

    // 系统警告
    systemAlert(text) {
        this.show(text, {
            type: 'SYSTEM',
            position: 'top',
            duration: 3000,
            customStyle: {
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                border: '1px solid rgba(255, 51, 51, 0.5)',
                animation: 'subtitlePulse 1s infinite'
            }
        });
    }

    // 剧情旁白
    narrate(text, duration = 4000) {
        this.show(text, {
            type: 'NARRATION',
            duration: duration,
            animation: 'fade'
        });
    }

    // 内心独白
    think(text) {
        this.show(text, {
            type: 'THOUGHT',
            animation: 'blur',
            customStyle: {
                fontStyle: 'italic',
                opacity: '0.8'
            }
        });
    }

    // 环境描述
    describe(text) {
        this.show(text, {
            type: 'ENVIRONMENT',
            position: 'top',
            animation: 'slide'
        });
    }
}

// 导出类（如果使用模块系统）
// export default SubtitleSystem;