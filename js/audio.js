/**
 * 音频管理系统 - 极简实现
 * 负责游戏中所有音效和背景音乐的播放
 */

class AudioManager {
    constructor() {
        // 音量设置
        this.volumes = {
            master: 0.7,
            sfx: 0.8,
            music: 0.5
        };

        // 背景音乐
        this.currentMusic = null;
        this.currentMusicId = null;

        // 音效缓存
        this.sfxCache = new Map();

        // 静音状态
        this.muted = false;

        // 特殊音量调整配置
        this.volumeBoost = {
            'mozart': 1.2,      // Mozart 音量提高 20%
            'atmosphere': 0.5,  // Atmosphere 白噪音音量降至 50%
            'memory': 1.3,      // Memory 音乐提高 30%
            'delete': 1.45,     // Delete 音乐提高 45%
            'dream': 0.9,       // Dream 音量降低 10%
            'wagner': 0.9,      // Wagner 音量降低 10%
            'heartache': 1.3,   // Heartache 音量提高 30%
            'heartache-2': 1.3  // Heartache-2 音量提高 30%
        };

        // 循环淡入淡出播放的状态
        this.loopFadeState = null;

        // 音频路径配置
        this.basePath = '../assets/audio/';
        this.sfxPath = this.basePath + 'sfx/';
        // BGM和自定义音效统一使用CDN加速
        this.musicPath = 'https://cdn.jsdelivr.net/gh/kmj-hamster/shancha@main/sound/';
        this.customSfxPath = 'https://cdn.jsdelivr.net/gh/kmj-hamster/shancha@main/sound/';
    }

    /**
     * 播放音效（一次性播放）
     * @param {string} soundId - 音效ID，如 'unlock', 'click'，或完整文件名如 'discover.mp3'
     * @param {number} volume - 音量 (0-1)，可选
     * @param {boolean} useCustomPath - 是否使用自定义路径，可选
     * @returns {HTMLAudioElement} 音频元素（用于需要控制的情况）
     */
    playSFX(soundId, volume = 1, useCustomPath = false) {
        console.log(`[AudioManager] playSFX called:`, {
            soundId,
            volume,
            useCustomPath,
            muted: this.muted
        });

        if (this.muted) {
            console.log(`[AudioManager] Audio is muted, skipping playback`);
            return null;
        }

        try {
            // 创建新的音频实例（允许重叠播放）
            const audio = new Audio();

            // 确定音频路径
            const basePath = useCustomPath ? this.customSfxPath : this.sfxPath;
            // 检查是否已有扩展名（支持.mp3, .wav, .ogg, .m4a等）
            const hasExtension = /\.(mp3|wav|ogg|m4a)$/i.test(soundId);
            const fileName = hasExtension ? soundId : `${soundId}.mp3`;
            audio.src = `${basePath}${fileName}`;

            console.log(`[AudioManager] Audio source set to: ${audio.src}`);

            // 设置音量
            const finalVolume = volume * this.volumes.sfx * this.volumes.master;
            audio.volume = Math.max(0, Math.min(1, finalVolume));

            console.log(`[AudioManager] Volume set to: ${audio.volume} (sfx: ${this.volumes.sfx}, master: ${this.volumes.master})`);

            // 播放
            audio.play()
                .then(() => {
                    console.log(`[AudioManager] ✅ Audio playing successfully: ${soundId}`);
                })
                .catch(err => {
                    console.error(`[AudioManager] ❌ Failed to play sound: ${soundId}`, err);
                });

            // 播放结束后清理
            audio.onended = () => {
                console.log(`[AudioManager] Audio ended: ${soundId}`);
                audio.remove();
            };

            return audio;
        } catch (error) {
            console.error(`[AudioManager] ❌ Error playing SFX: ${soundId}`, error);
            return null;
        }
    }

