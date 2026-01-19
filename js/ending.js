/**
 * 结束界面控制器
 * Ending Screen Controller
 */

class EndingScreen {
    constructor() {
        this.screen = null;
        // 🌐 在构造时获取语言设置，确保使用最新的语言状态
        this.lang = localStorage.getItem('gameLang') || 'en';
        console.log(`[EndingScreen] Initialized with lang: ${this.lang}`);
    }

    /**
     * 获取本地化文本
     */
    getText() {
        return {
            subtitle: this.lang === 'zh' ? '' : "It's just a",
            thanks: this.lang === 'zh' ? '感谢你的体验！' : 'Thanks for Playing',
            playAgain: this.lang === 'zh' ? '返回开头' : 'Play Again'
        };
    }

    /**
     * 显示结束界面
     */
    show() {
        console.log('[EndingScreen] Showing ending screen...');

        // 创建结束界面DOM
        this.screen = this.createScreen();
        document.body.appendChild(this.screen);

        // 短暂延迟后触发淡入动画
        setTimeout(() => {
            this.screen.classList.add('fade-in');
            console.log('[EndingScreen] Fade-in animation started');
        }, 50);
    }

    /**
     * 创建结束界面DOM
     */
    createScreen() {
        const screen = document.createElement('div');
        screen.className = 'ending-screen crt-active';

        const TEXT = this.getText();

        // 根据语言决定是否显示副标题
        const subtitleStyle = this.lang === 'zh' ? 'style="display: none;"' : '';

        // 根据语言选择 Logo 内容和样式
        const logoClass = this.lang === 'zh' ? 'ending-ascii-art ending-ascii-art-zh' : 'ending-ascii-art';
        const logoContent = this.lang === 'zh'
            ? '山  茶'
            : `██████╗ ██╗   ██╗██████╗ ███╗   ██╗██╗███╗   ██╗ ██████╗
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
╚═╝     ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝`;

        // 中文版感谢文本需要特殊样式
        const thanksClass = this.lang === 'zh' ? 'ending-thanks ending-thanks-zh' : 'ending-thanks';

        screen.innerHTML = `
            <div class="ending-frame">
                <!-- 小标题 -->
                <div class="ending-subtitle" ${subtitleStyle}>${TEXT.subtitle}</div>

                <!-- ASCII Logo -->
                <div class="ending-logo">
                    <pre class="${logoClass}">${logoContent}</pre>
                </div>

                <!-- Thanks for playing 文本 -->
                <div class="${thanksClass}">${TEXT.thanks}</div>

                <!-- 重置按钮 -->
                <button class="ending-reset-btn">${TEXT.playAgain}</button>
            </div>
        `;

        // 绑定重置按钮事件
        const resetBtn = screen.querySelector('.ending-reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.executeReset();
            });
        }

        return screen;
    }

    /**
     * 执行重置（无弹窗确认，直接执行）
     */
    executeReset() {
        console.log('[EndingScreen] Executing reset...');

        // 1. 停止背景音乐
        if (window.audioManager) {
            window.audioManager.stopMusic(300);
        }

        // 2. 清除所有游戏相关localStorage
        localStorage.removeItem('gameState');
        localStorage.removeItem('saveTime');
        localStorage.removeItem('gameLang');

        console.log('[EndingScreen] localStorage cleared, reloading...');

        // 3. 刷新页面返回语言选择界面
        setTimeout(() => {
            window.location.reload();
        }, 100);
    }

    /**
     * 隐藏结束界面
     */
    hide() {
        if (this.screen) {
            this.screen.classList.remove('fade-in');
            setTimeout(() => {
                if (this.screen && this.screen.parentNode) {
                    this.screen.parentNode.removeChild(this.screen);
                }
            }, 1500);
        }
    }

    /**
     * 销毁结束界面
     */
    destroy() {
        if (this.screen && this.screen.parentNode) {
            this.screen.parentNode.removeChild(this.screen);
        }
        this.screen = null;
    }
}

// 导出到全局作用域
if (typeof window !== 'undefined') {
    window.EndingScreen = EndingScreen;
}
