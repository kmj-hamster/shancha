/**
 * 主应用程序 - 集成数据层和UI
 */

// 全局变量
let gameState = null;
let cardManager = null;
let searchEngine = null;
let unlockManager = null;
let renderer = null;  // 新增渲染引擎
let readingLockManager = null;  // 阅读锁定管理器
let currentCard = null;
let scrambleEffect = null;  // 乱码特效
let memoryDecay = null;     // 记忆消失特效
// 🔧 已移除 previewShownCards，改用 gameState.preview_shown_cards 持久化
const disabledTabs = new Set();  // 永久禁用的 tab 列表

// 手机横屏检测（与 CSS 媒体查询保持一致）
function isMobileLandscape() {
    return window.matchMedia(
        '(max-height: 600px) and (orientation: landscape), ' +
        '(min-aspect-ratio: 2/1) and (max-height: 1200px) and (orientation: landscape)'
    ).matches;
}

// 平台检测函数
function isAndroid() {
    return /Android/i.test(navigator.userAgent);
}

function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isSafari() {
    return /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);
}

// 检测当前 display mode
function getDisplayMode() {
    const modes = ['fullscreen', 'standalone', 'minimal-ui', 'browser'];
    for (const mode of modes) {
        if (window.matchMedia(`(display-mode: ${mode})`).matches) {
            return mode;
        }
    }
    // iOS Safari 特殊检测
    if (window.navigator.standalone === true) return 'standalone';
    return 'browser';
}

// 检测是否已安装为 PWA（任何非浏览器模式）
function isPWA() {
    return getDisplayMode() !== 'browser';
}

// 检测是否已处于全屏
function isFullscreen() {
    return getDisplayMode() === 'fullscreen'
        || document.fullscreenElement
        || document.webkitFullscreenElement;
}

// 检测 Android 浏览器类型
function detectAndroidBrowser() {
    const ua = navigator.userAgent;
    if (/MiuiBrowser/i.test(ua)) return 'miui';
    if (/SamsungBrowser/i.test(ua)) return 'samsung';
    if (/HuaweiBrowser/i.test(ua)) return 'huawei';
    if (/Edg/i.test(ua)) return 'edge';
    if (/Chrome/i.test(ua)) return 'chrome';
    return 'other';
}

// 安卓端请求全屏（改进版 - PWA 模式下也尝试）
function requestFullscreenOnAndroid() {
    if (!isAndroid()) return;
    if (isFullscreen()) return;  // 已全屏则跳过

    const elem = document.documentElement;
    const requestFS = elem.requestFullscreen || elem.webkitRequestFullscreen;

    if (requestFS) {
        requestFS.call(elem, { navigationUI: 'hide' }).catch(err => {
            console.log('[Fullscreen] Request denied:', err);
        });
    }
}

// 页面加载时检测平台并添加 class
function detectPlatform() {
    const body = document.body;

    if (isIOS()) {
        body.classList.add('is-ios');
    } else if (isAndroid()) {
        body.classList.add('is-android');
        body.classList.add(`browser-${detectAndroidBrowser()}`);
    }

    // 检测 PWA 模式
    if (isPWA()) {
        body.classList.add('is-pwa');
    }

    // 添加 display mode class
    body.classList.add(`display-mode-${getDisplayMode()}`);
}

// 导出到全局
window.isAndroid = isAndroid;
window.isIOS = isIOS;
window.isPWA = isPWA;
window.isFullscreen = isFullscreen;
window.getDisplayMode = getDisplayMode;
window.detectAndroidBrowser = detectAndroidBrowser;
window.requestFullscreenOnAndroid = requestFullscreenOnAndroid;
window.detectPlatform = detectPlatform;

// 模式状态管理
let currentMode = 'search';  // 当前模式: 'search' | 'sort' | 'delete'
let inputLocked = false;     // 输入锁定状态（排序/删除成功后 2s）
let confirmationLocked = false;  // 确认阶段锁定（ARE YOU SURE / ENTER NAME 期间）

// 指令解锁映射表：卡片ID -> 解锁的指令列表
const COMMAND_UNLOCK_MAP = {
    'file_011': ['clue'],                    // 阅读完#Memory后解锁clue搜索
    'file_013': ['/sort', '/sort time'],    // 阅读完#Sort后解锁/sort和/sort time
    'file_014': ['/sort year'],             // 阅读完#Sort-2后解锁/sort year
    'file_015': ['/delete index'],          // 阅读完#Delete后解锁/delete index
    'file_016': ['/delete word']            // 阅读完#Delete-2后解锁/delete word
};

// 指令提示文本映射
const COMMAND_HINTS = {
    'clue': 'Type the clue as shown into the terminal, then press Enter.',
    '/sort': 'Sort by document number.',
    '/sort time': 'Sort by time (8am-11pm).',
    '/sort year': 'Sort by year. Sort by time within one year.',
    '/delete index': 'For example, enter /delete 1 to delete memory 1-8am-coffee',
    '/delete word': 'Word is not from the clue list.'
};

// 🌐 语言本地化支持（延迟初始化，在initApp中设置）
let currentLang = 'en';
let TEXT = {};

// 指令提示文本（中文版）
const COMMAND_HINTS_ZH = {
    'clue': '在终端中输入显示的线索词，然后按回车。',
    '/sort': '按文档编号排序。',
    '/sort time': '按时间排序 (8am-11pm)。',
    '/sort year': '按年份排序。同年内按时间排序。',
    '/delete index': '例如，输入 /delete 1 删除记忆 1-8am-coffee',
    '/delete word': '该词不在线索列表中。'
};

/**
 * 初始化本地化文本（在initApp中调用）
 */
function initLocalization() {
    currentLang = localStorage.getItem('gameLang') || 'en';

    // 根据语言设置body类名，用于CSS字体大小切换
    document.body.classList.remove('lang-zh', 'lang-en');
    document.body.classList.add(`lang-${currentLang}`);

    TEXT = {
        // 错误消息
        errorLoadData: currentLang === 'zh' ? '错误：游戏数据加载失败' : 'Error: Failed to load game data',
        invalidInputSearch: currentLang === 'zh' ? '无效输入。点击搜索进行搜索。' : 'Invalid input. Click SEARCH to search.',
        invalidInputNumber: currentLang === 'zh' ? '无效输入。请输入数字。' : 'Invalid input. Type a NUMBER.',
        unknownCommand: currentLang === 'zh' ? '未知指令' : 'Unknown command',
        cardLocked: currentLang === 'zh' ? '检测到心理防御机制：此记忆暂时无法解析。' : 'Defense mechanism detected: Memory temporarily inaccessible.',
        deleteNotAvailable: currentLang === 'zh' ? '删除不可用' : 'Delete not available',
        operationCancelled: currentLang === 'zh' ? '操作已取消' : 'Operation cancelled',
        operationCompleted: currentLang === 'zh' ? '操作已完成' : 'Operation already completed',

        // 成功消息
        progressSaved: currentLang === 'zh' ? '进度已保存。' : 'Progress saved.',
        sortComplete: currentLang === 'zh' ? '排序完成！' : 'Sort complete!',
        gameSaved: currentLang === 'zh' ? '游戏保存成功！' : 'Game saved successfully!',
        gameLoaded: currentLang === 'zh' ? '游戏加载成功！' : 'Game loaded successfully!',
        hiddenMemoryUnlocked: currentLang === 'zh' ? '隐藏记忆浮现：91l-8m-obodp' : 'Hidden memory surfaced: 91l-8m-obodp',

        // 其他消息
        saveFailed: currentLang === 'zh' ? '保存失败' : 'Failed to save game',
        noSaveFound: currentLang === 'zh' ? '未找到存档' : 'No save file found',
        yearDisplayOn: currentLang === 'zh' ? '年份显示：开' : 'Year display: ON',
        yearDisplayOff: currentLang === 'zh' ? '年份显示：关' : 'Year display: OFF',

        // Sort 模式提示
        sortPromptTime: currentLang === 'zh' ? '> 输入 TIME 按时间排序，点击[排序]执行' : '> Type TIME to sort memories by time. Click [SORT] to execute',
        sortPromptYear: currentLang === 'zh' ? '> 输入 YEAR 按年份排序，点击[排序]执行' : '> Type YEAR to sort memories by year. Click [SORT] to execute',
        systemSortComplete: currentLang === 'zh' ? '> 系统：排序完成！' : '> SYSTEM: Sort complete!',
        systemDetected1945: currentLang === 'zh'
            ? '> 系统：检测到21条1945年记忆...'
            : '> SYSTEM: Detected 21 memories from 1945...',

        // Delete 模式提示
        deletePromptWord: currentLang === 'zh' ? '> 输入要删除的词（非线索词），点击[删除]执行' : '> Type a WORD to delete (not from clue list). Click [DELETE] to execute',
        deletePromptNumber: currentLang === 'zh' ? '> 输入编号以删除对应记忆，点击[删除]执行' : '> Type a NUMBER to delete memory by ID. Click [DELETE] to execute',
        deleteExample: currentLang === 'zh'
            ? '例如，输入 /delete 1 删除记忆 1-8am-coffee'
            : 'For example, enter /delete 1 to delete memory 1-8am-coffee',

        // 确认对话
        areYouSure: currentLang === 'zh' ? '确定吗？' : 'ARE YOU SURE?',
        yesNo: '(yes / no)',
        enterYourName: currentLang === 'zh' ? '输入你的名字:' : 'ENTER YOUR NAME:',

        // 排序结果
        sortedBy: currentLang === 'zh' ? '已按{type}排序' : 'Sorted by {type}',

        // 其他
        notThisOne: currentLang === 'zh' ? '不是这个。\n 输入需为 1 到 25 之间的数字。' : 'Not this one.\nIt is a number between 1 and 25.',
        notThisOneClose: currentLang === 'zh' ? '不是这个。\n接近了。' : 'Not this one.\nThis number is between 1 and 25.',
        notThisOneHint: currentLang === 'zh' ? '不是这个。\n 在 1 到 25 之间。' : 'Not this one.\nThis number is between 1 and 25.',
        notThisOneCourage: currentLang === 'zh'
            ? '不是这个。\n写给自己：你有勇气做出这个选择吗？'
            : 'Not this one.\nTo myself: Do you have the courage to make this choice?',
        notThisOneHurt: currentLang === 'zh'
            ? '不是这个。\n写给自己：我知道这一定很痛苦。'
            : 'Not this one.\nTo myself: I know this must hurt.',
        incorrect: currentLang === 'zh' ? '答案错误。请重试。' : 'Incorrect. Try again.',
        pleaseEnterName: currentLang === 'zh' ? '请输入你的名字' : 'Please enter your name',

        // Search 模式提示
        pressEnterToSearch: currentLang === 'zh' ? '输入回车键执行搜索' : 'Press Enter to search',
        tapButtonToSearch: currentLang === 'zh' ? '点击下方按键进行[搜索]' : 'Tap [SEARCH] button below',

        // Scramble 相关
        scrambleNotInit: currentLang === 'zh' ? '乱码特效未初始化' : 'Scramble effect not initialized',
        decayNotInit: currentLang === 'zh' ? '记忆消失特效未初始化' : 'Memory decay effect not initialized',
        decayStarted: currentLang === 'zh' ? '记忆消失已启动 - 20秒后完全消失' : 'Memory decay started - 20s until complete vanish',
        decayStopped: currentLang === 'zh' ? '记忆消失已停止' : 'Memory decay stopped',
        memoryRestored: currentLang === 'zh' ? '记忆已恢复' : 'Memory restored',
        decayNotActive: currentLang === 'zh' ? '记忆消失未激活' : 'Memory decay is not active',
        scrambleEnabled: currentLang === 'zh' ? '乱码特效已启用' : 'Scramble effect enabled',
        scrambleDisabled: currentLang === 'zh' ? '乱码特效已禁用' : 'Scramble effect disabled',

        // 动画相关
        animNotAvailable: currentLang === 'zh' ? '动画系统不可用' : 'Animation system not available',
        initDeletion: currentLang === 'zh' ? '正在启动强制删除序列...' : 'Initiating forced deletion sequence...',
        deletionInProgress: currentLang === 'zh' ? '记忆删除进行中...' : 'Memory deletion in progress...',

        // 重置确认弹窗
        resetWarning: currentLang === 'zh'
            ? '警告：确定后将重置游戏全部进度，\n返回语言选择界面。\n被清除的存档无法找回。'
            : 'WARNING: This will reset all game progress\nand return to language selection.\nDeleted saves cannot be recovered.',
        resetConfirm: currentLang === 'zh' ? '[确定]' : '[CONFIRM]',
        resetCancel: currentLang === 'zh' ? '[取消]' : '[CANCEL]'
    };
}

/**
 * 获取本地化的指令提示
 */
function getCommandHint(command) {
    if (currentLang === 'zh') {
        return COMMAND_HINTS_ZH[command] || COMMAND_HINTS[command] || '';
    }
    return COMMAND_HINTS[command] || '';
}

/**
 * 初始化UI文本（根据语言设置）
 */
