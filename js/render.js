/**
 * 渲染引擎模块
 * 负责所有UI渲染和显示效果
 */

class Renderer {
    /**
     * 构造函数
     */
    constructor() {
        this.readingCompleteCallback = null;  // 阅读完成回调
        this.currentCardId = null;           // 当前渲染的卡片ID
        // 文字样式映射 - 使用CSS变量跟随主题
        // 颜色说明: var(--phosphor-primary) (主色), var(--phosphor-dim) (暗色)
        this.styleMap = {
            'visual': { color: 'var(--phosphor-primary)', description: '视觉描述' },
            'smell': { color: 'var(--phosphor-primary)', description: '嗅觉描述' },
            'sound': { color: 'var(--phosphor-primary)', description: '听觉描述' },
            'important': { color: 'var(--phosphor-primary)', fontWeight: 'bold', description: '重要信息' },
            'clue': { color: '#e0e0e0', className: 'clue-word', description: '线索词（亮白色）' },
            'success': { color: 'var(--phosphor-primary)', description: '成功提示' },
            'normal': { color: 'var(--phosphor-primary)', description: '普通文本' },
            'thought': { color: 'var(--phosphor-dim)', fontStyle: 'italic', description: '内心想法' },
            'dialogue': { color: 'var(--phosphor-primary)', description: '对话内容' }
        };

        // 逐行显示控制器
        this.lineByLineController = null;

        // 打字机效果控制
        this.typewriterSpeed = 30; // 毫秒/字符
        this.typewriterEnabled = false;
    }

    /**
     * 渲染卡片内容
     * @param {HTMLElement} container - 容器元素
     * @param {Object} card - 卡片数据
     * @param {Object} options - 渲染选项
     */
    renderCardContent(container, card, options = {}) {
        // 设置当前卡片ID
        this.setCurrentCard(card.id);

        // 清空容器
        container.innerHTML = '';

        // 根据卡片状态决定显示的内容
        let contentToShow = card.content;

        // 如果是问答解锁的部分状态，只显示预览内容
        if (options.preview && options.previewLines !== undefined) {
            contentToShow = card.content.slice(0, options.previewLines);
        }

        // 创建内容包装器
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'card-content-wrapper';

        // 检查是否包含图片
        const hasImage = contentToShow.some(segment => segment.type === 'image');

        // 如果有图片，先渲染图片区域
        if (hasImage) {
            const imageContainer = this.renderImageSection(contentToShow.filter(s => s.type === 'image'));
            contentWrapper.appendChild(imageContainer);
        }

        // 渲染文本内容
        const textContainer = this.renderTextContent(contentToShow.filter(s => s.type !== 'image'), card.is_read, card.type);
        contentWrapper.appendChild(textContainer);

        // 添加到容器
        container.appendChild(contentWrapper);

        // 如果需要逐行显示效果
        // 只有在有内容且未读时才启用逐行显示（preview_lines=0时跳过）
        if (options.lineByLine && !card.is_read && contentToShow.length > 0) {
            this.setupLineByLineDisplay(textContainer, card);
        }

        return contentWrapper;
    }

    /**
     * 渲染文本内容
     * @param {Array} contentSegments - 内容段落数组
     * @param {boolean} isRead - 是否已读
     * @param {string} cardType - 卡片类型 ('memory' 或 'file')
     */
    renderTextContent(contentSegments, isRead, cardType) {
        const textContainer = document.createElement('div');
        textContainer.className = 'text-content-container';

        let paragraphIndex = 0;
        let i = 0;

        while (i < contentSegments.length) {
            const segment = contentSegments[i];

            if (segment.type === 'choice') {
                // 创建choice占位符
                const placeholder = document.createElement('div');
                placeholder.className = 'content-paragraph choice-placeholder';
                placeholder.dataset.isChoice = 'true';
                placeholder.dataset.choiceData = JSON.stringify(segment);
                placeholder.dataset.lineIndex = paragraphIndex;

                // 如果未读且不是第一段，初始隐藏
                if (!isRead && paragraphIndex > 0) {
                    placeholder.style.display = 'none';
                }

                textContainer.appendChild(placeholder);
                paragraphIndex++;
                i++;
            } else if (segment.type === 'auto_sequence') {
                // 创建自动序列占位符
                const placeholder = document.createElement('div');
                placeholder.className = 'content-paragraph auto-sequence-placeholder';
                placeholder.dataset.isAutoSequence = 'true';
                placeholder.dataset.delay = segment.delay || 200;
                placeholder.dataset.content = JSON.stringify(segment.content);
                placeholder.dataset.lineIndex = paragraphIndex;

                // 如果未读且不是第一段，初始隐藏
                if (!isRead && paragraphIndex > 0) {
                    placeholder.style.display = 'none';
                }

                textContainer.appendChild(placeholder);
                paragraphIndex++;
                i++;
            } else {
                // 收集连续的非choice和非auto_sequence文本段落
                const textSegments = [];
                while (i < contentSegments.length &&
                       contentSegments[i].type !== 'choice' &&
                       contentSegments[i].type !== 'auto_sequence') {
                    textSegments.push(contentSegments[i]);
                    i++;
                }

                // 根据卡片类型选择分组方法
                let paragraphGroups;
                if (cardType === 'file') {
                    // File类型：按空行分组成块，每个块内的段落分别显示
                    const blocks = this.groupFileIntoParagraphBlocks(textSegments);

                    // 为每个块创建一个容器div（作为逐行显示的单元）
                    blocks.forEach((block, blockIndex) => {
                        const blockContainer = document.createElement('div');
                        blockContainer.className = 'content-paragraph file-block';
                        blockContainer.dataset.lineIndex = paragraphIndex;

                        // 如果启用逐行显示且未读，初始隐藏除第一块外的块
                        if (!isRead && paragraphIndex > 0) {
                            blockContainer.style.display = 'none';
                        }

                        // 在非第一个块的内容前添加空白行（作为块的一部分）
                        if (blockIndex > 0) {
                            const blankLine = document.createElement('div');
                            blankLine.innerHTML = '&nbsp;'; // 使用不间断空格确保高度
                            blankLine.style.minHeight = '1em'; // 确保空白行有高度
                            blankLine.style.marginBottom = '0.5em'; // 与下方内容保持间距
                            blockContainer.appendChild(blankLine);
                        }

                        // 块内的segments按breakAfter分组到同一行
                        let currentLine = [];
                        block.forEach((seg, segIndex) => {
                            currentLine.push(seg);

                            // 如果有breakAfter标记或是最后一个segment，创建段落行
                            if (seg.breakAfter || segIndex === block.length - 1) {
                                const paragraphLine = document.createElement('p');
                                paragraphLine.style.margin = '0.5em 0'; // 段落间适当间距

                                // 将当前行的所有segments添加到同一个<p>中
                                currentLine.forEach(lineSeg => {
                                    const element = this.createTextElement(lineSeg);
                                    paragraphLine.appendChild(element);
                                });

                                blockContainer.appendChild(paragraphLine);
                                currentLine = [];
                            }
                        });

                        textContainer.appendChild(blockContainer);
                        paragraphIndex++;
                    });
                } else {
                    // Memory类型：使用原有逻辑
                    paragraphGroups = this.groupIntoParagraphs(textSegments);

                    // 为每组创建一个<p>，组内segments共享同一段落
                    paragraphGroups.forEach(group => {
                        const paragraph = document.createElement('p');
                        paragraph.className = 'content-paragraph';
                        paragraph.dataset.lineIndex = paragraphIndex;

                        // 如果启用逐行显示且未读，初始隐藏除第一段外的段落
                        if (!isRead && paragraphIndex > 0) {
                            paragraph.style.display = 'none';
                        }

                        // 检查组内是否有delay属性（用于最后一行等特殊情况）
                        group.forEach(seg => {
                            if (seg.delay) {
                                paragraph.dataset.customDelay = seg.delay;
                            }
                            const element = this.createTextElement(seg);
                            paragraph.appendChild(element);
                        });

                        textContainer.appendChild(paragraph);
                        paragraphIndex++;
                    });
                }
            }
        }

        return textContainer;
    }

