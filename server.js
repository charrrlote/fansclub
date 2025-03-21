const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 