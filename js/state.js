/**
 * 游戏状态管理器
 * 负责管理游戏的所有运行时状态
 */

// 存档版本号
const SAVE_VERSION = '1.1.0';

// 默认状态模板（用于补全缺失字段）
const DEFAULT_STATE = {
    // 卡片相关状态
    discovered_cards: [],
    unlocked_cards: [],
    read_cards: [],
    // 线索词相关状态
    discovered_clues: [],
    used_clues: [],
    // UI相关状态
    current_sort: 'default',
    current_tab: 'memory',
    current_card: null,
    show_year: false,
    // 统计信息
    total_discovered: 0,
    // 游戏进度
    game_started: false,
    game_completed: false,
    // 其他状态
    notes: {},
    blue_marked_cards: [],
    sort_year_used: false,
    // Delete系统状态
    delete_stage: 'inactive',
    deletion1_completed: false,
    deletion2_completed: false,
    // 指令解锁系统
    unlocked_commands: [],
    // 问答卡片预览状态
    preview_shown_cards: [],
    // 音频状态
    current_bgm: 'Atmosphere'  // 当前BGM: Atmosphere/1Mo/Delete 等
};

class GameState {
    constructor() {
        this.initializeState();
    }

    /**
     * 初始化游戏状态
     */
    initializeState() {
        this.state = {
            // 卡片相关状态
            discovered_cards: [],      // 已发现的卡片ID列表
            unlocked_cards: [],        // 已解锁的卡片ID列表
            read_cards: [],            // 已阅读的卡片ID列表

            // 线索词相关状态
            discovered_clues: [],      // 已获得的线索词列表
            used_clues: [],            // 已使用的线索词列表

            // UI相关状态
            current_sort: 'default',   // 当前排序方式: default/time/year
            current_tab: 'memory',     // 当前选中的Tab: memory/file/clue
            current_card: null,        // 当前显示的卡片ID
            show_year: false,          // 是否在标题栏显示年份（默认隐藏，/sort year时显示）

            // 统计信息
            total_discovered: 0,       // 发现总数

            // 游戏进度
            game_started: false,       // 游戏是否已开始
            game_completed: false,     // 游戏是否已完成

            // 阅读状态
            is_reading: false,         // 是否正在阅读
            reading_card_id: null,     // 当前阅读的卡片ID

            // 其他状态
            notes: {},                 // 卡片笔记 {card_id: note_text}

            // 蓝色标记（用于/sort year功能）
            blue_marked_cards: [],     // 被标记为蓝色的卡片ID列表

            // 特殊解锁标记
            sort_year_used: false,     // 是否已经使用过/sort year命令

            // Delete系统状态
            delete_stage: 'inactive',  // Delete系统阶段: inactive/stage1/stage2
            pending_confirmation: null, // 待确认的操作: {type: 'delete1'|'delete2'|'name_input', data: {...}}
            deletion1_completed: false, // 删除动画1是否已播放
            deletion2_completed: false, // 删除动画2是否已播放

            // 指令解锁系统
            unlocked_commands: [],     // 已解锁的指令列表

            // 🔧 问答卡片预览状态
            preview_shown_cards: []    // 已显示过预览的问答类型卡片ID列表
        };
    }

    /**
     * 获取当前游戏状态
     */
    getState() {
        return this.state;
    }

    /**
     * 发现新卡片
     * @param {string} cardId - 卡片ID
     */
    discoverCard(cardId) {
        if (!this.state.discovered_cards.includes(cardId)) {
            this.state.discovered_cards.push(cardId);
            this.state.total_discovered++;
            this.saveState();
            return true;
        }
        return false;
    }

    /**
     * 解锁卡片
     * @param {string} cardId - 卡片ID
     */
    unlockCard(cardId) {
        if (!this.state.unlocked_cards.includes(cardId)) {
            this.state.unlocked_cards.push(cardId);
            this.saveState();
            return true;
        }
        return false;
    }

    /**
     * 标记卡片已读
     * @param {string} cardId - 卡片ID
     */
    markCardAsRead(cardId) {
        if (!this.state.read_cards.includes(cardId)) {
            this.state.read_cards.push(cardId);
            this.saveState();
            return true;
        }
        return false;
    }

    /**
     * 添加蓝色标记
     * @param {string} cardId - 卡片ID
     */
    addBlueMarked(cardId) {
        if (!this.state.blue_marked_cards.includes(cardId)) {
            this.state.blue_marked_cards.push(cardId);
            this.saveState();
        }
    }

