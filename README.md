# Learning Center

AI 引导式学习系统 · AI Guided Learning System

## 当前状态 (Tasks 0-3 完成)

- ✅ Task 0: 数据库结构 (14 张表)
- ✅ Task 1: 主框架 (HTML/CSS, 四角色入口)
- ✅ Task 2: 多语言系统 (英 / 中 / 西 / 韩 / 越)
- ✅ Task 3: 四角色登录 (学生码 / 家长邮箱 / 老师账号 / 管理员)
- ⏳ Task 4: 管理员后台 (建老师 / 管学生)
- ⏳ Task 5: 学生端三入口
- ⏳ Task 6-13: AI 教学 / SVG / 错题本 / 老师&家长后台

## 项目结构

```
learning-center/
├── index.html
├── css/style.css
├── js/
│   ├── config.js        (Supabase + 配置)
│   ├── i18n.js          (5 种语言翻译)
│   ├── db.js            (数据库操作)
│   ├── ui.js            (UI 工具)
│   ├── auth.js          (4 角色登录)
│   └── app.js           (事件绑定)
├── netlify/functions/ai.js  (AI 代理, 隐藏 OpenRouter key)
├── netlify.toml
└── supabase.sql         (完整数据库结构)
```

## 部署

1. **Supabase** — 跑 `supabase.sql`
2. **Netlify** — 环境变量 `OPENROUTER_API_KEY`
3. **GitHub** — 推送代码, Netlify 自动部署

## 默认账号

- 管理员: `Dixon168` / `168168`
- 老师 / 家长 / 学生需要先创建
