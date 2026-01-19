/**
 * 卡片管理器
 * 负责卡片数据的加载、查询和管理
 */
class CardManager {
    constructor() {
        this.cards = [];
        this.cardsById = {};
        this.metadata = {};
        this.isLoaded = false;
    }

    /**
     * 加载卡片数据
     * @param {string} dataPath - 卡片数据文件路径（暂时保留参数，但不使用）
     * @returns {Promise<boolean>} 加载是否成功
     */
    async loadCards(dataPath = 'data/cards.json') {
        try {
            // 直接使用全局CARDS_DATA对象（避免CORS问题）
            if (typeof CARDS_DATA === 'undefined') {
                throw new Error('CARDS_DATA not found. Make sure cards-data.js is loaded.');
            }

            const data = CARDS_DATA;
            this.cards = data.cards || [];
            this.metadata = data.metadata || {};

            // 建立ID索引
            this.cardsById = {};
            this.cards.forEach(card => {
                this.cardsById[card.id] = card;
            });

            this.isLoaded = true;
            console.log(`Loaded ${this.cards.length} cards successfully`);
            return true;
        } catch (error) {
            console.error('Failed to load cards:', error);
            this.isLoaded = false;
            return false;
        }
    }

    /**
     * 根据ID获取卡片
     * @param {string} cardId - 卡片ID
     * @returns {Object|null} 卡片对象或null
     */
    getCardById(cardId) {
        if (!this.isLoaded) {
            console.warn('Cards not loaded yet');
            return null;
        }
        return this.cardsById[cardId] || null;
    }

    /**
     * 根据类型筛选卡片
     * @param {string} type - 卡片类型: 'memory'/'file'
     * @returns {Array} 符合条件的卡片数组
     */
    getCardsByType(type) {
        if (!this.isLoaded) {
            console.warn('Cards not loaded yet');
            return [];
        }
        return this.cards.filter(card => card.type === type);
    }

    /**
     * 根据年份筛选卡片
     * @param {number} year - 年份: 1945/1995
     * @returns {Array} 符合条件的卡片数组
     */
    getCardsByYear(year) {
        if (!this.isLoaded) {
            console.warn('Cards not loaded yet');
            return [];
        }
        return this.cards.filter(card => card.year === year);
    }

    /**
     * 根据解锁线索词查找卡片
     * @param {string} clue - 线索词
     * @returns {Array} 可以被该线索词解锁的卡片数组
     */
    getCardsByUnlockClue(clue) {
        if (!this.isLoaded) {
            console.warn('Cards not loaded yet');
            return [];
        }
        const lowerClue = clue.toLowerCase();
        return this.cards.filter(card =>
            card.unlock_clue && card.unlock_clue.toLowerCase() === lowerClue
        );
    }

    /**
     * 获取所有卡片
     * @returns {Array} 所有卡片数组
     */
    getAllCards() {
        if (!this.isLoaded) {
            console.warn('Cards not loaded yet');
            return [];
        }
        return this.cards;
    }

    /**
     * 获取已发现的memory类型卡片数量
     * @param {Object} gameState - 游戏状态对象
     * @returns {number} 已发现的memory卡片数量
     */
    getDiscoveredMemoryCount(gameState) {
        const discoveredCards = gameState?.discovered_cards || [];
        let count = 0;
        discoveredCards.forEach(cardId => {
            const card = this.getCardById(cardId);
            if (card && card.type === 'memory') {
                count++;
            }
        });
        return count;
    }

    /**
     * 检查卡片的数量解锁条件
     * @param {string} cardId - 卡片ID
     * @param {number} discoveredCount - 已发现的卡片数量
     * @returns {boolean} 是否满足解锁条件
     */
    checkCountUnlockCondition(cardId, discoveredCount) {
        const card = this.getCardById(cardId);
        if (!card) return false;

        // 如果不是数量解锁类型，返回false
        if (card.unlock_type !== 'count') return false;

        // 检查是否达到所需数量
        const requiredCards = card.unlock_condition?.required_cards || 0;
        return discoveredCount >= requiredCards;
    }