function initUIText() {
    if (currentLang !== 'zh') return;

    // Tab 标签
    const memoryTab = document.querySelector('[data-type="memory"]');
    const fileTab = document.querySelector('[data-type="file"]');
    const clueTab = document.querySelector('[data-type="clue"]');
    if (memoryTab) memoryTab.childNodes[0].textContent = '[记忆]';
    if (fileTab) fileTab.childNodes[0].textContent = '[档案]';
    if (clueTab) clueTab.childNodes[0].textContent = '[线索]';

    // 终端提示符
    const prompt = document.querySelector('.prompt');
    if (prompt) prompt.textContent = '珂赛特@终端:~$';

    // 功能按钮
    const searchBtn = document.querySelector('[data-mode="search"]');
    const resetBtn = document.querySelector('[data-mode="reset"]');
    const sortBtn = document.querySelector('[data-mode="sort"]');
    const deleteBtn = document.querySelector('[data-mode="delete"]');
    if (searchBtn) searchBtn.textContent = '[搜索]';
    if (resetBtn) resetBtn.textContent = '[重置]';
    if (sortBtn) sortBtn.textContent = '[排序]';
    if (deleteBtn) deleteBtn.textContent = '[删除]';

    // 统计信息
    const statsLabel = document.querySelector('.statistics p');
    if (statsLabel) {
        const statNumber = statsLabel.querySelector('.stat-number');
        if (statNumber) {
            statsLabel.innerHTML = '已发现: <span class="stat-number">' + statNumber.textContent + '</span>';
        }
    }

    console.log('[i18n] UI text initialized for Chinese');
}

// 🎵 卡片BGM映射表：卡片ID -> BGM文件名
const CARD_BGM_MAP = {
    'mem_003': 'Memory',        // 初次点击mem_003时播放Memory
    'mem_023': 'Atmosphere',    // 初次点击mem_023时切换到Atmosphere
    'file_018': 'Dream',        // 点击file_018时切换到Dream
    'file_015': 'Atmosphere',   // 点击file_015时切换到Atmosphere
    'mem_025': 'Dream',         // 点击mem_025时切换到Dream
    'mem_012': 'Mozart.ogg',    // 初次点击mem_012时播放Mozart
    'mem_015': 'Wagner.ogg',    // 初次点击mem_015时播放Wagner
    'mem_009': 'Memory'         // 初次阅读mem_009时切换回Memory
};

// 🎵 仅首次触发BGM的卡片列表
const FIRST_TIME_ONLY_BGM = ['mem_003', 'mem_012', 'mem_015', 'mem_009', 'mem_023'];

/**
 * 同步gameState到cardManager
 * 用于从localStorage加载存档后，将状态应用到卡片对象
 */
function syncStateToCardManager() {
    const state = gameState.getState();
    console.log('[Sync] Starting state synchronization...');

    // 1. 同步 discovered 状态
    let discoveredCount = 0;
    state.discovered_cards.forEach(cardId => {
        const card = cardManager.getCardById(cardId);
        if (card) {
            cardManager.updateCardDiscoveredStatus(cardId, true);
            discoveredCount++;
        } else {
            console.warn(`[Sync] Card not found in data: ${cardId}`);
        }
    });
    console.log(`[Sync] ${discoveredCount} discovered cards synced`);

    // 2. 同步解锁状态（根据卡片类型分别处理）
    let unlockedCount = 0, partialCount = 0, lockedCount = 0, fixedCount = 0;

    state.discovered_cards.forEach(cardId => {
        const card = cardManager.getCardById(cardId);
        if (!card) return;

        const isUnlocked = state.unlocked_cards.includes(cardId);

        if (isUnlocked) {
            // 已解锁
            cardManager.updateCardStatus(cardId, 'unlocked');
            unlockedCount++;
        } else {
            // 未解锁，根据类型设置状态
            switch (card.unlock_type) {
                case 'question':
                    // 问答类型：设置为 partial（可以查看预览，需要回答问题）
                    cardManager.updateCardStatus(cardId, 'partial');
                    partialCount++;
                    break;
                case 'count':
                    // 数量解锁类型：保持 locked，等待 checkAllCountUnlocks 处理
                    cardManager.updateCardStatus(cardId, 'locked');
                    lockedCount++;
                    break;
                case 'direct':
                default:
                    // direct 类型应该在发现时就解锁，这里是数据不一致，自动修复
                    console.warn(`[Sync] Direct card ${cardId} not in unlocked_cards, fixing...`);
                    cardManager.updateCardStatus(cardId, 'unlocked');
                    gameState.unlockCard(cardId);
                    fixedCount++;
                    break;
            }
        }
    });
    console.log(`[Sync] Status: ${unlockedCount} unlocked, ${partialCount} partial, ${lockedCount} locked, ${fixedCount} fixed`);

    // 3. 同步 read 状态
    let readCount = 0;
    state.read_cards.forEach(cardId => {
        const card = cardManager.getCardById(cardId);
        if (card) {
            cardManager.updateCardReadStatus(cardId, true);
            readCount++;
        }
    });
    console.log(`[Sync] ${readCount} read cards synced`);

    // 4. 检查 count 类型解锁条件（可能进度已满足）
    if (unlockManager) {
        const newlyUnlocked = unlockManager.checkAllCountUnlocks();
        if (newlyUnlocked.length > 0) {
            console.log(`[Sync] ${newlyUnlocked.length} count-unlock cards newly unlocked:`, newlyUnlocked);
        }
    }

    console.log('[Sync] Synchronization complete');
}

/**
 * 初始化应用
 */
async function initApp() {
    console.log('🚀 Initializing Burning Memory...');

    // 🌐 首先初始化语言设置（必须在其他初始化之前）
    initLocalization();

    // 初始化游戏状态管理器
    gameState = new GameState();
    window.gameState = gameState;  // 暴露到全局，供render.js检查clue使用状态

    // 初始化卡片管理器
    cardManager = new CardManager();

    // 初始化搜索引擎
    searchEngine = new SearchEngine(cardManager, gameState);

    // 初始化解锁管理器
    unlockManager = new UnlockManager(cardManager, gameState);

    // 初始化渲染引擎
    renderer = new Renderer();
    window.renderer = renderer;  // 暴露到全局，供LineByLineController使用

    // 初始化阅读锁定管理器
    if (typeof ReadingLockManager !== 'undefined') {
        readingLockManager = new ReadingLockManager(gameState);
    }

    // 初始化乱码特效
    if (typeof initScrambleEffect !== 'undefined') {
        scrambleEffect = initScrambleEffect();
    }

    // 初始化记忆消失特效
    if (typeof initMemoryDecay !== 'undefined' && scrambleEffect) {
        memoryDecay = initMemoryDecay(scrambleEffect);
    }

    // 加载卡片数据
    const loaded = await cardManager.loadCards('./data/cards.json');

    if (!loaded) {
        console.error('[ERROR] Failed to load card data!');
        showFeedback(TEXT.errorLoadData, 'error');
        return;
    }

    // 尝试从localStorage加载游戏状态
    const hasState = gameState.loadState();

    if (hasState) {
        // ========== 存档恢复流程 ==========
        // 同步 gameState 到 cardManager
        syncStateToCardManager();

        // 【重要】存档恢复时不调用 initializeDirectUnlockFiles()
        // 因为直接解锁的文件应该已在 discovered_cards 中

        // 如果已阅读过README，直接启动心电图
        if (gameState.isCardRead('file_010') && window.ecgController) {
            window._ecgStarted = true;
            window.ecgController.start();
            console.log('[ECG] Started immediately (README already read)');
        }

    } else {
        // ========== 新游戏流程 ==========
        // 添加初始线索词
        const initialClues = cardManager.getInitialClues();
        gameState.addClues(initialClues);

        // 初始化直接解锁的 file（仅新游戏需要）
        unlockManager.initializeDirectUnlockFiles();
    }

    // 初始化UI
    initializeUI();

    // 🌐 初始化UI文本（根据语言设置）
    initUIText();

    // 刷新界面显示
    refreshUI();

    // 🔧 清空硬编码的content区域（无论是否有current_card）
    // 让用户从干净的界面开始，自己点击文件列表查看内容
    const textContent = document.querySelector('.text-content');
    const titleBar = document.querySelector('.title-bar');
    const feedbackText = document.querySelector('.feedback-text');

    if (textContent) {
        textContent.innerHTML = '';
    }
    if (titleBar) {
        const fileName = titleBar.querySelector('.card-filename');
        const timestamp = titleBar.querySelector('.card-timestamp');
        const yearDisplay = titleBar.querySelector('.card-year');
        if (fileName) fileName.textContent = '';
        if (timestamp) timestamp.style.display = 'none';
        if (yearDisplay) yearDisplay.style.display = 'none';
        // 初始隐藏分割线
        titleBar.classList.remove('has-content');
    }
    if (feedbackText) {
        feedbackText.textContent = '';
    }

    // 🔧 重置current_card状态，让用户重新选择要查看的内容
    gameState.setCurrentCard(null);

    console.log('✅ Game initialized successfully!');
}

/**
 * 初始化UI事件监听
 */
function initializeUI() {
    // 命令输入处理
    const commandInput = document.querySelector('.command-input');
    if (commandInput) {
        commandInput.addEventListener('keypress', handleCommandInput);
    }

    // Tab切换处理
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', handleTabSwitch);
    });

    // 文件列表点击处理
    const fileList = document.querySelector('.file-list');
    if (fileList) {
        fileList.addEventListener('click', handleFileClick);
    }

    // 状态按钮处理（P4.6）
    initFunctionBar();

    // 光标跟随处理（P4 修复）
    initCursorFollow();
}

/**
 * 初始化光标跟随功能（P4 修复）
 * 让方块光标紧跟输入文字，并管理焦点状态
 */
function initCursorFollow() {
    const input = document.querySelector('.command-input');
    const inputLine = document.querySelector('.input-line');
    const inputArea = document.querySelector('.input-area');
    if (!input) return;

    // 创建隐藏的测量元素
    const measureSpan = document.createElement('span');
    measureSpan.style.cssText = `
        position: absolute;
        visibility: hidden;
        white-space: pre;
        font-family: 'VT323', monospace;
        font-size: 22px;
    `;
    document.body.appendChild(measureSpan);

    // 更新输入框宽度
    function updateInputWidth() {
        const text = input.value || '';
        measureSpan.textContent = text || '';
        // 设置 input 宽度为文字宽度 + 余量（为 text-shadow 留空间）
        const width = Math.max(measureSpan.offsetWidth, 2) + 12;
        input.style.width = width + 'px';
        // 重置 input 内部滚动位置，防止文字偏移
        input.scrollLeft = 0;
    }

    // 暴露到全局，供其他地方调用
    window.updateCursorPosition = updateInputWidth;

    // 跟踪输入框是否为空的状态（用于search模式提示）
    let wasInputEmpty = true;

    // 监听输入事件
    input.addEventListener('input', () => {
        updateInputWidth();

        // 当terminal从空变为有内容时，在search模式下显示提示
        const currentValue = input.value.trim();
        const isNowEmpty = currentValue.length === 0;

        if (currentMode === 'search' && wasInputEmpty && !isNowEmpty) {
            // 从空 → 有内容，手机端显示不同提示
            const searchHint = isMobileLandscape() ? TEXT.tapButtonToSearch : TEXT.pressEnterToSearch;
            showFeedback(searchHint, 'info');
        }

        wasInputEmpty = isNowEmpty;
    });
    input.addEventListener('change', updateInputWidth);

    // 焦点管理 - 控制光标闪烁
    input.addEventListener('focus', () => {
        updateInputWidth();
        if (inputLine) inputLine.classList.add('cursor-active');
    });

    input.addEventListener('blur', () => {
        if (inputLine) inputLine.classList.remove('cursor-active');
    });

    // 点击 input-area 任意位置都能获得焦点
    if (inputArea) {
        inputArea.addEventListener('click', (e) => {
            // 避免点击按钮时也触发
            if (!e.target.closest('.func-btn')) {
                input.focus();
            }
        });
    }

    // 初始化时清空 input 并更新宽度
    input.value = '';
    updateInputWidth();

    // 默认获得焦点
    input.focus();
}

/**
 * 初始化状态按钮栏（P4.6）
 */
function initFunctionBar() {
    const funcBtns = document.querySelectorAll('.func-btn');
    funcBtns.forEach(btn => {
        btn.addEventListener('click', handleFuncBtnClick);
    });

    // 初始化时更新按钮解锁状态
    updateFunctionBar();
}

/**
 * 处理状态按钮点击（P4.6）
 */
function handleFuncBtnClick(event) {
    // 检查是否处于阅读锁定状态
    if (readingLockManager && readingLockManager.isLocked()) {
        return;
    }

    const btn = event.target;
    const mode = btn.dataset.mode;

    // 忽略锁定的按钮
    if (btn.classList.contains('locked')) {
        return;
    }

    switch (mode) {
        case 'search':
            handleSearchMode();
            break;
        case 'reset':
            handleResetMode();
            break;
        case 'sort':
            handleSortMode();
            break;
        case 'delete':
            handleDeleteMode();
            break;
    }

    // 更新按钮激活状态（RESET 不需要保持激活）
    if (mode !== 'reset') {
        setActiveFuncBtn(mode);
    }
}

/**
 * 设置激活的状态按钮
 */
