# Backend Changes Required

Apply these changes to `scraper.py` and `server.py` in your GitHub repo.
After deploying, visit `/api/recategorize` once to backfill `locale='en'` on existing articles.

---

## 1. scraper.py

### 1a. DB schema — add two columns

In the `CREATE TABLE` statement (and as a migration), add:

```sql
locale          TEXT DEFAULT 'en',
paywall_override BOOLEAN DEFAULT NULL
```

In your `setup_db()` function, after the `CREATE TABLE ... IF NOT EXISTS` block, add these
migration lines so existing deployments pick up the columns automatically:

```python
# Migration: add columns if they don't already exist
for col_sql in [
    "ALTER TABLE articles ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'en'",
    "ALTER TABLE articles ADD COLUMN IF NOT EXISTS paywall_override BOOLEAN DEFAULT NULL",
]:
    try:
        cursor.execute(col_sql)
        conn.commit()
    except Exception:
        conn.rollback()
```

---

### 1b. Replace the source-level `is_paywalled` check with `detect_paywall()`

Remove (or keep for reference) the old check that used `PAYWALLED_SOURCES` membership.
Add this function **before** your scraping loop:

```python
PAYWALL_SOURCES = {"New York Times", "Financial Times", "Washington Post"}

PAYWALL_SIGNAL_PHRASES = [
    "subscribe to read", "subscription required", "subscribers only",
    "sign in to read", "create a free account", "this article is for subscribers",
    "exclusive to subscribers", "premium content", "member exclusive",
    "for full access", "to continue reading", "read more with a subscription",
    "register to read", "already a subscriber", "become a member",
]

def detect_paywall(entry: dict, source: str) -> bool:
    """Return True if the article appears to be paywalled.

    Three-layer check (any one triggers True):
      1. Source is in the known-paywalled set.
      2. Explicit paywall signal phrases in title or summary.
      3. RSS summary is suspiciously short (< 120 chars) AND source is not in
         ALWAYS_INCLUDE_SOURCES — a good proxy for truncated preview text.
    """
    if source in PAYWALL_SOURCES:
        return True

    title   = (entry.get("title",   "") or "").lower()
    summary = (entry.get("summary", "") or "")
    combined = title + " " + summary.lower()

    for phrase in PAYWALL_SIGNAL_PHRASES:
        if phrase in combined:
            return True

    # Short summary heuristic (skip for specialist publications)
    if source not in ALWAYS_INCLUDE_SOURCES and 0 < len(summary.strip()) < 120:
        return True

    return False
```

Then replace your existing `is_paywalled` assignment in the scraping loop with:

```python
is_paywalled = detect_paywall(entry, source)
```

---

### 1c. Add `locale` to every article INSERT

Find the `INSERT INTO articles` statement and add `locale` to the column list and values:

```python
cursor.execute("""
    INSERT INTO articles
        (url_hash, title, link, summary, source, country,
         category, tags, topics, scraped_at, published_at,
         is_paywalled, locale)
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    ON CONFLICT (url_hash) DO NOTHING
""", (
    url_hash, title, link, summary, source, country,
    category, tags_str, topics_str, scraped_at, published_at,
    is_paywalled,
    'en',   # ← hard-code 'en' for all current English sources
))
```

When you add German sources later, pass `'de'` for those entries.

---

## 2. server.py

### 2a. Add ADMIN_SECRET import (near the top)

```python
import os
ADMIN_SECRET = os.environ.get("ADMIN_SECRET", "")
```

Set `ADMIN_SECRET` as an environment variable in your Render dashboard.

---

### 2b. Replace the `/api/articles` endpoint

Replace the entire existing `/api/articles` route with the version below.
Key changes vs the old endpoint:
- `locale` param (required; defaults to `'en'` for backward compat)
- `offset` param for pagination
- `paywall` param replaces `free_only` — accepts `'free'` or `'paywalled'`
- `topics` now accepts comma-separated list
- `sources` now accepts comma-separated list
- Response changes from `[...]` to `{"articles": [...], "total": N}`

