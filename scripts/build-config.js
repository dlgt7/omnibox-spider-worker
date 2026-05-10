/**
 * 本地配置构建脚本
 * 在部署前扫描爬虫脚本并生成配置文件
 */

const fs = require('fs');
const path = require('path');

// 爬虫脚本仓库路径
const SPIDER_REPO_PATH = process.env.SPIDER_REPO_PATH || 
  'C:\\Users\\Administrator\\Desktop\\OmniBox-Spider-main';

// 输出配置文件路径
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'config.json');

// 分类列表
const CATEGORIES = [
  '影视/采集',
  '影视/网盘', 
  '影视/磁力',
  '影视/解析',
  '动漫',
  '听书',
  '音乐',
  '教育',
  '直播',
  '短剧',
  '综合',
  '导航',
  '流媒体',
  'Emby',
];

/**
 * 解析爬虫脚本元数据
 */
function parseSpiderMetadata(content, filename) {
  const metadata = {
    name: '',
    author: '',
    description: '',
    version: '',
    dependencies: [],
  };

  // 解析 @name
  const nameMatch = content.match(/\/\/\s*@name\s+(.+)/);
  if (nameMatch) {
    metadata.name = nameMatch[1].trim();
  } else {
    metadata.name = filename.replace(/\.(js|py)$/, '');
  }

  // 解析其他元数据
  const authorMatch = content.match(/\/\/\s*@author\s+(.+)/);
  if (authorMatch) metadata.author = authorMatch[1].trim();

  const descMatch = content.match(/\/\/\s*@description\s+(.+)/);
  if (descMatch) metadata.description = descMatch[1].trim();

  const versionMatch = content.match(/\/\/\s*@version\s+(.+)/);
  if (versionMatch) metadata.version = versionMatch[1].trim();

  const depsMatch = content.match(/\/\/\s*@dependencies\s+(.+)/);
  if (depsMatch) {
    metadata.dependencies = depsMatch[1].split(',').map(d => d.trim()).filter(d => d);
  }

  return metadata;
}

/**
 * 扫描指定类别的爬虫脚本
 */
function scanCategory(category) {
  const spiders = [];
  const categoryPath = path.join(SPIDER_REPO_PATH, ...category.split('/'));

  if (!fs.existsSync(categoryPath)) {
    console.log(`目录不存在: ${categoryPath}`);
    return spiders;
  }

  const files = fs.readdirSync(categoryPath);

  for (const file of files) {
    if (file.endsWith('.js') || file.endsWith('.py')) {
      try {
        const filePath = path.join(categoryPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const metadata = parseSpiderMetadata(content, file);

        spiders.push({
          ...metadata,
          category: category,
          file: file,
          path: `${category}/${file}`,
          url: `https://github.com/dlgt7/OmniBox-Spider/raw/main/${category}/${file}`,
          downloadUrl: `https://gh-proxy.org/https://github.com/dlgt7/OmniBox-Spider/raw/main/${category}/${file}`,
        });
      } catch (error) {
        console.error(`解析文件失败: ${file}`, error.message);
      }
    }
  }

  return spiders;
}

/**
 * 生成站点配置
 */
function generateSiteConfig(spider) {
  const site = {
    key: spider.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '').substring(0, 20),
    name: `🚀${spider.name}`,
    type: 3,
    api: spider.downloadUrl,
    searchable: 1,
    quickSearch: 1,
    filterable: 1,
  };

  // 添加描述
  if (spider.description) {
    const shortDesc = spider.description.substring(0, 30);
    site.name += ` | ${shortDesc}`;
  }

  return site;
}

/**
 * 生成 TVBox 配置
 */
function buildTVBoxConfig(spiders) {
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
  
  for (const [category, categorySpiders] of Object.entries(groupedSpiders)) {
    console.log(`处理类别: ${category}, 数量: ${categorySpiders.length}`);
    
    for (const spider of categorySpiders) {
      const site = generateSiteConfig(spider);
      sites.push(site);
    }
  }

  // 构建完整配置
  const config = {
    spider: 'https://oss4liview.moji.com/thd_file/2026/05/08/b216ded4a854a190ce9f6bd280aff779.jpg;md5;448a9f26f33109f6aa148971c3adab46',
    wallpaper: 'https://深色壁纸.xxooo.cf/',
    sites: sites,
  };

  return config;
}

/**
 * 主函数
 */
function main() {
  console.log('开始扫描爬虫脚本...');
  console.log(`爬虫仓库路径: ${SPIDER_REPO_PATH}`);

  // 扫描所有类别
  const allSpiders = [];
  for (const category of CATEGORIES) {
    const spiders = scanCategory(category);
    allSpiders.push(...spiders);
    console.log(`扫描 ${category}: 找到 ${spiders.length} 个脚本`);
  }

  console.log(`\n总共找到 ${allSpiders.length} 个爬虫脚本`);

  // 生成配置
  const config = buildTVBoxConfig(allSpiders);

  // 确保输出目录存在
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 写入配置文件
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(config, null, 2), 'utf-8');
  console.log(`\n配置文件已生成: ${OUTPUT_PATH}`);
  console.log(`站点总数: ${config.sites.length}`);
}

// 执行
main();