    /**
     * 创建文本元素
     * @param {Object} segment - 文本段落
     */
    createTextElement(segment) {
        const span = document.createElement('span');
        const style = this.styleMap[segment.style] || this.styleMap.normal;

        // 应用样式
        if (style.color) span.style.color = style.color;
        if (style.fontWeight) span.style.fontWeight = style.fontWeight;
        if (style.fontStyle) span.style.fontStyle = style.fontStyle;
        if (style.className) span.className = style.className;

        // 检测decay是否激活，如果激活则渲染乱码
        const isDecayActive = typeof memoryDecay !== 'undefined' && memoryDecay.isActive;
        const hasScramble = isDecayActive && memoryDecay.scramble;

        if (hasScramble) {
            // 渲染乱码
            span.textContent = memoryDecay.scramble.scrambleText(segment.text, false);
            // 保存原文到data属性
            span.setAttribute('data-original-text', segment.text);
        } else {
            // 正常渲染原文
            span.textContent = segment.text;
        }

        // 如果是线索词，添加点击事件
        if (segment.style === 'clue') {
            // 检查是否已使用，降低亮度
            const clueText = segment.text.toLowerCase().trim();
            if (window.gameState && window.gameState.isClueUsed(clueText)) {
                span.classList.add('clue-used');
                span.style.color = '#a0a0a0';
            }

            span.onclick = (event) => {
                // 阻止事件冒泡，避免触发父元素的点击事件（如"显示下一行"）
                event.stopPropagation();

                // 阅读锁定时阻止
                if (window.readingLockManager && window.readingLockManager.isLocked()) {
                    return;
                }

                // 切换到Clue标签页，并传入要选中的 clue
                if (window.switchToClueTab) {
                    window.switchToClueTab(segment.text);
                }

                // 填充线索词到输入框
                if (window.fillClueToInput) {
                    window.fillClueToInput(segment.text);
                }
            };
        }

        return span;
    }

    /**
     * 将内容段落分组成段落（Memory类型使用）
     * @param {Array} segments - 内容段落数组
     * @param {string} cardType - 卡片类型 ('memory' 或 'file')
     */
    groupIntoParagraphs(segments, cardType = 'memory') {
        const paragraphs = [];
        let currentParagraph = [];

        // 对于file类型，每个segment都是独立的行（包括空行）
        if (cardType === 'file') {
            segments.forEach(segment => {
                // 每个segment都作为独立的段落
                paragraphs.push([segment]);
            });
            return paragraphs;
        }

        // 对于memory类型，使用原有的逻辑
        segments.forEach(segment => {
            currentParagraph.push(segment);

            // 如果文本包含句号或段落结束标记，创建新段落
            if (segment.text.includes('。') ||
                segment.text.includes('！') ||
                segment.text.includes('？') ||
                segment.breakAfter) {
                paragraphs.push([...currentParagraph]);
                currentParagraph = [];
            }
        });

        // 添加最后一段
        if (currentParagraph.length > 0) {
            paragraphs.push(currentParagraph);
        }

        return paragraphs.length > 0 ? paragraphs : [segments];
    }

    /**
     * 将File类型内容分组成段落块
     * File类型规则：
     * - 每个content元素是独立的段落（在同一个<p>中但显示为独立行）
     * - 连续的非空段落组成一个块（一起显示，无需click）
     * - 空行作为块的分隔（需要click to continue）
     * @param {Array} segments - 内容段落数组
     */
    groupFileIntoParagraphBlocks(segments) {
        const blocks = [];
        let currentBlock = [];

        segments.forEach((segment, index) => {
            // 检查是否为空行（空文本或只有空白）
            const isEmptyLine = !segment.text || segment.text.trim() === '';

            if (isEmptyLine) {
                // 空行：结束当前块，开始新块
                if (currentBlock.length > 0) {
                    blocks.push([...currentBlock]);
                    currentBlock = [];
                }
                // 空行本身不加入任何块，作为分隔符
            } else {
                // 非空行：加入当前块
                currentBlock.push(segment);
            }
        });

        // 添加最后一个块
        if (currentBlock.length > 0) {
            blocks.push(currentBlock);
        }

        return blocks.length > 0 ? blocks : [[]];
    }

    /**
     * 渲染图片区域
     * @param {Array} imageSegments - 图片段落数组
     */
    renderImageSection(imageSegments) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-display';

