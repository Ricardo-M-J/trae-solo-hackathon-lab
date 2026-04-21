# Cloudflare Worker API 代理部署指南

本文档介绍如何部署 Cloudflare Worker 来保护您的 API 密钥，避免在前端代码中暴露。

## 部署步骤

### 1. 创建 Cloudflare 账户
- 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
- 注册并登录账户

### 2. 创建 Worker 项目
有两种方式创建 Worker：

#### 方式一：使用 Wrangler CLI（推荐）
```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 创建新项目
cd trae-solo-showcase
mkdir -p cloudflare-worker
cd cloudflare-worker
wrangler init
```

#### 方式二：直接在 Dashboard 创建
1. 登录 Cloudflare Dashboard
2. 进入 "Workers & Pages"
3. 点击 "Create Application"
4. 选择 "HTTP Worker"
5. 粘贴 worker.js 中的代码

### 3. 配置环境变量
在 Cloudflare Dashboard 中配置以下环境变量：
1. 进入 Workers & Pages
2. 选择您的 Worker
3. 点击 "Settings" → "Variables"
4. 添加以下变量：
   - **KIMI_API_KEY**: 您的 Kimi API 密钥
   - **PM_API_KEY**: 产品经理 API 密钥
   - **DESIGNER_API_KEY**: 设计师 API 密钥
   - **DEV_API_KEY**: 程序员 API 密钥
   - **QA_API_KEY**: 测试 API 密钥

### 4. 部署 Worker
#### 使用 Wrangler CLI
```bash
wrangler deploy
```

#### 在 Dashboard 部署
1. 保存 Worker 代码
2. 点击 "Deploy"

### 5. 配置自定义域名（可选）
1. 在 Worker 设置中点击 "Triggers"
2. 选择 "Custom Domains"
3. 添加您的域名（如 api.example.com）

### 6. 更新前端配置
部署 Worker 后，更新前端的环境变量：
```bash
# .env.production
VITE_API_PROXY_URL=https://your-worker.workers.dev/api/chat
```

## 验证部署

### 测试 Worker
```bash
curl -X POST https://your-worker.workers.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "moonshot-v1-8k",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 检查响应
如果返回正常的 API 响应，说明 Worker 部署成功。

## 费用说明
- **免费计划**：100,000 请求/天
- **付费计划**：$5/月起，无限请求
- 对于黑客松演示，免费额度足够使用

## 故障排查

### Worker 返回 404
- 检查路由配置是否正确
- 确认 Worker 已部署并启用

### CORS 错误
- 检查 Worker 的 CORS 头部配置
- 确保 `Access-Control-Allow-Origin` 包含您的域名

### API 密钥错误
- 确认环境变量已正确设置
- 检查 API 密钥是否有效

## 维护建议
1. **监控使用量**：定期检查 Worker 的请求统计
2. **设置告警**：为异常流量设置告警
3. **日志查看**：使用 `wrangler tail` 查看实时日志
4. **版本控制**：保留 Worker 代码的版本历史

## 相关资源
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Workers 示例代码](https://github.com/cloudflare/workers-sdk/tree/main/packages/wrangler)