    /**
     * 播放背景音乐（循环播放）
     * @param {string} musicId - 音乐ID，如 'main_theme', 'theme_1945'
     * @param {number} volume - 音量 (0-1)，可选
     * @param {number} fadeInDuration - 淡入时长（毫秒），默认0（无淡入）
     */
    playMusic(musicId, volume = 1, fadeInDuration = 0) {
        // 如果是同一首歌，不重新播放
        if (this.currentMusicId === musicId && this.currentMusic && !this.currentMusic.paused) {
            return;
        }

        // 停止当前音乐
        this.stopMusic();

        if (this.muted) return;

        try {
            // 创建新的音乐播放器
            this.currentMusic = new Audio();
            // 检查是否已有扩展名（支持.mp3, .wav, .ogg, .m4a等）
            const hasExtension = /\.(mp3|wav|ogg|m4a)$/i.test(musicId);
            const fileName = hasExtension ? musicId : `${musicId}.mp3`;
            this.currentMusic.src = `${this.musicPath}${fileName}`;
            this.currentMusic.loop = true;

            // 计算目标音量（应用特定音乐的音量倍数）
            const multiplier = this.getVolumeMultiplier(musicId);
            const targetVolume = volume * this.volumes.music * this.volumes.master * multiplier;

            // 如果需要淡入，从0开始
            if (fadeInDuration > 0) {
                this.currentMusic.volume = 0;
                console.log(`[AudioManager] Starting music with fade-in: ${musicId} (${fadeInDuration}ms)`);
            } else {
                this.currentMusic.volume = Math.max(0, Math.min(1, targetVolume));
            }

            // 记录当前音乐ID
            this.currentMusicId = musicId;

            // 播放
            this.currentMusic.play().catch(err => {
                console.warn(`Failed to play music: ${musicId}`, err);
            });

            // 执行淡入
            if (fadeInDuration > 0) {
                this.fadeInMusic(targetVolume, fadeInDuration);
            }

        } catch (error) {
            console.error(`Error playing music: ${musicId}`, error);
        }
    }

    /**
     * 播放背景音乐（循环时带交叉淡入淡出效果）
     * 使用双音频实例实现无缝循环
     * @param {string} musicId - 音乐ID
     * @param {number} fadeInDuration - 初始淡入时长（毫秒）
     * @param {number} crossfadeDuration - 交叉淡入淡出时长（毫秒）
     * @param {number} volume - 音量 (0-1)，可选
     */
    playMusicWithLoopFade(musicId, fadeInDuration = 2000, crossfadeDuration = 3000, volume = 1) {
        // 停止当前音乐和循环状态
        this.stopLoopFade();
        this.stopMusic();

        if (this.muted) return;

        try {
            // 计算目标音量
            const multiplier = this.getVolumeMultiplier(musicId);
            const targetVolume = volume * this.volumes.music * this.volumes.master * multiplier;

            // 构建音频路径
            const hasExtension = /\.(mp3|wav|ogg|m4a)$/i.test(musicId);
            const fileName = hasExtension ? musicId : `${musicId}.mp3`;
            const audioSrc = `${this.musicPath}${fileName}`;

            // 创建第一个音频实例
            const audio = new Audio();
            audio.src = audioSrc;
            audio.loop = false;
            audio.volume = 0;

            // 保存状态
            this.loopFadeState = {
                audioSrc: audioSrc,
                musicId: musicId,
                targetVolume: targetVolume,
                crossfadeDuration: crossfadeDuration,
                volume: volume,
                currentAudio: audio,
                nextAudio: null,
                isCrossfading: false,
                fadeInterval: null,
                timeUpdateHandler: null
            };

            // 记录当前音乐
            this.currentMusic = audio;
            this.currentMusicId = musicId;

            console.log(`[AudioManager] Starting crossfade music: ${musicId}`);

            // 创建 timeupdate 处理器
            this.loopFadeState.timeUpdateHandler = () => {
                this._checkCrossfadePoint();
            };
            audio.addEventListener('timeupdate', this.loopFadeState.timeUpdateHandler);

            // 播放并淡入
            audio.play().then(() => {
                this._fadeInCrossfadeMusic(audio, targetVolume, fadeInDuration);
            }).catch(err => {
                console.warn(`Failed to play music: ${musicId}`, err);
            });

        } catch (error) {
            console.error(`Error playing crossfade music: ${musicId}`, error);
        }
    }

