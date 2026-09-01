import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { SITE } from './src/consts';

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    // 避免 dev 启动时强制重新 optimize deps 触发文件批量删除守卫
    // （在沙箱环境下 dev → build → dev 反复切换时尤其明显）
    optimizeDeps: {
      force: false,
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
