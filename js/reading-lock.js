/**
 * 阅读锁定管理器
 * 负责在阅读时锁定其他交互
 */
class ReadingLockManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.originalStyles = new Map(); // 保存原始样式
        this.bypassed = false; // 绕过锁定机制的标记
    }

    /**
     * 禁用锁定机制（用于特殊场景如decay）
     */
    bypass() {
        this.bypassed = true;
        console.log('[ReadingLock] Lock mechanism bypassed');
    }

    /**
     * 恢复锁定机制
     */
    restore() {
        this.bypassed = false;
        console.log('[ReadingLock] Lock mechanism restored');
    }

    /**
     * 锁定阅读模式
     * @param {string} cardId - 卡片ID
     */
    lock(cardId) {
        // 如果绕过模式开启，不锁定
        if (this.bypassed) {
            console.log('[ReadingLock] Lock bypassed, skipping');
            return false;
        }

        // 检查是否已锁定
        const readingState = this.gameState.getReadingState();
        if (readingState.isReading) {
            console.log('[ReadingLock] Already locked');
            return false;
        }

        // 设置锁定状态
        this.gameState.setReadingState(true, cardId);

        // 禁用交互
        this.disableInteractions();

        console.log(`[ReadingLock] Locked for card: ${cardId}`);
        return true;
    }

    /**
     * 解锁阅读模式
     */
    unlock() {
        const readingState = this.gameState.getReadingState();
        if (!readingState.isReading) {
            return false;
        }

        const cardId = readingState.cardId;

        // 标记卡片已读
        if (cardId) {
            this.gameState.markCardAsRead(cardId);
            console.log(`[ReadingLock] Marked card ${cardId} as read`);
        }

        // 恢复交互
        this.enableInteractions();

        // 清除锁定状态
        this.gameState.setReadingState(false, null);

        console.log('[ReadingLock] Unlocked');
        return true;
    }

    /**
     * 禁用交互
     */
    disableInteractions() {
        const readingState = this.gameState.getReadingState();
        const currentCardId = readingState.cardId;

        // 禁用文件列表点击
        const fileItems = document.querySelectorAll('.file-item');
        fileItems.forEach(item => {
            const itemCardId = item.getAttribute('data-card-id');

            if (itemCardId === currentCardId) {
                // 高亮当前阅读的卡片
                item.classList.add('reading-current');
            } else {
                // 禁用其他卡片
                item.classList.add('reading-locked');
            }
        });

        // 禁用输入框
        const input = document.querySelector('.command-input');
        if (input) {
            this.originalStyles.set(input, {
                disabled: input.disabled,
                placeholder: input.placeholder
            });
            input.disabled = true;
            input.placeholder = ''; // P4 修复：不显示 placeholder，避免文字泄露
            input.classList.add('reading-locked');
        }

        // 禁用Tab切换
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.classList.add('reading-locked');
        });

        // 禁用command-help区域
        const commandHelp = document.querySelector('.command-help');
        if (commandHelp) {
            commandHelp.classList.add('reading-locked');
        }

        // 添加body类用于样式控制
        document.body.classList.add('reading-mode');
        console.log('[ReadingLock] Interactions disabled');
    }

    /**
     * 恢复交互
     */
    enableInteractions() {
        // 恢复文件列表
        const fileItems = document.querySelectorAll('.file-item');
        fileItems.forEach(item => {
            item.classList.remove('reading-locked');
            item.classList.remove('reading-current');
        });

        // 恢复输入框
        const input = document.querySelector('.command-input');
        if (input) {
            const original = this.originalStyles.get(input);
            if (original) {
                input.disabled = original.disabled || false;
                input.placeholder = ''; // P4 修复：始终为空，避免文字泄露
            }
            input.classList.remove('reading-locked');
        }

        // 恢复Tab
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.classList.remove('reading-locked');
        });

        // 恢复command-help区域
        const commandHelp = document.querySelector('.command-help');
        if (commandHelp) {
            commandHelp.classList.remove('reading-locked');
        }

        // 移除body类
        document.body.classList.remove('reading-mode');

        // 清空保存的样式
        this.originalStyles.clear();
        console.log('[ReadingLock] Interactions enabled');
    }

    /**
     * 检查是否处于锁定状态
     * @returns {boolean}
     */
    isLocked() {
        return this.gameState.getReadingState().isReading;
    }

    /**
     * 获取当前阅读的卡片ID
     * @returns {string|null}
     */
    getCurrentCardId() {
        return this.gameState.getReadingState().cardId;
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReadingLockManager;
}