// 等待 DOM 完全加载后再执行脚本
document.addEventListener('DOMContentLoaded', () => {
    // 获取所有需要的 DOM 元素
    const elements = {
        chatHistory: document.getElementById('chatHistory'),
        userInput: document.getElementById('userInput'),
        sendChatBtn: document.getElementById('sendChatBtn'),
        typeButtons: document.querySelectorAll('.type-btn'),
        generateBtn: document.getElementById('generateBtn'),
        resultText: document.getElementById('generatedText'),
        copyBtn: document.getElementById('copyBtn'),
        sendBtn: document.getElementById('sendBtn'),
        danmuWall: document.getElementById('danmuWall'),
        danmuInput: document.getElementById('danmuInput'),
        colorPicker: document.getElementById('colorPicker'),
        danmuSendBtn: document.getElementById('danmuSendBtn')
    };

    // 检查所有元素是否存在
    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            console.error(`找不到元素: ${key}`);
            return; // 如果有任何元素不存在，就停止执行
        }
    }

    // 初始化事件监听器
    initializeEventListeners(elements);
});

function initializeEventListeners(elements) {
    const { sendChatBtn, userInput } = elements;

    // 聊天发送按钮点击事件
    sendChatBtn.addEventListener('click', () => handleSendMessage(elements));

    // 输入框回车发送
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(elements);
        }
    });

    // 类型按钮点击事件
    elements.typeButtons.forEach(button => {
        button.addEventListener('click', () => {
            elements.typeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentType = button.dataset.type;
        });
    });

    elements.generateBtn.addEventListener('click', generatePhrase);
    elements.copyBtn.addEventListener('click', copyToClipboard);
    elements.sendBtn.addEventListener('click', () => {
        if (elements.resultText.textContent !== '点击上方按钮生成语录~') {
            createDanmu(elements.resultText.textContent, elements.colorPicker.value);
        }
    });
    elements.danmuSendBtn.addEventListener('click', () => {
        if (elements.danmuInput.value.trim()) {
            createDanmu(elements.danmuInput.value, elements.colorPicker.value);
            elements.danmuInput.value = '';
        }
    });
}

// 其他函数定义...

// Current selected type
let currentType = 'rainbow';

// DeepSeek API configuration
const DEEPSEEK_API_KEY = 'sk-34fc6e9144b24a7baa7b6673a3223d9f'; // 替换成你的实际 API Key
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Type prompts
const prompts = {
    rainbow: [
        {
            role: "system",
            content: "你是一个饭圈达人，善于用甜美温暖的语言夸赞偶像。请生成一句富有创意的彩虹屁，字数在30字以内。"
        },
        {
            role: "user",
            content: "请生成一句夸赞偶像的话"
        }
    ],
    cheer: [
        {
            role: "system",
            content: "你是一个热情的应援粉丝，善于用充满能量的语言为偶像打call。请生成一句热血的应援语录，字数在30字以内。"
        },
        {
            role: "user",
            content: "请生成一句应援语录"
        }
    ],
    slang: [
        {
            role: "system",
            content: "你是一个饭圈文化专家，精通各种饭圈黑话。请生成一句有趣的饭圈黑话并解释其含义，字数在30字以内。"
        },
        {
            role: "user",
            content: "请生成一句饭圈黑话"
        }
    ]
};

// 在 generatePhrase 函数开始添加测试数据
const testPhrases = {
    rainbow: "你就是天上最闪亮的星星，每个舞台都因你而璀璨！",
    cheer: "为你疯狂打call！你就是最棒的！",
    slang: "爆米花女孩：形容追星girl们在演唱会上激动跳跃的样子"
};

// Generate phrase using DeepSeek API
async function generatePhrase() {
    try {
        elements.generateBtn.disabled = true;
        elements.resultText.textContent = '生成中...';

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: prompts[currentType],
                temperature: 0.7,
                max_tokens: 100
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.choices && data.choices[0]) {
            elements.resultText.textContent = data.choices[0].message.content.trim();
        } else {
            throw new Error('API返回数据格式错误');
        }
    } catch (error) {
        console.error('Error:', error);
        elements.resultText.textContent = '生成失败，请稍后重试';
    } finally {
        elements.generateBtn.disabled = false;
    }
}

// Copy text to clipboard
function copyToClipboard() {
    if (elements.resultText.textContent !== '点击上方按钮生成语录~') {
        navigator.clipboard.writeText(elements.resultText.textContent)
            .then(() => {
                const originalText = elements.copyBtn.textContent;
                elements.copyBtn.textContent = '已复制！';
                setTimeout(() => {
                    elements.copyBtn.textContent = originalText;
                }, 2000);
            })
            .catch(err => console.error('复制失败:', err));
    }
}

// Create and animate danmu
function createDanmu(text, color) {
    const danmu = document.createElement('div');
    danmu.className = 'danmu';
    danmu.textContent = text;
    danmu.style.color = color;
    
    // Random vertical position
    const top = Math.random() * (elements.danmuWall.clientHeight - 50);
    danmu.style.top = `${top}px`;
    
    elements.danmuWall.appendChild(danmu);
    
    // Remove danmu after animation
    danmu.addEventListener('animationend', () => {
        elements.danmuWall.removeChild(danmu);
    });
}

