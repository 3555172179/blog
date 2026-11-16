export const SITE = {
  title: 'Bruce Yu · 外贸手记',
  description: '外贸运营与业务实战 · 学习笔记 · 生活随笔',
  url: 'https://your-blog.vercel.app',
  author: 'Bruce Yu',
  bio: '在外贸行业做运营与业务。这里是实战复盘、学习方法、生活随笔。',
  avatar: '/avatar.jpg',
  locale: 'zh-CN',
};

// Cusdis 留言系统：访客无需登录，填昵称+邮箱即可评论；无广告
// 启用前：1) 注册 https://cusdis.com；
//        2) Dashboard → Website → New Website，填你的域名（如 your-blog.vercel.app）；
//        3) 拿到 App ID（Dashboard 显示），填到下方；
//        4) 把 enabled 改为 true
export const CUSDIS = {
  enabled: false,
  host: 'https://cusdis.com',       // 自托管时改成你的域名
  appId: 'your-app-id',
};

// Buttondown 邮件订阅：注册 https://buttondown.email 后填 username
// 表单会 POST 到 https://buttondown.email/<username>
export const BUTTONDOWN = {
  enabled: false,
  username: 'your-username',
};

// 社媒主页链接 —— 把 href 换成你的真实账号地址即可
// 与「社交分享按钮」(分享文章出去) 区分：这里是读者跳转到你的账号主页
// 包含 hover 颜色配置，让每个平台在 hover 时呈现品牌色
//
// 如果某个平台你不用，注释掉那一行即可。
// Bruce 当前实际用：X（主战场）+ RSS。Facebook/YouTube/TikTok 暂留占位。
const ICONS = {
  x: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.91l4.713 6.231 5.45 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
  facebook: '<path d="M9.101 23.691v-7.98H5.932v-4.65h3.169V8.313c0-3.137 1.868-4.866 4.731-4.866 1.373 0 2.552.102 2.895.146v3.358l-1.985-.001c-1.554 0-1.854.738-1.854 1.822v2.392h3.708l-.483 4.65h-3.225v7.98H9.101z"/>',
  linkedin: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
  youtube: '<path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>',
  tiktok: '<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.95-1.31 1.92-3.58 3.14-5.91 3.18-1.68.07-3.36-.42-4.74-1.4-2.06-1.43-3.31-3.86-3.23-6.37.05-1.6.59-3.16 1.54-4.42 1.08-1.48 2.78-2.5 4.6-2.81.07 1.45.2 2.88.59 4.27-.9.31-1.74.83-2.36 1.57-.71.83-1.07 1.94-.99 3.04.09 1.26.85 2.43 1.92 3.04 1.04.62 2.39.67 3.49.13.92-.43 1.61-1.27 1.9-2.25.23-.77.19-1.58.2-2.37.01-3.49 0-6.98 0-10.47z"/>',
  rss: '<path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.795 0-3.251-1.454-3.251-3.248 0-1.794 1.456-3.248 3.251-3.248 1.795 0 3.251 1.454 3.251 3.248zm-6.503-13.438v3.873c9.515 0 17.247 7.732 17.247 17.247h3.873c0-11.654-9.456-21.12-21.12-21.12zm0 7.626v3.874c5.297 0 9.622 4.325 9.622 9.622h3.874c0-7.414-6.082-13.496-13.496-13.496z"/>',
};

const wrap = (inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">${inner}</svg>`;

export const SOCIAL_LINKS = [
  { name: 'X',        href: 'https://x.com/ziboyu1987',                  svg: wrap(ICONS.x),        hover: 'hover:text-black dark:hover:text-white' },
  { name: 'Facebook', href: 'https://www.facebook.com/duo.duo.90226',    svg: wrap(ICONS.facebook), hover: 'hover:text-black dark:hover:text-white' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/bruce-yu-4805963b6', svg: wrap(ICONS.linkedin), hover: 'hover:text-black dark:hover:text-white' },
  { name: 'RSS',      href: '/rss.xml',                                 svg: wrap(ICONS.rss),     hover: 'hover:text-black dark:hover:text-white' },
];