```python
@app.route("/api/articles")
def get_articles():
    locale   = request.args.get("locale", "en")
    limit    = min(int(request.args.get("limit",  30)), 200)
    offset   = max(int(request.args.get("offset",  0)),  0)
    search   = request.args.get("search", "").strip()
    time_r   = request.args.get("time",   "")
    date_from= request.args.get("date_from", "")
    date_to  = request.args.get("date_to",   "")
    paywall  = request.args.get("paywall",   "all")   # "all" | "free" | "paywalled"

    # Comma-separated multi-value params
    topics_raw  = request.args.get("topics",  "")
    sources_raw = request.args.get("sources", "")
    topics_list  = [t.strip() for t in topics_raw.split(",")  if t.strip()]
    sources_list = [s.strip() for s in sources_raw.split(",") if s.strip()]

    conditions = ["locale = %s"]
    params     = [locale]

    # Topic filter (OR across comma-separated list)
    if topics_list:
        topic_clauses = " OR ".join(["topics ILIKE %s"] * len(topics_list))
        conditions.append(f"({topic_clauses})")
        for t in topics_list:
            params.append(f"%{t}%")

    # Source filter (OR across list)
    if sources_list:
        placeholders = ",".join(["%s"] * len(sources_list))
        conditions.append(f"source IN ({placeholders})")
        params.extend(sources_list)

    # Search (title + summary)
    if search:
        conditions.append("(LOWER(title) LIKE %s OR LOWER(summary) LIKE %s)")
        params += [f"%{search.lower()}%", f"%{search.lower()}%"]

    # Date filters (prefer published_at, fall back to scraped_at)
    if time_r == "today":
        conditions.append(
            "(COALESCE(NULLIF(published_at,''), scraped_at))::date = CURRENT_DATE"
        )
    if date_from:
        conditions.append(
            "(COALESCE(NULLIF(published_at,''), scraped_at)) >= %s"
        )
        params.append(date_from)
    if date_to:
        conditions.append(
            "(COALESCE(NULLIF(published_at,''), scraped_at)) < (%s::date + INTERVAL '1 day')"
        )
        params.append(date_to)

    # Paywall filter — COALESCE gives paywall_override priority over is_paywalled
    if paywall == "free":
        conditions.append("COALESCE(paywall_override, is_paywalled) = FALSE")
    elif paywall == "paywalled":
        conditions.append("COALESCE(paywall_override, is_paywalled) = TRUE")

    where_clause = "WHERE " + " AND ".join(conditions)

    conn = get_db()
    cursor = conn.cursor()

    # Total count for pagination
    cursor.execute(
        f"SELECT COUNT(*) FROM articles {where_clause}",
        params
    )
    total = cursor.fetchone()[0]

    # Paginated results
    cursor.execute(
        f"""SELECT id, title, link, summary, source, country, category,
                   tags, topics, scraped_at, published_at,
                   COALESCE(paywall_override, is_paywalled) AS is_paywalled,
                   locale
            FROM articles
            {where_clause}
            ORDER BY COALESCE(NULLIF(published_at,''), scraped_at) DESC
            LIMIT %s OFFSET %s""",
        params + [limit, offset]
    )
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    articles = []
    for row in rows:
        articles.append({
            "id":           row[0],
            "title":        row[1],
            "link":         row[2],
            "summary":      row[3],
            "source":       row[4],
            "country":      row[5],
            "category":     row[6],
            "tags":         row[7],
            "topics":       row[8],
            "scraped_at":   row[9],
            "published_at": row[10],
            "is_paywalled": row[11],
            "locale":       row[12],
        })

    return jsonify({"articles": articles, "total": total})
```

---

### 2c. Update `/api/stats` to support `locale`

```python
@app.route("/api/stats")
def stats():
    locale = request.args.get("locale", "en")
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT
            COUNT(*)                                              AS total,
            COUNT(*) FILTER (WHERE tags ILIKE '%%lgbtqia+%%')    AS lgbtqia_plus,
            COUNT(*) FILTER (WHERE tags ILIKE '%%women%%')        AS women,
            MAX(scraped_at)                                        AS last_scraped
        FROM articles
        WHERE locale = %s
    """, (locale,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    return jsonify({
        "total":        row[0] or 0,
        "lgbtqia_plus": row[1] or 0,
        "women":        row[2] or 0,
        "last_scraped": row[3] or "",
    })
```

---

### 2d. Add `/api/paywall-override` (admin endpoint)

Lets you manually correct a mis-detected paywall flag.
Protected by the `X-Admin-Secret` header.

```python
@app.route("/api/paywall-override", methods=["POST"])
def paywall_override():
    auth = request.headers.get("X-Admin-Secret", "")
    if not ADMIN_SECRET or auth != ADMIN_SECRET:
        return jsonify({"error": "Unauthorized"}), 401

    data       = request.get_json(silent=True) or {}
    article_id = data.get("id")
    override   = data.get("paywall_override")   # True | False | None (to reset)

    if article_id is None:
        return jsonify({"error": "Missing id"}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE articles SET paywall_override = %s WHERE id = %s",
        (override, article_id)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"ok": True, "id": article_id, "paywall_override": override})
```

**Usage example:**
```bash
curl -X POST https://roundup-briefs.onrender.com/api/paywall-override \
  -H "Content-Type: application/json" \
  -H "X-Admin-Secret: YOUR_SECRET_HERE" \
  -d '{"id": 1234, "paywall_override": false}'
```

---

## 3. Deployment checklist

1. **Set env var** `ADMIN_SECRET` in Render dashboard (Settings → Environment).
2. **Deploy** backend (push to GitHub / manual redeploy on Render).
3. **After deploy**, run the migration by hitting any endpoint — `setup_db()` will
   auto-add the new columns on startup.
4. **Backfill locale** on all existing articles (they default to `'en'` via column default,
   so no explicit SQL needed — but double-check with:
   `SELECT COUNT(*) FROM articles WHERE locale IS NULL;`)
5. **Deploy frontend** (push all changed files — remember Netlify needs
   FilterBar, useArticles, constants, translations together to avoid silent build failure).
6. **Hard refresh** (`Cmd+Shift+R`) to bypass Netlify CDN cache.
7. Visit `/api/recategorize` once to reprocess topics if you updated keyword rules.

---

## 4. German sources — when you're ready

When adding DE sources:

1. Add them to `scraper.py` with `locale='de'` in the INSERT.
2. Add their names to `DE_SOURCES` in `src/lib/constants.ts`.
3. Any DE-specific keyword rules should live in a `DE_KEYWORDS` dict alongside
   the existing English ones, gated by `if locale == 'de'` in `detect_paywall()`
   and topic detection.