    /**
     * 检查是否到达交叉淡入淡出点
     */
    _checkCrossfadePoint() {
        if (!this.loopFadeState || this.loopFadeState.isCrossfading) return;

        const audio = this.loopFadeState.currentAudio;
        if (!audio || isNaN(audio.duration)) return;

        const timeRemaining = audio.duration - audio.currentTime;
        const crossfadeSec = this.loopFadeState.crossfadeDuration / 1000;

        // 当剩余时间等于交叉淡入淡出时长时，开始交叉
        if (timeRemaining <= crossfadeSec && timeRemaining > 0) {
            this.loopFadeState.isCrossfading = true;
            console.log(`[AudioManager] Crossfade starting (${timeRemaining.toFixed(1)}s remaining)`);
            this._performCrossfade();
        }
    }

    /**
     * 执行交叉淡入淡出
     */
    _performCrossfade() {
        if (!this.loopFadeState) return;

        const state = this.loopFadeState;
        const oldAudio = state.currentAudio;
        const startVolume = oldAudio.volume;

        // 创建新音频实例
        const newAudio = new Audio();
        newAudio.src = state.audioSrc;
        newAudio.loop = false;
        newAudio.volume = 0;
        state.nextAudio = newAudio;

        // 为新音频添加 timeupdate 监听
        newAudio.addEventListener('timeupdate', state.timeUpdateHandler);

        // 开始播放新音频
        newAudio.play().then(() => {
            console.log(`[AudioManager] New audio started for crossfade`);
        }).catch(err => {
            console.warn(`Failed to start crossfade audio`, err);
        });

        // 执行交叉淡入淡出
        const duration = state.crossfadeDuration;
        const steps = 30;  // 更多步数，更平滑
        const interval = duration / steps;
        let currentStep = 0;

        if (state.fadeInterval) {
            clearInterval(state.fadeInterval);
        }

        state.fadeInterval = setInterval(() => {
            if (!this.loopFadeState) {
                clearInterval(state.fadeInterval);
                return;
            }

            currentStep++;
            const progress = currentStep / steps;

            // 旧音频淡出
            oldAudio.volume = Math.max(0, startVolume * (1 - progress));

            // 新音频淡入
            newAudio.volume = Math.min(state.targetVolume, state.targetVolume * progress);

            // 完成交叉淡入淡出
            if (currentStep >= steps) {
                clearInterval(state.fadeInterval);
                state.fadeInterval = null;

                // 停止并清理旧音频
                oldAudio.removeEventListener('timeupdate', state.timeUpdateHandler);
                oldAudio.pause();
                oldAudio.src = '';

                // 更新状态
                state.currentAudio = newAudio;
                state.nextAudio = null;
                state.isCrossfading = false;
                this.currentMusic = newAudio;

                console.log(`[AudioManager] Crossfade completed`);
            }
        }, interval);
    }

    /**
     * 淡入交叉淡入淡出音乐（初始淡入）
     */
    _fadeInCrossfadeMusic(audio, targetVolume, duration) {
        if (!this.loopFadeState) return;

        const steps = 20;
        const interval = duration / steps;
        const volumeStep = targetVolume / steps;
        let currentStep = 0;

        const fade = setInterval(() => {
            if (!this.loopFadeState || this.loopFadeState.currentAudio !== audio) {
                clearInterval(fade);
                return;
            }

            currentStep++;
            audio.volume = Math.min(volumeStep * currentStep, targetVolume);

            if (currentStep >= steps) {
                clearInterval(fade);
                console.log(`[AudioManager] Initial fade-in completed`);
            }
        }, interval);
    }