    /**
     * 移除蓝色标记
     * @param {string} cardId - 卡片ID
     */
    removeBlueMarked(cardId) {
        const index = this.state.blue_marked_cards.indexOf(cardId);
        if (index > -1) {
            this.state.blue_marked_cards.splice(index, 1);
            this.saveState();
        }
    }

    /**
     * 检查是否有蓝色标记
     * @param {string} cardId - 卡片ID
     * @returns {boolean}
     */
    isBlueMarked(cardId) {
        return this.state.blue_marked_cards.includes(cardId);
    }

    /**
     * 检查是否已经使用过/sort year命令
     * @returns {boolean}
     */
    hasSortYearUsed() {
        return this.state.sort_year_used;
    }

    /**
     * 标记已使用/sort year命令
     */
    setSortYearUsed() {
        this.state.sort_year_used = true;
        this.saveState();
    }

    /**
     * 添加新线索词
     * @param {string|Array} clues - 线索词或线索词数组
     */
    addClues(clues) {
        const clueArray = Array.isArray(clues) ? clues : [clues];
        let addedCount = 0;

        clueArray.forEach(clue => {
            // 统一转为小写，避免大小写重复
            const normalizedClue = clue.toLowerCase().trim();

            if (normalizedClue && !this.state.discovered_clues.includes(normalizedClue)) {
                this.state.discovered_clues.push(normalizedClue);
                addedCount++;
            }
        });

        if (addedCount > 0) {
            this.saveState();
        }
        return addedCount;
    }

    /**
     * 标记线索词已使用
     * @param {string} clue - 线索词
     */
    markClueAsUsed(clue) {
        // 统一转为小写，与discovered_clues保持一致
        const normalizedClue = clue.toLowerCase().trim();

        if (normalizedClue && !this.state.used_clues.includes(normalizedClue)) {
            this.state.used_clues.push(normalizedClue);
            this.saveState();
            return true;
        }
        return false;
    }

    /**
     * 设置当前排序方式
     * @param {string} sortType - 排序方式: default/time/year
     */
    setSort(sortType) {
        const validSorts = ['default', 'time', 'year'];
        if (validSorts.includes(sortType)) {
            this.state.current_sort = sortType;
            this.saveState();
            return true;
        }
        return false;
    }

    /**
     * 设置当前Tab
     * @param {string} tab - Tab类型: memory/file/clue
     */
    setTab(tab) {
        const validTabs = ['memory', 'file', 'clue'];
        if (validTabs.includes(tab)) {
            this.state.current_tab = tab;
            this.saveState();
            return true;
        }
        return false;
    }

    /**
     * 设置当前显示的卡片
     * @param {string} cardId - 卡片ID
     */
    setCurrentCard(cardId) {
        this.state.current_card = cardId;
        this.saveState();
    }

    /**
     * 设置是否显示年份
     * @param {boolean} showYear - 是否显示年份
     */
    setShowYear(showYear) {
        this.state.show_year = !!showYear;
        this.saveState();
    }

    /**
     * 设置阅读锁定状态
     * @param {boolean} isReading - 是否正在阅读
     * @param {string} cardId - 卡片ID（可选）
     */
    setReadingState(isReading, cardId = null) {
        this.state.is_reading = isReading;
        this.state.reading_card_id = cardId;
        // 不保存到localStorage，这是临时状态
    }

    /**
     * 获取阅读状态
     */
    getReadingState() {
        return {
            isReading: this.state.is_reading,
            cardId: this.state.reading_card_id
        };
    }

    /**
     * 添加或更新卡片笔记
     * @param {string} cardId - 卡片ID
     * @param {string} note - 笔记内容
     */
    setCardNote(cardId, note) {
        this.state.notes[cardId] = note;
        this.saveState();
    }

    /**
     * 检查卡片是否已发现
     * @param {string} cardId - 卡片ID
     */
    isCardDiscovered(cardId) {
        return this.state.discovered_cards.includes(cardId);
    }

    /**
     * 检查卡片是否已解锁
     * @param {string} cardId - 卡片ID
     */
    isCardUnlocked(cardId) {
        return this.state.unlocked_cards.includes(cardId);
    }

    /**
     * 检查卡片是否已读
     * @param {string} cardId - 卡片ID
     */
    isCardRead(cardId) {
        return this.state.read_cards.includes(cardId);
    }

    /**
     * 检查线索词是否已使用
     * @param {string} clue - 线索词
     */
    isClueUsed(clue) {
        const normalizedClue = clue.toLowerCase().trim();
        return this.state.used_clues.includes(normalizedClue);
    }

    /**
     * 获取未使用的线索词
     */
    getUnusedClues() {
        return this.state.discovered_clues.filter(
            clue => !this.state.used_clues.includes(clue)
        );
    }