    /**
     * 验证问答解锁的答案
     * @param {string} cardId - 卡片ID
     * @param {string} answer - 用户输入的答案
     * @returns {boolean} 答案是否正确
     */
    verifyQuestionAnswer(cardId, answer) {
        const card = this.getCardById(cardId);
        if (!card) return false;

        // 如果不是问答解锁类型，返回false
        if (card.unlock_type !== 'question') return false;

        // 获取正确答案（可以是字符串或数组）
        const correctAnswer = card.unlock_condition?.answer || '';
        const userAnswer = answer.toLowerCase().trim();

        // 如果答案是数组，检查用户答案是否在数组中
        if (Array.isArray(correctAnswer)) {
            return correctAnswer.some(ans => ans.toLowerCase().trim() === userAnswer);
        }

        // 如果答案是字符串，直接比较
        return userAnswer === correctAnswer.toLowerCase().trim();
    }

    /**
     * 获取问答解锁的预览内容
     * @param {string} cardId - 卡片ID
     * @returns {Object} 包含问题、答案和预览内容的对象
     */
    getQuestionPreview(cardId) {
        const card = this.getCardById(cardId);
        if (!card || card.unlock_type !== 'question') {
            return null;
        }

        const condition = card.unlock_condition || {};
        const previewLines = condition.preview_lines || 0;

        // 获取前N段内容作为预览
        const previewContent = card.content.slice(0, previewLines);

        return {
            question: condition.question || '',
            answer: condition.answer || '',  // 添加答案字段
            preview: previewContent,
            fullContent: card.content
        };
    }

    /**
     * 更新卡片状态
     * @param {string} cardId - 卡片ID
     * @param {string} newStatus - 新状态: 'locked'/'partial'/'unlocked'
     * @returns {boolean} 更新是否成功
     */
    updateCardStatus(cardId, newStatus) {
        const card = this.getCardById(cardId);
        if (!card) return false;

        const validStatuses = ['locked', 'partial', 'unlocked'];
        if (!validStatuses.includes(newStatus)) {
            console.warn(`Invalid status: ${newStatus}`);
            return false;
        }

        card.status = newStatus;
        return true;
    }

    /**
     * 更新卡片的发现状态
     * @param {string} cardId - 卡片ID
     * @param {boolean} isDiscovered - 是否已发现
     * @returns {boolean} 更新是否成功
     */
    updateCardDiscoveredStatus(cardId, isDiscovered) {
        const card = this.getCardById(cardId);
        if (!card) return false;

        card.is_discovered = isDiscovered;
        return true;
    }

    /**
     * 更新卡片的已读状态
     * @param {string} cardId - 卡片ID
     * @param {boolean} isRead - 是否已读
     * @returns {boolean} 更新是否成功
     */
    updateCardReadStatus(cardId, isRead) {
        const card = this.getCardById(cardId);
        if (!card) {
            console.log(`[DEBUG] updateCardReadStatus: Card ${cardId} not found`);
            return false;
        }

        const oldStatus = card.is_read;
        card.is_read = isRead;
        console.log(`[DEBUG] Card ${cardId} read status changed: ${oldStatus} -> ${isRead}`);
        return true;
    }

    /**
     * 获取卡片的新线索词
     * @param {string} cardId - 卡片ID
     * @returns {Array} 新线索词数组
     */
    getCardNewClues(cardId) {
        const card = this.getCardById(cardId);
        if (!card) return [];

        return card.new_clues || [];
    }

    /**
     * 管理卡片状态转换
     * 根据解锁类型和条件，自动管理状态转换
     * @param {string} cardId - 卡片ID
     * @param {Object} gameState - 游戏状态对象（用于检查条件）
     * @returns {string} 新状态: 'locked'/'partial'/'unlocked'
     */
    manageCardStateTransition(cardId, gameState) {
        const card = this.getCardById(cardId);
        if (!card) return 'locked';

        // 如果卡片还未被发现，返回锁定状态
        if (!card.is_discovered) {
            return 'locked';
        }

        // 根据解锁类型处理
        switch (card.unlock_type) {
            case 'direct':
                // 直接解锁类型：发现即解锁
                return 'unlocked';

            case 'count':
                // 数量解锁类型：检查已发现的memory类型卡片数量
                // 注意：只计算memory类型，不包括file类型
                const discoveredMemoryCount = this.getDiscoveredMemoryCount(gameState);
                if (this.checkCountUnlockCondition(cardId, discoveredMemoryCount)) {
                    return 'unlocked';
                }
                return 'locked';

            case 'question':
                // 问答解锁类型：初始为部分解锁，答对后完全解锁
                if (card.status === 'unlocked') {
                    return 'unlocked';
                }
                return 'partial';

            default:
                return 'locked';
        }
    }

