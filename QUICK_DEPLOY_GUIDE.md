# 🚀 快速部署流程图

## 完整部署流程

```
┌─────────────────────────────────────────────────────────────┐
│                    开始部署                                   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  步骤 1: 准备环境                                             │
│  ✅ 安装 Node.js (https://nodejs.org/)                       │
│  ✅ 安装 Wrangler: npm install -g wrangler                   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  步骤 2: 登录 Cloudflare                                      │
│  $ wrangler login                                            │
│  → 浏览器自动打开 → 点击 Allow 授权                            │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  步骤 3: 创建 KV 命名空间 ⭐ 关键步骤                          │
│  $ wrangler kv:namespace create CACHE                        │
│  → 输出: { binding = "CACHE", id = "abc123..." }             │
│  → 复制 ID                                                   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  步骤 4: 更新配置文件                                          │
│  编辑 wrangler.toml:                                         │
│  ┌────────────────────────────────────────────┐              │
│  │ [[kv_namespaces]]                          │              │
│  │ binding = "CACHE"                          │              │
│  │ id = "abc123..."  ← 粘贴真实 ID            │              │
│  └────────────────────────────────────────────┘              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  步骤 5: 选择部署方式                                          │
│                                                               │
│  方式 A: 本地部署 (Windows)                                   │
│  ┌────────────────────────────────────────────┐              │
│  │ 双击 deploy-smart.bat                      │              │
│  │ → 自动构建 → 自动部署                       │              │
│  └────────────────────────────────────────────┘              │
│                                                               │
│  方式 B: Cloudflare Pages (推荐)                              │
│  ┌────────────────────────────────────────────┐              │
│  │ 1. git add .                               │              │
│  │ 2. git commit -m "Update KV ID"            │              │
│  │ 3. git push                                │              │
│  │ 4. 连接 Cloudflare Pages                   │              │
│  │ 5. 配置构建并部署                           │              │
│  └────────────────────────────────────────────┘              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  步骤 6: 获取配置地址                                          │
│                                                               │
│  部署成功后显示：                                              │
│  ✨ Published omnibox-spider-worker                           │
│     https://omnibox-spider-worker.你的账户.workers.dev        │
│                                                               │
│  TVBox 配置地址：                                             │
│  https://omnibox-spider-worker.你的账户.workers.dev/config.json│
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  步骤 7: 在 TVBox 中使用                                       │
│  1. 打开 TVBox 应用                                           │
│  2. 设置 → 配置地址                                           │
│  3. 输入配置 URL                                              │
│  4. 点击确定                                                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    🎉 部署完成！                               │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚠️ 关键检查点

### 检查点 1: Wrangler 登录

```bash
wrangler whoami
```

**成功输出：**
```
You are logged in with an OAuth Token...
```

**失败：** 重新运行 `wrangler login`

---

### 检查点 2: KV 命名空间

```bash
wrangler kv:namespace list
```

**成功输出：**
```json
[
  {
    "id": "abc123...",
    "title": "omnibox-spider-worker-CACHE"
  }
]
```

**失败：** 重新创建 `wrangler kv:namespace create CACHE`

---

### 检查点 3: wrangler.toml 配置

**检查内容：**
```toml
[[kv_namespaces]]
binding = "CACHE"
id = "abc123..."  # ✅ 必须是真实 ID，不能是 "your-kv-namespace-id"
```

**错误示例：**
```toml
id = "your-kv-namespace-id"  # ❌ 这是示例值，必须替换
```

---

### 检查点 4: 构建配置

```bash
npm run build-config
```

**成功输出：**
```
总共找到 120 个爬虫脚本
✓ 配置文件已生成
```

---

### 检查点 5: 部署

```bash
npm run deploy
```

**成功输出：**
```
✨ Published omnibox-spider-worker
  https://omnibox-spider-worker.你的账户.workers.dev
```

**失败输出：**
```
✘ [ERROR] KV namespace 'your-kv-namespace-id' is not valid.
```

**解决：** 检查 wrangler.toml 中的 KV ID 是否正确

---

## 📊 时间估算

| 步骤 | 时间 |
|------|------|
| 安装 Node.js | 5 分钟 |
| 安装 Wrangler | 1 分钟 |
| 登录 Cloudflare | 1 分钟 |
| 创建 KV 命名空间 | 1 分钟 |
| 更新配置文件 | 1 分钟 |
| 部署 | 2 分钟 |
| **总计** | **约 10 分钟** |

---

## 🎯 最简部署命令

如果你已经安装了 Node.js，只需 5 条命令：

```bash
# 1. 安装 Wrangler
npm install -g wrangler

# 2. 登录
wrangler login

# 3. 创建 KV
wrangler kv:namespace create CACHE

# 4. 更新 wrangler.toml（手动编辑，粘贴 KV ID）

# 5. 部署
npm run deploy
```

---

## 🆘 遇到问题？

### 问题 1: 找不到 KV 菜单

**解决：** 直接访问 https://dash.cloudflare.com/?to=/:account/workers/kv/namespaces

### 问题 2: 部署失败

**检查：**
1. KV ID 是否正确
2. 是否已登录
3. 网络是否正常

### 问题 3: 配置为空

**解决：** 
- 检查构建日志
- 确认 GitHub API 可访问
- 重新运行 `npm run build-config`

---

## 📚 相关文档

- [KV_SETUP_GUIDE.md](KV_SETUP_GUIDE.md) - KV 命名空间详细配置
- [CLOUDFLARE_PAGES_DEPLOY.md](CLOUDFLARE_PAGES_DEPLOY.md) - Cloudflare Pages 部署
- [README.md](README.md) - 完整项目文档

---

**祝你部署顺利！🎉**
