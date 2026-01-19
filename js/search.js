/**
 * 搜索引擎模块
 * 负责处理线索词搜索和相关逻辑
 */

// 🌐 语言本地化支持（延迟初始化）
let SEARCH_TEXT = {};

function initSearchLocalization() {
    const lang = localStorage.getItem('gameLang') || 'en';
    SEARCH_TEXT = {
        clueNotDiscovered: lang === 'zh' ? '线索尚未发现' : 'Clue not yet discovered',
        noResultsFound: lang === 'zh' ? '未找到"{clue}"的结果' : 'No results found for "{clue}"',
        searchSuccess: lang === 'zh'
            ? '搜索成功！发现{memory}条记忆，{file}份档案。'
            : 'Search successful! Discovered {memory} memory(s), {file} file(s).',
        alreadyDiscovered: lang === 'zh'
            ? '已通过"{clue}"发现这些记忆'
            : 'Already discovered these memories with "{clue}"'
    };
}

class SearchEngine {
    /**
     * 构造函数
     * @param {CardManager} cardManager - 卡片管理器实例
     * @param {GameState} gameState - 游戏状态管理器实例
     */
    constructor(cardManager, gameState) {
        this.cardManager = cardManager;
        this.gameState = gameState;
        this.searchHistory = [];  // 搜索历史记录

        // 🌐 初始化本地化文本
        initSearchLocalization();
    }

    /**
     * 搜索线索词
     * @param {string} clue - 要搜索的线索词
     * @returns {Object} 搜索结果对象
     */
    search(clue) {
        // 规范化输入（统一小写并去除前后空格）
        const normalizedClue = clue.toLowerCase().trim();

        // 🔒 验证线索词是否已被发现
        const discoveredClues = this.gameState.getState().discovered_clues;
        if (!discoveredClues.includes(normalizedClue)) {
            return {
                success: false,
                message: SEARCH_TEXT.clueNotDiscovered,
                memoryCount: 0,
                fileCount: 0,
                newDiscoveries: 0,
                matchedCards: [],
                isDuplicate: false
            };
        }

        // 记录搜索历史
        this.searchHistory.push({
            clue: clue,
            timestamp: new Date(),
            found: false
        });

        // 查找匹配的卡片（只搜索memory类型，file不通过搜索发现）
        const matchedCards = this.cardManager.getCardsByUnlockClue(clue).filter(card => card.type === 'memory');

        // 如果没有找到匹配的卡片
        if (matchedCards.length === 0) {
            return {
                success: false,
                message: SEARCH_TEXT.noResultsFound.replace('{clue}', clue),
                memoryCount: 0,
                fileCount: 0,
                newDiscoveries: 0,
                matchedCards: []
            };
        }

        // 统计发现的记忆和文件数量
        let memoryCount = 0;
        let fileCount = 0;
        let newDiscoveries = 0;
        const discoveredCardIds = [];

        matchedCards.forEach(card => {
            // 检查是否已经发现过
            const isNew = !this.gameState.isCardDiscovered(card.id);

            if (isNew) {
                console.log(`[SearchEngine] 🎉 New card discovered: ${card.id} (${card.title})`);

                // 发现新卡片
                this.gameState.discoverCard(card.id);
                this.cardManager.updateCardDiscoveredStatus(card.id, true);

                // 处理解锁逻辑
                this.processCardUnlock(card.id);

                newDiscoveries++;
                discoveredCardIds.push(card.id);

                // 🎵 播放发现音效
                console.log(`[SearchEngine] Attempting to play discover sound...`);
                console.log(`[SearchEngine] window.audioManager exists:`, !!window.audioManager);
                if (window.audioManager) {
                    console.log(`[SearchEngine] Calling audioManager.playSFX('discover', 0.5, true)`);
                    audioManager.playSFX('discover', 0.5, true);
                } else {
                    console.warn(`[SearchEngine] ⚠️ audioManager not available!`);
                }

            }

            // 统计类型
            if (card.type === 'memory') {
                memoryCount++;
            } else if (card.type === 'file') {
                fileCount++;
            }
        });

        // 标记线索词已使用 - 使用卡片中的实际线索词（保留原始大小写）
        if (matchedCards.length > 0) {
            const actualClue = matchedCards[0].unlock_clue;
            this.gameState.markClueAsUsed(actualClue);

            // 更新页面上所有对应 clue 的样式（降低已使用 clue 的亮度）
            const normalizedClue = actualClue.toLowerCase().trim();
            document.querySelectorAll('.clue-word').forEach(el => {
                if (el.textContent.toLowerCase().trim() === normalizedClue) {
                    el.classList.add('clue-used');
                    el.style.color = '#a0a0a0';
                }
            });
        }

        // 更新搜索历史记录
        this.searchHistory[this.searchHistory.length - 1].found = true;

        // 构建返回结果
        if (newDiscoveries > 0) {
            return {
                success: true,
                message: SEARCH_TEXT.searchSuccess
                    .replace('{memory}', memoryCount)
                    .replace('{file}', fileCount),
                memoryCount: memoryCount,
                fileCount: fileCount,
                newDiscoveries: newDiscoveries,
                discoveredCardIds: discoveredCardIds,
                matchedCards: matchedCards
            };
        } else {
            return {
                success: true,
                message: SEARCH_TEXT.alreadyDiscovered.replace('{clue}', clue),
                memoryCount: memoryCount,
                fileCount: fileCount,
                newDiscoveries: 0,
                discoveredCardIds: [],
                matchedCards: matchedCards,
                isDuplicate: true
            };
        }
    }

