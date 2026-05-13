/**
 * 运行时爬虫扫描器 - 从 GitHub API 获取最新列表
 */

const CATEGORIES = [
  '影视/采集', '影视/网盘', '影视/磁力', '影视/解析',
  '动漫', '听书', '音乐', '教育', '直播', '短剧',
  '综合', '导航', '流媒体', 'Emby'
];

export async function scanSpiders(env) {
  console.log('正在从 GitHub 扫描爬虫脚本...');
  
  const spiders = [];
  const GITHUB_RAW = 'https://raw.githubusercontent.com/dlgt7/OmniBox-Spider/refs/heads/main';

  for (const category of CATEGORIES) {
    try {
      const apiUrl = `https://api.github.com/repos/dlgt7/OmniBox-Spider/contents/${encodeURIComponent(category)}`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'OmniBox-Spider-Worker',
          'Accept': 'application/vnd.github.v3+json',
        }
      });

      if (!response.ok) continue;

      const files = await response.json();
      const scriptFiles = files.filter(f =>
        f.type === 'file' && (f.name.endsWith('.js') || f.name.endsWith('.py'))
      );

      for (const file of scriptFiles) {
        const name = file.name.replace(/\.(js|py)$/, '');
        spiders.push({
          name: name,
          category: category,
          file: file.name,
          path: `${category}/${file.name}`,
          url: `${GITHUB_RAW}/${category}/${file.name}`,
          downloadUrl: `https://gh-proxy.org/${GITHUB_RAW}/${category}/${file.name}`,
        });
      }
      
      console.log(`✓ ${category}: ${scriptFiles.length} 个脚本`);
    } catch (err) {
      console.error(`扫描 ${category} 失败:`, err.message);
    }
  }

  console.log(`总共扫描到 ${spiders.length} 个爬虫`);
  return spiders;
}
