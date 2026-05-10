/**
 * 配置生成器 - 支持动态 spider 字段
 */

import { scanSpiders } from './spider-scanner.js';

async function getOriginalSpider() {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/dlgt7/omnibox-spider-worker/main/public/config.json',
      { cache: 'no-store' }
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.spider || "https://oss4liview.moji.com/thd_file/2026/05/08/b216ded4a854a190ce9f6bd280aff779.jpg;md5;448a9f26f33109f6aa148971c3adab46";
    }
  } catch (e) {
    console.error('获取原始 spider 失败:', e.message);
  }

  return "https://oss4liview.moji.com/thd_file/2026/05/08/b216ded4a854a190ce9f6bd280aff779.jpg;md5;448a9f26f33109f6aa148971c3adab46";
}

export async function generateConfig(env, forceRefresh = false) {
  console.log('=== generateConfig 开始执行 ===');

  if (!forceRefresh && env.CACHE) {
    try {
      const cached = await env.CACHE.get('config:latest');
      if (cached) {
        console.log('✅ 从 KV 缓存读取');
        return JSON.parse(cached);
      }
    } catch (e) {
      console.error('Cache read error:', e.message);
    }
  }

  const spiders = await scanSpiders(env);
  console.log(`扫描到 ${spiders.length} 个站点`);

  const spiderUrl = await getOriginalSpider();
  console.log('使用 spider 地址:', spiderUrl);

  const config = {
    spider: spiderUrl,
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
        expirationTtl: 7200 
      });
      console.log('✅ 配置已缓存');
    } catch (e) {
      console.error('Cache write error:', e.message);
    }
  }

  console.log('=== generateConfig 执行完成 ===');
  return config;
}
