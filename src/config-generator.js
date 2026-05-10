/**
 * 配置生成器 - 修复版
 */

import { scanSpiders } from './spider-scanner.js';

export async function generateConfig(env, forceRefresh = false) {
  if (!forceRefresh && env.CACHE) {
    try {
      const cached = await env.CACHE.get('config:latest');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.error('Cache read error:', e);
    }
  }

  const spiders = await scanSpiders(env);

  console.log(`生成配置 - 扫描到 ${spiders.length} 个站点`);

  const config = {
    spider: "https://gh-proxy.org/https://raw.githubusercontent.com/dlgt7/OmniBox-Spider/main/jiekou.json",
    wallpaper: "https://深色壁纸.xxooo.cf/",
    sites: spiders.map(spider => ({
      key: spider.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '').substring(0, 30),
      name: `🚀${spider.name}`,
      type: 3,
      api: spider.downloadUrl,
      searchable: 1,
      quickSearch: 1,
      filterable: 1
    }))
  };

  if (env.CACHE && spiders.length > 0) {
    try {
      await env.CACHE.put('config:latest', JSON.stringify(config), {
        expirationTtl: 7200,
      });
    } catch (e) {
      console.error('Cache write error:', e);
    }
  }

  return config;
}
