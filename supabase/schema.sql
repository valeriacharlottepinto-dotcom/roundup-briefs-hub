-- ============================================================
-- shared ground — Supabase database schema
-- Run this in: Supabase → SQL Editor → New query → Run
-- ============================================================

-- ── 1. saved_articles ────────────────────────────────────────
-- Articles bookmarked by users. Stores a snapshot of the article
-- at save time so it stays readable even if the source changes.

CREATE TABLE IF NOT EXISTS saved_articles (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  article_id       TEXT,
  article_url      TEXT        NOT NULL,
  title            TEXT        NOT NULL,
  source_slug      TEXT        NOT NULL,
  source_name      TEXT        NOT NULL,
  published_at     TIMESTAMPTZ,
  locale           TEXT        NOT NULL DEFAULT 'en',
  is_paywalled     BOOLEAN     NOT NULL DEFAULT FALSE,
  topic_slugs      TEXT[]      NOT NULL DEFAULT '{}',
  identity_tags    TEXT[]      NOT NULL DEFAULT '{}',
  summary_snapshot TEXT,
  saved_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, article_url)
);

ALTER TABLE saved_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved articles"
  ON saved_articles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save articles"
  ON saved_articles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave their own articles"
  ON saved_articles FOR DELETE
  USING (auth.uid() = user_id);


-- ── 2. user_topic_preferences ────────────────────────────────
-- Topics a user follows. Used for personalised feed (Phase 2)
-- and digest emails (Phase 3).

CREATE TABLE IF NOT EXISTS user_topic_preferences (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  topic_slug TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, topic_slug)
);

ALTER TABLE user_topic_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own topic preferences"
  ON user_topic_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add topic preferences"
  ON user_topic_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove topic preferences"
  ON user_topic_preferences FOR DELETE
  USING (auth.uid() = user_id);


-- ── 3. user_source_follows ───────────────────────────────────
-- Sources (news outlets) a user follows (Phase 2).

CREATE TABLE IF NOT EXISTS user_source_follows (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  source_slug TEXT        NOT NULL,
  source_name TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, source_slug)
);

ALTER TABLE user_source_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own source follows"
  ON user_source_follows FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can follow sources"
  ON user_source_follows FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unfollow sources"
  ON user_source_follows FOR DELETE
  USING (auth.uid() = user_id);


-- ── 4. user_digest_preferences ───────────────────────────────
-- Digest email settings per user (Phase 3).

CREATE TABLE IF NOT EXISTS user_digest_preferences (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  frequency    TEXT        NOT NULL DEFAULT 'weekly'
                           CHECK (frequency IN ('daily', 'weekly', 'never')),
  send_day     TEXT        NOT NULL DEFAULT 'monday'
                           CHECK (send_day IN ('monday','tuesday','wednesday',
                                               'thursday','friday','saturday','sunday')),
  send_time    TIME        NOT NULL DEFAULT '08:00',
  locale       TEXT        NOT NULL DEFAULT 'de',
  is_active    BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_digest_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own digest preferences"
  ON user_digest_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can set their own digest preferences"
  ON user_digest_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own digest preferences"
  ON user_digest_preferences FOR UPDATE
  USING (auth.uid() = user_id);


-- ── 5. digest_logs ───────────────────────────────────────────
-- Record of every digest email sent (Phase 3).

CREATE TABLE IF NOT EXISTS digest_logs (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sent_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  article_ids TEXT[]      NOT NULL DEFAULT '{}',
  status      TEXT        NOT NULL DEFAULT 'sent'
                          CHECK (status IN ('sent', 'failed', 'skipped'))
);

ALTER TABLE digest_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own digest logs"
  ON digest_logs FOR SELECT
  USING (auth.uid() = user_id);


-- ── 6. user_profiles ─────────────────────────────────────────
-- Public-facing profile data (display name, avatar, etc.)
-- Automatically created on first sign-in via trigger.

CREATE TABLE IF NOT EXISTS user_profiles (
  id           UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  avatar_url   TEXT,
  locale       TEXT        NOT NULL DEFAULT 'de',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ── 7. articles ───────────────────────────────────────────────────────────────
-- Public news articles written by the scraper.
-- Anyone can read; only the service role (scraper) can write.

CREATE TABLE IF NOT EXISTS articles (
  id               BIGSERIAL PRIMARY KEY,
  url_hash         TEXT UNIQUE NOT NULL,
  title            TEXT NOT NULL DEFAULT '',
  link             TEXT NOT NULL DEFAULT '',
  summary          TEXT DEFAULT '',
  source           TEXT NOT NULL DEFAULT '',
  country          TEXT DEFAULT '',
  category         TEXT DEFAULT '',
  tags             TEXT DEFAULT '',
  topics           TEXT DEFAULT '',
  scraped_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at     TIMESTAMPTZ,
  is_paywalled     BOOLEAN NOT NULL DEFAULT FALSE,
  locale           TEXT NOT NULL DEFAULT 'en',
  paywall_override BOOLEAN
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Articles are publicly readable"
  ON articles FOR SELECT
  USING (true);

-- Service role key bypasses RLS for scraper inserts/deletes.
-- No additional policies needed for INSERT/DELETE — the scraper uses service role.


-- ── 8. newsletter_subscribers ─────────────────────────────────────────────────
-- E-mails signed up for the weekly digest newsletter.

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  locale     TEXT        NOT NULL DEFAULT 'de',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous insert (public sign-up form)
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);
