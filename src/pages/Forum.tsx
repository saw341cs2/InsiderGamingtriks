-- ============================================
-- FORUM COMMUNAUTAIRE - Tables et sécurité
-- A coller dans Supabase > SQL Editor > New query > Run
-- ============================================

create table if not exists public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users(id) on delete cascade not null,
  author_name text not null,
  author_avatar text,
  title text not null,
  content text not null,
  category text not null default 'Discussion',
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.forum_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.forum_posts(id) on delete cascade not null,
  author_id uuid references auth.users(id) on delete cascade not null,
  author_name text not null,
  author_avatar text,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.forum_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.forum_posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  unique(post_id, user_id)
);

alter table public.forum_posts enable row level security;
alter table public.forum_replies enable row level security;
alter table public.forum_likes enable row level security;

drop policy if exists "forum_posts_select" on public.forum_posts;
create policy "forum_posts_select" on public.forum_posts for select using (true);

drop policy if exists "forum_replies_select" on public.forum_replies;
create policy "forum_replies_select" on public.forum_replies for select using (true);

drop policy if exists "forum_likes_select" on public.forum_likes;
create policy "forum_likes_select" on public.forum_likes for select using (true);

drop policy if exists "forum_posts_insert" on public.forum_posts;
create policy "forum_posts_insert" on public.forum_posts for insert with check (auth.uid() = author_id);

drop policy if exists "forum_replies_insert" on public.forum_replies;
create policy "forum_replies_insert" on public.forum_replies for insert with check (auth.uid() = author_id);

drop policy if exists "forum_likes_insert" on public.forum_likes;
create policy "forum_likes_insert" on public.forum_likes for insert with check (auth.uid() = user_id);

drop policy if exists "forum_posts_update" on public.forum_posts;
create policy "forum_posts_update" on public.forum_posts for update using (auth.uid() = author_id);

drop policy if exists "forum_posts_delete" on public.forum_posts;
create policy "forum_posts_delete" on public.forum_posts for delete using (auth.uid() = author_id);

drop policy if exists "forum_replies_delete" on public.forum_replies;
create policy "forum_replies_delete" on public.forum_replies for delete using (auth.uid() = author_id);

drop policy if exists "forum_likes_delete" on public.forum_likes;
create policy "forum_likes_delete" on public.forum_likes for delete using (auth.uid() = user_id);
