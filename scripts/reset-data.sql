-- ============================================================================
-- HMG Watches — production data reset (go-live)
-- ----------------------------------------------------------------------------
-- Removes all CONTENT and TEST data (watches, blog posts, leads, messages,
-- analytics, audit log, market movers, test auctions) so you launch with a
-- clean database — WHILE KEEPING your site configuration and admin account.
--
-- HOW TO RUN:
--   Supabase dashboard → SQL Editor → paste this → Run.
--   It runs in a single transaction (all-or-nothing). If anything looks wrong
--   before COMMIT, you can change COMMIT to ROLLBACK.
--
-- WHAT IS *NOT* TOUCHED:
--   • Your admin login (Supabase auth.users) — you stay logged in.
--   • Site config in site_settings: site_name, contact email, instagram_url,
--     whatsapp_number, weekly_report_*, blog_auto_*, movers_auto_enabled, etc.
--   • Uploaded images in Storage (see the OPTIONAL section at the bottom).
-- ============================================================================

BEGIN;

-- 1) Wipe content + activity tables.
--    CASCADE handles the foreign keys automatically
--    (watch_leads → watches, page_views → watches/blog_posts).
TRUNCATE TABLE
  watch_leads,
  page_views,
  contact_messages,
  audit_logs,
  watch_market_highlights,
  blog_posts,
  watches
RESTART IDENTITY CASCADE;

-- 2) Clear test-only entries from site_settings, keeping all real config:
--    • 'auctions'                 — the Leilões JSON list (test entries)
--    • 'movers_auto_last_week'    — weekly throttle (lets the AI Top-10 run fresh)
--    • 'blog_auto_last_week'      — weekly throttle (lets the auto-blog run fresh)
DELETE FROM site_settings
WHERE key IN ('auctions', 'movers_auto_last_week', 'blog_auto_last_week');

-- 3) Make sure maintenance mode is OFF for launch (no-op if the key is absent).
UPDATE site_settings SET value = 'false', updated_at = now()
WHERE key = 'maintenance_mode';

COMMIT;

-- ---- Verify (optional) — run after COMMIT to confirm everything is empty ----
-- SELECT
--   (SELECT count(*) FROM watches)                  AS watches,
--   (SELECT count(*) FROM blog_posts)               AS blog_posts,
--   (SELECT count(*) FROM watch_leads)              AS leads,
--   (SELECT count(*) FROM contact_messages)         AS messages,
--   (SELECT count(*) FROM page_views)               AS page_views,
--   (SELECT count(*) FROM audit_logs)               AS audit_logs,
--   (SELECT count(*) FROM watch_market_highlights)  AS movers;

-- ============================================================================
-- OPTIONAL — also delete uploaded images from Supabase Storage.
-- ----------------------------------------------------------------------------
-- Easiest: Supabase dashboard → Storage → "watch-images" bucket → select all →
-- delete. If you prefer SQL, this removes the object rows for that bucket
-- (watch photos live under "<watch-id>/..." and auction images under
-- "auctions/..."):
--
--   DELETE FROM storage.objects WHERE bucket_id = 'watch-images';
--
-- NOTE: deleting watches above does NOT remove their Storage files — only the
-- normal in-app delete flow (or the line above / the dashboard) does that.
-- ============================================================================
