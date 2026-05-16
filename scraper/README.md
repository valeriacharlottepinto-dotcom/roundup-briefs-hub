# Scraper

Valeria's Python news scraper. Lives here so Cloudflare Pages
(which deploys the frontend) doesn't try to install Python deps
during its build.

## Files

- `scraper_UPDATED.py` — main scraper, pulls RSS feeds and writes to Postgres
- `requirements.txt` — Python dependencies (feedparser, psycopg2-binary)

## Render deployment

The scraper runs on Render. If Render's "Root Directory" was set to `/`
before this move, update it to `/scraper` (or update the build/start
command to `cd scraper && …`).

## Local dev

```bash
cd scraper
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python scraper_UPDATED.py
```