function setActiveFuncBtn(mode) {
    document.querySelectorAll('.func-btn').forEach(btn => {
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

/**
 * 切换交互模式
 * @param {string} mode - 'search' | 'sort' | 'delete'
 */
function switchMode(mode) {
    currentMode = mode;

    // 1. 切换主题类
    document.body.classList.remove('theme-search', 'theme-sort', 'theme-delete');
    document.body.classList.add(`theme-${mode}`);

    // 2. 更新按钮高亮
    setActiveFuncBtn(mode);

    // 3. 更新 system-output 提示
    if (mode === 'delete') {
        updateDeleteModePrompt();
    } else {
        updateModePrompt(mode);
    }

    console.log(`[Mode] Switched to ${mode} mode`);
}

/**
 * 更新 system-output 区域的模式提示
 * @param {string} mode - 'search' | 'sort'
 */
function updateModePrompt(mode) {
    const container = document.querySelector('.system-output');
    if (!container) return;

    const lines = container.querySelectorAll('.output-line');

    if (mode === 'sort') {
        const hasYearUnlocked = gameState.isCommandUnlocked('/sort year');

        if (isMobileLandscape()) {
            // 手机端只显示一行，显示最新解锁的功能
            const prompt = hasYearUnlocked ? TEXT.sortPromptYear : TEXT.sortPromptTime;
            lines[0].textContent = '';
            lines[1].textContent = prompt;
        } else {
            // 桌面端显示两行
            lines[0].textContent = TEXT.sortPromptTime;
            lines[1].textContent = hasYearUnlocked ? TEXT.sortPromptYear : '';
        }

        // 重置颜色（使用模式主色）
        lines.forEach(line => line.style.color = '');
    } else if (mode === 'search') {
        // 清空提示
        lines[0].textContent = '';
        lines[1].textContent = '';
    }

    // 清空 systemOutputLines 队列以保持同步
    systemOutputLines.length = 0;
}

/**
 * 更新 DELETE 模式的 system-output 提示
 */
function updateDeleteModePrompt() {
    const container = document.querySelector('.system-output');
    if (!container) return;

    const lines = container.querySelectorAll('.output-line');
    const hasWordUnlocked = gameState.isCommandUnlocked('/delete word');

    // 显示最新解锁的功能提示
    const prompt = hasWordUnlocked ? TEXT.deletePromptWord : TEXT.deletePromptNumber;

    if (isMobileLandscape()) {
        // 手机端只显示一行（lines[1]可见）
        lines[0].textContent = '';
        lines[1].textContent = prompt;
    } else {
        // 桌面端正常显示
        lines[0].textContent = prompt;
        lines[1].textContent = '';
    }

    // 重置颜色（使用模式主色）
    lines.forEach(line => line.style.color = '');

    // 清空队列
    systemOutputLines.length = 0;
}

/**
 * 显示确认提示（放大高亮）
 * @param {string} type - 'are_you_sure' | 'enter_name'
 */
function showConfirmPrompt(type) {
    const container = document.querySelector('.system-output');
    if (!container) return;

    const lines = container.querySelectorAll('.output-line');
    const isMobile = isMobileLandscape();

    if (type === 'are_you_sure') {
        if (isMobile) {
            // 手机端：合并成一行显示在 lines[1]
            lines[0].textContent = '';
            lines[1].textContent = `${TEXT.areYouSure} ${TEXT.yesNo}`;
        } else {
            // PC端：分两行显示
            lines[0].textContent = TEXT.areYouSure;
            lines[1].textContent = TEXT.yesNo;
        }
    } else if (type === 'enter_name') {
        if (isMobile) {
            // 手机端：显示在 lines[1]
            lines[0].textContent = '';
            lines[1].textContent = TEXT.enterYourName;
        } else {
            // PC端：显示在 lines[0]
            lines[0].textContent = TEXT.enterYourName;
            lines[1].textContent = '';
        }
    }

    // 添加高亮类
    lines.forEach(line => {
        line.classList.add('confirm-highlight');
        line.style.color = '';  // 使用主题色
    });

    // 锁定模式切换
    confirmationLocked = true;

    systemOutputLines.length = 0;
}

/**
 * 清除确认提示高亮
 */
function clearConfirmPrompt() {
    const container = document.querySelector('.system-output');
    if (!container) return;

    const lines = container.querySelectorAll('.output-line');
    lines.forEach(line => {
        line.classList.remove('confirm-highlight');
    });

    // 解除模式切换锁定
    confirmationLocked = false;
}

/**
 * 切换回 SEARCH 模式
 */
function switchToSearchMode() {
    // ECG联动：返回SEARCH模式时恢复正常（瞬间变色，重置速度和幅度）
    if (window.ecgController) {
        window.ecgController.setMode('normal');
        window.ecgController.setSpeed(1);
        window.ecgController.setAmplitude(0.8);
    }

    switchMode('search');
    document.querySelector('.command-input')?.focus();
}

/**
 * SEARCH 模式处理
 * 已在该模式时，点击按钮等同于回车提交
 */
function handleSearchMode() {
    if (confirmationLocked) return;  // 确认阶段禁止切换

    // 已在 SEARCH 模式：点击按钮等同于回车提交
    if (currentMode === 'search') {
        if (inputLocked) return;
        const input = document.querySelector('.command-input');
        const command = input?.value.trim();
        if (command) {
            input.value = '';
            if (window.updateCursorPosition) window.updateCursorPosition();
            processCommand(command);
        }
        return;
    }

    switchToSearchMode();  // 统一使用switchToSearchMode，确保ECG正确重置
}

/**
 * RESET 模式处理 - 显示重置确认弹窗
 */
function handleResetMode() {
    showResetModal();
}

/**
 * 显示重置确认弹窗
 */
function showResetModal() {
    const modal = document.getElementById('resetModal');
    const warningText = document.getElementById('resetWarningText');
    const confirmBtn = document.getElementById('resetConfirmBtn');
    const cancelBtn = document.getElementById('resetCancelBtn');

    if (!modal || !warningText) {
        console.error('[Reset] Modal elements not found');
        return;
    }

    // 设置文本（根据当前语言）
    warningText.textContent = TEXT.resetWarning;
    confirmBtn.textContent = TEXT.resetConfirm;
    cancelBtn.textContent = TEXT.resetCancel;

    // 显示弹窗
    modal.classList.add('active');

    // 绑定事件（使用一次性事件避免重复绑定）
    const handleConfirm = () => {
        executeReset();
        hideResetModal();
        confirmBtn.removeEventListener('click', handleConfirm);
    };

    const handleCancel = () => {
        hideResetModal();
        cancelBtn.removeEventListener('click', handleCancel);
    };

    // 点击遮罩层关闭
    const handleOverlayClick = (e) => {
        if (e.target === modal) {
            hideResetModal();
            modal.removeEventListener('click', handleOverlayClick);
        }
    };

    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);
    modal.addEventListener('click', handleOverlayClick);
}

/**
 * 隐藏重置确认弹窗
 */
function hideResetModal() {
    const modal = document.getElementById('resetModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * 执行重置操作
 */
function executeReset() {
    console.log('[Reset] Executing game reset...');

    // 1. 停止背景音乐
    if (window.audioManager) {
        audioManager.stopMusic(300);
    }

    // 2. 清除所有游戏相关localStorage
    localStorage.removeItem('gameState');
    localStorage.removeItem('saveTime');
    localStorage.removeItem('gameLang');
    localStorage.removeItem('introAnimationShown');

    console.log('[Reset] localStorage cleared, reloading...');

    // 3. 强制刷新页面（清除缓存）
    // 刷新后 LangSelect.checkSkipCondition() 会返回 skip: false
    // 自动进入首次访问流程，显示语言选择界面
    setTimeout(() => {
        location.reload(true);
    }, 300);
}

/**
 * SORT 模式处理（进入 SORT 模式）
 * 已在该模式时，点击按钮等同于回车提交
 */
function handleSortMode() {
    if (confirmationLocked) return;  // 确认阶段禁止切换

    // 已在 SORT 模式：点击按钮等同于回车提交
    if (currentMode === 'sort') {
        if (inputLocked) return;
        const input = document.querySelector('.command-input');
        const command = input?.value.trim();
        if (command) {
            input.value = '';
            if (window.updateCursorPosition) window.updateCursorPosition();
            processCommand(command);
        }
        return;
    }

    // ECG联动：进入SORT模式变黄
    if (window.ecgController) window.ecgController.setMode('sort');

    switchMode('sort');
    document.querySelector('.command-input')?.focus();
}

/**
 * DELETE 模式处理
 * 已在该模式时，点击按钮等同于回车提交
 */
function handleDeleteMode() {
    // 已在 DELETE 模式：点击按钮等同于回车提交
    if (currentMode === 'delete') {
        if (inputLocked) return;
        const input = document.querySelector('.command-input');
        const command = input?.value.trim();
        if (command) {
            input.value = '';
            if (window.updateCursorPosition) window.updateCursorPosition();
            processCommand(command);
        }
        return;
    }

    if (confirmationLocked) return;  // 确认阶段禁止切换模式

    // ECG联动：进入DELETE模式变红+加速+起伏大
    if (window.ecgController) {
        window.ecgController.setMode('delete');
        window.ecgController.setSpeed(2);
        window.ecgController.setAmplitude(1.0);
    }

    switchMode('delete');
    document.querySelector('.command-input')?.focus();
}

/**
 * 更新状态按钮栏解锁状态
 */
function updateFunctionBar() {
    const unlockedCommands = gameState.getUnlockedCommands();
    const deletion2Completed = gameState.isDeletion2Completed();

    document.querySelectorAll('.func-btn').forEach(btn => {
        const mode = btn.dataset.mode;

        // 删除动画2完成后，隐藏 SORT 和 DELETE 按钮
        if (deletion2Completed && (mode === 'sort' || mode === 'delete')) {
            btn.style.display = 'none';
            return;
        }

        // SORT 和 DELETE 需要解锁
        if (mode === 'sort') {
            if (unlockedCommands.includes('/sort')) {
                btn.classList.remove('locked');
            }
        } else if (mode === 'delete') {
            if (unlockedCommands.includes('/delete index') || unlockedCommands.includes('/delete word')) {
                btn.classList.remove('locked');
            }
        }
    });
}

/**
 * 处理命令输入
 */
function handleCommandInput(event) {
    if (event.key !== 'Enter') return;

    // 检查输入锁定
    if (inputLocked) {
        event.preventDefault();
        return;
    }

    // 检查是否处于阅读锁定状态
    if (readingLockManager && readingLockManager.isLocked()) {
        event.preventDefault();
        event.stopPropagation();
        return;
    }

    const input = event.target;
    const command = input.value.trim();

    if (!command) return;

    // 清空输入框并重置光标位置
    input.value = '';
    if (window.updateCursorPosition) {
        window.updateCursorPosition();
    }

    // 处理命令
    processCommand(command);
}

/**
 * 处理 SORT 模式下的输入
 * @param {string} input - 用户输入
 */
function processSortModeInput(input) {
    const cmd = input.toLowerCase().trim();

    if (cmd === 'time') {
        executeSortAndReturn('time');
    } else if (cmd === 'year') {
        if (gameState.isCommandUnlocked('/sort year')) {
            executeSortAndReturn('year');
        } else {
            showFeedback(TEXT.invalidInputSearch, 'error');
        }
    } else {
        showFeedback(TEXT.invalidInputSearch, 'error');
    }
}

/**
 * 执行排序并在 2 秒后返回 SEARCH 模式
 * @param {string} sortType - 'time' | 'year'
 */
function executeSortAndReturn(sortType) {
    // 复用 handleSort 的核心逻辑
    gameState.setSort(sortType);

    // 如果是年份排序，处理特殊解锁和蓝色标记
    if (sortType === 'year') {
        // 检查是否是第一次使用year排序
        if (!gameState.hasSortYearUsed()) {
            console.log('[Sort Year] First time using year sort, unlocking mem_024');

            if (gameState.discoverCard('mem_024')) {
                console.log('[Sort Year] mem_024 discovered');
            }
            if (gameState.unlockCard('mem_024')) {
                console.log('[Sort Year] mem_024 unlocked');
            }
            cardManager.updateCardStatus('mem_024', 'unlocked');
            gameState.setSortYearUsed();
        }

        // 标记 1995 年卡片为蓝色
        const discoveredCards = gameState.getState().discovered_cards;
        discoveredCards.forEach(cardId => {
            const card = cardManager.getCardById(cardId);
            if (card && card.type === 'memory' && card.year === 1995) {
                gameState.addBlueMarked(cardId);
            }
        });

        gameState.setShowYear(true);
    } else {
        gameState.setShowYear(false);
    }

    refreshFileList();

    // 显示成功消息
    if (sortType === 'year') {
        showSortYearSuccess();
    } else {
        showFeedback(TEXT.sortComplete, 'success');
    }

    // 锁定输入
    inputLocked = true;

    // 2 秒后返回 SEARCH 模式
    setTimeout(() => {
        inputLocked = false;
        switchToSearchMode();
    }, 2000);
}

/**
 * 显示 year 排序成功消息（两行）
 */
function showSortYearSuccess() {
    const container = document.querySelector('.system-output');
    if (!container) return;

    const lines = container.querySelectorAll('.output-line');
    lines[0].textContent = TEXT.systemSortComplete;
    lines[0].style.color = '';  // 使用主题色
    // 第二行消息（中英文）
    const line2 = currentLang === 'zh'
        ? '> 系统：检测到21条1945年记忆，3条1995年记忆'
        : '> SYSTEM: Detected 21 memories from 1945, 3 memories from 1995';
    lines[1].textContent = line2;
    lines[1].style.color = '';  // 使用主题色

    // 同步队列
    systemOutputLines.length = 0;
    systemOutputLines.push({ text: lines[0].textContent, type: 'success' });
    systemOutputLines.push({ text: lines[1].textContent, type: 'success' });
}

/**
 * 处理 DELETE 模式下的输入
 */
function processDeleteModeInput(input) {
    const deleteStage = gameState.getDeleteStage();
    const pendingConfirmation = gameState.getPendingConfirmation();

    // 处理 yes/no 确认（同时接受 y/n 简写）
    const lowerInput = input.toLowerCase();
    if (lowerInput === 'yes' || lowerInput === 'y' || lowerInput === 'no' || lowerInput === 'n') {
        if (pendingConfirmation) {
            // 将 y/n 转换为 yes/no
            const normalizedInput = (lowerInput === 'y') ? 'yes' : (lowerInput === 'n') ? 'no' : lowerInput;
            handleDeleteCommand(normalizedInput);
            return;
        }
    }

    // 处理姓名输入
    if (pendingConfirmation && pendingConfirmation.type === 'name_input') {
        handleNameInput(input);
        return;
    }

    // Stage 1: 数字输入
    if (deleteStage === 'stage1') {
        processDeleteNumberInput(input);
        return;
    }

    // Stage 2: 单词输入
    if (deleteStage === 'stage2') {
        processDeleteWordInput(input);
        return;
    }

    // 未激活状态
    showFeedback(TEXT.deleteNotAvailable, 'error');
}

/**
 * 处理数字阶段输入
 */
function processDeleteNumberInput(input) {
    const num = parseInt(input.trim());

    if (isNaN(num)) {
        showFeedback(TEXT.invalidInputNumber, 'error');
        return;
    }

    // 复用现有逻辑
    handleDeleteStage1(input.trim());
}

/**
 * 处理单词阶段输入
 */
function processDeleteWordInput(input) {
    // 直接复用现有逻辑（包含正确答案检测和错误提示）
    handleDeleteStage2(input.trim());
}

/**
 * 处理命令
 */
function processCommand(command) {
    // 检查输入锁定
    if (inputLocked) {
        return;
    }

    // 按模式分发
    if (currentMode === 'sort') {
        processSortModeInput(command);
        return;
    }

    if (currentMode === 'delete') {
        processDeleteModeInput(command);
        return;
    }

    // === SEARCH 模式逻辑 ===

    // 检查是否处于name_input等待状态
    const pendingConfirmation = gameState.getPendingConfirmation();
    if (pendingConfirmation && pendingConfirmation.type === 'name_input') {
        handleNameInput(command);
        return;
    }

    // 去掉命令前的 / 前缀（如果有）
    const cmd = command.startsWith('/') ? command.slice(1) : command;

    // 禁用的指令检查
    if (cmd === 'save' || cmd === 'load') {
        showFeedback(TEXT.unknownCommand, 'error');
        return;
    }

    if (cmd.startsWith('scramble')) {
        showFeedback(TEXT.unknownCommand, 'error');
        return;
    }

    if (cmd.startsWith('year')) {
        showFeedback(TEXT.unknownCommand, 'error');
        return;
    }

    // 禁用 /sort 指令（现在只能通过 SORT 模式操作）
    if (cmd.startsWith('sort')) {
        showFeedback(TEXT.unknownCommand, 'error');
        return;
    }

    // 禁用 /delete 指令（现在只能通过 DELETE 模式操作）
    if (cmd.startsWith('delete') || cmd === 'yes' || cmd === 'no' || cmd === 'y' || cmd === 'n') {
        showFeedback(TEXT.unknownCommand, 'error');
        return;
    }

    // 否则作为线索词搜索
    searchByClue(command);
}

/**
 * 通过线索词搜索
 */
function searchByClue(clue) {
    // 清除delete系统的待确认状态
    if (gameState.getPendingConfirmation()) {
        gameState.clearPendingConfirmation();
    }

    // 使用搜索引擎进行搜索
    const result = searchEngine.search(clue);

    // 显示反馈
    if (!result.success) {
        showFeedback(result.message, 'error');
    } else if (result.isDuplicate) {
        showFeedback(result.message, 'info');
    } else {
        showFeedback(result.message, 'success');

        // 根据搜索结果智能切换tab
        // 优先级：有memory则跳转memory，否则跳转file
        let targetTab = 'memory';  // 默认跳转到memory
        if (result.memoryCount > 0) {
            targetTab = 'memory';
        } else if (result.fileCount > 0) {
            targetTab = 'file';
        }
        gameState.setTab(targetTab);
        updateTabUI(targetTab);

        // 检查新解锁的卡片
        const newlyUnlocked = unlockManager.checkAllCountUnlocks();
        if (newlyUnlocked.length > 0) {
            console.log(`Automatically unlocked ${newlyUnlocked.length} cards by count condition`);
            // 触发闪烁效果
            triggerUnlockFlash(newlyUnlocked);
        }
    }

    // 刷新UI
    refreshUI();

    // 搜索后取消 clue 选中
    deselectClue();
}

/**
 * 处理Tab切换
 */
function handleTabSwitch(event) {
    // 检查是否处于阅读锁定状态
    if (readingLockManager && readingLockManager.isLocked()) {
        event.preventDefault();
        event.stopPropagation();
        return;
    }

    const btn = event.target;
    // 优先使用 data-type 属性，如果没有则使用文本内容
    const tabName = btn.getAttribute('data-type') || btn.textContent.toLowerCase();

    // 检查是否被永久禁用
    if (disabledTabs.has(tabName)) {
        event.preventDefault();
        event.stopPropagation();
        return;
    }

    // 检查是否在decay期间点击clue tab
    if (typeof memoryDecay !== 'undefined' && memoryDecay.isActive && tabName === 'clue') {
        event.preventDefault();
        event.stopPropagation();
        return;
    }

    // 清除delete系统的待确认状态
    if (gameState.getPendingConfirmation()) {
        gameState.clearPendingConfirmation();
    }

    // 更新Tab状态
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // 更新游戏状态
    gameState.setTab(tabName);

    // 刷新UI（包括文件列表、统计数字、tab指示器）
    refreshUI();
}

/**
 * 更新Tab UI（用于程序化切换）
 */
function updateTabUI(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-type') === tabName) {
            btn.classList.add('active');
        }
    });
}

/**
 * 处理文件点击
 */
function handleFileClick(event) {
    const fileItem = event.target.closest('.file-item');
    if (!fileItem) return;

    // 检查是否处于阅读锁定状态
    if (readingLockManager && readingLockManager.isLocked()) {
        event.preventDefault();
        event.stopPropagation();
        return;
    }

    // 清除delete系统的待确认状态
    if (gameState.getPendingConfirmation()) {
        gameState.clearPendingConfirmation();
    }

    // 优先从data属性获取卡片ID（避免scramble影响）
    let cardId = fileItem.getAttribute('data-card-id');

    // 如果没有data属性，则尝试通过文件名查找（兼容旧数据）
    if (!cardId) {
        const fileName = fileItem.querySelector('.file-name')?.textContent;
        if (!fileName) return;
        cardId = findCardIdByFileName(fileName);
        if (!cardId) return;
    }

    // 获取卡片
    const card = cardManager.getCardById(cardId);
    if (!card) return;

    // 检查卡片状态并处理解锁
    if (card.status === 'locked') {
        // 尝试解锁
        const unlockResult = unlockManager.checkAndProcessUnlock(cardId);

        if (unlockResult.type === 'count' && !unlockResult.success) {
            // 数量解锁未满足条件
            showFeedback(unlockResult.message, 'error');
            return;
        } else if (unlockResult.type === 'count' && unlockResult.success) {
            // 数量解锁成功
            showFeedback(unlockResult.message, 'success');
            card = cardManager.getCardById(cardId); // 重新获取更新后的卡片
        }
    }

    // 对于问答解锁，即使是partial状态也可以显示
    if (card.status === 'locked' && card.unlock_type !== 'question') {
        showFeedback(TEXT.cardLocked, 'error');
        return;
    }

    // 显示卡片内容
    displayCard(card);

    // 标记为已读（只有完全解锁的卡片才标记为已读）
    // 注意：对于问答类型卡片，不要在这里立即标记为已读
    // 因为回答正确后会异步重新渲染，需要等逐行显示完成后才标记
    if (card.status === 'unlocked' &&
        !gameState.isCardRead(cardId) &&
        card.unlock_type !== 'question') {
        gameState.markCardAsRead(cardId);
        cardManager.updateCardReadStatus(cardId, true);

        // 检查并解锁指令
        checkAndUnlockCommands(cardId);
    }

    // 如果是蓝色标记的卡片，点击后移除蓝色标记
    if (gameState.isBlueMarked(cardId)) {
        gameState.removeBlueMarked(cardId);
    }

    // 如果卡片完全解锁，获取新线索词
    if (card.status === 'unlocked') {
        const newClues = cardManager.getCardNewClues(cardId);
        gameState.addClues(newClues);
    }

    // 更新当前卡片
    gameState.setCurrentCard(cardId);
    currentCard = card;

    // 刷新UI（读文件时列表不滚动）
    refreshUI(false);
}

/**
 * 显示卡片内容
 */
function displayCard(card) {
    // 🎵 检查是否需要切换BGM
    if (CARD_BGM_MAP[card.id] && window.audioManager) {
        const targetBGM = CARD_BGM_MAP[card.id];
        const currentBGM = audioManager.currentMusicId;

        // 检查是否是"仅首次触发"的卡片
        const isFirstTimeOnly = FIRST_TIME_ONLY_BGM.includes(card.id);
        const isFirstRead = !gameState.isCardRead(card.id);

        // 决定是否应该切换BGM
        const shouldSwitch = isFirstTimeOnly ? isFirstRead : true;

        if (shouldSwitch && currentBGM !== targetBGM) {
            console.log(`[BGM] Switching to ${targetBGM} for card ${card.id} (2s crossfade, first-time: ${isFirstTimeOnly})`);
            audioManager.switchMusic(targetBGM, 2000);  // 2秒淡入淡出
            // 保存BGM状态到存档
            gameState.setCurrentBGM(targetBGM);
        } else if (!shouldSwitch) {
            console.log(`[BGM] Card ${card.id} is first-time-only and already read, skipping BGM switch`);
        } else {
            console.log(`[BGM] Already playing ${targetBGM}, no switch needed`);
        }
    }

    // 更新标题栏 (P3 新格式)
    const titleBar = document.querySelector('.title-bar');
    if (titleBar) {
        // 显示分割线（打开文件后才显示）
        titleBar.classList.add('has-content');

        const titleElement = titleBar.querySelector('.card-filename');
        const timestamp = titleBar.querySelector('.card-timestamp');

        // 检测decay是否激活
        const isDecayActive = typeof memoryDecay !== 'undefined' && memoryDecay.isActive;
        const hasScramble = isDecayActive && memoryDecay.scramble;

        if (titleElement) {
            // 使用新的标题格式化函数
            const formattedTitle = formatCardTitle(card);
            const displayTitle = hasScramble ? memoryDecay.scramble.scrambleText(formattedTitle, false) : formattedTitle;
            titleElement.textContent = displayTitle;
            // 保存原文到data属性
            if (hasScramble) {
                titleElement.setAttribute('data-original-text', formattedTitle);
            } else {
                titleElement.removeAttribute('data-original-text');
            }
        }

        // 隐藏旧的timestamp元素（时间已包含在新标题格式中）
        if (timestamp) {
            timestamp.style.display = 'none';
        }

        // 更新年份显示（P3.3 - 在 // 和日期之间）
        updateCardYearP3(card);
    }

    // 如果是未读的已解锁卡片，启用阅读锁定
    const shouldLock = card.status === 'unlocked' && !card.is_read;
    if (shouldLock && readingLockManager) {
        readingLockManager.lock(card.id);

        // 设置阅读完成回调
        renderer.onReadingComplete((completedCardId) => {

            // 特殊处理：mem_025 阅读完成后触发苏醒动画序列
            if (completedCardId === 'mem_025') {
                // 防止重复触发（点击事件监听器未移除可能导致多次回调）
                if (window._awakeningTriggered) {
                    console.log('[Awakening] Already triggered, ignoring duplicate call');
                    return;
                }
                window._awakeningTriggered = true;

                console.log('[Awakening] mem_025 reading completed, triggering awakening sequence');

                // 标记为已读
                if (!gameState.isCardRead(completedCardId)) {
                    gameState.markCardAsRead(completedCardId);
                    cardManager.updateCardReadStatus(completedCardId, true);

                    // 检查并解锁指令
                    checkAndUnlockCommands(completedCardId);
                }

                // 触发苏醒动画序列（延迟4秒，让用户看到最后一行"…Carol"）
                // 保持阅读锁定状态直到动画开始
                if (typeof memoryDecay !== 'undefined' && memoryDecay) {
                    setTimeout(() => {
                        // 解锁阅读模式（恢复输入框和列表点击）
                        if (readingLockManager) {
                            readingLockManager.unlock();
                        }
                        memoryDecay.triggerAwakeningSequence();
                    }, 4000);
                } else {
                    // 如果没有memoryDecay，立即解锁
                    if (readingLockManager) {
                        readingLockManager.unlock();
                    }
                }

                return; // 不执行下面的通用逻辑
            }

            // 解锁阅读模式
            if (readingLockManager) {
                readingLockManager.unlock();
            }

            // 标记为已读
            if (!gameState.isCardRead(completedCardId)) {
                gameState.markCardAsRead(completedCardId);
                cardManager.updateCardReadStatus(completedCardId, true);

                // 检查并解锁指令
                checkAndUnlockCommands(completedCardId);
            }

            // 阅读 file_010 (README) 后 1 秒启动心电图
            if (completedCardId === 'file_010' && window.ecgController && !window._ecgStarted) {
                window._ecgStarted = true;
                setTimeout(() => {
                    window.ecgController.start();
                    console.log('[ECG] Started 1s after reading README');
                }, 1000);
            }

            // 阅读 file_015 后激活 delete stage1
            if (completedCardId === 'file_015') {
                gameState.setDeleteStage('stage1');
                console.log('[Delete System] Stage 1 activated after reading file_015');
            }

            // 阅读 file_016 后激活 delete stage2
            if (completedCardId === 'file_016') {
                gameState.setDeleteStage('stage2');
                console.log('[Delete System] Stage 2 activated after reading file_016');
            }

            // 刷新UI
            refreshUI();
        });
    }

    // 更新内容区 - 使用新的渲染引擎
    const textContent = document.querySelector('.text-content');
    if (textContent) {
        textContent.innerHTML = '';

        // 准备渲染选项
        const options = {
            // 未读内容启用逐行显示（包括memory和file）
            lineByLine: !card.is_read
        };

        // 设置当前卡片ID（用于阅读完成检测）
        renderer.setCurrentCard(card.id);

        // 如果是问答解锁的部分状态，需要特殊处理
        if (card.unlock_type === 'question' && card.status === 'partial') {
            const preview = cardManager.getQuestionPreview(card.id);
            if (preview) {
                options.preview = true;
                options.previewLines = preview.preview.length;

                // 🔧 检查预览是否已显示过（从gameState持久化状态检查）
                const hasShownPreview = gameState.isPreviewShown(card.id);

                // 修改卡片内容以匹配预览
                const tempCard = {
                    ...card,
                    content: preview.preview,
                    // 🔧 关键修复：根据是否已显示过预览设置 is_read
                    // 如果已显示过，设为 true（直接显示全部）
                    // 如果首次显示，设为 false（逐行显示）
                    is_read: hasShownPreview
                };

                // 使用渲染引擎渲染内容
                renderer.renderCardContent(textContent, tempCard, options);

                // 🔧 提取并添加预览内容中的clue
                const extractedClues = [];
                preview.preview.forEach(segment => {
                    if (segment.style === 'clue' && segment.text) {
                        const clueText = segment.text.toLowerCase().replace(/[.,!?]/g, '').trim();
                        if (clueText && !extractedClues.includes(clueText)) {
                            extractedClues.push(clueText);
                        }
                    }
                });

                // 添加提取到的clue到游戏状态
                if (extractedClues.length > 0) {
                    const addedCount = gameState.addClues(extractedClues);
                    if (addedCount > 0) {
                        refreshUI();
                    }
                }

                // 🔧 根据是否已读决定何时显示问答UI
                const questionData = {
                    cardId: card.id,
                    cardType: card.type,
                    text: preview.question
                };

                const handleSubmit = (answer) => {
                    const result = unlockManager.verifyAnswer(card.id, answer);

                    if (result.correct) {
                        // 🔧 答对后补充显示最后的内容，并启用逐行显示
                        setTimeout(() => {
                            // 获取完整卡片内容
                            const fullCard = cardManager.getCardById(card.id);

                            // 找到需要补充的内容（从preview_lines之后开始）
                            const previewLines = preview.preview.length;
                            const supplementContent = fullCard.content.slice(previewLines);

                            // 提取补充内容中的clue
                            const supplementClues = [];
                            supplementContent.forEach(segment => {
                                if (segment.style === 'clue' && segment.text) {
                                    const clueText = segment.text.toLowerCase().replace(/[.,!?]/g, '').trim();
                                    if (clueText && !supplementClues.includes(clueText)) {
                                        supplementClues.push(clueText);
                                    }
                                }
                            });

                            // 添加补充内容中的clue到游戏状态
                            if (supplementClues.length > 0) {
                                const addedCount = gameState.addClues(supplementClues);
                                if (addedCount > 0) {
                                }
                            }

                            // 移除问答UI
                            const questionUI = textContent.querySelector('.question-section');
                            if (questionUI) {
                                questionUI.remove();
                            }

                            // 按原有的段落分组方式添加补充内容
                            let paragraphGroups = [];
                            let currentGroup = [];

                            supplementContent.forEach(segment => {
                                currentGroup.push(segment);
                                if (segment.breakAfter) {
                                    paragraphGroups.push([...currentGroup]);
                                    currentGroup = [];
                                }
                            });

                            // 处理最后一组（如果有）
                            if (currentGroup.length > 0) {
                                paragraphGroups.push(currentGroup);
                            }

                            // 获取现有段落数量，作为新段落的起始索引
                            const existingParagraphs = textContent.querySelectorAll('.content-paragraph');
                            let paragraphIndex = existingParagraphs.length;

                            // 为每组创建一个段落，初始隐藏
                            paragraphGroups.forEach((group, index) => {
                                const paragraph = document.createElement('p');
                                paragraph.className = 'content-paragraph';
                                paragraph.dataset.lineIndex = paragraphIndex + index;

                                // 除第一个外都隐藏（第一个立即显示）
                                if (index > 0) {
                                    paragraph.style.display = 'none';
                                }

                                // 检查组内是否有 trigger_unlock 标记
                                group.forEach(seg => {
                                    if (seg.trigger_unlock) {
                                        paragraph.dataset.triggerUnlock = 'true';
                                    }
                                    const element = renderer.createTextElement(seg);
                                    paragraph.appendChild(element);
                                });

                                textContent.appendChild(paragraph);
                            });

                            // 🔧 修复：只选择新添加的补充段落（不包括预览段落）
                            // 补充段落的 data-line-index >= paragraphIndex
                            const supplementParagraphs = Array.from(textContent.querySelectorAll('.content-paragraph'))
                                .filter(p => parseInt(p.dataset.lineIndex) >= paragraphIndex);

                            renderer.lineByLineController = new LineByLineController(supplementParagraphs, fullCard);

                            // 添加或更新继续提示
                            let continueHint = textContent.querySelector('.continue-hint');
                            if (!continueHint) {
                                continueHint = document.createElement('p');
                                continueHint.className = 'continue-hint';
                                continueHint.innerHTML = 'Click to continue';
                                textContent.appendChild(continueHint);
                            } else {
                                // 移除现有提示
                                continueHint.remove();
                                // 重新创建并添加到末尾
                                continueHint = document.createElement('p');
                                continueHint.className = 'continue-hint';
                                continueHint.innerHTML = 'Click to continue';
                                continueHint.style.display = 'block';
                                textContent.appendChild(continueHint);
                            }

                            // 重新绑定点击事件（因为新的LineByLineController）
                            const clickHandler = () => {
                                if (renderer.lineByLineController.fullAutoPlayMode) {
                                    return;
                                }

                                renderer.lineByLineController.showNext();

                                // 如果全部显示完成
                                if (renderer.lineByLineController.isComplete()) {
                                    continueHint.style.display = 'none';

                                    // 标记卡片为已读
                                    gameState.markCardAsRead(fullCard.id);
                                    cardManager.updateCardReadStatus(fullCard.id, true);

                                    // 检查并解锁指令
                                    checkAndUnlockCommands(fullCard.id);

                                    // 🔧 修复：无条件检查unlock_by链条（不仅限于trigger_unlock）
                                    if (typeof unlockManager !== 'undefined') {
                                        const unlockedFiles = unlockManager.checkReadTriggeredUnlocks(fullCard.id);
                                        if (unlockedFiles && unlockedFiles.length > 0) {
                                            console.log(`[Q&A Supplement] Unlocked files via unlock_by:`, unlockedFiles);
                                        }
                                    }

                                    refreshUI();
                                    textContent.removeEventListener('click', clickHandler);
                                }
                            };

                            // 移除旧的事件监听器，添加新的
                            const oldClickHandler = textContent.onclick;
                            if (oldClickHandler) {
                                textContent.removeEventListener('click', oldClickHandler);
                            }
                            textContent.addEventListener('click', clickHandler);

                            // 🔧 添加键盘事件监听器（修复问答卡片无法通过Enter键继续的问题）
                            const handleKeyboard = (e) => {
                                if (!e.target.matches('input, textarea')) {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();

                                        // 如果是全自动播放模式，忽略用户Enter键
                                        if (renderer.lineByLineController && renderer.lineByLineController.fullAutoPlayMode) {
                                            console.log('[LineByLine] Full auto-play mode, ignoring user Enter key');
                                            return;
                                        }

                                        if (renderer.lineByLineController) {
                                            renderer.lineByLineController.showNext();

                                            // 如果全部显示完成
                                            if (renderer.lineByLineController.isComplete()) {
                                                continueHint.style.display = 'none';
                                                document.removeEventListener('keydown', handleKeyboard);

                                                // 标记卡片为已读
                                                gameState.markCardAsRead(fullCard.id);
                                                cardManager.updateCardReadStatus(fullCard.id, true);

                                                // 检查并解锁指令
                                                checkAndUnlockCommands(fullCard.id);

                                                // 🔧 修复：无条件检查unlock_by链条（不仅限于trigger_unlock）
                                                if (typeof unlockManager !== 'undefined') {
                                                    const unlockedFiles = unlockManager.checkReadTriggeredUnlocks(fullCard.id);
                                                    if (unlockedFiles && unlockedFiles.length > 0) {
                                                        console.log(`[Q&A Supplement] Unlocked files via unlock_by:`, unlockedFiles);
                                                    }
                                                }

                                                refreshUI();
                                            }
                                        }
                                    } else if (e.key === 'Escape' && renderer.lineByLineController && renderer.lineByLineController.isAutoPlaying) {
                                        e.preventDefault();
                                        renderer.lineByLineController.skipAutoSequence();
                                    }
                                }
                            };
                            document.addEventListener('keydown', handleKeyboard);

                            refreshUI();
                        }, 300);  // 🔧 缩短延迟到300ms，提升答对后的响应速度
                    }

                    return result;
                };

                // 如果是第一次显示预览，设置预览完成回调
                if (!hasShownPreview && renderer.lineByLineController) {
                    // 设置预览完成后显示问答UI
                    renderer.lineByLineController.onPreviewComplete = () => {
                        gameState.addPreviewShown(card.id);  // 🔧 标记预览已显示（持久化）
                        renderer.renderQuestionUI(textContent, questionData, handleSubmit);
                    };
                } else {
                    // 已显示过预览，直接显示问答UI
                    renderer.renderQuestionUI(textContent, questionData, handleSubmit);
                }
            }
        } else {
            // 正常渲染完整内容
            renderer.renderCardContent(textContent, card, options);

            // 提取并添加内容中的clue（对非问答卡片）
            if (card.unlock_type !== 'question') {
                const extractedClues = [];
                card.content.forEach(segment => {
                    if (segment.style === 'clue' && segment.text) {
                        const clueText = segment.text.toLowerCase().replace(/[.,!?]/g, '').trim();
                        if (clueText && !extractedClues.includes(clueText)) {
                            extractedClues.push(clueText);
                        }
                    }
                });

                // 添加提取到的clue到游戏状态
                if (extractedClues.length > 0) {
                    const addedCount = gameState.addClues(extractedClues);
                    if (addedCount > 0) {
                        refreshUI();
                    }
                }
            }

            // 对问答类型卡片的特殊处理：确保逐行阅读完成后被标记为已读
            if (card.unlock_type === 'question' && card.status === 'unlocked' && !card.is_read) {

                // 监听容器点击，每次点击后检查是否完成
                const checkAndMark = () => {
                    // 延迟检查，确保renderer有时间更新状态
                    setTimeout(() => {
                        if (renderer.lineByLineController && renderer.lineByLineController.isComplete()) {
                            gameState.markCardAsRead(card.id);
                            cardManager.updateCardReadStatus(card.id, true);

                            // 检查并解锁指令
                            checkAndUnlockCommands(card.id);

                            // 🔧 修复：检查unlock_by链条（与补充内容handler保持一致）
                            if (typeof unlockManager !== 'undefined') {
                                const unlockedFiles = unlockManager.checkReadTriggeredUnlocks(card.id);
                                if (unlockedFiles && unlockedFiles.length > 0) {
                                    console.log(`[Q&A Re-read] Unlocked files via unlock_by:`, unlockedFiles);
                                }
                            }

                            refreshUI();
                            // 移除监听器
                            textContent.removeEventListener('click', checkAndMark);
                            document.removeEventListener('keydown', checkAndMarkKeyboard);
                        }
                    }, 100);
                };

                // 🔧 添加键盘事件监听器（修复问答卡片无法通过Enter键继续的问题）
                const checkAndMarkKeyboard = (e) => {
                    if (!e.target.matches('input, textarea')) {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            checkAndMark();
                        }
                    }
                };

                textContent.addEventListener('click', checkAndMark);
                document.addEventListener('keydown', checkAndMarkKeyboard);
            }
        }

        // 刷新scramble特效（卡片内容区域）
        if (scrambleEffect && scrambleEffect.enabled) {
            setTimeout(() => {
                scrambleEffect.refresh();
            }, 50); // 轻微延迟确保DOM渲染完成
        }
    }
}