// 全局变量
const messageHistory = [];
const systemMessage = {
    role: "system",
    content: "你是一个友好的AI助手，精通饭圈文化。你可以生成饭圈用语，也可以和用户自由交谈。如果用户询问敏感话题，请婉拒并引导到积极话题。"
};

async function handleSendMessage(elements) {
    const { chatHistory, userInput } = elements;
    const message = userInput.value.trim();
    if (!message) return;

    // 添加用户消息到聊天记录
    appendMessage(chatHistory, 'user', message);
    userInput.value = '';

    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    systemMessage,
                    ...messageHistory,
                    { role: "user", content: message }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const botResponse = data.choices[0].message.content;
        
        // 添加机器人回复到聊天记录
        appendMessage(chatHistory, 'bot', botResponse);
        
        // 更新聊天历史
        messageHistory.push(
            { role: "user", content: message },
            { role: "assistant", content: botResponse }
        );

        // 保持聊天历史在合理范围内
        if (messageHistory.length > 10) {
            messageHistory.splice(0, messageHistory.length - 10);
        }

    } catch (error) {
        appendMessage(chatHistory, 'bot', '抱歉，我遇到了一些问题，请稍后再试。');
        console.error('Error:', error);
    }
}

function appendMessage(chatHistory, type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}-message`;
    messageDiv.textContent = content;
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

async function testApiKey() {
    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    {
                        role: "user",
                        content: "你好"
                    }
                ]
            })
        });

        if (response.ok) {
            console.log('API Key 配置正确！');
            return true;
        } else {
            console.error('API Key 可能有误，状态码:', response.status);
            return false;
        }
    } catch (error) {
        console.error('API 请求失败:', error);
        return false;
    }
}

async function handleQuickAction(type, elements) {
    const prompts = {
        rainbow: "请生成一句夸奖偶像的饭圈彩虹屁语录，要求积极正面、富有创意，字数在30字以内。",
        cheer: "请生成一句为偶像打call的应援语录，要求热血励志、充满能量，字数在30字以内。",
        slang: "请生成一句饭圈黑话，要求有趣、符合饭圈文化，并解释其含义，字数在30字以内。"
    };

    const prompt = prompts[type];
    if (prompt) {
        elements.userInput.value = prompt;
        handleSendMessage(elements);
    }
}

// 配置和常量
const CONFIG = {
    DEEPSEEK_API_KEY: 'sk-34fc6e9144b24a7baa7b6673a3223d9f', // 替换成你的实际 API Key
    API_URL: 'https://api.deepseek.com/v1/chat/completions',
    MAX_HISTORY: 10
};

const PROMPTS = {
    rainbow: "请生成一句夸奖偶像的饭圈彩虹屁语录，要求积极正面、富有创意，字数在30字以内。",
    cheer: "请生成一句为偶像打call的应援语录，要求热血励志、充满能量，字数在30字以内。",
    slang: "请生成一句饭圈黑话，要求有趣、符合饭圈文化，并解释其含义，字数在30字以内。"
};

// 聊天系统
class ChatSystem {
    constructor() {
        this.history = [];
        this.systemMessage = {
            role: "system",
            content: "你是一个友好的AI助手，精通饭圈文化。你可以生成饭圈用语，也可以和用户自由交谈。"
        };
        this.initElements();
        this.initEventListeners();
    }

    initElements() {
        this.elements = {
            chatHistory: document.getElementById('chatHistory'),
            userInput: document.getElementById('userInput'),
            sendButton: document.getElementById('sendChatBtn'),
            quickButtons: document.querySelectorAll('.type-btn')
        };
    }

    initEventListeners() {
        if (!this.validateElements()) return;

        this.elements.sendButton.addEventListener('click', () => this.sendMessage());
        this.elements.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.elements.quickButtons.forEach(btn => {
            btn.addEventListener('click', () => this.handleQuickAction(btn.dataset.type));
        });
    }

    validateElements() {
        return Object.entries(this.elements).every(([key, element]) => {
            if (!element) {
                console.error(`找不到元素: ${key}`);
                return false;
            }
            return true;
        });
    }

    async sendMessage() {
        const message = this.elements.userInput.value.trim();
        if (!message) return;

        this.appendMessage('user', message);
        this.elements.userInput.value = '';

        try {
            const response = await this.callAPI(message);
            this.appendMessage('bot', response);
        } catch (error) {
            console.error('Error:', error);
            this.appendMessage('bot', '抱歉，我遇到了一些问题，请稍后再试。');
        }
    }

    async callAPI(message) {
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    this.systemMessage,
                    ...this.history,
                    { role: "user", content: message }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || '请求失败');

        const botResponse = data.choices[0].message.content;
        this.updateHistory(message, botResponse);
        return botResponse;
    }

    updateHistory(userMessage, botResponse) {
        this.history.push(
            { role: "user", content: userMessage },
            { role: "assistant", content: botResponse }
        );

        if (this.history.length > CONFIG.MAX_HISTORY * 2) {
            this.history = this.history.slice(-CONFIG.MAX_HISTORY * 2);
        }
    }

    appendMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}-message`;
        
        // 创建消息内容容器
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        messageDiv.appendChild(contentDiv);

        // 如果是机器人消息，添加操作按钮
        if (type === 'bot') {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'message-actions';

            // 复制按钮
            const copyBtn = document.createElement('button');
            copyBtn.className = 'message-action-btn';
            copyBtn.textContent = '复制';
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(content)
                    .then(() => {
                        copyBtn.textContent = '已复制';
                        setTimeout(() => copyBtn.textContent = '复制', 1000);
                    });
            };

            // 发送到弹幕按钮
            const sendToDanmuBtn = document.createElement('button');
            sendToDanmuBtn.className = 'message-action-btn';
            sendToDanmuBtn.textContent = '发送弹幕';
            sendToDanmuBtn.onclick = () => {
                const danmuSystem = new DanmuSystem();
                danmuSystem.sendCustomDanmu(content);
            };

            actionsDiv.appendChild(copyBtn);
            actionsDiv.appendChild(sendToDanmuBtn);
            messageDiv.appendChild(actionsDiv);
        }

        this.elements.chatHistory.appendChild(messageDiv);
        this.elements.chatHistory.scrollTop = this.elements.chatHistory.scrollHeight;
    }

    handleQuickAction(type) {
        if (PROMPTS[type]) {
            this.elements.userInput.value = PROMPTS[type];
            this.sendMessage();
        }
    }
}

