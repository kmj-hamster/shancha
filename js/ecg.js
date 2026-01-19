/**
 * ECG (心电图) 动画控制器 - 精简版
 * 视觉效果来源：心电图.html（医学波形 + 辉光 + CRT扫描）
 * API：setMode / setSpeed / setAmplitude / reset / start / stop
 */

// 模式常量
const ECG_MODE = {
    NORMAL: 'normal',
    SORT: 'sort',
    DELETE: 'delete',
    FLATLINE: 'flatline'
};

// 模式-颜色绑定
const ECG_COLORS = {
    normal: '#80ff8a',   // 绿色
    sort: '#FFD700',     // 黄色
    delete: '#FF3333',   // 红色
    flatline: '#444444'  // 灰色
};

class ECGController {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.warn('[ECG] Canvas not found:', canvasId);
            return;
        }
        this.ctx = this.canvas.getContext('2d');

        // 状态变量
        this.mode = ECG_MODE.NORMAL;
        this.speed = 1;           // 扫描速度倍数 (1-5)，1=与主界面CRT扫描线同步
        this.amplitude = 0.8;     // 波峰幅度 (0.1-1.0)

        // 渲染变量
        this.scanX = 0;
        this.lastY = 0;
        this.beatPhase = 0.6;
        this.isRunning = false;
        this.animationId = null;
        this.lastFrameTime = 0;   // 上一帧时间戳
        this.pathHistory = [];    // 路径历史记录（用于模式切换时重绘）

        // 视觉配置
        this.shadowBlur = 8;
        this.blankingGap = 30;
        this.baseScanDuration = 8000;   // 基础扫描周期8秒
        this.bgColor = '#031205';       // 背景色，与主界面--bg-screen一致

        // 波形变化参数（每次扫描随机调整）
        this.cyclesPerScan = 3.0;
        this.peakFactor = 1.0;      // 当前波峰的高度因子
        this.lastPhase = 0;         // 上一次的相位，用于检测新波峰

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // 页面可见性处理
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stop();
            } else {
                this.start();
            }
        });
    }

    resizeCanvas() {
        if (!this.canvas) return;
        this.canvas.width = this.canvas.parentElement.offsetWidth;
        this.canvas.height = this.canvas.parentElement.offsetHeight;
        this.lastY = this.canvas.height * 0.6;  // 与baseY保持一致
        this.scanX = 0;
        this.pathHistory = [];  // 尺寸变化后坐标失效
    }

    // ========== 核心API ==========

    /**
     * 设置模式（自动切换颜色）
     * @param {string} mode - 'normal' | 'sort' | 'delete' | 'flatline'
     */
    setMode(mode) {
        if (Object.values(ECG_MODE).includes(mode)) {
            this.mode = mode;

            if (this.ctx && this.canvas) {
                // 清空画布
                this.ctx.fillStyle = this.bgColor;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                // 用新颜色重绘历史波形
                this.redrawHistory();

                // 重绘扫描头前方的空白区域
                const drawX = this.scanX % this.canvas.width;
                this.ctx.save();
                this.ctx.shadowBlur = 0;
                this.ctx.fillStyle = this.bgColor;
                let clearX = drawX + 10;
                if (clearX + this.blankingGap > this.canvas.width) {
                    this.ctx.fillRect(clearX, 0, this.canvas.width - clearX, this.canvas.height);
                    this.ctx.fillRect(0, 0, this.blankingGap - (this.canvas.width - clearX), this.canvas.height);
                } else {
                    this.ctx.fillRect(clearX, 0, this.blankingGap, this.canvas.height);
                }
                this.ctx.restore();
            }
            // 不重置 scanX、lastY、beatPhase - 继续从当前位置绘制
        }
    }

    /**
     * 设置扫描速度
     * @param {number} speed - 1(慢) 到 5(快)，默认2
     */
    setSpeed(speed) {
        this.speed = Math.max(0.3, Math.min(5, speed));
    }

    /**
     * 设置波峰幅度
     * @param {number} amp - 0.1(低) 到 1.0(满)，默认0.8
     */
    setAmplitude(amp) {
        this.amplitude = Math.max(0.1, Math.min(1.0, amp));
    }

    /**
     * 重置到初始状态
     */
    reset() {
        this.mode = ECG_MODE.NORMAL;
        this.speed = 1;
        this.amplitude = 0.8;
        this.pathHistory = [];  // 清空历史
        // 清除canvas并重置扫描位置
        if (this.ctx && this.canvas) {
            this.ctx.fillStyle = this.bgColor;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.scanX = 0;
            this.lastY = this.canvas.height * 0.6;
            this.beatPhase = 0.5 + Math.random() * 0.35;
        }
    }

    // ========== 波形算法 ==========

    /**
     * P-QRS-T 医学波形算法
     * @param {number} phase - 0到1之间，代表一个心跳周期
     * @returns {number} 电压值 (-1 到 1)
     */
    getHeartVoltage(phase) {
        let v = 0;

        // 微小噪点（模拟肌电干扰）
        v += (Math.random() - 0.5) * 0.05;

        // 检测是否进入新的波峰区间，生成新的高度因子
        if (phase >= 0.36 && this.lastPhase < 0.36) {
            // 随机因子：0.85 到 1.30（低15%，高30%）
            this.peakFactor = 0.85 + Math.random() * 0.45;
        }
        this.lastPhase = phase;

        // P波（心房收缩）- 小圆包
        if (phase > 0.1 && phase < 0.2) {
            v += 0.15 * Math.sin((phase - 0.1) * Math.PI / 0.1);
        }
        // QRS波群（心室收缩）- 使用正弦波，高度受peakFactor影响
        else if (phase > 0.36 && phase < 0.46) {
            const qrsPhase = (phase - 0.36) / 0.10;  // 0到1
            v += 1.0 * this.peakFactor * Math.sin(qrsPhase * Math.PI);
        }
        // T波（心室复极化）- 宽缓的波
        else if (phase > 0.6 && phase < 0.75) {
            v += 0.25 * Math.sin((phase - 0.6) * Math.PI / 0.15);
        }

        return v;
    }

    /**
     * 根据模式计算Y坐标
     */
    calculateY() {
        const height = this.canvas.height;
        const baseY = height * 0.6;  // 基线下移（原来是0.5）
        const maxAmp = (height / 2) - 15; // 留15px边距，限制波峰高度
        let y = baseY;

        switch (this.mode) {
            case ECG_MODE.FLATLINE:
                // 平线：只有微小噪点
                y += (Math.random() - 0.5) * 2;
                break;

            case ECG_MODE.NORMAL:
            case ECG_MODE.SORT:
            case ECG_MODE.DELETE:
            default:
                // 正常波形（normal/sort/delete共用，只是颜色不同）
                const voltage = this.getHeartVoltage(this.beatPhase);
                y = baseY - (voltage * maxAmp * this.amplitude);
                break;
        }

        // 限制在画布范围内
        return Math.max(10, Math.min(height - 10, y));
    }

    // ========== 渲染 ==========

    getCurrentColor() {
        return ECG_COLORS[this.mode] || ECG_COLORS.normal;
    }

    /**
     * 用当前颜色重绘所有历史路径
     * 用于模式切换时瞬间改变已绘制波形的颜色
     */
    redrawHistory() {
        if (!this.pathHistory || this.pathHistory.length < 2) return;

        const color = this.getCurrentColor();
        const ctx = this.ctx;

        ctx.strokeStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = this.shadowBlur;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 1; i < this.pathHistory.length; i++) {
            const prev = this.pathHistory[i - 1];
            const curr = this.pathHistory[i];

            // 跳过回卷断点
            if (Math.abs(curr.x - prev.x) > 10) continue;

            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(curr.x, curr.y);
            ctx.stroke();
        }
    }

    draw(timestamp) {
        if (!this.isRunning) return;

        // 初始化时间戳
        if (!this.lastFrameTime) {
            this.lastFrameTime = timestamp;
            this.pixelAccumulator = 0;
        }

        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const color = this.getCurrentColor();

        // 基于时间计算本帧应移动的像素数
        const deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;

        // 每毫秒移动的像素数 = 宽度 / (基础周期 / 速度倍数)
        const pixelsPerMs = (width * this.speed) / this.baseScanDuration;
        this.pixelAccumulator += deltaTime * pixelsPerMs;

        // 每像素推进的相位量
        const phasePerPixel = this.cyclesPerScan / width;

        // 绘制累积的像素（可能多个）
        while (this.pixelAccumulator >= 1) {
            this.pixelAccumulator -= 1;

            // 推进相位（每像素固定推进量）
            this.beatPhase += phasePerPixel;
            if (this.beatPhase >= 1) {
                this.beatPhase -= 1;
                this.lastPhase = 0;  // 重置，确保下个周期能检测到新波峰
            }

            // 计算当前Y
            const currentY = this.calculateY();
            const drawX = this.scanX % width;

            // A. CRT扫描清除（扫描头前方区域，使用背景色填充）
            ctx.save();
            ctx.shadowBlur = 0;
            ctx.fillStyle = this.bgColor;
            let clearX = drawX + 10;
            if (clearX + this.blankingGap > width) {
                ctx.fillRect(clearX, 0, width - clearX, height);
                ctx.fillRect(0, 0, this.blankingGap - (width - clearX), height);
            } else {
                ctx.fillRect(clearX, 0, this.blankingGap, height);
            }
            ctx.restore();

            // B. 设置辉光效果
            ctx.strokeStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = this.shadowBlur;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // C. 绘制波形线段
            if (drawX > 0) {
                ctx.beginPath();
                ctx.moveTo(drawX - 1, this.lastY);
                ctx.lineTo(drawX, currentY);
                ctx.stroke();
            }

            this.lastY = currentY;
            this.scanX++;

            // 记录点坐标（用于模式切换时重绘）
            this.pathHistory.push({ x: drawX, y: currentY });

            // 回卷处理：随机调整参数，让每次扫描都有变化
            if (this.scanX >= width) {
                this.scanX = 0;
                this.pathHistory = [];  // 回卷时清空历史
                // 随机起始相位(0.5-0.85)，让第一个波峰在10-30%位置
                this.beatPhase = 0.5 + Math.random() * 0.35;
                // 随机周期数(2.7-3.3)，让波峰间距有变化
                this.cyclesPerScan = 2.7 + Math.random() * 0.6;
            }
        }

        this.animationId = requestAnimationFrame((t) => this.draw(t));
    }

    start() {
        if (this.isRunning || !this.canvas) return;
        this.isRunning = true;
        this.lastFrameTime = 0;
        this.pixelAccumulator = 0;
        requestAnimationFrame((t) => this.draw(t));
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

// 全局实例
window.ecgController = null;

// 初始化（不自动启动，等待README阅读后启动）
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('ecgCanvas');
    if (canvas) {
        window.ecgController = new ECGController('ecgCanvas');
        // 不自动启动，由app.js在阅读README后1秒启动
    }
});