/**
 * 检查并解锁指令（根据已读卡片）
 * @param {string} cardId - 刚刚阅读完的卡片ID
 */
function checkAndUnlockCommands(cardId) {
    if (COMMAND_UNLOCK_MAP[cardId]) {
        const commands = COMMAND_UNLOCK_MAP[cardId];
        const unlocked = gameState.unlockCommands(commands);

        if (unlocked > 0) {
            console.log(`[Command Unlock] Card ${cardId} unlocked ${unlocked} command(s)`);
            // 可以在这里添加提示，但目前保持静默
        }
    }
}

/**
 * 更新指令帮助区域 - P4.1 已移除右侧指令帮助区
 * 功能已迁移至底部状态按钮栏
 */
function updateCommandHelp() {
    // P4.1: 指令帮助区已移除，此函数保留但不执行任何操作
    return;
}

/**
 * 触发解锁闪烁效果
 * @param {Array|string} cardIds - 卡片ID或ID数组
 */
function triggerUnlockFlash(cardIds) {
    const ids = Array.isArray(cardIds) ? cardIds : [cardIds];
    // 等待 DOM 更新后触发闪烁
    setTimeout(() => {
        ids.forEach(cardId => {
            const fileItem = document.querySelector(`.file-item[data-card-id="${cardId}"]`);
            if (fileItem) {
                fileItem.classList.add('just-unlocked');
                // 动画结束后移除类
                setTimeout(() => {
                    fileItem.classList.remove('just-unlocked');
                }, 1000);
            }
        });
    }, 100);
}

