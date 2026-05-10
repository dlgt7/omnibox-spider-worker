# KV 命名空间配置详细步骤

本指南将手把手教你创建和配置 Cloudflare KV 命名空间。

---

## 📋 目录

- [什么是 KV 命名空间](#什么是-kv-命名空间)
- [方式一：通过 Dashboard 创建（推荐新手）](#方式一通过-dashboard-创建推荐新手)
- [方式二：通过 Wrangler CLI 创建（推荐开发者）](#方式二通过-wrangler-cli-创建推荐开发者)
- [获取 KV 命名空间 ID](#获取-kv-命名空间-id)
- [配置到项目](#配置到项目)
- [验证配置](#验证配置)
- [常见问题](#常见问题)

---

## 什么是 KV 命名空间

**KV (Key-Value)** 是 Cloudflare 提供的键值存储服务，用于：

- ✅ 缓存配置数据
- ✅ 存储用户设置
- ✅ 提高访问速度
- ✅ 减少重复计算

**在本项目中的作用：**
- 缓存生成的 TVBox 配置
- 避免每次请求都重新生成
- 提高响应速度

**免费额度：**
- 读取：100,000 次/天
- 写入：1,000 次/天
- 存储：1GB

---

## 方式一：通过 Dashboard 创建（推荐新手）

### 步骤 1: 登录 Cloudflare

1. 打开浏览器
2. 访问 https://dash.cloudflare.com/
3. 输入邮箱和密码
4. 点击 **Log in**

### 步骤 2: 进入 Workers 页面

1. 登录后，在左侧菜单找到 **Workers & Pages**
2. 点击进入

### 步骤 3: 打开 KV 页面

1. 在 Workers & Pages 页面
2. 点击顶部的 **KV** 标签
3. 你会看到 "Create a namespace" 按钮

### 步骤 4: 创建命名空间

1. 点击 **Create a namespace** 按钮
2. 在弹出的对话框中：
   - **Namespace Name**: 输入 `CACHE`
   - **Location**: 选择 `Automatic`（自动选择最近的位置）
3. 点击 **Add** 按钮

### 步骤 5: 确认创建

创建成功后，你会看到：
- 命名空间名称：CACHE
- 命名空间 ID：一串字符（如 `abc123def456...`）
- 位置：自动选择

---

## 方式二：通过 Wrangler CLI 创建（推荐开发者）

### 步骤 1: 安装 Wrangler

**已安装可跳过**

```bash
npm install -g wrangler
```

验证安装：
```bash
wrangler --version
```

### 步骤 2: 登录 Cloudflare

```bash
wrangler login
```

**会发生什么：**
1. 浏览器自动打开
2. 显示 Cloudflare 授权页面
3. 点击 **Allow** 授权
4. 浏览器显示 "Success"
5. 返回终端，显示登录成功

**验证登录：**
```bash
wrangler whoami
```

输出示例：
```
Getting User settings...
You are logged in with an OAuth Token, associated with the email 'your-email@example.com'!
┌───────────────────┬──────────────────────────────────┐
│ Account Name      │ Account ID                       │
├───────────────────┼──────────────────────────────────┤
│ Your Account      │ abc123def456...                  │
└───────────────────┴──────────────────────────────────┘
```

### 步骤 3: 创建 KV 命名空间

```bash
wrangler kv:namespace create CACHE
```

**输出示例：**
```
🌀 Creating namespace with title "omnibox-spider-worker-CACHE"
✨ Success!
Add the following to your configuration file in your kv_namespaces:
{ binding = "CACHE", id = "abc123def456789..." }
```

**重要：** 复制输出的 `id` 值！

### 步骤 4: 创建预览环境（可选）

如果需要本地开发，创建预览命名空间：

```bash
wrangler kv:namespace create CACHE --preview
```

**输出示例：**
```
🌀 Creating namespace with title "omnibox-spider-worker-CACHE_preview"
✨ Success!
Add the following to your configuration file in your kv_namespaces:
{ binding = "CACHE", preview_id = "xyz789..." }
```

### 步骤 5: 查看所有命名空间

```bash
wrangler kv:namespace list
```

**输出示例：**
```json
[
  {
    "id": "abc123def456...",
    "title": "omnibox-spider-worker-CACHE"
  },
  {
    "id": "xyz789...",
    "title": "omnibox-spider-worker-CACHE_preview"
  }
]
```

---

## 获取 KV 命名空间 ID

### 方式一：从 Dashboard 获取

1. Cloudflare Dashboard → Workers & Pages → KV
2. 点击你创建的 `CACHE` 命名空间
3. 在右侧查看 **Namespace ID**
4. 点击复制图标 📋

### 方式二：从 CLI 输出获取

创建时的输出中包含 ID：
```
{ binding = "CACHE", id = "abc123def456789..." }
```

复制 `id` 后面的值。

### 方式三：通过命令查看

```bash
wrangler kv:namespace list
```

复制对应命名空间的 `id` 字段。

---

## 配置到项目

### 步骤 1: 打开 wrangler.toml

使用文本编辑器打开项目中的 `wrangler.toml` 文件。

### 步骤 2: 找到 KV 配置部分

找到这部分：
```toml
[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"
```

### 步骤 3: 替换 ID

将 `your-kv-namespace-id` 替换为你复制的真实 ID：

**替换前：**
```toml
[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"
```

**替换后：**
```toml
[[kv_namespaces]]
binding = "CACHE"
id = "abc123def456789..."  # 你的真实 ID
```

### 步骤 4: 保存文件

保存 `wrangler.toml` 文件。

### 步骤 5: 提交到 Git（如果使用 GitHub）

```bash
git add wrangler.toml
git commit -m "Update KV namespace ID"
git push
```

---

## 验证配置

### 方式一：本地验证

```bash
# 构建配置
npm run build-config

# 本地运行
npm run dev
```

访问 http://localhost:8787/config.json

### 方式二：部署验证

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

如果看到这个错误，说明 ID 没有正确替换。

### 方式三：Dashboard 验证

1. Cloudflare Dashboard → Workers & Pages
2. 点击你的 Worker
3. Settings → Variables
4. 查看 KV Namespace Bindings
5. 确认 CACHE 绑定到正确的命名空间

---

## 完整配置示例

### 最小配置

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
id = "abc123def456789..."  # 替换为你的真实 ID
```

### 完整配置（包含预览环境）

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
id = "abc123def456789..."        # 生产环境 ID
preview_id = "xyz789..."         # 预览环境 ID（可选）
```

---

## 常见问题

### 问题 1: 创建失败 - 权限错误

**错误：**
```
Error: Authentication error
```

**解决：**
```bash
# 重新登录
wrangler logout
wrangler login
```

### 问题 2: 找不到 KV 菜单

**原因：** 可能是账户类型问题

**解决：**
1. 确认已登录正确的账户
2. 刷新页面
3. 尝试直接访问：https://dash.cloudflare.com/?to=/:account/workers/kv/namespaces

### 问题 3: ID 格式错误

**错误：**
```
KV namespace 'xxx' is not valid
```

**原因：** ID 格式不正确

**正确的 ID 格式：**
- 长度：32 个字符
- 字符：字母、数字
- 示例：`abc123def456789012345678901234`

**检查：**
1. 确保复制了完整的 ID
2. 没有多余的空格或引号
3. 没有拼写错误

### 问题 4: 命名空间名称冲突

**错误：**
```
A namespace with that name already exists
```

**解决：**
- 使用不同的名称，如 `CACHE2`
- 或删除旧的命名空间后重新创建

### 问题 5: 超出免费额度

**错误：**
```
Limit exceeded
```

**解决：**
- 免费账户限制：最多 10 个命名空间
- 删除不需要的命名空间
- 或升级到付费计划

---

## KV 命名空间管理

### 查看命名空间列表

**Dashboard：**
Workers & Pages → KV

**CLI：**
```bash
wrangler kv:namespace list
```

### 删除命名空间

**Dashboard：**
1. Workers & Pages → KV
2. 点击命名空间
3. 点击 **Delete**
4. 输入命名空间名称确认

**CLI：**
```bash
wrangler kv:namespace delete --namespace-id=<ID>
```

### 查看 KV 数据

**Dashboard：**
1. Workers & Pages → KV
2. 点击命名空间
3. 查看键值对列表

**CLI：**
```bash
# 列出所有键
wrangler kv:key list --namespace-id=<ID>

# 获取值
wrangler kv:key get "config:latest" --namespace-id=<ID>
```

### 清空 KV 数据

**CLI：**
```bash
# 删除单个键
wrangler kv:key delete "config:latest" --namespace-id=<ID>

# 清空所有数据（谨慎使用）
wrangler kv:bulk delete --namespace-id=<ID> --file=keys.json
```

---

## 最佳实践

### 1. 命名规范

- ✅ 使用大写字母：`CACHE`, `SESSION`, `CONFIG`
- ✅ 简洁明了：`CACHE` 而不是 `CACHE_STORAGE_FOR_DATA`
- ❌ 避免特殊字符

### 2. 环境分离

为不同环境创建不同的命名空间：

```toml
# 生产环境
[[env.production.kv_namespaces]]
binding = "CACHE"
id = "production-kv-id"

# 开发环境
[[env.development.kv_namespaces]]
binding = "CACHE"
id = "development-kv-id"
```

### 3. 缓存策略

```javascript
// 设置合理的过期时间
await env.CACHE.put(key, value, {
  expirationTtl: 3600,  // 1小时
});
```

### 4. 错误处理

```javascript
try {
  const cached = await env.CACHE.get(key);
  if (cached) return JSON.parse(cached);
} catch (error) {
  console.error('KV read error:', error);
  // 降级处理
}
```

---

## 快速检查清单

部署前检查：

- [ ] 已创建 KV 命名空间
- [ ] 已获取命名空间 ID
- [ ] 已更新 wrangler.toml
- [ ] ID 格式正确（32个字符）
- [ ] 已保存文件
- [ ] 已提交到 Git（如果使用 GitHub）

---

## 下一步

配置完成后：

1. **本地测试**
   ```bash
   npm run dev
   ```

2. **部署**
   ```bash
   npm run deploy
   ```

3. **验证**
   访问你的 Worker URL

---

**配置完成！🎉**