    /**
     * 重置游戏状态
     */
    resetState() {
        this.initializeState();
        this.clearSavedState();
    }

    /**
     * 保存状态到localStorage
     */
    saveState() {
        try {
            // 创建状态副本，排除临时状态
            const stateCopy = { ...this.state };

            // 排除临时的UI状态（这些状态不应该持久化）
            delete stateCopy.is_reading;
            delete stateCopy.reading_card_id;
            delete stateCopy.pending_confirmation;

            // 添加版本号
            stateCopy._version = SAVE_VERSION;

            const stateJSON = JSON.stringify(stateCopy);
            localStorage.setItem('gameState', stateJSON);
            localStorage.setItem('saveTime', new Date().toISOString());
            return true;
        } catch (error) {
            console.error('[State] Failed to save:', error);
            return false;
        }
    }

    /**
     * 从localStorage加载状态
     */
    loadState() {
        try {
            const savedState = localStorage.getItem('gameState');
            if (!savedState) return false;

            let loaded;
            try {
                loaded = JSON.parse(savedState);
            } catch (parseError) {
                console.error('[State] JSON parse failed:', parseError);
                this.backupCorruptedSave(savedState);
                return false;
            }

            // 版本迁移
            loaded = this.migrateState(loaded);

            // 合并默认值（补全缺失字段）+ 加载的状态
            this.state = {
                ...DEFAULT_STATE,
                ...loaded,
                // 强制重置临时状态
                is_reading: false,
                reading_card_id: null,
                pending_confirmation: null
            };

            // 验证数据完整性
            this.validateState();

            const saveTime = localStorage.getItem('saveTime');
            console.log(`[State] Loaded from: ${saveTime}, version: ${loaded._version || 'unknown'}`);
            return true;
        } catch (error) {
            console.error('[State] Load failed:', error);
            return false;
        }
    }

    /**
     * 版本迁移
     * @param {Object} loaded - 加载的状态对象
     * @returns {Object} 迁移后的状态对象
     */
    migrateState(loaded) {
        const version = loaded._version || '1.0.0';
        console.log(`[State] Current save version: ${version}`);

        // 1.0.0 → 1.1.0: 确保新字段存在
        if (version === '1.0.0') {
            loaded.preview_shown_cards = loaded.preview_shown_cards || [];
            loaded.unlocked_commands = loaded.unlocked_commands || [];
            loaded._version = '1.1.0';
            console.log('[State] Migrated 1.0.0 → 1.1.0');
        }

        return loaded;
    }

    /**
     * 验证状态数据完整性
     */
    validateState() {
        // 确保数组字段是数组
        const arrayFields = [
            'discovered_cards', 'unlocked_cards', 'read_cards',
            'discovered_clues', 'used_clues', 'blue_marked_cards',
            'unlocked_commands', 'preview_shown_cards'
        ];

        arrayFields.forEach(field => {
            if (!Array.isArray(this.state[field])) {
                console.warn(`[State] Invalid ${field}, resetting to []`);
                this.state[field] = [];
            }
        });

        // 同步 total_discovered 与 discovered_cards.length
        if (this.state.total_discovered !== this.state.discovered_cards.length) {
            console.warn(`[State] Fixing total_discovered: ${this.state.total_discovered} → ${this.state.discovered_cards.length}`);
            this.state.total_discovered = this.state.discovered_cards.length;
        }

        // 验证 delete_stage
        const validStages = ['inactive', 'stage1', 'stage2'];
        if (!validStages.includes(this.state.delete_stage)) {
            console.warn(`[State] Invalid delete_stage: ${this.state.delete_stage}, resetting to 'inactive'`);
            this.state.delete_stage = 'inactive';
        }

        // 确保 notes 是对象
        if (typeof this.state.notes !== 'object' || this.state.notes === null) {
            console.warn('[State] Invalid notes, resetting to {}');
            this.state.notes = {};
        }
    }

    /**
     * 备份损坏的存档
     * @param {string} data - 损坏的存档数据
     */
    backupCorruptedSave(data) {
        const backupKey = `gameState_corrupted_${Date.now()}`;
        try {
            localStorage.setItem(backupKey, data);
            console.log(`[State] Corrupted save backed up to: ${backupKey}`);
        } catch (e) {
            console.error('[State] Failed to backup corrupted save');
        }
        localStorage.removeItem('gameState');
        localStorage.removeItem('saveTime');
    }

    /**
     * 清除保存的状态
     */
    clearSavedState() {
        localStorage.removeItem('gameState');
        localStorage.removeItem('saveTime');
    }

    /**
     * 导出状态为JSON字符串（用于存档功能）
     */
    exportState() {
        return JSON.stringify({
            state: this.state,
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        }, null, 2);
    }

