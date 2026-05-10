/**
 * 配置生成器
 * 生成 TVBox 格式的配置文件
 */

import { scanSpiders } from './spider-scanner.js';

export async function generateConfig(env, forceRefresh = false) {
  // 尝试从缓存读取
  if (!forceRefresh && env.CACHE) {
    try {
      const cached = await env.CACHE.get('config:latest');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('Error reading from cache:', error);
    }
  }

  // 扫描爬虫脚本
  const spiders = await scanSpiders(env);

  // 生成配置
  const config = buildTVBoxConfig(spiders, env);

  // 缓存配置
  if (env.CACHE) {
    try {
      await env.CACHE.put('config:latest', JSON.stringify(config), {
        expirationTtl: 3600, // 1小时缓存
      });
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  }

  return config;
}

function buildTVBoxConfig(spiders, env) {
  const baseUrl = env.SPIDER_REPO_URL || 'https://gh-proxy.org/https://raw.githubusercontent.com/dlgt7/OmniBox-Spider';
  
  // 按类别分组
  const groupedSpiders = {};
  for (const spider of spiders) {
    const category = spider.category || '其他';
    if (!groupedSpiders[category]) {
      groupedSpiders[category] = [];
    }
    groupedSpiders[category].push(spider);
  }

  // 构建站点列表
  const sites = [];

  // 添加分组站点
  for (const [category, categorySpiders] of Object.entries(groupedSpiders)) {
    // 为每个类别创建一个分组
    const categoryName = getCategoryName(category);
    
    for (const spider of categorySpiders) {
      const site = {
        key: generateSiteKey(spider),
        name: `🚀${spider.name}`,
        type: 3,
        api: spider.downloadUrl,
        searchable: 1,
        quickSearch: 1,
        filterable: 1,
      };

      // 添加描述
      if (spider.description) {
        site.name += ` | ${spider.description}`;
      }

      sites.push(site);
    }
  }

  // 构建完整配置
  const config = {
    spider: `${baseUrl}/raw/main/jiekou.json`,
    wallpaper: 'https://深色壁纸.xxooo.cf/',
    sites: sites,
  };

  return config;
}

function getCategoryName(category) {
  const categoryNames = {
    '影视/采集': '🎬影视采集',
    '影视/网盘': '💾网盘资源',
    '影视/磁力': '🧲磁力搜索',
    '影视/解析': '🎬视频解析',
    '动漫': '🎌动漫',
    '听书': '🎧听书',
    '音乐': '🎵音乐',
    '教育': '📚教育',
    '直播': '📺直播',
    '短剧': '🎭短剧',
    '综合': '🌐综合',
    '导航': '🧭导航',
    '流媒体': '📺流媒体',
    'Emby': '🎬Emby',
  };

  return categoryNames[category] || `📁${category}`;
}

function generateSiteKey(spider) {
  // 生成唯一的站点 key
  const name = spider.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');
  return name.substring(0, 20);
}