    /**
     * 处理卡片解锁逻辑
     * @param {string} cardId - 卡片ID
     */
    processCardUnlock(cardId) {
        console.log(`[SearchEngine] Processing unlock for card: ${cardId}`);

        const card = this.cardManager.getCardById(cardId);
        if (!card) {
            console.log(`[SearchEngine] Card not found: ${cardId}`);
            return;
        }

        console.log(`[SearchEngine] Card unlock_type: ${card.unlock_type}`);

        // 对于问答解锁类型，需要特殊处理
        if (card.unlock_type === 'question') {
            console.log(`[SearchEngine] Card is question type, using UnlockManager`);

            // 使用全局的UnlockManager来处理问答解锁
            // 这样可以正确设置pendingQuestions
            if (typeof unlockManager !== 'undefined' && unlockManager) {
                console.log(`[SearchEngine] Calling unlockManager.checkAndProcessUnlock`);
                const result = unlockManager.checkAndProcessUnlock(cardId);
                console.log(`[SearchEngine] UnlockManager result:`, result);

                // 更新卡片状态
                if (result.status) {
                    this.cardManager.updateCardStatus(cardId, result.status);
                }
            } else {
                console.log(`[SearchEngine] WARNING: unlockManager not available, falling back to basic processing`);
                // 回退到基本处理
                const newStatus = this.cardManager.manageCardStateTransition(
                    cardId,
                    this.gameState.getState()
                );
                this.cardManager.updateCardStatus(cardId, newStatus);
            }
        } else {
            // 对于其他类型，使用原有逻辑
            const newStatus = this.cardManager.manageCardStateTransition(
                cardId,
                this.gameState.getState()
            );

            this.cardManager.updateCardStatus(cardId, newStatus);

            // 如果是直接解锁，也标记为已解锁
            if (newStatus === 'unlocked') {
                this.gameState.unlockCard(cardId);
            }
        }

        // 检查是否触发了数量解锁
        this.checkCountUnlocks();
    }

    /**
     * 检查并处理数量解锁
     * 当发现的memory类型卡片数量达到某些卡片的解锁条件时，自动解锁它们
     */
    checkCountUnlocks() {
        const discoveredCount = unlockManager.getDiscoveredMemoryCount();
        const allCards = this.cardManager.getAllCards();

        allCards.forEach(card => {
            // 检查是否是数量解锁类型且尚未解锁
            if (card.unlock_type === 'count' &&
                card.status === 'locked' &&
                this.gameState.isCardDiscovered(card.id)) {

                // 检查是否满足解锁条件
                if (this.cardManager.checkCountUnlockCondition(card.id, discoveredCount)) {
                    // 解锁卡片
                    this.cardManager.updateCardStatus(card.id, 'unlocked');
                    this.gameState.unlockCard(card.id);

                    console.log(`[SearchEngine] Card ${card.id} unlocked by count condition`);
                }
            }
        });
    }

    /**
     * 获取搜索历史
     * @param {number} limit - 返回的历史记录数量限制
     * @returns {Array} 搜索历史数组
     */
    getSearchHistory(limit = 10) {
        return this.searchHistory.slice(-limit);
    }

    /**
     * 获取未使用的线索词
     * @returns {Array} 未使用的线索词数组
     */
    getUnusedClues() {
        return this.gameState.getUnusedClues();
    }

    /**
     * 获取已使用的线索词
     * @returns {Array} 已使用的线索词数组
     */
    getUsedClues() {
        const state = this.gameState.getState();
        return state.used_clues || [];
    }

    /**
     * 检查线索词是否已被使用
     * @param {string} clue - 线索词
     * @returns {boolean} 是否已使用
     */
    isClueUsed(clue) {
        return this.gameState.isClueUsed(clue);
    }

    /**
     * 获取搜索统计
     * @returns {Object} 搜索统计信息
     */
    getSearchStats() {
        const totalSearches = this.searchHistory.length;
        const successfulSearches = this.searchHistory.filter(s => s.found).length;
        const uniqueClues = [...new Set(this.searchHistory.map(s => s.clue))];

        return {
            totalSearches: totalSearches,
            successfulSearches: successfulSearches,
            failedSearches: totalSearches - successfulSearches,
            uniqueCluesSearched: uniqueClues.length,
            successRate: totalSearches > 0 ? (successfulSearches / totalSearches * 100).toFixed(1) + '%' : '0%'
        };
    }

    /**
     * 清空搜索历史
     */
    clearHistory() {
        this.searchHistory = [];
        console.log('[SearchEngine] Search history cleared');
    }
}

// 导出类（如果使用模块系统）
// export default SearchEngine;