# Playwright MCP 配置指南

## 目标
在 Trae IDE 中配置 Playwright MCP 服务器，实现浏览器自动化操作能力。

## 已完成
✅ Playwright MCP 包已安装：`npm install -g @executeautomation/playwright-mcp-server`

## 下一步：在 Trae IDE 中配置 MCP

### 步骤 1：打开 Trae IDE 设置
1. 打开 Trae IDE
2. 点击左侧边栏的 **设置图标** 或使用快捷键 `Ctrl + ,`

### 步骤 2：找到 MCP 配置
1. 在设置搜索框中输入 **"MCP"** 或 **"Model Context Protocol"**
2. 找到 **"MCP Server"** 或 **"MCP Servers"** 配置选项

### 步骤 3：添加 Playwright MCP 配置
点击 **"Add MCP Server"** 或 **"+"** 按钮，添加以下配置：

```json
{
  "name": "playwright",
  "command": "npx",
  "args": ["-y", "@executeautomation/playwright-mcp-server"]
}
```

或者如果使用全局安装的版本：

```json
{
  "name": "playwright",
  "command": "playwright-mcp-server",
  "args": []
}
```

### 步骤 4：保存并重启
1. 点击 **"Save"** 或 **"OK"** 保存配置
2. **重启 Trae IDE** 使配置生效

## 验证配置

配置完成后，可以测试以下功能：
- 浏览器导航：`mcp_Playwright_playwright_navigate`
- 点击元素：`mcp_Playwright_playwright_click`
- 填写表单：`mcp_Playwright_playwright_fill`
- 截图：`mcp_Playwright_playwright_screenshot`

## 故障排除

### 问题 1：找不到 MCP 配置选项
- 确保 Trae IDE 是最新版本
- 尝试在设置中搜索 "Servers" 或 "Extensions"

### 问题 2：MCP 服务器无法启动
- 检查 npm 是否正确安装
- 验证 Playwright MCP 包是否安装成功：`npm list -g @executeautomation/playwright-mcp-server`

### 问题 3：浏览器无法启动
- 运行 `npx playwright install` 安装浏览器依赖
- 检查系统权限设置

## 使用示例

配置完成后，可以使用以下命令测试：

```
帮我访问 GitHub 仓库设置页面并添加环境变量
帮我截图 Cloudflare Dashboard 的当前状态
帮我填写表单并提交
```

## 参考资源
- Playwright MCP: https://github.com/executeautomation/mcp-playwright
- Trae IDE 文档
- Playwright 官方文档
