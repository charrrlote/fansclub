const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;

// 启用 CORS
app.use(cors());

// 解析 JSON 请求体
app.use(express.json());

// 服务静态文件
app.use(express.static(path.join(__dirname)));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const wss = new WebSocket.Server({ server: app.listen(PORT) });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            if (data.type === 'danmu') {
                // 广播弹幕给所有连接的客户端
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'danmu',
                            text: data.text,
                            color: data.color
                        }));
                    }
                });
            }
        } catch (error) {
            console.error('消息处理错误:', error);
        }
    });
}); 