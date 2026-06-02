# 开启云同步：Supabase 一次性配置

Life Archive 的账号 + 多设备云同步用 **Supabase**（免费额度）。每个人用自己的免费项目，
配置只存在本机、不上传、不打进安装包。下面 5 步,大约 10 分钟。

## 1. 建项目
1. 打开 [supabase.com](https://supabase.com) → 注册（可用 GitHub 登录）。
2. **New project** → 取个名字、设一个数据库密码 → **Region 选离国内近的**（如 `Southeast Asia (Singapore)` 或 `Northeast Asia (Tokyo)`）。
3. 等 1–2 分钟项目创建完成。

## 2. 建表 + 权限（把存档存进来）
项目左侧 **SQL Editor** → **New query** → 粘贴下面整段 → **Run**：

```sql
-- 每个用户一行，存他自己的存档 JSON
create table if not exists public.archives (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.archives enable row level security;

create policy "own archive - select" on public.archives
  for select using (auth.uid() = user_id);
create policy "own archive - insert" on public.archives
  for insert with check (auth.uid() = user_id);
create policy "own archive - update" on public.archives
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own archive - delete" on public.archives
  for delete using (auth.uid() = user_id);
```

> 这套「行级安全（RLS）」规则保证：**每个用户只能读写自己的那行数据**，别人碰不到。

## 3.（推荐）免确认邮箱，登录更顺
默认注册后要去邮箱点确认链接才能登录。个人使用想更省事：
**Authentication → Sign In / Providers（或 Settings）→ 关闭 “Confirm email”**。
这样注册后能立刻登录。（不关也行，按提示去邮箱确认即可。）

## 4. 复制项目地址和密钥
**Project Settings（齿轮）→ API**：
- **Project URL**（形如 `https://abcdefg.supabase.co`）
- **Project API keys → `anon` `public`**（一长串，这就是 anon key，公开可用、可放心填）

## 5. 在 App 里填上
打开 App → **⚙ 设置 → 账号与云同步** → 粘贴 **URL** 和 **anon key** → **保存** →
**注册 / 登录** → 点 **☁ 立即同步**。换台设备用同一账号登录，存档就同步过去了。

---

### 常见问题
- **登录/同步报错**：把红色提示原文发给开发者，多半是表没建好或邮箱没确认。
- **想换后端**（CloudBase / 自建服务器）：App 的云同步是「可插拔适配层」，只改 `js/app.js` 里的 `Cloud` 一段即可，数据（JSON）可直接迁移。
- **安全**：anon key 是设计上公开的，真正的数据隔离由上面的 RLS 规则保证。
