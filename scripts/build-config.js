/**
 * 配置构建脚本
 * 在部署前生成配置文件
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'config.json');

// GitHub 仓库 URL
const GITHUB_REPO = 'https://github.com/dlgt7/OmniBox-Spider';
const GITHUB_RAW = 'https://raw.githubusercontent.com/dlgt7/OmniBox-Spider/main';

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
 * 从 GitHub API 获取目录内容
 */
async function fetchGitHubDirectory(category) {
  return new Promise((resolve, reject) => {
    const apiPath = `/repos/dlgt7/OmniBox-Spider/contents/${encodeURIComponent(category)}`;
    const options = {
      hostname: 'api.github.com',
      path: apiPath,
      method: 'GET',
      headers: {
        'User-Agent': 'OmniBox-Spider-Worker',
        'Accept': 'application/vnd.github.v3+json',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve([]);
          }
        } else {
          resolve([]);
        }
      });
    });

    req.on('error', () => resolve([]));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve([]);
    });
    req.end();
  });
}

/**
 * 解析爬虫脚本元数据
 */
function parseSpiderMetadata(content, filename) {
  const metadata = {
    name: '',
    author: '',
    description: '',
    version: '',
  };

  const nameMatch = content.match(/\/\/\s*@name\s+(.+)/);
  if (nameMatch) {
    metadata.name = nameMatch[1].trim();
  } else {
    metadata.name = filename.replace(/\.(js|py)$/, '');
  }

  const authorMatch = content.match(/\/\/\s*@author\s+(.+)/);
  if (authorMatch) metadata.author = authorMatch[1].trim();

  const descMatch = content.match(/\/\/\s*@description\s+(.+)/);
  if (descMatch) metadata.description = descMatch[1].trim();

  const versionMatch = content.match(/\/\/\s*@version\s+(.+)/);
  if (versionMatch) metadata.version = versionMatch[1].trim();

  return metadata;
}

/**
 * 扫描 GitHub 仓库
 */
async function scanGitHubRepo() {
  console.log('正在从 GitHub 仓库扫描爬虫脚本...');
  console.log(`仓库地址: ${GITHUB_REPO}`);
  
  const spiders = [];

  for (const category of CATEGORIES) {
    try {
      const files = await fetchGitHubDirectory(category);
      const jsFiles = files.filter(f => f.name.endsWith('.js') || f.name.endsWith('.py'));
      
      console.log(`扫描 ${category}: 找到 ${jsFiles.length} 个脚本`);

      for (const file of jsFiles) {
        spiders.push({
          name: file.name.replace(/\.(js|py)$/, ''),
          category: category,
          file: file.name,
          path: `${category}/${file.name}`,
          url: `${GITHUB_RAW}/${category}/${file.name}`,
          downloadUrl: `https://gh-proxy.org/${GITHUB_RAW}/${category}/${file.name}`,
        });
      }
    } catch (error) {
      console.log(`扫描 ${category}: 失败 - ${error.message}`);
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

  return site;
}

/**
 * 生成 TVBox 配置
 */
function buildTVBoxConfig(spiders) {
  const sites = [];
  
  for (const spider of spiders) {
    const site = generateSiteConfig(spider);
    sites.push(site);
  }

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
async function main() {
  console.log('开始生成配置文件...\n');

  try {
    // 扫描 GitHub 仓库
    const spiders = await scanGitHubRepo();
    console.log(`\n总共找到 ${spiders.length} 个爬虫脚本\n`);

    // 生成配置
    const config = buildTVBoxConfig(spiders);

    // 确保输出目录存在
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 写入配置文件
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(config, null, 2), 'utf-8');
    console.log(`✓ 配置文件已生成: ${OUTPUT_PATH}`);
    
    // 同时生成 jiekou.json（相同内容）
    const jiekouPath = path.join(outputDir, 'jiekou.json');
    fs.writeFileSync(jiekouPath, JSON.stringify(config, null, 2), 'utf-8');
    console.log(`✓ 配置文件已生成: ${jiekouPath}`);
    
    console.log(`✓ 站点总数: ${config.sites.length}`);
  } catch (error) {
    console.error('生成配置失败:', error.message);
    
    // 生成空配置作为后备
    const emptyConfig = {
      spider: '',
      wallpaper: '',
      sites: [],
    };
    
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(emptyConfig, null, 2), 'utf-8');
    
    const jiekouPath = path.join(outputDir, 'jiekou.json');
    fs.writeFileSync(jiekouPath, JSON.stringify(emptyConfig, null, 2), 'utf-8');
    
    console.log('✓ 已生成空配置文件');
  }
}

// 执行
main();