    /**
     * 淡入循环音乐 (保留旧方法兼容性)
     */
    fadeInLoopMusic(targetVolume, duration) {
        if (!this.loopFadeState) return;

        const audio = this.loopFadeState.currentAudio || this.loopFadeState.audio;
        if (!audio) return;
        const steps = 20;
        const interval = duration / steps;
        const volumeStep = targetVolume / steps;
        let currentStep = 0;

        // 清除之前的淡入淡出
        if (this.loopFadeState.fadeInterval) {
            clearInterval(this.loopFadeState.fadeInterval);
        }

        this.loopFadeState.fadeInterval = setInterval(() => {
            if (!this.loopFadeState || this.loopFadeState.audio !== audio) {
                clearInterval(this.loopFadeState?.fadeInterval);
                return;
            }

            currentStep++;
            audio.volume = Math.min(volumeStep * currentStep, targetVolume);

            if (currentStep >= steps) {
                clearInterval(this.loopFadeState.fadeInterval);
                this.loopFadeState.fadeInterval = null;
                console.log(`[AudioManager] Loop fade-in completed`);
            }
        }, interval);
    }

    /**
     * 淡出并重新开始循环
     */
    fadeOutAndRestart() {
        if (!this.loopFadeState) return;

        const audio = this.loopFadeState.audio;
        const startVolume = audio.volume;
        const duration = this.loopFadeState.fadeOutDuration;
        const steps = 20;
        const interval = duration / steps;
        let currentStep = 0;

        // 清除之前的淡入淡出
        if (this.loopFadeState.fadeInterval) {
            clearInterval(this.loopFadeState.fadeInterval);
        }

        this.loopFadeState.fadeInterval = setInterval(() => {
            if (!this.loopFadeState || this.loopFadeState.audio !== audio) {
                clearInterval(this.loopFadeState?.fadeInterval);
                return;
            }

            currentStep++;
            const progress = currentStep / steps;
            audio.volume = startVolume * (1 - progress);

            if (currentStep >= steps) {
                clearInterval(this.loopFadeState.fadeInterval);
                this.loopFadeState.fadeInterval = null;
                console.log(`[AudioManager] Loop fade-out completed, restarting`);
                this.restartLoopMusic();
            }
        }, interval);
    }

    /**
     * 重新开始循环音乐
     */
    restartLoopMusic() {
        if (!this.loopFadeState) return;

        const state = this.loopFadeState;
        state.audio.currentTime = 0;
        state.audio.volume = 0;
        state.isFadingOut = false;

        state.audio.play().then(() => {
            this.fadeInLoopMusic(state.targetVolume, state.fadeInDuration);
        }).catch(err => {
            console.warn(`Failed to restart loop music`, err);
        });
    }

    /**
     * 停止循环淡入淡出播放
     */
    stopLoopFade() {
        if (this.loopFadeState) {
            if (this.loopFadeState.fadeInterval) {
                clearInterval(this.loopFadeState.fadeInterval);
            }
            // 清理当前音频
            const currentAudio = this.loopFadeState.currentAudio || this.loopFadeState.audio;
            if (currentAudio) {
                if (this.loopFadeState.timeUpdateHandler) {
                    currentAudio.removeEventListener('timeupdate', this.loopFadeState.timeUpdateHandler);
                }
                currentAudio.pause();
                currentAudio.src = '';
            }
            // 清理下一个音频（如果正在交叉淡入淡出）
            if (this.loopFadeState.nextAudio) {
                if (this.loopFadeState.timeUpdateHandler) {
                    this.loopFadeState.nextAudio.removeEventListener('timeupdate', this.loopFadeState.timeUpdateHandler);
                }
                this.loopFadeState.nextAudio.pause();
                this.loopFadeState.nextAudio.src = '';
            }
            this.loopFadeState = null;
            console.log(`[AudioManager] Crossfade music stopped`);
        }
    }

