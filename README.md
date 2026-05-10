# OmniBox Spider Worker

自动聚合 OmniBox 爬虫脚本并生成 TVBox 配置文件的 Cloudflare Worker 项目。

## 📋 目录

- [功能特性](#功能特性)
- [一键部署](#一键部署)
- [项目结构](#项目结构)
- [快速部署](#快速部署)
- [详细部署指南](#详细部署指南)
- [API 接口](#api-接口)
- [使用方式](#使用方式)
- [更新维护](#更新维护)
- [故障排查](#故障排查)

**📚 更多文档：**
- [KV 命名空间配置详细步骤](KV_SETUP_GUIDE.md) ⭐ 必看
- [快速部署流程图](QUICK_DEPLOY_GUIDE.md)
- [Cloudflare Pages 部署指南](CLOUDFLARE_PAGES_DEPLOY.md)

---

## 一键部署

### 🚀 方式一：智能部署脚本（Windows 推荐）

**使用方法：**
```bash
双击运行 deploy-smart.bat
```

**功能：**
- ✅ 自动检查并安装依赖
- ✅ 自动登录 Cloudflare
- ✅ **自动创建 KV 命名空间**
- ✅ **自动更新配置文件**
- ✅ 一键部署完成

**只需 3 步：**
1. 安装 Node.js（首次需要）
2. 双击 `deploy-smart.bat`
3. 等待部署完成

---

### 🚀 方式二：Cloudflare Pages 部署（推荐）

**适合：** 不想配置本地环境的用户

**步骤：**

1. **Fork 项目到 GitHub**
2. **创建 KV 命名空间**
   ```bash
   wrangler login
   wrangler kv:namespace create CACHE
   ```
3. **更新 wrangler.toml**
   - 将 `your-kv-namespace-id` 替换为真实的 KV ID
4. **连接 Cloudflare Pages**
   - Dashboard → Workers & Pages → Create application → Pages
   - 连接你的 GitHub 仓库
5. **配置构建设置**
   ```
   Build command: npm run build-config
   Build output directory: public
   ```
6. **部署**

**详细步骤：** 查看 [CLOUDFLARE_PAGES_DEPLOY.md](CLOUDFLARE_PAGES_DEPLOY.md)

**优点：**
- ✅ 完全自动化
- ✅ 无需本地环境
- ✅ 每次推送自动部署
- ✅ 从 GitHub API 在线获取爬虫列表

---

### 📝 重要说明

**构建脚本已更新：**
- ✅ 从 GitHub API 在线获取爬虫脚本列表
- ✅ 不再依赖本地路径 `C:\Users\Administrator\Desktop\OmniBox-Spider-main`
- ✅ 支持在 Cloudflare Pages 环境中运行

**KV 命名空间配置：**
- ⚠️ 必须先创建 KV 命名空间才能部署
- ⚠️ 需要将真实的 KV ID 填入 `wrangler.toml`
- 📖 **详细步骤**: 查看 [KV_SETUP_GUIDE.md](KV_SETUP_GUIDE.md)

**快速创建 KV 命名空间：**

```bash
# 1. 登录 Cloudflare
wrangler login

# 2. 创建 KV 命名空间
wrangler kv:namespace create CACHE

# 3. 复制输出的 ID，例如：
# { binding = "CACHE", id = "abc123def456..." }

# 4. 更新 wrangler.toml，将 your-kv-namespace-id 替换为真实 ID

# 5. 提交到 GitHub（如果使用 Cloudflare Pages）
git add wrangler.toml
git commit -m "Update KV namespace ID"
git push
```

---

## 功能特性

- 🕷️ **自动扫描**: 扫描 120+ 个爬虫脚本，提取元信息
- 📝 **配置生成**: 自动生成 TVBox 格式的配置文件
- 🚀 **Cloudflare 部署**: 部署到 Cloudflare Workers，全球加速
- 🔄 **自动更新**: 支持自动刷新配置缓存
- 📊 **API 接口**: 提供 RESTful API 接口
- 💰 **完全免费**: Cloudflare 免费套餐完全够用

---

## 项目结构

```
OmniBox-Spider-Worker/
├── src/                          # 源代码目录
│   ├── index.js                  # Worker 入口
│   ├── handler.js                # 请求处理器
│   ├── spider-scanner.js         # 爬虫扫描器
│   ├── metadata-parser.js        # 元数据解析器
│   └── config-generator.js       # 配置生成器
├── scripts/                      # 构建脚本
│   └── build-config.js           # 配置构建脚本
├── public/                       # 生成的配置文件
│   └── config.json               # TVBox 配置（120个站点）
├── package.json                  # 项目配置
├── wrangler.toml                 # Cloudflare Worker 配置
└── README.md                     # 本文档
```

### 核心文件说明

| 文件 | 作用 | 说明 |
|------|------|------|
| `src/index.js` | Worker 入口 | 处理所有请求的入口点 |
| `src/handler.js` | 请求处理器 | 路由分发和响应生成 |
| `src/spider-scanner.js` | 爬虫扫描器 | 扫描爬虫脚本目录 |
| `src/metadata-parser.js` | 元数据解析器 | 提取脚本元信息 |
| `src/config-generator.js` | 配置生成器 | 生成 TVBox 配置 |
| `scripts/build-config.js` | 构建脚本 | 本地构建配置文件 |
| `wrangler.toml` | Worker 配置 | Cloudflare 部署配置 |

---

## 快速部署

### 前置要求

- Node.js 16+ 
- Cloudflare 账户（免费）
- Wrangler CLI

### 5 分钟快速部署

#### 1. 安装 Wrangler

```bash
npm install -g wrangler
```

#### 2. 登录 Cloudflare

```bash
wrangler login
```

浏览器会自动打开，授权 Wrangler 访问你的 Cloudflare 账户。

#### 3. 创建 KV 命名空间

```bash
wrangler kv:namespace create CACHE
```

复制输出的 ID，例如：
```
{ binding = "CACHE", id = "abc123def456..." }
```

#### 4. 更新配置

编辑 `wrangler.toml`，填入 KV ID：

```toml
[[kv_namespaces]]
binding = "CACHE"
id = "你的KV命名空间ID"
```

#### 5. 部署

```bash
npm run deploy
```

部署成功后会显示：
```
✨ Published omnibox-spider-worker
  https://omnibox-spider-worker.你的账户.workers.dev
```

#### 6. 测试

访问你的 Worker：
- 主页: `https://omnibox-spider-worker.你的账户.workers.dev/`
- 配置: `https://omnibox-spider-worker.你的账户.workers.dev/config.json`

---

## 详细部署指南

### 1. 环境准备

#### 1.1 安装 Node.js

**Windows:**
1. 访问 https://nodejs.org/
2. 下载 LTS 版本（推荐 18.x 或更高）
3. 运行安装程序

**验证安装:**
```bash
node --version
npm --version
```

#### 1.2 安装 Wrangler

```bash
npm install -g wrangler
wrangler --version
```

### 2. Cloudflare 账户设置

#### 2.1 注册账户

1. 访问 https://dash.cloudflare.com/sign-up
2. 填写邮箱和密码
3. 验证邮箱

#### 2.2 获取账户 ID

1. 登录 Cloudflare Dashboard
2. 右侧栏查看 **Account ID**
3. 复制保存

#### 2.3 登录 Wrangler

```bash
wrangler login
```

验证登录：
```bash
wrangler whoami
```

### 3. KV 命名空间配置

#### 3.1 创建 KV 命名空间

```bash
wrangler kv:namespace create CACHE
```

#### 3.2 创建预览环境（可选）

```bash
wrangler kv:namespace create CACHE --preview
```

#### 3.3 更新 wrangler.toml

```toml
name = "omnibox-spider-worker"
main = "src/index.js"
compatibility_date = "2024-01-01"

[vars]
SPIDER_REPO_URL = "https://github.com/dlgt7/OmniBox-Spider"

[site]
bucket = "./public"

[[kv_namespaces]]
binding = "CACHE"
id = "你的生产环境KV_ID"
preview_id = "你的预览环境KV_ID"  # 可选
```

### 4. 环境变量配置

#### 4.1 在 wrangler.toml 中配置

```toml
[vars]
SPIDER_REPO_URL = "https://github.com/dlgt7/OmniBox-Spider"
```

#### 4.2 使用 Secrets（敏感信息）

```bash
wrangler secret put API_KEY
# 输入密钥值
```

### 5. 部署到 Cloudflare

#### 5.1 构建配置文件

```bash
npm run build-config
```

输出：
```
开始扫描爬虫脚本...
总共找到 120 个爬虫脚本
配置文件已生成: public/config.json
```

#### 5.2 部署

```bash
npm run deploy
```

或：
```bash
wrangler deploy
```

#### 5.3 查看部署信息

```bash
wrangler deployments list
```

### 6. 绑定自定义域名

#### 方式一：通过 Dashboard（推荐）

1. Cloudflare Dashboard → Workers & Pages
2. 点击你的 Worker
3. Settings → Triggers
4. Add Custom Domain
5. 输入域名（如 `spider.yourdomain.com`）

#### 方式二：通过配置文件

编辑 `wrangler.toml`：

```toml
routes = [
  { pattern = "spider.yourdomain.com/*", zone_name = "yourdomain.com" }
]
```

然后部署：
```bash
wrangler deploy
```

#### 域名要求

- 域名必须已添加到 Cloudflare
- DNS 状态为 Active
- Cloudflare 会自动配置 SSL

### 7. 多环境部署

#### 7.1 配置多环境

```toml
# 生产环境
[env.production]
name = "omnibox-spider-worker-prod"

[[env.production.kv_namespaces]]
binding = "CACHE"
id = "production-kv-id"

# 开发环境
[env.development]
name = "omnibox-spider-worker-dev"

[[env.development.kv_namespaces]]
binding = "CACHE"
id = "development-kv-id"
```

#### 7.2 部署到不同环境

```bash
# 部署到生产环境
wrangler deploy --env production

# 部署到开发环境
wrangler deploy --env development
```

### 8. 高级配置

#### 8.1 缓存策略

在 `src/handler.js` 中：

```javascript
const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'public, max-age=3600', // 缓存1小时
  'CDN-Cache-Control': 'public, max-age=3600',
};
```

#### 8.2 CORS 配置

```javascript
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
```

#### 8.3 速率限制

在 `wrangler.toml` 中：

```toml
[limits]
cpu_ms = 50  # CPU 时间限制
```

### 9. 监控和日志

#### 9.1 查看实时日志

```bash
npm run tail
```

或：
```bash
wrangler tail
```

#### 9.2 查看分析数据

1. Cloudflare Dashboard
2. Workers & Pages
3. 点击你的 Worker
4. Analytics

可以看到：
- 请求数量
- 错误率
- CPU 时间
- 带宽使用

#### 9.3 配置告警

1. Dashboard → Notifications
2. Add → Workers Alert
3. 配置触发条件（如错误率 > 5%）

---

## API 接口

### 获取配置文件

```
GET /config.json
GET /jiekou.json
```

返回 TVBox 格式的配置文件。

**示例:**
```bash
curl https://your-worker.workers.dev/config.json
```

### 获取爬虫列表

```
GET /api/spiders
```

返回所有爬虫脚本的详细信息。

**示例:**
```bash
curl https://your-worker.workers.dev/api/spiders
```

### 刷新配置

```
POST /api/refresh
```

强制刷新配置缓存。

**示例:**
```bash
curl -X POST https://your-worker.workers.dev/api/refresh
```

---

## 使用方式

### 在 TVBox 中使用

1. 部署成功后，获取 Worker URL：
   ```
   https://omnibox-spider-worker.你的账户.workers.dev
   ```

2. 在 TVBox 应用中：
   - 进入设置 → 配置地址
   - 输入配置 URL：
     ```
     https://omnibox-spider-worker.你的账户.workers.dev/config.json
     ```
   - 点击确定，等待加载

### 使用自定义域名

如果绑定了自定义域名：

```
https://spider.yourdomain.com/config.json
```

---

## 更新维护

### 更新爬虫脚本

当爬虫脚本仓库更新时：

```bash
# 1. 更新爬虫仓库
cd C:\Users\Administrator\Desktop\OmniBox-Spider-main
git pull

# 2. 重新构建配置
cd C:\Users\Administrator\Desktop\OmniBox-Spider-Worker
npm run build-config

# 3. 重新部署
npm run deploy
```

### 回滚部署

```bash
# 查看部署历史
wrangler deployments list

# 回滚到上一版本
wrangler rollback

# 回滚到指定版本
wrangler rollback --version <version-id>
```

### 清理缓存

```bash
# 通过 API 刷新
curl -X POST https://your-worker.workers.dev/api/refresh
```

---

## 故障排查

### 问题 1: 部署失败 - 权限错误

**错误:**
```
Error: Authentication error
```

**解决:**
```bash
wrangler logout
wrangler login
```

### 问题 2: KV 命名空间未找到

**错误:**
```
Error: KV namespace not found
```

**解决:**
```bash
# 检查 KV
wrangler kv:namespace list

# 重新创建
wrangler kv:namespace create CACHE

# 更新 wrangler.toml 中的 ID
```

### 问题 3: 自定义域名无法访问

**原因:**
- DNS 未生效
- SSL 证书未配置
- 路由配置错误

**解决:**
```bash
# 检查 DNS
nslookup spider.yourdomain.com

# 检查路由
wrangler routes list

# 重新绑定
wrangler routes delete spider.yourdomain.com/*
wrangler routes publish spider.yourdomain.com/*
```

### 问题 4: 配置文件为空

**原因:**
- 爬虫仓库路径错误
- 构建脚本未运行

**解决:**
```bash
# 检查仓库
dir C:\Users\Administrator\Desktop\OmniBox-Spider-main

# 重新构建
npm run build-config
```

### 问题 5: Worker 超时

**错误:**
```
Error: Worker exceeded CPU time limit
```

**解决:**

优化代码，使用缓存：
```javascript
// 使用 KV 缓存
const cached = await env.CACHE.get(key);
if (cached) return cached;
```

### 问题 6: CORS 错误

**错误:**
```
Access blocked by CORS policy
```

**解决:**

确保响应包含 CORS 头：
```javascript
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
```

### 查看详细日志

```bash
# 实时日志
wrangler tail

# JSON 格式
wrangler tail --format json

# 只看错误
wrangler tail --status error
```

---

## 成本说明

### Cloudflare Workers 免费套餐

- **请求数**: 100,000 次/天
- **KV 读取**: 100,000 次/天
- **KV 写入**: 1,000 次/天
- **KV 存储**: 1GB
- **带宽**: 无限制

### 预估使用量

假设每天：
- 更新配置 10 次
- 访问配置 100 次

**计算:**
- KV 写入: 10 次/天 ✅
- KV 读取: 100 次/天 ✅
- 请求数: 110 次/天 ✅

**结论**: 免费套餐完全够用！

---

## 相关链接

- [OmniBox-Spider](https://github.com/dlgt7/OmniBox-Spider) - 爬虫脚本仓库
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) - 官方文档
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) - CLI 文档
- [TVBox](https://github.com/CatVodTVOfficial/TVBoxOSC) - TVBox 项目

---

## 许可证

MIT License

---

**祝你使用愉快！🎉**
