// 中英双版本公共文本与路径工具

export type Locale = 'zh' | 'en';
export type Category = 'work' | 'study' | 'life';

export const LOCALES: Locale[] = ['zh', 'en'];
export const DEFAULT_LOCALE: Locale = 'zh';

export const CATEGORIES: Category[] = ['work', 'study', 'life'];

export const UI = {
  zh: {
    siteTitle: 'Bruce Yu · 外贸手记',
    siteDesc: '外贸运营与业务实战 · 学习笔记 · 生活随笔',
    bio: '在外贸行业做运营与业务。这里是实战复盘、学习方法、生活随笔。',
    nav: {
      home: '首页',
      categories: '分类',
      blog: 'Blog',
      notes: '笔记',
      tags: '标签',
      search: '搜索',
    },
    categories: {
      work: '工作',
      study: '学习',
      life: '生活',
      workDesc: '外贸运营与业务实战',
      studyDesc: '方法沉淀与英语',
      lifeDesc: '随笔与日常',
    },
    home: {
      recentPosts: '最近文章',
      recentNotes: '最近笔记',
      viewAll: '查看全部 →',
      postsEmpty: '还没有文章。',
      notesEmpty: '还没有笔记。',
      recentWork: '最近工作',
      recentStudy: '最近学习',
      recentLife: '最近生活',
      viewWork: '查看工作 →',
      viewStudy: '查看学习 →',
      viewLife: '查看生活 →',
      workEmpty: '工作类内容还在路上。',
      studyEmpty: '学习类内容还在路上。',
      lifeEmpty: '生活类内容还在路上。',
    },
    category: {
      work: '工作',
      study: '学习',
      life: '生活',
      workDesc: '外贸运营与业务实战',
      studyDesc: '方法沉淀与英语',
      lifeDesc: '随笔与日常',
      all: '全部',
    },
    blog: { title: '所有文章', back: '返回文章列表' },
    notes: { title: '笔记', back: '返回笔记列表' },
    tags: { title: '标签', description: '按标签浏览文章与笔记', back: '全部标签', note: '字号大小表示文章数量' },
    post: { updated: '更新于', share: '分享' },
    pagination: { prev: '← 上一页', next: '下一页 →' },
    search: { placeholder: '搜索文章与笔记...', empty: '输入关键词开始搜索', noMatch: '没有匹配结果', esc: 'Esc' },
    footer: {
      copyright: (y: number, n: string) => `© ${y} ${n}. 保留所有权利。`,
      builtWith: '外贸实战 · 学习沉淀 · 生活碎片',
      intro: '在外贸行业做运营与业务。这里是实战复盘、学习方法、生活随笔。',
    },
    theme: { toggle: '切换深浅色主题' },
    lang: { switchTo: 'English', noTranslation: '暂无英文版' },
  },
  en: {
    siteTitle: 'Bruce Yu · Foreign Trade Notes',
    siteDesc: 'Foreign trade ops & business · Learning notes · Life essays',
    bio: 'Working in foreign trade — ops and sales. Field notes, methods, and essays.',
    nav: {
      home: 'Home',
      categories: 'Topics',
      blog: 'Blog',
      notes: 'Notes',
      tags: 'Tags',
      search: 'Search',
    },
    categories: {
      work: 'Work',
      study: 'Study',
      life: 'Life',
      workDesc: 'Foreign trade ops & business',
      studyDesc: 'Methods & English',
      lifeDesc: 'Essays & daily notes',
    },
    home: {
      recentPosts: 'Recent Posts',
      recentNotes: 'Recent Notes',
      viewAll: 'View all →',
      postsEmpty: 'No posts yet.',
      notesEmpty: 'No notes yet.',
      recentWork: 'Recent Work',
      recentStudy: 'Recent Study',
      recentLife: 'Recent Life',
      viewWork: 'View work →',
      viewStudy: 'View study →',
      viewLife: 'View life →',
      workEmpty: 'Work posts coming soon.',
      studyEmpty: 'Study posts coming soon.',
      lifeEmpty: 'Life posts coming soon.',
    },
    category: {
      work: 'Work',
      study: 'Study',
      life: 'Life',
      workDesc: 'Foreign trade ops & business',
      studyDesc: 'Methods & English',
      lifeDesc: 'Essays & daily notes',
      all: 'All',
    },
    blog: { title: 'All Posts', back: 'Back to posts' },
    notes: { title: 'Notes', back: 'Back to notes' },
    tags: { title: 'Tags', description: 'Browse posts and notes by tag', back: 'All tags', note: 'Font size reflects post count' },
    post: { updated: 'Updated', share: 'Share' },
    pagination: { prev: '← Prev', next: 'Next →' },
    search: { placeholder: 'Search posts & notes...', empty: 'Type to start searching', noMatch: 'No matches', esc: 'Esc' },
    footer: {
      copyright: (y: number, n: string) => `© ${y} ${n}. All rights reserved.`,
      builtWith: 'Foreign Trade · Learning · Life',
      intro: 'Working in foreign trade — ops and sales. Field notes, methods, and essays.',
    },
    theme: { toggle: 'Toggle theme' },
    lang: { switchTo: '中文', noTranslation: 'No English version' },
  },
} as const;

export const t = (locale: Locale) => UI[locale] ?? UI[DEFAULT_LOCALE];

// 路径加语言前缀（默认语言不加前缀）
export const localePath = (path: string, locale: Locale): string => {
  const clean = path.startsWith('/') ? path : '/' + path;
  return locale === DEFAULT_LOCALE ? clean : `/${locale}${clean}`;
};

// 推断当前语言（用于 LangSwitcher 反向链接）
export const detectLocale = (pathname: string): Locale => {
  if (pathname.startsWith('/en')) return 'en';
  return 'zh';
};

// 当前路径去掉语言前缀得到「裸路径」
export const stripLocale = (pathname: string): string => {
  if (pathname.startsWith('/en')) {
    const rest = pathname.slice(3);
    return rest || '/';
  }
  return pathname || '/';
};

// category 路由辅助
export const categoryPath = (category: Category, locale: Locale): string => {
  return localePath(`/${category}`, locale);
};
export const categoryLabel = (category: Category, locale: Locale): string => {
  return UI[locale].category[category];
};
export const categoryDesc = (category: Category, locale: Locale): string => {
  return UI[locale].category[`${category}Desc` as 'workDesc' | 'studyDesc' | 'lifeDesc'];
};