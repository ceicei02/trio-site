-- ══════════════════════════════════════════════
-- TRIO — Schéma Supabase (version safe)
-- Utilise IF NOT EXISTS partout pour éviter les erreurs
-- ══════════════════════════════════════════════

create extension if not exists "uuid-ossp";

-- ── Tables ────────────────────────────────────

create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  prenom text not null,
  age integer not null check (age >= 18 and age <= 99),
  ville text,
  job text,
  bio text,
  orientation text,
  intent text,
  profile_type text not null default 'solo',
  partner_name text,
  partner_age integer,
  photo_url text,
  photo2_url text,
  voice_bio_url text,
  trust_score integer default 70,
  streak_days integer default 0,
  last_active timestamptz default now(),
  available_tonight boolean default false,
  is_verified boolean default false,
  categories text[] default '{}',
  vibe_tags text[] default '{}',
  vibe_question text,
  likes_received integer default 0,
  matches_count integer default 0
);

create table if not exists public.likes (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now(),
  from_user uuid references public.profiles(id) on delete cascade,
  to_user uuid references public.profiles(id) on delete cascade,
  is_super_match boolean default false,
  unique(from_user, to_user)
);

create table if not exists public.matches (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now(),
  user_1 uuid references public.profiles(id) on delete cascade,
  user_2 uuid references public.profiles(id) on delete cascade,
  unique(user_1, user_2)
);

create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now(),
  match_id uuid references public.matches(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  read boolean default false
);

create table if not exists public.vibe_checks (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now(),
  from_user uuid references public.profiles(id) on delete cascade,
  to_user uuid references public.profiles(id) on delete cascade,
  question text not null,
  answer text not null,
  revealed boolean default false
);

create table if not exists public.profile_views (
  id uuid default uuid_generate_v4() primary key,
  viewed_at timestamptz default now(),
  viewer_id uuid references public.profiles(id) on delete cascade,
  viewed_id uuid references public.profiles(id) on delete cascade
);

create table if not exists public.daily_rewards (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  claimed_at timestamptz default now(),
  day_number integer not null,
  prize text not null
);

-- ── RLS ───────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.likes enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;
alter table public.vibe_checks enable row level security;
alter table public.profile_views enable row level security;
alter table public.daily_rewards enable row level security;

-- Policies (drop avant create pour éviter les conflits)
do $$ begin

  -- profiles
  drop policy if exists "Profils visibles par tous" on public.profiles;
  drop policy if exists "Utilisateur modifie son profil" on public.profiles;
  drop policy if exists "Utilisateur crée son profil" on public.profiles;
  create policy "Profils visibles par tous" on public.profiles for select using (true);
  create policy "Utilisateur modifie son profil" on public.profiles for update using (auth.uid() = id);
  create policy "Utilisateur crée son profil" on public.profiles for insert with check (auth.uid() = id);

  -- likes
  drop policy if exists "Voir ses likes" on public.likes;
  drop policy if exists "Créer un like" on public.likes;
  drop policy if exists "Supprimer son like" on public.likes;
  create policy "Voir ses likes" on public.likes for select using (auth.uid() = from_user or auth.uid() = to_user);
  create policy "Créer un like" on public.likes for insert with check (auth.uid() = from_user);
  create policy "Supprimer son like" on public.likes for delete using (auth.uid() = from_user);

  -- matches
  drop policy if exists "Voir ses matchs" on public.matches;
  drop policy if exists "Créer un match" on public.matches;
  create policy "Voir ses matchs" on public.matches for select using (auth.uid() = user_1 or auth.uid() = user_2);
  create policy "Créer un match" on public.matches for insert with check (auth.uid() = user_1 or auth.uid() = user_2);

  -- messages
  drop policy if exists "Voir ses messages" on public.messages;
  drop policy if exists "Envoyer un message" on public.messages;
  create policy "Voir ses messages" on public.messages for select using (
    exists (select 1 from public.matches where id = match_id and (user_1 = auth.uid() or user_2 = auth.uid()))
  );
  create policy "Envoyer un message" on public.messages for insert with check (auth.uid() = sender_id);

  -- profile_views
  drop policy if exists "Voir ses visiteurs" on public.profile_views;
  drop policy if exists "Enregistrer une visite" on public.profile_views;
  create policy "Voir ses visiteurs" on public.profile_views for select using (auth.uid() = viewed_id);
  create policy "Enregistrer une visite" on public.profile_views for insert with check (auth.uid() = viewer_id);

  -- daily_rewards
  drop policy if exists "Voir ses récompenses" on public.daily_rewards;
  drop policy if exists "Réclamer sa récompense" on public.daily_rewards;
  create policy "Voir ses récompenses" on public.daily_rewards for select using (auth.uid() = user_id);
  create policy "Réclamer sa récompense" on public.daily_rewards for insert with check (auth.uid() = user_id);

end $$;

-- ── Storage ───────────────────────────────────

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('voice-bios', 'voice-bios', true)
on conflict (id) do nothing;

do $$ begin
  drop policy if exists "Avatars publics" on storage.objects;
  drop policy if exists "Upload avatar" on storage.objects;
  drop policy if exists "VoiceBio public" on storage.objects;
  drop policy if exists "Upload voicebio" on storage.objects;

  create policy "Avatars publics" on storage.objects for select using (bucket_id = 'avatars');
  create policy "Upload avatar" on storage.objects for insert with check (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );
  create policy "VoiceBio public" on storage.objects for select using (bucket_id = 'voice-bios');
  create policy "Upload voicebio" on storage.objects for insert with check (
    bucket_id = 'voice-bios' and auth.uid()::text = (storage.foldername(name))[1]
  );
end $$;

-- ── Fonctions & Triggers ──────────────────────

create or replace function public.check_mutual_like()
returns trigger language plpgsql security definer as $$
begin
  if exists (
    select 1 from public.likes
    where from_user = new.to_user and to_user = new.from_user
  ) then
    insert into public.matches (user_1, user_2)
    values (least(new.from_user, new.to_user), greatest(new.from_user, new.to_user))
    on conflict do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_like_inserted on public.likes;
create trigger on_like_inserted
  after insert on public.likes
  for each row execute function public.check_mutual_like();

create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();