/**
 * 刷新整个UI
 * @param {boolean} scrollListToBottom - 是否滚动列表到底部（默认true）
 */
function refreshUI(scrollListToBottom = true) {
    refreshFileList(scrollListToBottom);
    refreshStatistics();
    updateCommandHelp();  // 更新指令帮助区域（P4.1 已移除，保留兼容）
    updateFunctionBar();  // 更新状态按钮栏（P4.6）

    // 更新Tab未读指示器
    if (renderer && renderer.updateTabIndicators) {
        renderer.updateTabIndicators(cardManager, gameState);
    }
}

/**
 * 刷新文件列表
 * @param {boolean} scrollToBottom - 是否滚动到底部（默认true）
 */
function refreshFileList(scrollToBottom = true) {
    const fileList = document.querySelector('.file-list');

    if (!fileList) {
        console.error('[ERROR] File list element not found!');
        return;
    }

    // 获取当前Tab
    const currentTab = gameState.getState().current_tab;

    if (currentTab === 'clue') {
        // 显示线索词列表
        displayClueList(scrollToBottom);
        // 刷新scramble特效
        if (scrambleEffect && scrambleEffect.enabled) {
            scrambleEffect.refresh();
        }
        return;
    }

    // 获取已发现的卡片
    const discoveredIds = gameState.getState().discovered_cards;

    let cardsToShow = discoveredIds.map(id => cardManager.getCardById(id)).filter(c => c);

    // 根据Tab筛选
    if (currentTab === 'memory') {
        cardsToShow = cardsToShow.filter(c => c.type === 'memory');
    } else if (currentTab === 'file') {
        cardsToShow = cardsToShow.filter(c => c.type === 'file');
    }

    // 排序（时间排序只对memory生效，file始终使用默认排序）
    let sortType = gameState.getState().current_sort;
    if (currentTab === 'file' && (sortType === 'time' || sortType === 'year')) {
        sortType = 'default';
    }
    cardsToShow = sortCards(cardsToShow, sortType);

    // 使用渲染引擎渲染卡片列表
    renderer.renderCardList(fileList, cardsToShow, gameState);

    // 刷新scramble特效
    if (scrambleEffect && scrambleEffect.enabled) {
        scrambleEffect.refresh();
    }

    // 滚动位置：仅在需要时滚动（切换Tab时滚动，读文件时不滚动）
    if (scrollToBottom) {
        if (gameState.isCardUnlocked('file_018')) {
            fileList.scrollTop = 0;
        } else {
            fileList.scrollTop = fileList.scrollHeight;
        }
    }
}

