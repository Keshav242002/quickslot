# QuickSlot Backend — Progress

## Status

| Phase | Status | Notes |
|---|---|---|
| B0 | Done | Django 6 + DRF scaffolded, settings configured |
| B1 | Done | User, Venue, Slot, Booking models + admin registered |
| B2 | Done | `seed` management command — 5 venues, 7 days × 16 slots |
| B3 | Done | All 6 REST endpoints implemented with serializers |
| B4 | Done | `select_for_update` + atomic + DB unique constraint |
| B5 | Done | Firebase Auth middleware + `/api/auth/sync/` endpoint |
| B6 | Done | Procfile + render.yaml deployment config |
| B7 | Done | Google Sign-In supported via Firebase middleware (no extra code needed) |
| B8 | Done | `GET /api/venues/{id}/slots/poll/?date=&since=` — returns slots modified after timestamp |
| B9 | Done | Dockerfile + docker-compose.yml (PostgreSQL 16) + 9 concurrency/booking tests |

## API Endpoints

| Method | URL | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/sync/` | Bearer | Sync Firebase user → Postgres |
| GET | `/api/venues/` | Bearer | List all venues |
| GET | `/api/venues/{id}/slots/?date=YYYY-MM-DD` | Bearer | Slots for venue on date |
| POST | `/api/bookings/` | Bearer | Book a slot `{"slot_id": 42}` |
| GET | `/api/me/bookings/` | Bearer | Current user's bookings |
| DELETE | `/api/bookings/{id}/` | Bearer | Cancel a booking |
| GET | `/api/health/` | None | Health check |
| GET | `/api/venues/{id}/slots/poll/?date=YYYY-MM-DD&since=ISO8601` | Bearer | Slots changed after timestamp |

## Running Locally

```bash
cd server
source ../venv/bin/activate
python manage.py migrate
python manage.py seed
python manage.py runserver
```