        imageSegments.forEach(segment => {
            if (segment.src) {
                // 真实图片
                const img = document.createElement('img');
                img.src = segment.src;
                img.alt = segment.alt || 'Image';
                img.className = 'card-image';
                imageContainer.appendChild(img);
            } else {
                // 占位符
                const placeholder = document.createElement('div');
                placeholder.className = 'image-placeholder';
                placeholder.textContent = segment.text || '[Image]';
                imageContainer.appendChild(placeholder);
            }
        });

        return imageContainer;
    }

    /**
     * 设置逐行显示效果
     * @param {HTMLElement} container - 文本容器
     * @param {Object} card - 卡片对象
     */
    setupLineByLineDisplay(container, card = null) {
        const paragraphs = container.querySelectorAll('.content-paragraph');

        // 创建逐行显示控制器，传递card
        this.lineByLineController = new LineByLineController(paragraphs, card);

        // 添加继续提示
        const continueHint = document.createElement('p');
        continueHint.className = 'continue-hint';
        continueHint.innerHTML = 'Click to continue';
        container.appendChild(continueHint);

        // 添加点击事件
        container.addEventListener('click', () => {
            // 如果是全自动播放模式，忽略用户点击
            if (this.lineByLineController.fullAutoPlayMode) {
                console.log('[LineByLine] Full auto-play mode, ignoring user click');
                return;
            }

            this.lineByLineController.showNext();

            // 如果全部显示完成，隐藏提示
            if (this.lineByLineController.isComplete()) {
                continueHint.style.display = 'none';
                // 🔧 检查是否是预览模式（通过 onPreviewComplete 回调判断）
                // 预览模式下不触发阅读完成，等待问答完成后再触发
                if (!this.lineByLineController.onPreviewComplete) {
                    // 只有非预览模式才触发阅读完成回调
                    this.triggerReadingComplete();
                }
            }
        });

        // 添加键盘事件（Enter键和ESC键）
        const handleKeyboard = (e) => {
            if (!e.target.matches('input, textarea')) {
                if (e.key === 'Enter') {
                    e.preventDefault();

                    // 如果是全自动播放模式，忽略用户Enter键
                    if (this.lineByLineController.fullAutoPlayMode) {
                        console.log('[LineByLine] Full auto-play mode, ignoring user Enter key');
                        return;
                    }

                    this.lineByLineController.showNext();

                    if (this.lineByLineController.isComplete()) {
                        continueHint.style.display = 'none';
                        document.removeEventListener('keydown', handleKeyboard);
                        // 🔧 检查是否是预览模式（通过 onPreviewComplete 回调判断）
                        // 预览模式下不触发阅读完成，等待问答完成后再触发
                        if (!this.lineByLineController.onPreviewComplete) {
                            // 只有非预览模式才触发阅读完成回调
                            this.triggerReadingComplete();
                        }
                    }
                } else if (e.key === 'Escape' && this.lineByLineController.isAutoPlaying) {
                    e.preventDefault();
                    this.lineByLineController.skipAutoSequence();
                }
            }
        };
        document.addEventListener('keydown', handleKeyboard);
    }

    /**
     * 渲染卡片列表
     * @param {HTMLElement} container - 容器元素
     * @param {Array} cards - 卡片数组
     * @param {Object} gameState - 游戏状态
     */
    renderCardList(container, cards, gameState) {
        if (!container) {
            console.error('[Renderer] ERROR: Container is null!');
            return;
        }

        container.innerHTML = '';

        if (!cards || cards.length === 0) {
            container.innerHTML = '<p style="color: #666; padding: 10px;">No items found</p>';
            return;
        }

        // 获取当前正在阅读的卡片ID
        const currentCardId = gameState.getState().current_card;

        cards.forEach((card, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';

            // 设置状态样式
            const statusClass = this.getCardStatusClass(card, gameState);

            if (statusClass) {
                fileItem.classList.add(statusClass);
            }

            // 检查是否是当前正在阅读的卡片
            const isActive = card.id === currentCardId;
            if (isActive) {
                fileItem.classList.add('active');
            }

            // 设置图标
            const icon = this.getCardIcon(card);

            // 检测decay是否激活，如果激活则渲染乱码
            let displayTitle = card.title;
            let saveOriginalToData = false;
            if (typeof memoryDecay !== 'undefined' && memoryDecay.isActive && memoryDecay.scramble) {
                displayTitle = memoryDecay.scramble.scrambleText(card.title, false);
                saveOriginalToData = true;
            }

            // 创建内容 - 选中项添加黑方块 █
            const activeMarker = isActive ? '<span class="active-marker">█</span>' : '';
            fileItem.innerHTML = `
                ${activeMarker}<span class="file-name" ${saveOriginalToData ? `data-original-text="${card.title}"` : ''}>${displayTitle}</span>
            `;

            // 添加data属性存储卡片ID（用于点击事件）
            fileItem.setAttribute('data-card-id', card.id);

            // 检查是否应该隐藏（删除阶段）
            if (typeof memoryDecay !== 'undefined' && memoryDecay.hiddenCards && memoryDecay.hiddenCards.has(card.id)) {
                fileItem.style.display = 'none';
            }

            container.appendChild(fileItem);
        });
    }

    /**
     * 渲染线索词列表
     * @param {HTMLElement} container - 容器元素
     * @param {Array} discoveredClues - 已发现的线索词
     * @param {Array} usedClues - 已使用的线索词
     */
    renderClueList(container, discoveredClues, usedClues) {
        container.innerHTML = '';

        discoveredClues.forEach(clue => {
            const clueItem = document.createElement('div');
            clueItem.className = 'file-item';

            // 设置状态样式
            if (usedClues.includes(clue)) {
                clueItem.classList.add('read');  // 已使用显示为白色
            } else {
                clueItem.classList.add('unread');  // 未使用显示为蓝色
            }

            clueItem.innerHTML = `
                <span class="file-name">${clue}</span>
            `;

            // 添加点击事件：填充到输入框（已使用的 clue 不可点击）
            clueItem.onclick = () => {
                if (usedClues.includes(clue)) {
                    return;  // 已使用的 clue 不响应点击
                }
                if (window.fillClueToInput) {
                    window.fillClueToInput(clue);
                }
            };

            container.appendChild(clueItem);
        });
    }

    /**
     * 获取卡片状态样式类
     * @param {Object} card - 卡片对象
     * @param {Object} gameState - 游戏状态
     */
    getCardStatusClass(card, gameState) {
        if (card.status === 'locked') {
            return 'locked';
        } else if (card.status === 'partial') {
            return 'locked';
        } else if (gameState.isBlueMarked(card.id)) {
            // 蓝色标记优先（用于/sort year功能）
            return 'unread';
        } else if (!gameState.isCardRead(card.id)) {
            return 'unread';
        } else {
            return 'read';
        }
    }

    /**
     * 获取卡片图标
     * @param {Object} card - 卡片对象
     */
    getCardIcon(card) {
        if (card.status === 'locked' || card.status === 'partial') {
            return '🔒';
        }
        return '📄';
    }

    /**
     * 设置阅读完成回调
     * @param {Function} callback - 回调函数
     */
    onReadingComplete(callback) {
        this.readingCompleteCallback = callback;
    }

    /**
     * 触发阅读完成
     */
    triggerReadingComplete() {
        if (this.readingCompleteCallback && this.currentCardId) {
            this.readingCompleteCallback(this.currentCardId);

            // 🔧 检查当前卡片状态，如果是 partial（预览模式），不触发解锁
            const card = window.cardManager && window.cardManager.getCardById(this.currentCardId);
            if (card && card.status === 'partial') {
                return;
            }

            // 检查是否有file被阅读触发解锁
            if (typeof unlockManager !== 'undefined' && unlockManager) {
                const unlockedFiles = unlockManager.checkReadTriggeredUnlocks(this.currentCardId);

                // ⭐ 如果有新file被解锁，延迟刷新UI确保状态完全更新
                if (unlockedFiles && unlockedFiles.length > 0) {
                    setTimeout(() => {
                        // 自动切换到 File tab
                        if (typeof gameState !== 'undefined' && gameState) {
                            gameState.setTab('file');
                        }
                        // 更新Tab按钮的视觉状态
                        document.querySelectorAll('.tab-btn').forEach(btn => {
                            btn.classList.remove('active');
                            if (btn.getAttribute('data-type') === 'file') {
                                btn.classList.add('active');
                            }
                        });

                        if (typeof refreshUI === 'function') {
                            refreshUI();
                        } else if (typeof window.refreshUI === 'function') {
                            window.refreshUI();
                        } else {
                            console.warn('[Renderer] refreshUI function not found');
                        }
                        // 触发解锁闪烁效果
                        if (typeof window.triggerUnlockFlash === 'function') {
                            window.triggerUnlockFlash(unlockedFiles);
                        }
                    }, 100);  // 100ms延迟确保状态完全更新
                }
            }
        }
    }

    /**
     * 设置当前卡片ID（渲染时调用）
     * @param {string} cardId - 卡片ID
     */
    setCurrentCard(cardId) {
        this.currentCardId = cardId;
    }

    /**
     * 检查是否阅读完成
     * @returns {boolean} 是否完成
     */
    isReadingComplete() {
        if (this.lineByLineController) {
            return this.lineByLineController.isComplete();
        }
        // 普通显示模式默认为完成
        return true;
    }

    /**
     * 计算未读数量
     * @param {string} type - 卡片类型 ('memory' 或 'file')
     * @param {Object} cardManager - 卡片管理器
     * @param {Object} gameState - 游戏状态
     * @returns {number} 未读数量
     */
    getUnreadCount(type, cardManager, gameState) {
        const cards = cardManager.getCardsByType(type);

        const unreadCards = cards.filter(card => {
            const isUnlocked = card.status === 'unlocked';
            const isRead = gameState.isCardRead(card.id);
            const isDiscovered = gameState.isCardDiscovered(card.id);

            // 只有完全解锁且未读的才算未读（蓝色状态）
            return isUnlocked && !isRead && isDiscovered;
        });

        return unreadCards.length;
    }

    /**
     * 更新Tab未读指示器
     * @param {Object} cardManager - 卡片管理器
     * @param {Object} gameState - 游戏状态
     */
    updateTabIndicators(cardManager, gameState) {
        // 更新Memory Tab
        const memoryTab = document.querySelector('.tab-btn[data-type="memory"]');

        if (memoryTab) {
            const memoryUnread = this.getUnreadCount('memory', cardManager, gameState);
            this.updateTabDot(memoryTab, memoryUnread);
        }

        // 更新File Tab
        const fileTab = document.querySelector('.tab-btn[data-type="file"]');

        if (fileTab) {
            const fileUnread = this.getUnreadCount('file', cardManager, gameState);
            this.updateTabDot(fileTab, fileUnread);
        }

        // Clue Tab不需要未读指示器
    }

    /**
     * 更新单个Tab的未读星号
     * @param {HTMLElement} tab - Tab元素
     * @param {number} count - 未读数量
     */
    updateTabDot(tab, count) {
        let notification = tab.querySelector('.tab-notification');

        // 如果星号不存在，创建它
        if (!notification) {
            notification = document.createElement('span');
            notification.className = 'tab-notification';
            notification.textContent = '*';
            tab.appendChild(notification);
        }

        // 根据数量显示或隐藏星号
        if (count > 0) {
            notification.style.display = 'inline';
        } else {
            notification.style.display = 'none';
        }
    }

    /**
     * 启用打字机效果
     * @param {boolean} enable - 是否启用
     */
    enableTypewriter(enable) {
        this.typewriterEnabled = enable;
    }

    /**
     * 设置打字机速度
     * @param {number} speed - 速度（毫秒/字符）
     */
    setTypewriterSpeed(speed) {
        this.typewriterSpeed = speed;
    }

    /**
     * 渲染问答解锁UI
     * @param {HTMLElement} container - 容器元素
     * @param {Object} question - 问题对象
     * @param {Function} onSubmit - 提交回调
     */
    renderQuestionUI(container, question, onSubmit) {
        // 创建问题区域 - 虚线边框（和左侧分割线一致）
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-section';
        questionDiv.style.marginTop = '20px';
        questionDiv.style.padding = '15px';
        questionDiv.style.border = '2px dashed var(--phosphor-dim)';

        // 仅针对 memory 类型卡片显示"压抑"提示
        if (question.cardType === 'memory') {
            const lang = localStorage.getItem('gameLang') || 'en';
            const hintP = document.createElement('p');
            hintP.style.color = '#FFFF00';
            hintP.style.marginBottom = '10px';
            hintP.style.fontSize = '20px';
            hintP.textContent = lang === 'zh'
                ? '检测到心理防御机制[压抑]，需输入关键内容'
                : 'Defense mechanism detected: [Repression]. Keyword input required.';
            questionDiv.appendChild(hintP);
        }

        // 问题文本 - 字号和content一致
        const questionP = document.createElement('p');
        questionP.style.color = '#FFFF00';
        questionP.style.marginBottom = '15px';
        questionP.style.fontSize = '24px';
        questionP.innerHTML = question.text;
        questionDiv.appendChild(questionP);

        // 输入行 - terminal风格（复用 .input-line 结构）
        const inputLine = document.createElement('div');
        inputLine.className = 'input-line question-input-line';

        // Prompt: >
        const prompt = document.createElement('span');
        prompt.className = 'prompt';
        prompt.textContent = '>';
        prompt.style.fontSize = '24px';

        // 输入框 - 无边框，复用 .command-input 样式
        const answerInput = document.createElement('input');
        answerInput.type = 'text';
        answerInput.className = 'command-input answer-input';
        answerInput.id = `answer-${question.cardId}`;
        answerInput.style.fontSize = '24px';

        // 光标块 - 复用 .cursor-block
        const cursorBlock = document.createElement('span');
        cursorBlock.className = 'cursor-block';

        // 创建测量文字宽度的隐藏span（模仿terminal实现）
        const measureSpan = document.createElement('span');
        measureSpan.style.cssText = `
            position: absolute;
            visibility: hidden;
            white-space: pre;
            font-family: 'VT323', monospace;
            font-size: 24px;
        `;
        document.body.appendChild(measureSpan);

        // 动态更新输入框宽度，让光标紧跟文字
        const updateInputWidth = () => {
            measureSpan.textContent = answerInput.value || '';
            // 设置宽度 + 12px 余量（为 text-shadow 辉光留空间）
            const width = Math.max(measureSpan.offsetWidth, 2) + 12;
            answerInput.style.width = width + 'px';
            // 重置 input 内部滚动位置，防止文字偏移遮挡
            answerInput.scrollLeft = 0;
        };

        // 组装输入行
        inputLine.appendChild(prompt);
        inputLine.appendChild(answerInput);
        inputLine.appendChild(cursorBlock);

        // 立即设置初始宽度，避免光标跳动
        updateInputWidth();

        // 焦点管理 - 聚焦时光标闪烁
        answerInput.addEventListener('focus', () => {
            inputLine.classList.add('cursor-active');
            updateInputWidth();
        });
        answerInput.addEventListener('blur', () => {
            inputLine.classList.remove('cursor-active');
        });
        answerInput.addEventListener('input', updateInputWidth);

        // 提交按钮 - [SUBMIT] 样式（复用 .func-btn）
        const submitBtn = document.createElement('span');
        const currentLang = localStorage.getItem('gameLang') || 'en';
        submitBtn.textContent = currentLang === 'zh' ? '[提交]' : '[SUBMIT]';
        submitBtn.className = 'func-btn answer-submit';
        submitBtn.style.marginLeft = '15px';
        submitBtn.style.cursor = 'pointer';

        // 反馈区域
        const feedbackDiv = document.createElement('div');
        feedbackDiv.id = `answer-feedback-${question.cardId}`;
        feedbackDiv.style.marginTop = '10px';
        feedbackDiv.style.fontSize = '16px';
        feedbackDiv.style.color = '#FF3333';

        // 事件处理
        const handleSubmit = () => {
            const answer = answerInput.value.trim();
            if (!answer) {
                const lang = localStorage.getItem('gameLang') || 'en';
                feedbackDiv.textContent = lang === 'zh' ? '请输入内容。' : 'Please enter an answer.';
                return;
            }

            const result = onSubmit(answer);

            if (result.correct) {
                feedbackDiv.style.color = '#00FF00';
                feedbackDiv.textContent = result.message;

                // 答对后禁用输入框和按钮
                answerInput.disabled = true;
                answerInput.blur();
                inputLine.classList.remove('cursor-active');
                submitBtn.style.opacity = '0.5';
                submitBtn.style.cursor = 'not-allowed';
                submitBtn.onclick = null;
            } else {
                feedbackDiv.style.color = '#FF3333';
                feedbackDiv.textContent = result.message;
                if (result.hint) {
                    feedbackDiv.textContent += ` ${result.hint}`;
                }
            }
        };

        submitBtn.onclick = handleSubmit;
        answerInput.onkeypress = (e) => {
            if (e.key === 'Enter') handleSubmit();
        };

        // 组装UI
        const inputRow = document.createElement('div');
        inputRow.style.display = 'flex';
        inputRow.style.alignItems = 'center';
        inputRow.appendChild(inputLine);
        inputRow.appendChild(submitBtn);
        questionDiv.appendChild(inputRow);
        questionDiv.appendChild(feedbackDiv);

        container.appendChild(questionDiv);

        // 点击区域控制：右上(card-content-area)聚焦问答，左侧失焦
        const cardContentArea = document.querySelector('.card-content-area');
        const leftSidebar = document.querySelector('.left-sidebar');

        if (cardContentArea) {
            cardContentArea.addEventListener('click', (e) => {
                // 避免点击按钮时触发
                if (!e.target.classList.contains('func-btn') && !answerInput.disabled) {
                    answerInput.focus();
                }
            });
        }

        if (leftSidebar) {
            leftSidebar.addEventListener('click', () => {
                answerInput.blur();
            });
        }

        // 自动聚焦
        setTimeout(() => answerInput.focus(), 100);

        return questionDiv;
    }

    /**
     * 渲染选项UI（显示在Terminal输入区）
     * @param {HTMLElement} inputArea - Terminal输入区（.input-area）
     * @param {Object} choiceData - 选择数据
     * @param {Function} onSelect - 选择回调 (result) => void
     */
    renderChoiceUI(inputArea, choiceData, onSelect) {
        console.log('[Choice] renderChoiceUI called', choiceData);

        // 1. 隐藏输入框和反馈区
        const commandInput = inputArea.querySelector('.command-input');
        const inputBox = inputArea.querySelector('.input-box');
        const feedbackArea = inputArea.querySelector('.feedback-area');

        if (commandInput) commandInput.style.display = 'none';
        if (inputBox) inputBox.style.display = 'none';
        if (feedbackArea) feedbackArea.style.display = 'none';

        // 隐藏"click to continue"提示
        const continueHint = document.querySelector('.continue-hint');
        if (continueHint) {
            continueHint.style.display = 'none';
        }

        // 添加闪烁动画CSS（如果还没有）
        if (!document.getElementById('choice-blink-style')) {
            const style = document.createElement('style');
            style.id = 'choice-blink-style';
            style.textContent = `
                @keyframes blink {
                    0%, 49% { opacity: 1; }
                    50%, 100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        // 2. 创建选项容器（无边框，纯文本风格）
        const choiceDiv = document.createElement('div');
        choiceDiv.className = 'choice-section';
        choiceDiv.id = 'active-choice-ui';
        choiceDiv.style.padding = '20px 20px 10px 20px';  // 增加顶部间距

        // 3. 创建选项列表
        let currentIndex = 0;
        const optionElements = [];

        choiceData.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'choice-option';
            optionDiv.style.color = '#00FF00';
            optionDiv.style.fontSize = '18px';  // 增大字号
            optionDiv.style.margin = '10px 0';  // 增加选项间距
            optionDiv.style.cursor = 'pointer';  // 显示可点击指针
            optionDiv.dataset.index = index;  // 保存索引

            // 默认第一个选中，前面显示 "> "（加空格）
            if (index === 0) {
                // 使用span包裹>，添加闪烁效果
                const arrow = document.createElement('span');
                arrow.className = 'choice-arrow';
                arrow.textContent = '> ';
                arrow.style.animation = 'blink 1s step-end infinite';

                optionDiv.appendChild(arrow);
                optionDiv.appendChild(document.createTextNode(option.text));
            } else {
                optionDiv.textContent = '   ' + option.text;  // 3个空格对齐（> + 空格）
            }

            optionElements.push(optionDiv);
            choiceDiv.appendChild(optionDiv);
        });

        // 4. 更新选中状态函数（只改变">"符号位置，添加闪烁效果）
        const updateSelection = (newIndex) => {
            optionElements.forEach((el, i) => {
                const optionText = choiceData.options[i].text;
                el.innerHTML = '';  // 清空内容

                if (i === newIndex) {
                    // 选中：添加闪烁的>
                    const arrow = document.createElement('span');
                    arrow.className = 'choice-arrow';
                    arrow.textContent = '> ';
                    arrow.style.animation = 'blink 1s step-end infinite';
                    el.appendChild(arrow);
                    el.appendChild(document.createTextNode(optionText));
                } else {
                    // 未选中：3个空格对齐
                    el.textContent = '   ' + optionText;
                }
            });
            currentIndex = newIndex;
        };

        // 5. 确认选择的处理函数
        const confirmSelection = () => {
            const selectedOption = choiceData.options[currentIndex];

            // 移除监听器
            document.removeEventListener('keydown', handleKeydown);
            optionElements.forEach(el => {
                el.removeEventListener('click', handleClick);
            });

            // 移除选项UI
            choiceDiv.remove();

            // 触发回调，传递result和选中的文本
            // 注意：不再恢复输入框，保持terminal的简洁状态
            onSelect(selectedOption.result, selectedOption.text);
        };

        // 6. 键盘事件处理
        const handleKeydown = (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                const newIndex = currentIndex > 0 ? currentIndex - 1 : optionElements.length - 1;
                updateSelection(newIndex);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const newIndex = currentIndex < optionElements.length - 1 ? currentIndex + 1 : 0;
                updateSelection(newIndex);
            } else if (e.key === 'Enter' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                confirmSelection();
            }
        };

        // 7. 点击事件处理
        const handleClick = (e) => {
            const clickedIndex = parseInt(e.currentTarget.dataset.index);

            if (clickedIndex === currentIndex) {
                // 点击已选中的选项，提交
                confirmSelection();
            } else {
                // 点击未选中的选项，切换选中状态
                updateSelection(clickedIndex);
            }
        };

        // 8. 添加监听器
        document.addEventListener('keydown', handleKeydown);
        optionElements.forEach(el => {
            el.addEventListener('click', handleClick);
        });

        // 9. 添加到输入区（在inputBoxArea的最前面）
        const inputBoxArea = inputArea.querySelector('.input-box-area');
        if (inputBoxArea) {
            inputBoxArea.insertBefore(choiceDiv, inputBoxArea.firstChild);
        } else {
            console.error('[Choice] .input-box-area not found!');
        }

        return choiceDiv;
    }
}

/**
 * 逐行显示控制器
 */
class LineByLineController {
    constructor(paragraphs, card = null) {
        this.paragraphs = Array.from(paragraphs);
        this.currentIndex = 0;
        this.complete = false;
        this.card = card; // 保存卡片引用

        // 新增：自动播放相关属性
        this.autoPlayQueue = [];      // 自动播放队列
        this.isAutoPlaying = false;   // 自动播放状态
        this.autoPlayTimer = null;    // 定时器引用
        this.blockInput = false;      // 输入屏蔽标志
        this.autoPlayContainer = null; // 自动播放的容器

        // 全自动播放模式
        this.fullAutoPlayMode = false;  // 是否进入全自动播放模式
        this.autoPlayDelay = 1500;      // 默认自动播放延迟
        this.firstChoiceMade = false;   // 是否已做出第一次选择

        // 从卡片读取配置
        if (card) {
            if (card.auto_play_delay) {
                this.autoPlayDelay = card.auto_play_delay;
            }
        }

        // 显示第一段
        if (this.paragraphs.length > 0) {
            this.paragraphs[0].style.display = 'block';

            // 立即检查第一段是否是自动序列
            if (this.paragraphs[0].dataset.isAutoSequence === 'true') {
                // 延迟触发，让UI先渲染
                setTimeout(() => this.showNext(), 100);
            }
        }
    }

    /**
     * 显示下一段
     */
    /**
     * 根据段落文本长度计算自动播放延时
     * 基础延时2000ms，每40个字符增加800ms
     */
    calculateAutoPlayDelay(paragraph) {
        // 如果段落有自定义delay，优先使用
        if (paragraph.dataset.customDelay) {
            return parseInt(paragraph.dataset.customDelay);
        }

        // 获取段落文本内容
        const text = paragraph.textContent || '';
        const textLength = text.length;

        // 基础延时 + 额外延时（每40字符800ms，长句获得更多时间）
        const baseDelay = 2000;  // 增加基础延时
        const extraDelay = Math.floor(textLength / 40) * 800;  // 更频繁、更大的增量
        const totalDelay = baseDelay + extraDelay;

        return totalDelay;
    }

    showNext() {
        // 50ms 节流，防止多个监听器同时调用导致重复执行
        const now = Date.now();
        if (this.lastShowNextTime && now - this.lastShowNextTime < 50) {
            return;
        }
        this.lastShowNextTime = now;

        if (this.complete) {
            return;
        }

        // 如果正在自动播放，忽略输入
        if (this.blockInput) {
            return;
        }

        // 检查是否有活动的choice UI，如果有则暂停
        const activeChoiceUI = document.querySelector('#active-choice-ui');
        if (activeChoiceUI) {
            return;
        }

        this.currentIndex++;

        // 🔧 先检查是否超出范围
        if (this.currentIndex >= this.paragraphs.length) {
            this.complete = true;

            // 如果是全自动播放模式，解除锁定并恢复提示
            if (this.fullAutoPlayMode) {
                this.fullAutoPlayMode = false;

                // 恢复"click to continue"提示
                const continueHint = document.querySelector('.continue-hint');
                if (continueHint) {
                    continueHint.style.display = '';
                }
            }

            // 触发预览完成回调（用于显示问答UI）
            if (this.onPreviewComplete) {
                setTimeout(() => {
                    this.onPreviewComplete();
                }, 100);
            }
            return;
        }

        // 显示下一个段落
        const nextParagraph = this.paragraphs[this.currentIndex];

        // 检查是否是choice占位符
        if (nextParagraph.dataset.isChoice === 'true') {

                // 解析choice数据
                const choiceData = JSON.parse(nextParagraph.dataset.choiceData);

                // 自动选择第一个选项
                const firstOption = choiceData.options[0];
                const selectedText = firstOption.text;

                // 插入选中的选项文本（灰白色、娟秀字体）
                const selectedP = document.createElement('p');
                selectedP.className = 'content-paragraph choice-selected';
                selectedP.style.color = '#c0c0c0';  // 灰白色
                selectedP.style.fontFamily = 'Georgia, "Times New Roman", serif';  // 娟秀的衬线字体
                selectedP.style.fontStyle = 'italic';  // 斜体
                selectedP.style.fontSize = '18px';  // 增大字号
                selectedP.style.marginTop = '10px';
                selectedP.style.marginBottom = '10px';
                selectedP.style.opacity = '0.85';
                selectedP.textContent = selectedText;

                // 在占位符后面插入选中文本
                nextParagraph.insertAdjacentElement('afterend', selectedP);

                // 移除占位符
                nextParagraph.remove();

                // 刷新特效
                if (window.scrambleEffect && window.scrambleEffect.enabled) {
                    window.scrambleEffect.refresh();
                }

                // 滚动到新内容
                this.scrollToElement(selectedP);

                // 递增索引，用户点击后显示下一行
                this.currentIndex++;
                return;
            } else if (nextParagraph.dataset.isAutoSequence === 'true') {
                // 检查是否是自动序列占位符

                // 解析自动序列数据
                const delay = parseInt(nextParagraph.dataset.delay) || 200;
                const content = JSON.parse(nextParagraph.dataset.content);

                // 显示占位符（虽然它是空的）
                nextParagraph.style.display = 'block';

                // 保存插入点：创建一个标记元素在占位符位置
                const marker = document.createElement('span');
                marker.className = 'auto-sequence-insert-marker';
                marker.style.display = 'none';
                nextParagraph.insertAdjacentElement('afterend', marker);

                // 移除占位符
                nextParagraph.remove();

                // 从段落列表中移除
                this.paragraphs.splice(this.currentIndex, 1);
                this.currentIndex--;  // 回退索引，因为移除了一个元素

                // 启动自动播放序列，传递marker作为插入点
                this.startAutoSequence(content, delay, marker);
            } else {
                // 普通段落，正常显示
                nextParagraph.style.display = 'block';

                // 滚动到新段落
                this.scrollToElement(nextParagraph);

                // 如果是全自动播放模式，自动触发下一段
                if (this.fullAutoPlayMode && this.currentIndex < this.paragraphs.length - 1) {
                    // 使用动态延时计算（基于文本长度或自定义delay）
                    const delay = this.calculateAutoPlayDelay(nextParagraph);

                    setTimeout(() => {
                        this.showNext();
                    }, delay);
                }
            }

        // 🔧 显示段落后，检查是否已经是最后一段
        if (this.currentIndex === this.paragraphs.length - 1) {
            this.complete = true;

            // 如果是全自动播放模式，解除锁定并恢复提示
            if (this.fullAutoPlayMode) {
                this.fullAutoPlayMode = false;

                // 恢复"click to continue"提示
                const continueHint = document.querySelector('.continue-hint');
                if (continueHint) {
                    continueHint.style.display = '';
                }
            }

            // 触发预览完成回调（用于显示问答UI）
            if (this.onPreviewComplete) {
                setTimeout(() => {
                    this.onPreviewComplete();
                }, 100);
            }
        }
    }

    /**
     * 启动自动播放序列
     */
    startAutoSequence(contentArray, delay = 200, insertMarker = null) {

        this.isAutoPlaying = true;
        this.blockInput = true;
        this.autoPlayQueue = [...contentArray];
        this.autoInsertMarker = insertMarker; // 保存插入标记

        // 添加自动播放状态指示器
        this.showAutoPlayIndicator();

        // 开始播放第一个
        this.playNextAuto(delay);
    }

    /**
     * 播放下一个自动段落
     */
    playNextAuto(delay) {
        if (this.autoPlayQueue.length === 0) {
            // 序列播放完毕
            this.isAutoPlaying = false;
            this.blockInput = false;
            this.hideAutoPlayIndicator();

            // 移除插入标记
            if (this.autoInsertMarker && this.autoInsertMarker.parentNode) {
                this.autoInsertMarker.remove();
                this.autoInsertMarker = null;
            }

            // 继续正常的下一段显示
            this.showNext();
            return;
        }

        // 获取下一个内容
        const nextContent = this.autoPlayQueue.shift();

        // 创建并显示段落
        const p = document.createElement('p');
        p.className = 'content-paragraph auto-displayed';

        // 根据内容类型创建元素
        if (window.renderer) {
            const el = window.renderer.createTextElement(nextContent);
            p.appendChild(el);
        } else {
            p.textContent = nextContent.text || nextContent;
        }

        // 添加到正确的位置
        if (this.autoInsertMarker && this.autoInsertMarker.parentNode) {
            // 在marker之前插入（marker始终在插入点）
            this.autoInsertMarker.insertAdjacentElement('beforebegin', p);
        } else {
            // 降级方案：插入到continueHint之前
            const continueHint = document.querySelector('.continue-hint');
            if (continueHint) {
                continueHint.insertAdjacentElement('beforebegin', p);
            } else {
                // 最后降级：添加到容器末尾
                const container = document.querySelector('.text-content-container');
                if (container) {
                    container.appendChild(p);
                }
            }
        }

        // 显示动画
        p.style.display = 'block';
        p.classList.add('auto-sequence-fade-in');

        // 自动滚动到新段落
        this.autoScroll(p);

        // 设置下一次播放
        this.autoPlayTimer = setTimeout(() => {
            this.playNextAuto(delay);
        }, delay);
    }

    /**
     * 滚动到指定段落（移动端：顶部对齐；PC端：滚动到底部）
     */
    scrollToElement(targetElement) {
        if (!targetElement) return;

        const container = document.querySelector('.card-scroll');
        if (!container) return;

        const isMobile = typeof isMobileLandscape === 'function' && isMobileLandscape();

        setTimeout(() => {
            if (isMobile) {
                // 计算元素相对于容器的偏移，滚动到元素顶部
                const targetTop = targetElement.offsetTop - container.offsetTop;
                container.scrollTo({ top: targetTop, behavior: 'smooth' });
            } else {
                container.scrollTop = container.scrollHeight;
            }
        }, 50);
    }

    /**
     * 自动滚动（用于自动序列播放）
     */
    autoScroll(targetElement = null) {
        const container = document.querySelector('.card-scroll');
        if (!container) return;

        const isMobile = typeof isMobileLandscape === 'function' && isMobileLandscape();

        if (isMobile && targetElement) {
            // 计算元素相对于容器的偏移，滚动到元素顶部
            const targetTop = targetElement.offsetTop - container.offsetTop;
            container.scrollTo({ top: targetTop, behavior: 'smooth' });
        } else {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
            setTimeout(() => {
                container.scrollTop = container.scrollHeight;
            }, 100);
        }
    }

    /**
     * 显示自动播放指示器
     */
    showAutoPlayIndicator() {
        const textContent = document.querySelector('.text-content');
        if (textContent) {
            textContent.classList.add('auto-playing');
        }

        // 隐藏 click to continue 提示
        const continueHint = document.querySelector('.continue-hint');
        if (continueHint) {
            continueHint.style.display = 'none';
        }
    }

    /**
     * 隐藏自动播放指示器
     */
    hideAutoPlayIndicator() {
        const textContent = document.querySelector('.text-content');
        if (textContent) {
            textContent.classList.remove('auto-playing');
            const indicator = document.querySelector('.auto-play-indicator');
            if (indicator) {
                indicator.remove();
            }
        }

        // 恢复 click to continue 提示（如果尚未完成且不在全自动播放模式）
        if (!this.complete && !this.fullAutoPlayMode) {
            const continueHint = document.querySelector('.continue-hint');
            if (continueHint) {
                continueHint.style.display = '';
            }
        }
    }

    /**
     * 跳过自动播放
     */
    skipAutoSequence() {
        if (this.isAutoPlaying) {
            // 清除定时器
            if (this.autoPlayTimer) {
                clearTimeout(this.autoPlayTimer);
            }

            // 立即显示剩余内容
            while (this.autoPlayQueue.length > 0) {
                const content = this.autoPlayQueue.shift();
                const p = document.createElement('p');
                p.className = 'content-paragraph';

                if (window.renderer) {
                    const el = window.renderer.createTextElement(content);
                    p.appendChild(el);
                } else {
                    p.textContent = content.text || content;
                }

                // 插入到正确位置
                if (this.autoInsertMarker && this.autoInsertMarker.parentNode) {
                    this.autoInsertMarker.insertAdjacentElement('beforebegin', p);
                } else {
                    // 降级方案：插入到continueHint之前
                    const continueHint = document.querySelector('.continue-hint');
                    if (continueHint) {
                        continueHint.insertAdjacentElement('beforebegin', p);
                    } else {
                        const container = document.querySelector('.text-content-container');
                        if (container) {
                            container.appendChild(p);
                        }
                    }
                }
                p.style.display = 'block';
            }

            // 移除插入标记
            if (this.autoInsertMarker && this.autoInsertMarker.parentNode) {
                this.autoInsertMarker.remove();
                this.autoInsertMarker = null;
            }

            // 重置状态
            this.isAutoPlaying = false;
            this.blockInput = false;
            this.hideAutoPlayIndicator();

            // 继续正常流程
            this.showNext();
        }
    }

    /**
     * 显示全部（快进）
     */
    showAll() {
        // 如果正在自动播放，先跳过
        if (this.isAutoPlaying) {
            this.skipAutoSequence();
        }

        this.paragraphs.forEach(p => {
            p.style.display = 'block';
        });
        this.complete = true;
    }

    /**
     * 是否已完成
     */
    isComplete() {
        return this.complete || this.currentIndex >= this.paragraphs.length - 1;
    }
}

// 导出类（如果使用模块系统）
// export default Renderer;