    /**
     * 导入状态从JSON字符串（用于读档功能）
     * @param {string} stateJSON - 状态JSON字符串
     */
    importState(stateJSON) {
        try {
            const imported = JSON.parse(stateJSON);
            if (imported.state) {
                this.state = imported.state;
                this.saveState();
                return true;
            }
        } catch (error) {
            console.error('Failed to import state:', error);
        }
        return false;
    }

    /**
     * 获取游戏进度统计
     */
    getProgress() {
        return {
            discovered: this.state.discovered_cards.length,
            unlocked: this.state.unlocked_cards.length,
            read: this.state.read_cards.length,
            clues: this.state.discovered_clues.length,
            usedClues: this.state.used_clues.length,
            totalDiscovered: this.state.total_discovered
        };
    }

    /**
     * 解锁指令
     * @param {string|Array} commands - 指令或指令数组
     */
    unlockCommands(commands) {
        const commandArray = Array.isArray(commands) ? commands : [commands];
        let addedCount = 0;

        commandArray.forEach(cmd => {
            if (!this.state.unlocked_commands.includes(cmd)) {
                this.state.unlocked_commands.push(cmd);
                addedCount++;
                console.log(`[Command Unlock] Unlocked: ${cmd}`);
            }
        });

        if (addedCount > 0) {
            this.saveState();
        }
        return addedCount;
    }

    /**
     * 检查指令是否已解锁
     * @param {string} command - 指令名称
     * @returns {boolean}
     */
    isCommandUnlocked(command) {
        return this.state.unlocked_commands.includes(command);
    }

    /**
     * 获取所有已解锁的指令
     * @returns {Array}
     */
    getUnlockedCommands() {
        return [...this.state.unlocked_commands];
    }

    /**
     * 标记问答卡片的预览已显示
     * @param {string} cardId - 卡片ID
     */
    addPreviewShown(cardId) {
        if (!this.state.preview_shown_cards.includes(cardId)) {
            this.state.preview_shown_cards.push(cardId);
            this.saveState();
            console.log(`[State] Preview shown marked for card: ${cardId}`);
        }
    }

    /**
     * 检查问答卡片的预览是否已显示
     * @param {string} cardId - 卡片ID
     * @returns {boolean}
     */
    isPreviewShown(cardId) {
        return this.state.preview_shown_cards.includes(cardId);
    }

    /**
     * 设置Delete系统阶段
     * @param {string} stage - 阶段: inactive/stage1/stage2
     */
    setDeleteStage(stage) {
        const validStages = ['inactive', 'stage1', 'stage2'];
        if (validStages.includes(stage)) {
            this.state.delete_stage = stage;
            this.saveState();
            return true;
        }
        return false;
    }

    /**
     * 获取Delete系统阶段
     * @returns {string}
     */
    getDeleteStage() {
        return this.state.delete_stage;
    }

    /**
     * 设置待确认操作
     * @param {Object} confirmation - 确认对象: {type, data}
     */
    setPendingConfirmation(confirmation) {
        this.state.pending_confirmation = confirmation;
        // 不保存到localStorage，这是临时状态
    }

    /**
     * 获取待确认操作
     * @returns {Object|null}
     */
    getPendingConfirmation() {
        return this.state.pending_confirmation;
    }

    /**
     * 清除待确认操作
     */
    clearPendingConfirmation() {
        this.state.pending_confirmation = null;
    }

    /**
     * 设置删除动画1已完成
     */
    setDeletion1Completed() {
        this.state.deletion1_completed = true;
        this.saveState();
    }

    /**
     * 设置删除动画2已完成
     */
    setDeletion2Completed() {
        this.state.deletion2_completed = true;
        this.saveState();
    }

    /**
     * 检查删除动画1是否已完成
     * @returns {boolean}
     */
    isDeletion1Completed() {
        return this.state.deletion1_completed;
    }

    /**
     * 检查删除动画2是否已完成
     * @returns {boolean}
     */
    isDeletion2Completed() {
        return this.state.deletion2_completed;
    }

    /**
     * 设置当前BGM
     * @param {string} bgmId - BGM名称，如 'Atmosphere', '1Mo', 'Delete'
     */
    setCurrentBGM(bgmId) {
        if (this.state.current_bgm !== bgmId) {
            this.state.current_bgm = bgmId;
            this.saveState();
            console.log(`[State] BGM saved: ${bgmId}`);
        }
    }

    /**
     * 获取当前BGM
     * @returns {string}
     */
    getCurrentBGM() {
        return this.state.current_bgm || 'Atmosphere';
    }
}

// 导出给其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameState;
}