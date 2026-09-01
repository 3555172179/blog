# 个人博客（Astro 5）

基于 Astro 5 + Tailwind CSS v4 的个人技术博客骨架。阶段①：文章 / 笔记 / RSS / 暗黑模式 / 社媒链接。

## 本地启动

```bash
npm install
npm run dev      # 开发服务器 http://localhost:4321
npm run build    # 构建到 dist/
npm run preview  # 预览构建产物
```

## 写内容

- 文章：在 `src/content/blog/` 新建 `.md` 或 `.mdx`，参考 `hello-astro.md` 的 frontmatter
- 笔记：在 `src/content/notes/` 新建文件，frontmatter 更简洁
- 草稿：frontmatter 加 `draft: true`，不会出现在列表与 RSS

## 需要你替换的占位

- `src/consts.ts` → `SITE`（站点标题/作者/域名）、`SOCIAL_LINKS`（5 个社媒真实链接）
- `astro.config.mjs` 的 `site` 会自动读取 `SITE.url`
- `vercel.json` 部署时 Vercel 会自动识别 Astro，可不改

## 部署到 Vercel

1. 把项目推到 GitHub
2. Vercel 新建项目，选这个仓库，框架自动识别为 Astro
3. 确认 build 命令 `astro build`、输出目录 `dist`，部署即可
4. 部署后把 Vercel 域名填回 `src/consts.ts` 的 `SITE.url`