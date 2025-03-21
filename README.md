# 饭圈话术生成器 & 弹幕墙

一个结合 DeepSeek API 的饭圈话术生成器和实时弹幕墙互动平台。用户可以生成有趣的饭圈语录，并通过弹幕墙进行互动。

## 功能特点

- 🌈 饭圈话术生成
  - 彩虹屁：夸奖偶像的饭圈语录
  - 打call语录：热血应援、激励偶像的语句
  - 饭圈黑话：有趣的饭圈术语及解释

- 💬 实时弹幕墙
  - 支持自定义弹幕颜色
  - 平滑的弹幕动画效果
  - 响应式设计，适配各种设备

## 技术栈

- HTML5
- CSS3 (动画、渐变、毛玻璃效果)
- JavaScript (原生)
- DeepSeek API

## 快速开始

1. 克隆项目到本地：
```bash
git clone [项目地址]
cd [项目目录]
```

2. 配置 DeepSeek API：
   - 注册 DeepSeek 账号并获取 API Key
   - 在 `script.js` 中填入你的 API Key：
   ```javascript
   const DEEPSEEK_API_KEY = '你的API Key';
   ```

3. 启动项目：
   - 使用本地服务器（如 Live Server）运行项目
   - 或直接打开 `index.html` 文件

## 使用说明

1. 生成饭圈话术：
   - 选择话术类型（彩虹屁/打call/黑话）
   - 点击"生成饭圈语录"按钮
   - 可以复制生成的内容或发送到弹幕墙

2. 弹幕互动：
   - 在输入框中输入文字
   - 选择弹幕颜色
   - 点击发送按钮

## 注意事项

- DeepSeek API 需要配置有效的 API Key
- 建议使用现代浏览器以获得最佳体验
- 移动端支持响应式布局

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 许可证

MIT License 