/**
 * 显示线索词列表
 * @param {boolean} scrollToBottom - 是否滚动到底部（默认true）
 */
function displayClueList(scrollToBottom = true) {
    const fileList = document.querySelector('.file-list');
    if (!fileList) return;

    const discoveredClues = gameState.getState().discovered_clues;
    const usedClues = gameState.getState().used_clues;

    // 使用渲染引擎渲染线索词列表
    renderer.renderClueList(fileList, discoveredClues, usedClues);

    // 刷新scramble特效
    if (scrambleEffect && scrambleEffect.enabled) {
        scrambleEffect.refresh();
    }

    // 滚动位置：仅在需要时滚动（切换Tab时滚动，读文件时不滚动）
    if (scrollToBottom) {
        if (gameState.isCardUnlocked('file_018')) {
            fileList.scrollTop = 0;
        } else {
            fileList.scrollTop = fileList.scrollHeight;
        }
    }
}

/**
 * 刷新统计信息
 * 根据当前tab显示对应类型的discovered数量
 */
function refreshStatistics() {
    const statNumber = document.querySelector('.stat-number');
    if (!statNumber) return;

    const currentTab = gameState.getState().current_tab;
    const discoveredCards = gameState.getState().discovered_cards;

    if (currentTab === 'clue') {
        // Clue tab显示线索词数量
        const clueCount = gameState.getState().discovered_clues.length;
        statNumber.textContent = clueCount;
    } else {
        // Memory/File tab显示对应类型的discovered数量
        // 排除已隐藏的卡片（删除阶段）
        const typedCount = discoveredCards.filter(id => {
            const card = cardManager.getCardById(id);
            // 检查是否被隐藏
            const isHidden = typeof memoryDecay !== 'undefined' &&
                           memoryDecay.hiddenCards &&
                           memoryDecay.hiddenCards.has(id);
            return card && card.type === currentTab && !isHidden;
        }).length;
        statNumber.textContent = typedCount;
    }
}

/**
 * 系统输出消息队列（最多保存2行）
 */
const systemOutputLines = [];

/**
 * 显示系统输出信息（P4.3 三段式布局）
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 (success/error/info)
 */
function showFeedback(message, type = 'info') {
    // 添加前缀
    const prefix = '> SYSTEM: ';
    const fullMessage = prefix + message;

    // 添加到队列
    systemOutputLines.push({ text: fullMessage, type: type });
    if (systemOutputLines.length > 2) {
        systemOutputLines.shift(); // 移除最旧的
    }

    // 更新 DOM
    const container = document.querySelector('.system-output');
    if (container) {
        const lines = container.querySelectorAll('.output-line');
        const isMobile = isMobileLandscape();

        // 清空所有行
        lines.forEach(line => {
            line.textContent = '';
            line.style.color = '';
        });

        if (isMobile) {
            // 手机端：最新消息放在 lines[1]（唯一可见行）
            if (systemOutputLines.length > 0) {
                const msg = systemOutputLines[systemOutputLines.length - 1];
                lines[1].textContent = msg.text;
                if (msg.type === 'error') {
                    lines[1].style.color = '#ff6b6b';
                }
            }
        } else {
            // PC端：正常两行显示
            lines.forEach((line, index) => {
                if (index < systemOutputLines.length) {
                    const msg = systemOutputLines[index];
                    line.textContent = msg.text;
                    if (msg.type === 'error') {
                        line.style.color = '#ff6b6b';
                    }
                }
            });
        }
    }
}

/**
 * 排序卡片
 */
function sortCards(cards, sortType) {
    switch (sortType) {
        case 'time':
            return cardManager.sortCardsByTime(cards);
        case 'year':
            return cardManager.sortCardsByYearAndTime(cards);
        default:
            return cardManager.sortCardsByDefault(cards);
    }
}

/**
 * 处理排序
 */
function handleSort(sortType) {
    // 清除delete系统的待确认状态
    if (gameState.getPendingConfirmation()) {
        gameState.clearPendingConfirmation();
    }

    gameState.setSort(sortType);

    // 如果是年份排序，处理特殊解锁和蓝色标记
    if (sortType === 'year') {
        // 检查是否是第一次使用year排序，如果是则解锁mem_024
        if (!gameState.hasSortYearUsed()) {
            console.log('[Sort Year] First time using /sort year, unlocking mem_024');

            // 发现并解锁mem_024
            if (gameState.discoverCard('mem_024')) {
                console.log('[Sort Year] mem_024 discovered');
            }
            if (gameState.unlockCard('mem_024')) {
                console.log('[Sort Year] mem_024 unlocked');
            }

            // 更新卡片状态
            cardManager.updateCardStatus('mem_024', 'unlocked');

            // 标记已使用过year排序
            gameState.setSortYearUsed();

            showFeedback(TEXT.hiddenMemoryUnlocked, 'success');
        }

        const discoveredCards = gameState.getState().discovered_cards;
        let markedCount = 0;

        discoveredCards.forEach(cardId => {
            const card = cardManager.getCardById(cardId);
            // 只处理1995年的memory类型卡片
            if (card && card.type === 'memory' && card.year === 1995) {
                gameState.addBlueMarked(cardId);
                markedCount++;
            }
        });

        console.log(`[Sort Year] Marked ${markedCount} cards from 1995 as blue`);

        // 显示年份
        gameState.setShowYear(true);
    } else {
        // 其他排序方式隐藏年份
        gameState.setShowYear(false);
    }

    refreshFileList();
    showFeedback(TEXT.sortedBy.replace('{type}', sortType), 'success');
}

/**
 * 处理存档
 */
function handleSave() {
    // 清除delete系统的待确认状态
    if (gameState.getPendingConfirmation()) {
        gameState.clearPendingConfirmation();
    }

    const saved = gameState.saveState();
    if (saved) {
        showFeedback(TEXT.gameSaved, 'success');
    } else {
        showFeedback(TEXT.saveFailed, 'error');
    }
}

/**
 * 处理读档
 */
function handleLoad() {
    // 清除delete系统的待确认状态
    if (gameState.getPendingConfirmation()) {
        gameState.clearPendingConfirmation();
    }

    const loaded = gameState.loadState();
    if (loaded) {
        showFeedback(TEXT.gameLoaded, 'success');
        refreshUI();
    } else {
        showFeedback(TEXT.noSaveFound, 'error');
    }
}

/**
 * 处理年份显示命令
 */
function handleYearCommand(command) {
    // 清除delete系统的待确认状态
    if (gameState.getPendingConfirmation()) {
        gameState.clearPendingConfirmation();
    }

    const parts = command.split(' ');
    const subCommand = parts[1]?.toLowerCase();

    if (subCommand === 'on') {
        gameState.setShowYear(true);
        showFeedback(TEXT.yearDisplayOn, 'success');
        // 如果当前有显示卡片，刷新显示
        const currentCard = gameState.getState().current_card;
        if (currentCard) {
            const card = cardManager.getCardById(currentCard);
            if (card) {
                updateCardYear(card);
            }
        }
    } else if (subCommand === 'off') {
        gameState.setShowYear(false);
        showFeedback(TEXT.yearDisplayOff, 'success');
        // 隐藏年份显示
        const yearDisplay = document.querySelector('.card-year');
        if (yearDisplay) {
            yearDisplay.style.display = 'none';
        }
    } else {
        // 切换状态
        const currentState = gameState.getState().show_year;
        gameState.setShowYear(!currentState);
        showFeedback(`Year display: ${!currentState ? 'ON' : 'OFF'}`, 'success');
        // 刷新当前卡片显示
        const currentCard = gameState.getState().current_card;
        if (currentCard) {
            const card = cardManager.getCardById(currentCard);
            if (card) {
                if (!currentState) {
                    updateCardYear(card);
                } else {
                    const yearDisplay = document.querySelector('.card-year');
                    if (yearDisplay) {
                        yearDisplay.style.display = 'none';
                    }
                }
            }
        }
    }
}

/**
 * 根据文件名找到卡片ID
 */
function findCardIdByFileName(fileName) {
    // 去除序号，如 "1-city" -> "city"
    const name = fileName.replace(/^\d+-/, '');

    // 查找所有已发现的卡片
    const discoveredIds = gameState.getState().discovered_cards;
    for (let id of discoveredIds) {
        const card = cardManager.getCardById(id);
        if (card && card.title.toLowerCase().includes(name.toLowerCase())) {
            return id;
        }
    }

    return null;
}

/**
 * 格式化卡片时间
 * @param {string} time - 时间（如 "8am" 或 "14:30"）
 * @param {string} date - 日期（如 "Sep 17th"），默认为 "Aug 31st"
 */
function formatCardTime(time, date = null) {
    if (!time) return '';

    // 使用传入的日期或默认值
    const dateStr = date || "Aug 31st";

    // 检查是否已经是 "8am" / "10pm" 格式
    const ampmMatch = time.match(/^(\d+)(am|pm)$/i);
    if (ampmMatch) {
        // 已经是正确格式，直接返回
        return `${ampmMatch[1]}${ampmMatch[2]} ${dateStr}`;
    }

    // 否则，解析 "HH:MM" 格式
    const [hours, minutes] = time.split(':').map(Number);

    // 转换为12小时制
    const period = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

    // 返回格式化的时间
    return `${displayHours}${period} ${dateStr}`;
}

// ====================================
// P3 标题栏格式化函数
// ====================================

/**
 * 月份名称到数字的映射
 */