    /**
     * 切换背景音乐（带淡出淡入效果）
     * @param {string} musicId - 新音乐ID
     * @param {number} duration - 淡化时长（毫秒），默认1000ms
     */
    switchMusic(musicId, duration = 1000) {
        if (this.currentMusicId === musicId) return;

        // 停止循环淡入淡出状态
        this.stopLoopFade();

        const oldMusic = this.currentMusic;
        const oldVolume = oldMusic ? oldMusic.volume : 0;

        // 创建新音乐（音量为0）
        const newMusic = new Audio();
        // 检查是否已有扩展名（支持.mp3, .wav, .ogg, .m4a等）
        const hasExtension = /\.(mp3|wav|ogg|m4a)$/i.test(musicId);
        const fileName = hasExtension ? musicId : `${musicId}.mp3`;
        newMusic.src = `${this.musicPath}${fileName}`;
        newMusic.loop = true;
        newMusic.volume = 0;

        if (!this.muted) {
            newMusic.play().catch(err => {
                console.warn(`Failed to play music: ${musicId}`, err);
            });
        }

        // 淡出旧音乐，淡入新音乐
        const steps = 20;
        const interval = duration / steps;
        let step = 0;

        const fade = setInterval(() => {
            step++;
            const progress = step / steps;

            // 淡出旧音乐
            if (oldMusic) {
                oldMusic.volume = oldVolume * (1 - progress);
            }

            // 淡入新音乐（应用特定音乐的音量倍数）
            if (!this.muted) {
                const multiplier = this.getVolumeMultiplier(musicId);
                const targetVolume = this.volumes.music * this.volumes.master * multiplier;
                newMusic.volume = targetVolume * progress;
            }

            // 完成切换
            if (step >= steps) {
                clearInterval(fade);
                if (oldMusic) {
                    oldMusic.pause();
                    oldMusic.currentTime = 0;
                }
                this.currentMusic = newMusic;
                this.currentMusicId = musicId;
            }
        }, interval);
    }

    /**
     * 停止背景音乐
     * @param {number} fadeOutDuration - 淡出时长（毫秒），默认0（立即停止）
     */
    stopMusic(fadeOutDuration = 0) {
        // 停止循环淡入淡出状态
        this.stopLoopFade();

        if (!this.currentMusic) return;

        if (fadeOutDuration > 0) {
            console.log(`[AudioManager] Stopping music with fade-out (${fadeOutDuration}ms)`);
            this.fadeOutMusic(fadeOutDuration);
        } else {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
            this.currentMusicId = null;
        }
    }