    /**
     * 按时间排序卡片
     * @param {Array} cards - 卡片数组
     * @returns {Array} 排序后的卡片数组
     */
    sortCardsByTime(cards) {
        return [...cards].sort((a, b) => {
            // 解析时间为小时数（24小时制）
            const hourA = this.parseTimeToHour(a.time);
            const hourB = this.parseTimeToHour(b.time);

            // 按小时数排序
            if (hourA !== hourB) {
                return hourA - hourB;
            }

            // 时间相同则按ID排序
            return (a.id || '').localeCompare(b.id || '');
        });
    }

    /**
     * 解析时间字符串为小时数（24小时制）
     * @param {string} timeStr - 时间字符串，如 "8am", "10pm"
     * @returns {number} 小时数（0-23），无效时间返回 -1
     */
    parseTimeToHour(timeStr) {
        if (!timeStr) return -1;

        // 匹配格式：数字 + am/pm
        const match = timeStr.match(/^(\d+)(am|pm)$/i);
        if (!match) return -1;

        let hour = parseInt(match[1]);
        const period = match[2].toLowerCase();

        // 转换为24小时制
        if (period === 'pm' && hour !== 12) {
            hour += 12;
        } else if (period === 'am' && hour === 12) {
            hour = 0;
        }

        return hour;
    }

    /**
     * 按年份分组后时间排序
     * @param {Array} cards - 卡片数组
     * @returns {Array} 排序后的卡片数组
     */
    sortCardsByYearAndTime(cards) {
        return [...cards].sort((a, b) => {
            // 先按年份排序
            const yearA = a.year || 0;
            const yearB = b.year || 0;

            if (yearA !== yearB) {
                return yearA - yearB;
            }

            // 年份相同则按时间排序（使用小时数比较）
            const hourA = this.parseTimeToHour(a.time);
            const hourB = this.parseTimeToHour(b.time);

            if (hourA !== hourB) {
                return hourA - hourB;
            }

            // 时间也相同则按ID排序
            return (a.id || '').localeCompare(b.id || '');
        });
    }

    /**
     * 按默认顺序（ID）排序
     * @param {Array} cards - 卡片数组
     * @returns {Array} 排序后的卡片数组
     */
    sortCardsByDefault(cards) {
        return [...cards].sort((a, b) => (a?.id || '').localeCompare(b?.id || ''));
    }

    /**
     * 获取游戏元数据
     * @returns {Object} 元数据对象
     */
    getMetadata() {
        return this.metadata;
    }

    /**
     * 获取初始线索词
     * @returns {Array} 初始线索词数组
     */
    getInitialClues() {
        return this.metadata.initial_clues || [];
    }

    /**
     * 根据unlock_by查找file类型卡片
     * @param {string} triggerCardId - 触发卡片的ID
     * @returns {Array} 可以被该卡片解锁的file数组
     */
    getFilesByUnlockBy(triggerCardId) {
        if (!this.isLoaded) {
            console.warn('Cards not loaded yet');
            return [];
        }

        return this.cards.filter(card => {
            // 只检查file类型
            if (card.type !== 'file') return false;

            // 检查unlock_by字段
            const unlockBy = card.unlock_by;
            if (!unlockBy) return false;

            // unlock_by可以是数组或单个字符串
            if (Array.isArray(unlockBy)) {
                return unlockBy.includes(triggerCardId);
            } else {
                return unlockBy === triggerCardId;
            }
        });
    }

    /**
     * 调试用：打印卡片信息
     * @param {string} cardId - 卡片ID（可选，不传则打印所有）
     */
    debugPrintCards(cardId = null) {
        if (!this.isLoaded) {
            console.log('Cards not loaded yet');
            return;
        }

        if (cardId) {
            const card = this.getCardById(cardId);
            if (card) {
                console.log('Card Info:', card);
            } else {
                console.log(`Card ${cardId} not found`);
            }
        } else {
            console.log('All Cards:', this.cards);
            console.log('Metadata:', this.metadata);
        }
    }
}

// 导出给其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CardManager;
}