const MONTH_MAP = {
    'jan': '01', 'january': '01',
    'feb': '02', 'february': '02',
    'mar': '03', 'march': '03',
    'apr': '04', 'april': '04',
    'may': '05',
    'jun': '06', 'june': '06',
    'jul': '07', 'july': '07',
    'aug': '08', 'august': '08',
    'sep': '09', 'september': '09',
    'oct': '10', 'october': '10',
    'nov': '11', 'november': '11',
    'dec': '12', 'december': '12'
};

/**
 * 解析 Memory 文件名
 * 从 "4-9am-toast" 解析出 ID=4, time=9am, SUBJECT=toast
 * @param {string} filename - 文件名
 * @returns {Object} {id, time, subject}
 */
function parseMemoryFilename(filename) {
    if (!filename) return { id: '', time: '', subject: '' };

    const parts = filename.split('-');
    if (parts.length < 2) {
        return { id: '', time: '', subject: filename };
    }

    const id = parts[0];                      // "4"
    const time = parts[1];                    // "9am"
    const subject = parts[parts.length - 1]; // "toast"

    return { id, time, subject };
}

/**
 * 将时间转换为24小时制 HH:00 格式
 * "9am" → "09:00", "2pm" → "14:00"
 * @param {string} timeStr - 时间字符串（如 "9am", "2pm"）
 * @returns {string} 24小时制时间（如 "09:00"）
 */
function formatTime24h(timeStr) {
    if (!timeStr) return '';

    const match = timeStr.match(/^(\d+)(am|pm)$/i);
    if (!match) return timeStr;

    let hour = parseInt(match[1]);
    const isPM = match[2].toLowerCase() === 'pm';

    // 转换为24小时制
    if (isPM && hour !== 12) {
        hour += 12;
    } else if (!isPM && hour === 12) {
        hour = 0;
    }

    return `${hour.toString().padStart(2, '0')}:00`;
}

/**
 * 将日期转换为 MM-DD 格式
 * "Aug 31st" → "08-31", "Sep 17th" → "09-17"
 * @param {string} dateStr - 日期字符串
 * @returns {string} MM-DD 格式日期
 */
function formatDateMMDD(dateStr) {
    if (!dateStr) return '08-31'; // 默认值

    // 解析 "Aug 31st" 格式
    const match = dateStr.match(/^(\w+)\s+(\d+)/i);
    if (!match) return '08-31';

    const monthName = match[1].toLowerCase();
    const day = match[2];

    const month = MONTH_MAP[monthName] || '08';

    return `${month}-${day.padStart(2, '0')}`;
}

/**
 * 格式化 Memory 标题
 * 输出: "ID: 4 SUBJECT: TOAST //          08-31 09:00"
 * @param {Object} card - 卡片对象
 * @returns {string} 格式化后的标题
 */
function formatMemoryTitle(card) {
    const parsed = parseMemoryFilename(card.title);
    const date = formatDateMMDD(card.date);
    const time = formatTime24h(parsed.time);

    // SUBJECT 内容大写
    const subjectUpper = parsed.subject.toUpperCase();

    // 年份占位：10个空格，为后续年份显示留出位置
    // 格式: "ID: X SUBJECT: XXX //          MM-DD HH:00"
    return `ID: ${parsed.id} SUBJECT: ${subjectUpper} //          ${date} ${time}`;
}

/**
 * 格式化 File 标题
 * 输出: "FILE: 原标题"
 * @param {Object} card - 卡片对象
 * @returns {string} 格式化后的标题
 */
function formatFileTitle(card) {
    return `FILE: ${card.title}`;
}

/**
 * 格式化卡片标题（根据类型选择格式）
 * @param {Object} card - 卡片对象
 * @returns {string} 格式化后的标题
 */
function formatCardTitle(card) {
    if (card.type === 'memory') {
        return formatMemoryTitle(card);
    } else if (card.type === 'file') {
        return formatFileTitle(card);
    }
    return card.title;
}

/**
 * P3.3 更新卡片年份显示（新版）
 * 当 show_year 为 true 时，将标题中的 "//          " 替换为 "// YYYY "
 * @param {Object} card - 卡片对象
 */
function updateCardYearP3(card) {
    const titleBar = document.querySelector('.title-bar');
    if (!titleBar) return;

    const titleElement = titleBar.querySelector('.card-filename');
    if (!titleElement) return;

    // 只有 memory 类型才显示年份
    if (card.type !== 'memory' || !card.year) return;

    const showYear = gameState.getState().show_year;
    const isDecayActive = typeof memoryDecay !== 'undefined' && memoryDecay.isActive;
    const hasScramble = isDecayActive && memoryDecay.scramble;

    // 获取当前标题（如果有乱码，使用原文）
    let currentTitle = titleElement.getAttribute('data-original-text') || titleElement.textContent;

    if (showYear) {
        // 将 "//          " (10空格) 替换为 "// YYYY      " (年份+6空格，保持对齐)
        const yearStr = card.year.toString();
        const newTitle = currentTitle.replace('//          ', `// ${yearStr}      `);

        if (hasScramble) {
            titleElement.textContent = memoryDecay.scramble.scrambleText(newTitle, false);
            titleElement.setAttribute('data-original-text', newTitle);
        } else {
            titleElement.textContent = newTitle;
        }
    } else {
        // 恢复原始格式（不显示年份）- 匹配 "// YYYY " 或 "// YYYY      "
        const newTitle = currentTitle.replace(/\/\/\s+\d{4}\s+/, '//          ');

        if (hasScramble) {
            titleElement.textContent = memoryDecay.scramble.scrambleText(newTitle, false);
            titleElement.setAttribute('data-original-text', newTitle);
        } else {
            titleElement.textContent = newTitle;
        }
    }
}

/**
 * 更新卡片年份显示（旧版，保留兼容）
 * @param {Object} card - 卡片对象
 */
function updateCardYear(card) {
    const titleBar = document.querySelector('.title-bar');
    if (!titleBar) return;

    let yearDisplay = titleBar.querySelector('.card-year');

    // 如果卡片没有year属性，隐藏年份显示
    if (!card || !card.year) {
        if (yearDisplay) {
            yearDisplay.style.display = 'none';
        }
        return;
    }

    // 如果不存在，创建年份显示元素
    if (!yearDisplay) {
        yearDisplay = document.createElement('span');
        yearDisplay.className = 'card-year';
        yearDisplay.style.color = '#ffff00';  // 黄色
        yearDisplay.style.fontWeight = 'normal';  // 不加粗
        // 插入到 title-bar 中间（filename 和 timestamp 之间）
        const timestamp = titleBar.querySelector('.card-timestamp');
        if (timestamp) {
            titleBar.insertBefore(yearDisplay, timestamp);
        } else {
            titleBar.appendChild(yearDisplay);
        }
    }

    // 根据 show_year 状态显示或隐藏
    const showYear = gameState.getState().show_year;
    if (showYear) {
        // 检测decay是否激活
        const isDecayActive = typeof memoryDecay !== 'undefined' && memoryDecay.isActive;
        const hasScramble = isDecayActive && memoryDecay.scramble;

        const displayYear = hasScramble ? memoryDecay.scramble.scrambleText(card.year, false) : card.year;
        yearDisplay.textContent = displayYear;
        yearDisplay.style.display = 'inline';
        // 保存原文到data属性
        if (hasScramble) {
            yearDisplay.setAttribute('data-original-text', card.year);
        } else {
            yearDisplay.removeAttribute('data-original-text');
        }
    } else {
        yearDisplay.style.display = 'none';
    }
}

// 当前选中的 clue
let selectedClue = null;

/**
 * 选中 clue（视觉效果：反色 + 黑块）
 * @param {string} clueText - 线索词
 */
function selectClue(clueText) {
    // 移除之前的选中
    deselectClue();

    // 查找并选中新的 clue
    const clueItems = document.querySelectorAll('.file-list .file-item');
    clueItems.forEach(item => {
        const nameEl = item.querySelector('.file-name');
        if (nameEl && nameEl.textContent === clueText) {
            item.classList.add('active');
            // 添加黑块（如果没有）
            if (!item.querySelector('.active-marker')) {
                const marker = document.createElement('span');
                marker.className = 'active-marker';
                marker.textContent = '█';
                item.insertBefore(marker, item.firstChild);
            }
        }
    });

    selectedClue = clueText;
}

/**
 * 取消 clue 选中
 */
function deselectClue() {
    const selected = document.querySelector('.file-list .file-item.active');
    if (selected && gameState.getState().current_tab === 'clue') {
        selected.classList.remove('active');
        const marker = selected.querySelector('.active-marker');
        if (marker) marker.remove();
    }
    selectedClue = null;
}

/**
 * 填充线索词到输入框
 * @param {string} clueText - 线索词文本
 */
function fillClueToInput(clueText) {
    // 阅读锁定时禁止填充
    if (readingLockManager && readingLockManager.isLocked()) {
        return;
    }

    // 确认阶段禁止点击 clue
    if (confirmationLocked) return;

    // 精确选择 Terminal 输入框（排除 Question UI 的 .answer-input）
    const input = document.querySelector('.input-area .command-input');
    if (!input) return;

    // 如果不在 SEARCH 模式，先切换回去
    if (currentMode !== 'search') {
        switchToSearchMode();
    }

    // 检查是否重复填充（防止重复点击同一个clue）
    if (input.value.trim() === clueText) {
        // 重复点击，恢复选中状态（不聚焦，避免手机端唤起键盘）
        if (gameState.getState().current_tab === 'clue') {
            selectClue(clueText);
        }
        return;
    }

    // 记录填充前是否为空（用于提示逻辑）
    const wasEmpty = input.value.trim().length === 0;

    // 填充新的clue（覆盖原有内容）
    input.value = clueText;

    // 电脑端自动聚焦，方便直接按回车搜索
    // 手机端不自动聚焦，避免唤起键盘
    if (!isMobileLandscape()) {
        input.focus();
    }

    // 更新光标位置
    if (window.updateCursorPosition) {
        window.updateCursorPosition();
    }

    // 如果从空变为有内容，在search模式下显示提示（手机端显示不同提示）
    if (wasEmpty && currentMode === 'search') {
        const searchHint = isMobileLandscape() ? TEXT.tapButtonToSearch : TEXT.pressEnterToSearch;
        showFeedback(searchHint, 'info');
    }

    // 选中对应的 clue（如果在 clue tab）
    if (gameState.getState().current_tab === 'clue') {
        selectClue(clueText);
    }
}

/**
 * 切换到Clue标签页
 * @param {string} clueToSelect - 可选，要选中的 clue
 */
function switchToClueTab(clueToSelect = null) {
    // 更新游戏状态
    gameState.setTab('clue');

    // 更新Tab UI
    updateTabUI('clue');

    // 刷新文件列表显示
    refreshFileList();

    // 如果指定了 clue，则选中它
    if (clueToSelect) {
        // 等待 DOM 更新后选中
        setTimeout(() => {
            selectClue(clueToSelect);
        }, 50);
    }
}

/**
 * 处理乱码特效命令
 */
function handleScrambleCommand(command) {
    // 清除delete系统的待确认状态
    if (gameState.getPendingConfirmation()) {
        gameState.clearPendingConfirmation();
    }

    if (!scrambleEffect) {
        showFeedback(TEXT.scrambleNotInit, 'error');
        return;
    }

    const parts = command.split(' ');
    const action = parts[1] || 'toggle';

    // 处理decay子命令
    if (action === 'decay') {
        if (!memoryDecay) {
            showFeedback(TEXT.decayNotInit, 'error');
            return;
        }

        const subAction = parts[2] || 'status';
        switch (subAction) {
            case 'start':
                memoryDecay.start();
                showFeedback(TEXT.decayStarted, 'success');
                break;

            case 'stop':
                memoryDecay.stop();
                showFeedback(TEXT.decayStopped, 'success');
                break;

            case 'reset':
                memoryDecay.reset();
                showFeedback(TEXT.memoryRestored, 'success');
                break;

            case 'status':
                const decayStatus = memoryDecay.getStatus();
                if (decayStatus.isActive) {
                    showFeedback(
                        `🔥 Decay active: ${decayStatus.progress} complete, ` +
                        `${decayStatus.retentionRate} visible, ` +
                        `${decayStatus.timeRemaining} remaining`,
                        'info'
                    );
                } else {
                    showFeedback(TEXT.decayNotActive, 'info');
                }
                break;

            default:
                showFeedback('Usage: /scramble decay [start|stop|reset|status]', 'info');
        }
        return;
    }

    // 原有的scramble命令处理
    switch (action) {
        case 'on':
        case 'enable':
            scrambleEffect.enable();
            showFeedback(TEXT.scrambleEnabled, 'success');
            break;

        case 'off':
        case 'disable':
            scrambleEffect.disable();
            showFeedback(TEXT.scrambleDisabled, 'success');
            break;

        case 'toggle':
            const isEnabled = scrambleEffect.toggle();
            showFeedback(`Scramble effect ${isEnabled ? 'enabled' : 'disabled'}`, 'success');
            break;

        case 'exempt':
            // 设置豁免文件，例如：/scramble exempt 1-city,2-fire
            if (parts[2]) {
                const files = parts[2].split(',').map(f => f.trim());
                scrambleEffect.setExemptFiles(files);
                showFeedback(`Exempt files set: ${files.join(', ')}`, 'success');
            } else {
                showFeedback('Usage: /scramble exempt file1,file2', 'info');
            }
            break;

        case 'status':
            const status = scrambleEffect.getStatus();
            showFeedback(`Scramble: ${status.enabled ? 'ON' : 'OFF'}, Cache: ${status.cacheSize} items`, 'info');
            break;

        default:
            showFeedback('Usage: /scramble [on|off|toggle|exempt|status|decay]', 'info');
    }
}