    /**
     * 暂停背景音乐
     */
    pauseMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
        }
    }

    /**
     * 恢复背景音乐
     */
    resumeMusic() {
        if (this.currentMusic && !this.muted) {
            this.currentMusic.play().catch(err => {
                console.warn('Failed to resume music', err);
            });
        }
    }

    /**
     * 设置主音量
     * @param {number} volume - 音量值 (0-1)
     */
    setMasterVolume(volume) {
        this.volumes.master = Math.max(0, Math.min(1, volume));
        this.updateMusicVolume();
    }

    /**
     * 设置音效音量
     * @param {number} volume - 音量值 (0-1)
     */
    setSFXVolume(volume) {
        this.volumes.sfx = Math.max(0, Math.min(1, volume));
    }

    /**
     * 设置音乐音量
     * @param {number} volume - 音量值 (0-1)
     */
    setMusicVolume(volume) {
        this.volumes.music = Math.max(0, Math.min(1, volume));
        this.updateMusicVolume();
    }

    /**
     * 更新当前播放的音乐音量
     */
    updateMusicVolume() {
        if (this.currentMusic) {
            const multiplier = this.getVolumeMultiplier(this.currentMusicId);
            this.currentMusic.volume = this.volumes.music * this.volumes.master * multiplier;
        }
    }

    /**
     * 静音
     */
    mute() {
        this.muted = true;
        if (this.currentMusic) {
            this.currentMusic.pause();
        }
    }

    /**
     * 取消静音
     */
    unmute() {
        this.muted = false;
        if (this.currentMusic) {
            this.currentMusic.play().catch(err => {
                console.warn('Failed to unmute music', err);
            });
        }
    }

    /**
     * 切换静音状态
     */
    toggleMute() {
        if (this.muted) {
            this.unmute();
        } else {
            this.mute();
        }
    }

    /**
     * 预加载音效（可选，用于优化）
     * @param {Array<string>} soundIds - 音效ID数组
     */
    async preloadSFX(soundIds) {
        for (const id of soundIds) {
            try {
                const audio = new Audio();
                audio.src = `${this.sfxPath}${id}.mp3`;
                audio.load();
                this.sfxCache.set(id, audio.src);
            } catch (err) {
                console.warn(`Failed to preload: ${id}`, err);
            }
        }
    }

    /**
     * 循环播放音效（特殊用途，如环境音）
     * @param {string} soundId - 音效ID
     * @param {number} volume - 音量
     * @returns {Object} 包含stop方法的控制对象
     */
    loopSFX(soundId, volume = 1) {
        if (this.muted) return { stop: () => {} };

        const audio = new Audio();
        audio.src = `${this.sfxPath}${soundId}.mp3`;
        audio.loop = true;
        audio.volume = volume * this.volumes.sfx * this.volumes.master;

        audio.play().catch(err => {
            console.warn(`Failed to loop sound: ${soundId}`, err);
        });

        return {
            audio: audio,
            stop: () => {
                audio.pause();
                audio.currentTime = 0;
                audio.remove();
            }
        };
    }

    /**
     * 淡入当前音乐
     * @param {number} targetVolume - 目标音量
     * @param {number} duration - 淡入时长（毫秒）
     */
    fadeInMusic(targetVolume, duration) {
        if (!this.currentMusic) return;

        const steps = 20;
        const interval = duration / steps;
        const volumeStep = targetVolume / steps;
        let currentStep = 0;

        const fade = setInterval(() => {
            if (!this.currentMusic) {
                clearInterval(fade);
                return;
            }

            currentStep++;
            this.currentMusic.volume = Math.min(volumeStep * currentStep, targetVolume);

            if (currentStep >= steps) {
                clearInterval(fade);
                console.log(`[AudioManager] ✅ Fade-in completed`);
            }
        }, interval);
    }

    /**
     * 淡出当前音乐
     * @param {number} duration - 淡出时长（毫秒）
     */
    fadeOutMusic(duration) {
        if (!this.currentMusic) return;

        const music = this.currentMusic;
        const startVolume = music.volume;
        const steps = 20;
        const interval = duration / steps;
        let currentStep = 0;

        const fade = setInterval(() => {
            if (!music) {
                clearInterval(fade);
                return;
            }

            currentStep++;
            const progress = currentStep / steps;
            music.volume = startVolume * (1 - progress);

            if (currentStep >= steps) {
                clearInterval(fade);
                music.pause();
                music.currentTime = 0;

                // 清理引用（只有当前音乐还是这个实例时才清理）
                if (this.currentMusic === music) {
                    this.currentMusic = null;
                    this.currentMusicId = null;
                }

                console.log(`[AudioManager] ✅ Fade-out completed`);
            }
        }, interval);
    }

    /**
     * 设置音频路径（如果需要自定义路径）
     */
    setBasePath(path) {
        this.basePath = path;
        this.sfxPath = this.basePath + 'sfx/';
        this.musicPath = this.basePath + 'music/';
    }

    /**
     * 获取特定音乐的音量倍数
     * @param {string} musicId - 音乐ID
     * @returns {number} 音量倍数
     */
    getVolumeMultiplier(musicId) {
        if (!musicId) return 1;
        const lowerMusicId = musicId.toLowerCase();
        for (const [key, multiplier] of Object.entries(this.volumeBoost)) {
            if (lowerMusicId.includes(key.toLowerCase())) {
                return multiplier;
            }
        }
        return 1;
    }
}

// 创建全局实例
const audioManager = new AudioManager();

// 挂载到 window 对象（浏览器环境）
if (typeof window !== 'undefined') {
    window.audioManager = audioManager;
    console.log('[AudioManager] ✅ Initialized and mounted to window.audioManager');
}

// 导出（Node.js 环境）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = audioManager;
}