// 弹幕系统
class DanmuSystem {
    constructor() {
        this.initElements();
        this.initEventListeners();
    }

    initElements() {
        this.elements = {
            wall: document.getElementById('danmuWall'),
            input: document.getElementById('danmuInput'),
            colorPicker: document.getElementById('colorPicker'),
            sendButton: document.getElementById('danmuSendBtn')
        };
    }

    initEventListeners() {
        if (!this.validateElements()) return;

        this.elements.sendButton.addEventListener('click', () => this.sendDanmu());
        this.elements.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.sendDanmu();
            }
        });
    }

    validateElements() {
        return Object.entries(this.elements).every(([key, element]) => {
            if (!element) {
                console.error(`找不到弹幕元素: ${key}`);
                return false;
            }
            return true;
        });
    }

    sendDanmu() {
        const text = this.elements.input.value.trim();
        if (!text) return;

        const danmu = this.createDanmuElement(text);
        this.elements.wall.appendChild(danmu);
        this.elements.input.value = '';

        danmu.addEventListener('animationend', () => {
            this.elements.wall.removeChild(danmu);
        });
    }

    createDanmuElement(text) {
        const danmu = document.createElement('div');
        danmu.className = 'danmu';
        danmu.textContent = text;
        danmu.style.color = this.elements.colorPicker?.value || '#ffffff';
        
        // 计算弹幕显示高度，避开输入区域
        const maxHeight = this.elements.wall.clientHeight - 80; // 预留输入框高度
        danmu.style.top = `${Math.random() * maxHeight}px`;

        // 根据文本长度设置动画速度
        const textLength = text.length;
        if (textLength <= 15) {
            danmu.dataset.length = 'short';
        } else if (textLength <= 30) {
            danmu.dataset.length = 'medium';
        } else {
            danmu.dataset.length = 'long';
        }

        return danmu;
    }

    sendCustomDanmu(text) {
        if (!text) return;
        const danmu = this.createDanmuElement(text);
        this.elements.wall.appendChild(danmu);
        
        // 移除已完成动画的弹幕
        danmu.addEventListener('animationend', () => {
            if (this.elements.wall.contains(danmu)) {
                this.elements.wall.removeChild(danmu);
            }
        });
    }
}

// 添加在线人数模拟功能
class OnlineCounter {
    constructor() {
        this.count = Math.floor(Math.random() * 50) + 30; // 初始随机人数
        this.countElement = document.getElementById('onlineCount');
        this.startCounting();
    }

    startCounting() {
        setInterval(() => {
            // 随机增减人数
            const change = Math.random() > 0.5 ? 1 : -1;
            this.count = Math.max(30, Math.min(100, this.count + change));
            this.updateDisplay();
        }, 1000);
    }

    updateDisplay() {
        this.countElement.textContent = this.count;
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    const onlineCounter = new OnlineCounter();
    testDeepSeekAPI().then(success => {
        if (success) {
            console.log('API 连接正常，可以开始使用了！');
            const chatSystem = new ChatSystem();
            const danmuSystem = new DanmuSystem();
        } else {
            console.error('API 连接测试失败，请检查配置。');
        }
    });
});

// 测试 DeepSeek API 连接
async function testDeepSeekAPI() {
    const testMessage = "你好";
    
    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.DEEPSEEK_API_KEY}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "user", content: testMessage }
                ],
                temperature: 0.7,
                max_tokens: 100
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('API 响应错误:', data);
            return false;
        }

        console.log('API 测试成功！');
        console.log('响应数据:', data);
        return true;

    } catch (error) {
        console.error('API 测试失败:', error);
        return false;
    }
}