/**
 * 处理Delete命令
 */
function handleDeleteCommand(command) {
    const deleteStage = gameState.getDeleteStage();
    const pendingConfirmation = gameState.getPendingConfirmation();

    // 处理yes/no回答（同时接受 y/n 简写）
    if (command === 'yes' || command === 'no' || command === 'y' || command === 'n') {
        if (!pendingConfirmation) {
            showFeedback(TEXT.unknownCommand, 'error');
            return;
        }

        // 将 y/n 转换为 yes/no
        const normalizedCommand = (command === 'y') ? 'yes' : (command === 'n') ? 'no' : command;

        if (normalizedCommand === 'no') {
            // 取消操作
            gameState.clearPendingConfirmation();
            // 清除高亮样式并解锁
            clearConfirmPrompt();
            // 恢复 DELETE 模式提示
            updateDeleteModePrompt();
            return;
        }

        // 处理yes回答
        if (normalizedCommand === 'yes') {
            handleYesConfirmation(pendingConfirmation);
            return;
        }
    }

    // 处理/delete命令
    if (deleteStage === 'inactive') {
        showFeedback(TEXT.unknownCommand, 'error');
        return;
    }

    // 只是输入 /delete
    if (command === 'delete') {
        // 如果有待确认状态，清除它（取消操作）
        if (pendingConfirmation) {
            gameState.clearPendingConfirmation();
            showFeedback(TEXT.operationCancelled, 'info');
        } else {
            // 否则显示帮助
            showDeleteHelp();
        }
        return;
    }

    // 解析 /delete 后的参数
    const parts = command.split(' ');
    if (parts[0] !== 'delete' || parts.length < 2) {
        showFeedback(TEXT.unknownCommand, 'error');
        return;
    }

    const arg = parts.slice(1).join(' ').trim();

    // 第一阶段：只接受数字
    if (deleteStage === 'stage1') {
        handleDeleteStage1(arg);
        return;
    }

    // 第二阶段：只接受单词
    if (deleteStage === 'stage2') {
        handleDeleteStage2(arg);
        return;
    }
}

/**
 * 显示Delete命令帮助
 */
function showDeleteHelp() {
    const deleteStage = gameState.getDeleteStage();

    if (deleteStage === 'stage1') {
        showFeedback(TEXT.deleteExample, 'success');
    } else if (deleteStage === 'stage2') {
        // 检查是否解锁了file delete-2
        const hasDelete2 = gameState.isCardUnlocked('file_delete-2');

        if (hasDelete2) {
            const helpMsg = currentLang === 'zh'
                ? TEXT.deleteExample + '\n\n' +
                  '/delete word - 从记忆中删除某个概念的所有实例\n\n例如: /delete general\n注意: 该词不在线索列表中。'
                : 'For example, enter /delete 1 to delete memory 1-8am-coffee\n\n' +
                  '/delete word - Delete all instances of a concept from memory\n\nExample: /delete general\nNote: This word is not from the clue list.';
            showFeedback(helpMsg, 'success');
        } else {
            showFeedback(TEXT.deleteExample, 'success');
        }
    }
}

/**
 * 处理第一阶段Delete命令
 */
function handleDeleteStage1(arg) {
    // 防护：检查删除动画1是否已完成
    if (gameState.isDeletion1Completed()) {
        showFeedback(TEXT.operationCompleted, 'error');
        return;
    }

    // 处理 /delete index 18 格式
    let actualArg = arg;
    if (arg.toLowerCase().startsWith('index ')) {
        actualArg = arg.substring(6).trim(); // 移除 "index "
    }

    // 检查是否是数字
    const num = parseInt(actualArg);
    if (isNaN(num)) {
        showFeedback(TEXT.unknownCommand, 'error');
        return;
    }

    // 正确答案是18
    if (num === 18) {
        // 显示确认对话框
        gameState.setPendingConfirmation({
            type: 'delete1',
            data: { memoryNumber: 18 }
        });
        showConfirmPrompt('are_you_sure');
        return;
    }

    // 错误提示
    if (num === 19) {
        showFeedback(TEXT.notThisOneClose, 'info');
    } else if (num > 30) {
        showFeedback(TEXT.notThisOneHint, 'info');
    } else {
        showFeedback(TEXT.notThisOne, 'info');
    }
}

/**
 * 处理第二阶段Delete命令
 */
function handleDeleteStage2(arg) {
    // 防护：检查删除动画2是否已完成
    if (gameState.isDeletion2Completed()) {
        showFeedback(TEXT.operationCompleted, 'error');
        return;
    }

    // 处理 /delete word camellia 格式
    let actualArg = arg;
    if (arg.toLowerCase().startsWith('word ')) {
        actualArg = arg.substring(5).trim(); // 移除 "word "
    }

    const word = actualArg.toLowerCase();

    // 正确答案是camellia或carol（中文：山茶、珂赛特）
    if (word === 'camellia' || word === 'carol' || word === '山茶' || word === '珂赛特') {
        // 显示确认对话框
        gameState.setPendingConfirmation({
            type: 'delete2',
            data: { word: word }
        });
        showConfirmPrompt('are_you_sure');
        return;
    }

    // 错误提示（随机两种之一）
    const messages = [
        TEXT.notThisOneCourage,
        TEXT.notThisOneHurt
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    showFeedback(randomMsg, 'info');
}

/**
 * 处理yes确认
 */
function handleYesConfirmation(confirmation) {
    if (confirmation.type === 'delete1') {
        // 播放删除动画一
        gameState.clearPendingConfirmation();
        playDeletionAnimation1();
    } else if (confirmation.type === 'delete2') {
        // 要求输入姓名
        gameState.setPendingConfirmation({
            type: 'name_input',
            data: confirmation.data
        });
        showConfirmPrompt('enter_name');
    } else if (confirmation.type === 'name_input') {
        // 这个不应该发生（name_input应该通过普通输入处理）
        showFeedback(TEXT.pleaseEnterName, 'info');
    }
}

/**
 * 显示大字号反馈
 */
function showFeedbackLarge(message, type = 'info') {
    const feedbackText = document.querySelector('.feedback-text');
    if (feedbackText) {
        feedbackText.textContent = message;
        feedbackText.className = 'feedback-text';

        // 设置大字号
        feedbackText.style.fontSize = '18px';
        feedbackText.style.fontWeight = 'bold';

        // 根据类型添加颜色
        switch (type) {
            case 'success':
                feedbackText.style.color = '#3399FF';
                break;
            case 'error':
                feedbackText.style.color = '#f00';
                break;
            case 'info':
                feedbackText.style.color = '#ff0';
                break;
        }
    }
}

/**
 * 播放删除动画一
 */
function playDeletionAnimation1() {
    if (typeof DeletionAnimation1 === 'undefined') {
        console.error('DeletionAnimation1 not loaded');
        showFeedback(TEXT.animNotAvailable, 'error');
        return;
    }

    // ECG联动：删除动画1开始，加速
    if (window.ecgController) {
        window.ecgController.setMode('delete');
        window.ecgController.setSpeed(3);
        window.ecgController.setAmplitude(1.0);
    }

    // 清除确认提示高亮
    clearConfirmPrompt();

    // 锁定输入
    inputLocked = true;

    // 2s 后返回 SEARCH 模式
    setTimeout(() => {
        inputLocked = false;
        if (currentMode === 'delete') {
            switchToSearchMode();
        }
    }, 2000);

    // 清空反馈文本，保持干净
    showFeedback('', 'info');

    // 🎵 播放Error BGM（1秒淡入）
    if (window.audioManager) {
        console.log('[BGM] Playing Error BGM for deletion animation 1 (1s fade-in)...');
        audioManager.playMusic('Error', 1, 1000);
    }

    const deletion1 = new DeletionAnimation1();
    deletion1.onComplete = () => {
        console.log('Deletion animation 1 completed');

        // ✅ 设置删除动画1已完成标记
        gameState.setDeletion1Completed();

        // 🎵 切换到Delete BGM（1秒交叉淡入淡出）
        if (window.audioManager) {
            console.log('[BGM] Switching to Delete BGM (1s crossfade)...');
            audioManager.switchMusic('Delete', 1000);
            // 保存BGM状态到存档
            gameState.setCurrentBGM('Delete');
        }

        // 动画1完成后，延迟2秒自动解锁 file_016
        setTimeout(() => {
            const fileDelete2 = cardManager.getCardById('file_016');
            if (fileDelete2 && fileDelete2.status !== 'unlocked') {
                console.log('[Delete System] Attempting to unlock file_016...');

                // 发现文件（如果尚未发现）
                if (!gameState.isCardDiscovered('file_016')) {
                    gameState.discoverCard('file_016');
                    cardManager.updateCardDiscoveredStatus('file_016', true);
                    console.log('[Delete System] file_016 discovered');

                    // 🎵 播放发现音效
                    if (window.audioManager) {
                        console.log('[Delete System] Playing discover sound for file_016');
                        audioManager.playSFX('discover', 0.5, true);
                    }
                }

                // 解锁文件
                cardManager.updateCardStatus('file_016', 'unlocked');
                gameState.unlockCard('file_016');
                console.log('[Delete System] file_016 unlocked');

                // 触发解锁通知（显示反馈消息和更新UI）
                unlockManager.notifyFileUnlock(fileDelete2);
                console.log('[Delete System] file_016 unlock notification sent');
            } else {
                console.log('[Delete System] file_016 already unlocked or not found');
            }
        }, 2000);
    };
    deletion1.run();
}

/**
 * 播放删除动画二
 */
function playDeletionAnimation2() {
    if (typeof DeletionAnimation2 === 'undefined') {
        console.error('DeletionAnimation2 not loaded');
        showFeedback(TEXT.animNotAvailable, 'error');
        return;
    }

    // ECG联动：删除动画2开始，更快
    if (window.ecgController) {
        window.ecgController.setMode('delete');
        window.ecgController.setSpeed(4);
        window.ecgController.setAmplitude(1.0);
    }

    // 清除确认提示高亮
    clearConfirmPrompt();

    // 锁定输入
    inputLocked = true;

    // 2s 后返回 SEARCH 模式
    setTimeout(() => {
        inputLocked = false;
        if (currentMode === 'delete') {
            switchToSearchMode();
        }
    }, 2000);

    // 立即更新反馈文本
    showFeedback(TEXT.initDeletion, 'info');

    // 🎵 播放Error BGM（1秒淡入）
    if (window.audioManager) {
        console.log('[BGM] Playing Error BGM for deletion animation 2 (1s fade-in)...');
        audioManager.playMusic('Error.ogg', 1, 1000);
    }

    const deletion2 = new DeletionAnimation2({ glitchEnabled: true });
    deletion2.onComplete = () => {
        console.log('Deletion animation 2 completed');
        showFeedback(TEXT.deletionInProgress, 'info');

        // ✅ 设置删除动画2已完成标记
        gameState.setDeletion2Completed();

        // 隐藏 SORT 和 DELETE 按钮（直到游戏结束）
        document.querySelectorAll('.func-btn').forEach(btn => {
            if (btn.dataset.mode === 'sort' || btn.dataset.mode === 'delete') {
                btn.style.display = 'none';
            }
        });
        console.log('[Delete System] SORT and DELETE buttons hidden');
    };
    deletion2.run();
}

/**
 * 处理姓名输入
 */
function handleNameInput(input) {
    const name = input.trim().toLowerCase();

    // 正确答案是carol或camellia（中文：山茶、珂赛特）
    if (name === 'carol' || name === 'camellia' || name === '山茶' || name === '珂赛特') {
        // 播放删除动画二
        gameState.clearPendingConfirmation();
        playDeletionAnimation2();
    } else {
        // 输入错误
        showFeedback(TEXT.incorrect, 'error');
    }
}

/**
 * 永久禁用指定的 tab
 * @param {string|Array<string>} tabs - 要禁用的 tab 名称或数组
 */
function permanentlyDisableTabs(tabs) {
    const tabsToDisable = Array.isArray(tabs) ? tabs : [tabs];

    tabsToDisable.forEach(tabName => {
        disabledTabs.add(tabName);

        // 添加视觉禁用效果
        const tabBtn = document.querySelector(`.tab-btn[data-type="${tabName}"]`);
        if (tabBtn) {
            tabBtn.classList.add('permanently-disabled');
            tabBtn.style.opacity = '0.3';
            tabBtn.style.cursor = 'not-allowed';
            console.log(`[Tab] Permanently disabled tab: ${tabName}`);
        }
    });
}

// 导出函数到全局作用域，供渲染引擎使用
window.fillClueToInput = fillClueToInput;
window.switchToClueTab = switchToClueTab;
window.selectClue = selectClue;
window.permanentlyDisableTabs = permanentlyDisableTabs;
window.triggerUnlockFlash = triggerUnlockFlash;
window.initApp = initApp;  // 导出initApp供opening界面调用

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 如果有开场界面，等待开场界面完成后再初始化
    if (window.openingActive) {
        console.log('Opening screen active, delaying game initialization...');
        return;
    }
    // 没有开场界面，直接初始化
    initApp();
});