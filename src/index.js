/**
 * OmniBox Spider Worker
 * 自动聚合爬虫脚本并生成 TVBox 配置
 */

import { handleRequest } from './handler.js';

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  },
};
