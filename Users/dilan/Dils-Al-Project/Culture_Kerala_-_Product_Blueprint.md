# Culture Kerala — Product Strategy, UX, IA, and Design System (Improved)

> A sharper, more actionable version of your vision—tightened copy, clarified IA, concrete workflows, and production‑ready design tokens.

---

## 1) Positioning & Promise

**Tagline options**

* *Culture Kerala: Your global Malayali home.*
* *Discover Kerala, wherever you are.*
* *Events, communities, and perks for Malayalis worldwide.*

**One‑liner**
Culture Kerala is the living home of the global Kerala diaspora—find events, join communities, support Malayali businesses, and unlock local perks.

**Value prop pillars**

1. **One Home** — A single place for events, communities, businesses, deals, movies.
2. **Smart Discovery** — Powerful, intent‑aware search with filters, maps, and personalized feeds.
3. **Trust & Safety** — Moderation, verified listings, claim ownership, and community reporting.
4. **Rewards** — Earn points for contributing; redeem for perks and access.

**Differentiators**

* Deep regional focus (Malayali culture), verified business claims, and contributor reputation.
* Share‑ready objects (links + QR) and attend/RSVP flows that actually close the loop (calendar add, directions, wallet passes).
* Programmatic SEO architecture for scalable discovery.

---

## 2) Core Personas & Top Journeys

**Personas**

* *New Migrant / Student*: wants local community, events, and services nearby.
* *Family / Settled Malayali*: wants cultural continuity (Onam, Vishu), kids’ events, trusted businesses.
* *Community Organizer*: wants attendees, simple event submission, analytics, and moderation clarity.
* *Business Owner*: wants visibility, reviews, claims listing, promotions, and perks integration.
* *Moviegoer / Fan*: wants Malayalam releases, showtimes, trailers, nearby cinemas.

**Journeys (high‑level)**

* **Discover → Save → Share → Attend/Buy → Review**
* **Claim → Verify → Update → Promote (Deals/Ads) → Analyze**
* **Submit → Moderate → Publish → Track (RSVP/Clicks) → Iterate**

---

## 3) Features (MoSCoW)

**Must‑have (MVP)**

* Directory: Events, Communities, Businesses, Deals, Movies.
* Search & filters (location, date, category, free/paid, rating), map view.
* Profiles, Saved items, Share (deep link + QR), Report content.
* Moderation queue with roles (admin, moderator, editor).
* Claimable business listings; verified badge after KYC‑lite.
* Points + basic badges; redeem deals (coupon/QR code).
* Accessibility AA, i18n (EN/Malayalam), responsive web, SEO‑ready pages.

**Should‑have (v1.1–v1.3)**

* Reviews & ratings with anti‑fraud (cooldowns, receipts/photo proof optional).
* Direct messaging (user ↔ user, user ↔ business) with block/report.
* Calendar integration (Add to Google/Apple/Outlook), ICS feed per user.
* Wallet passes (Apple/Google) for events/deals; dynamic QR validation.
* Organizer & Business dashboards (analytics, performance, review replies).
* Creator program (local ambassadors) with tiered rewards.

**Could‑have (v2+)**

* Ticketing & RSVP with check‑in app, waitlists, promo codes.
* UGC feed (photos from events) with editorial (human‑written) summaries and community‑powered translations (reviewed, no machine translation).
* Brand collaborations (Onam/Vishu seasonal campaigns), livestreams.

**Won’t‑have (now)**

* Marketplace/payments beyond tickets/deals.
* Long‑form social timelines.

---

## 4) IA & URL Architecture (Cleaned Up)

Keep everything lowercase, hyphenated; align admin namespaces; add missing primitives.

**Public**

* /** (home)
* /explore (global discovery hub)
* /search (unified search results)
* /events, /events/[slug]
* /communities, /communities/[slug]
* /businesses, /businesses/[slug]
* /deals, /deals/[slug]
* /movies, /movies/[slug]
* /classifieds, /classifieds/[slug]
* /kerala (culture landing), /learn (guides), /emergency-contacts
* /about, /contact, /privacy, /terms
* /sitemap.xml, /robots.txt, /opengraph/*

**Contribution**

* /submit (switcher → event | business | community | deal)
* /claim/[type]/[id]
* /report/[type]/[id]

**User**

* /profile/[username]
* /saved
* /notifications
* /settings (account, interests, privacy)
* /auth/login | /signup | /forgot-password | /verify-email

**Admin**

* /admin (moderation queue + dashboards)
* /admin/events | /admin/events/[id]/edit | /admin/events/new
* /admin/communities | /admin/communities/[id]/edit | /admin/communities/new
* /admin/businesses | /admin/businesses/[id]/edit | /admin/businesses/new
* /admin/deals | /admin/deals/[id]/edit | /admin/deals/new
* /admin/movies | /admin/movies/[id]/edit | /admin/movies/new
* /admin/classifieds | /admin/classifieds/[id]/edit | /admin/classifieds/new
* /admin/emergency-contacts | /admin/emergency-contacts/[id]/edit | /admin/emergency-contacts/new
* /admin/users, /admin/settings, /admin/ads, /admin/rewards, /admin/perks

> *Note:* Collapse the previous `PlatformAdmin` into `/admin/*`. Use RBAC for superadmin powers.

**SEO**

* Faceted pages with crawl‑safe query params (`?city=sydney&date=this-week`).
* Programmatic location/category hubs (e.g., /events/sydney, /businesses/restaurants-sydney).
* Canonicals + paginated rels; JSON‑LD for events/businesses; OpenGraph images.

---

## 5) Data Model (Core Collections)

**users**: uid, username, name, email, photoURL, bio, location {country, city, lat, lng}, interests[], roles {admin, moderator, editor}, verified, createdAt, updatedAt.

**events**: id, slug, title, summary, description, hostId, organizerIds[], photos[], category, tags[], startsAt, endsAt, timezone, venue {name, address, lat, lng}, price {type: free/paid, min, max, currency}, externalUrl, status {draft/pending/published/rejected/archived}, moderation {state, reviewerId, notes}, metrics {views, saves, shares, rsvps}, createdBy, createdAt, updatedAt.

**businesses**: id, slug, name, summary, description, ownerId, claim {claimed, claimantId, status, docs[]}, photos[], category, tags[], contact {phone, email, website}, location {address, city, country, lat, lng}, hours[], priceTier, verified, status, moderation, metrics {views, saves, shares}, createdAt, updatedAt.

**communities**: id, slug, name, summary, description, admins[], channelLinks[], locationScope {global/city}, photos[], status, moderation, metrics.

**deals**: id, title, businessId, description, terms, code, qrPayload, startsAt, endsAt, locations[], redemptionRules {limits, perUser, KYC}, status, metrics {views, redemptions}.

**movies**: id, slug, title, synopsis, trailerUrl, rating, releaseDate, languages[], genres[], runtime, providers[], screenings[] {cinema, city, times[]}, status.

**reviews**: id, authorId, target {type, id}, rating, text, photos[], status, moderation, helpfulCount, createdAt.

**reports**: id, reporterId, target {type, id}, reason, details, status, resolution, createdAt.

**points**: id, userId, type (earn/spend), source (review, submission, verify, referral), amount, balanceAfter, metadata, createdAt.

**rewards**: id, title, description, requiredPoints, inventory, businessId? , status, validity.

**notifications**: id, userId, type, payload, seen, createdAt.

---

## 6) Moderation & Trust/Safety

**Submission pipeline**

1. User submits → status `pending`.
2. Rule‑based automated checks (profanity, spam/dup, URL safety, image nudity) — no generative AI.
3. Moderator review → `published` or `rejected` with notes.
4. Post‑publish audits & community reports (triage SLA: 24h).

**Abuse controls**

* Rate limits per user/IP.
* Reputation: good history → fast‑track; poor history → stricter checks.
* Claim verification: email/phone + doc/photo + small refundable deposit (optional, later).

---

## 7) Search, Ranking & Personalization

**Search**

* Index: title, summary, description, tags, location, dates, category; synonyms (e.g., “payasam”↔“dessert”).
* Filters: city, distance, date range, price, free/paid, family‑friendly, verified, rating.
* Sort: relevance (query × engagement × freshness), distance, date, rating.

**Personalization**

* Interests, location, language; collaborative signals (people like you saved…).
* Cold start: trending + nearby + seasonal (Onam/Vishu/Christmas).

---

## 8) Rewards & Gamification (Detailed)

**Earning**

* +50 submit approved event/business/community
* +10 verified review (passes checks)
* +5 add photo; +3 attend/RSVP + check‑in
* +100 referral (new active user)
* Weekly streak bonuses (cap to prevent farming)

**Spending**

* Redeem at participating businesses (QR or code).
* Early access to events, priority RSVP, VIP seats.

**Badges & Levels**

* Contributor (5 approved), Organizer (3 successful events), Guide (10 helpful reviews), City Champion, Onam Ambassador.

**Anti‑gaming**

* Cooldowns, device/IP checks, proof asks (ticket/receipt/photo), anomaly alerts.

---

## 9) UX System & Components

**Design principles**: Clarity, Warmth, Cultural Texture, Performance, Inclusivity. Human‑first curation (no AI content generation).

**Key screens**

* **Explore**: tabs (Events • Businesses • Communities • Deals • Movies), sticky filters, map toggle, infinite scroll, save/share/claim/report.
* **Detail page**: hero image, quick facts, CTA row (Save • Directions • Share • Report • Claim), schedule, reviews, similar nearby.
* **Submit/Claim wizards**: progressive steps, validation, preview, status tracking.
* **Moderation**: multi‑select triage, diff view, spam clusters, audit log.

**Component checklist**

* Navbar with city switcher; Search bar (typeahead); Filter drawer.
* Card variants (event/business/deal/movie); Rating stars; Tag pills.
* Share modal (link + QR + social); Save button; Report sheet.
* Claim banner; Verified badge; Empty states; Skeleton loaders.
* Review composer w/ photo upload; Media gallery; Map embed.
* Toasts, dialogs, drawers; Pagination; Breadcrumbs.

---

## 10) Design Tokens & Theming

**Colors (semantic)**

* `--color-bg`: Light `#F4F3EF`, Dark `#130C1F` (derived from Indigo family).
* `--color-surface`: Light `#FFFFFF`, Dark `#1B1530`.
* `--color-primary`: Kerala Green `#0F8A4B` (AA on light/dark).
* `--color-primary-contrast`: `#FFFFFF`.
* `--color-accent`: Blue `#0047FF` (accessible with bg variants).
* `--color-positive`: `#0E9F6E`; `--color-warning`: `#F59E0B`; `--color-danger`: `#DC2626`.
* Focus ring: `#7C3AED` (indigo) at 2px; 4px when keyboard‑navigating.

**Typography**

* Headings: Space Grotesk (700/600/500).
* Body: PT Sans (400/500).
* Scale: `12, 14, 16, 18, 20, 24, 28, 32, 40` px.
* Line‑height: 1.4–1.6 body; 1.2–1.3 headings.
* Fallbacks: `system-ui, -apple-system, Segoe UI, Roboto, Noto Sans`.

**Radius & Elevation**

* Radius: `12px` base, `16px` for hero cards, `24px` buttons special.
* Shadows: low (y2 b8 10%), med (y6 b16 12%), high (y12 b24 16%).

**Motion**

* Durations: 200–300ms; easing: standard curve; spring on cards (stiffness \~240, damping \~30).
* Respect `prefers-reduced-motion` everywhere.

---

## 11) Accessibility & Internationalization

* AA contrast minimum; keyboard navigation; visible focus; landmarks (nav/main/footer).
* Alt text required on images; form labels; error summaries.
* i18n: English + Malayalam; RTL‑aware layouts (future Arabic); locale routes `/ml-IN/*`. Translations curated by community editors (no machine translation).
* Numerals & dates localized; content language tags.

---

## 12) Tech Stack & Architecture

* **Frontend**: Next.js (App Router) + TypeScript; shadcn/ui; lucide‑react; Framer Motion; Map (Leaflet/Mapbox).
* **Auth**: Firebase Auth (email/OAuth), phone optional for claims.
* **Data**: Firestore; Storage for media; Cloud Functions for moderation & QR; Cloud Tasks for scheduled cleanups.
* **Search**: Algolia / Typesense for instant search & facets.
* **Edge**: Vercel ISR + SWR (`stale‑while‑revalidate`).
* **Notifications**: FCM + email (SendGrid).
* **Analytics**: GA4 + Amplitude; Sentry/LogRocket.

**Security & Rules (overview)**

* Resource ownership; role gates; field validation (status transitions, slugs unique).
* Rate limiting per IP/uid; file type/size checks; image moderation.
* Audit logs for edits, reviews, moderation actions.

---

## 13) Legal & Privacy

* GDPR/APPs compliance; explicit consent for marketing.

* Clear ToS for reviews, UGC licensing.

* Data retention policy; delete/my data export.

* **No‑AI policy**: No generative AI is used to create, translate, or moderate content; your data is not used to train third‑party AI models.

---

## 14) KPIs & Analytics

* MAU/WAU, new signups, activation (% first save/share within 3 days).
* Search → click‑through → detail conversion; Save rate; Share rate.
* Event RSVP/attendance; Deal redemption; Review rate.
* Content velocity: new approved submissions/week; moderation SLA.
* NPS; report resolution time.

---

## 15) Launch Plan (90 Days)

**Phase 1 (Weeks 1–3)**: Seed Sydney/NSW—curate 100 events, 100 businesses, 20 communities; recruit 10 local ambassadors.
**Phase 2 (Weeks 4–6)**: Open submissions; run Onam/Vishu seasonal campaign; 10 partner deals.
**Phase 3 (Weeks 7–10)**: Reviews & badges; claim flow; organizer dashboard.
**Phase 4 (Weeks 11–13)**: Wallet passes; city hubs (Melbourne, Perth); creator program.

---

## 16) Microcopy (Tighter, Friendlier)

* **Empty Saved**: “Nothing saved yet. Tap the ⭐ on events and places you love.”
* **Share Modal**: “Scan the QR or copy the link—see you there!”
* **Report Received**: “Thanks for keeping Culture Kerala safe. Our team will review within 24 hours.”
* **Claim CTA**: “Own this listing? Claim it to update details and earn a verified badge.”

---

## 17) Improvements vs. Original

* Cleaned IA (consistent lowercase, removed `/PlatformAdmin`, added `/submit`, `/claim`, `/report`, `/notifications`, unified `/settings`).
* Expanded data model, moderation workflow, and rewards anti‑abuse.
* Concrete design tokens and accessibility specs; motion guidelines.
* Clear MVP vs. roadmap; explicit KPIs and 90‑day go‑to‑market.

---

## 18) Next Build Steps

1. Lock design tokens → Tailwind config + shadcn theme.
2. Scaffold pages/routes; implement cards, filters, share modal (QR), report flow.
3. Set up Firestore collections & rules; moderation console; Algolia index.
4. Ship Sydney MVP, instrument analytics, iterate weekly.

## 19) Sign‑Up & Onboarding — Data Flow + Steps (No‑AI)

**Actors**: User • Web App (Next.js) • Firebase Auth • Cloud Functions • Firestore • Email Provider (SendGrid) • FCM (push) • Analytics

### A) High‑Level Data Flow

```
User → Web App (/auth/signup)
     → Firebase Auth (create user)
       ↳ Cloud Function onAuthCreate (idempotent bootstrap)
         → Firestore
            • users/{uid}
            • points/{tx}
            • notifications/tokens/{token}
         → Email Provider (verification email)
     ← Web App (/verify-email guard, polling)
     → Onboarding Wizard (/settings?step=profile→interests→notifications→privacy→done)
         → Firestore (incremental updates)
         → FCM (token capture) / Email prefs stored
     → Explore/Home (personalized defaults)
```

### B) Step‑by‑Step UX & System Actions

1. **Open Sign‑Up** (`GET /auth/signup`)

   * UX: email, password, full name, username, city/country, consent (ToS/Privacy/Marketing opt‑in).
   * Client validation: strong password, unique username pre‑check, profanity check on username (rule‑based).

2. **Create Auth Account**

   * Call `createUserWithEmailAndPassword(email, password)`.
   * **Result**: `uid` issued; `emailVerified=false`.

3. **Bootstrap User Record (idempotent)**

   * Client (or `onAuthCreate` function) writes `users/{uid}` with defaults (see schema).
   * Create initial **points** transaction if desired (e.g., `+10 account_created`).
   * Create **audit** entry `user_acceptance` with timestamps and client meta (IP hash, UA) — no PII beyond what’s necessary.

4. **Send Verification Email**

   * Trigger email via Auth provider; optionally mirror via SendGrid for branding.
   * UX: redirect to `/auth/verify-email` with **Resend** and **Change email** options.

5. **Email Verified → Elevate Privileges**

   * After link click, app observes `emailVerified=true`.
   * Firestore: set `users/{uid}.verified=true`, `verifiedAt` timestamp.
   * Gate: unverified users can browse but **cannot submit** or **claim** listings.

6. **Onboarding Wizard** (`/settings?step=...`)
   **a) Profile Basics** — name, username, photo, city/lat/lng; uniqueness checks; photo type/size validation.
   **b) Interests** — categories (events, food, arts, sports), languages; stored to `interests[]`.
   **c) Notifications** — choose Email/Push. If Push → request permission, fetch FCM token, store under `notifications/tokens/{token}` with device meta; topics pre‑subscribe (city, categories).
   **d) Privacy** — toggle discoverability (public profile / hidden), email preferences, analytics opt‑out.
   **e) Referral (optional)** — enter code; validate, write **points** to both users; anti‑fraud checks (IP/device/time window).

7. **Complete → First‑Session Activation**

   * Grant onboarding bonus (e.g., `+20 onboarding_completed`).
   * UX nudges: “Save 3 events near you” or “Follow 3 communities.”
   * Analytics: `sign_up_started`, `sign_up_completed`, `email_verified`, `onboarding_completed`, `push_enabled`, `referral_applied`.

8. **Ongoing**

   * Weekly email (if opted‑in): local roundup; can be turned off in `/settings`.
   * Push: event reminders for **Saved** items, deal expiring reminders, city alerts (storm/strike) routed via **Emergency Contacts** policy when relevant.

### C) Firestore Schemas (Key Docs)

**users/{uid}**

```json
{
  "uid": "abc123",
  "email": "user@example.com",
  "emailVerified": false,
  "verified": false,
  "verifiedAt": null,
  "username": "amala",
  "name": "Amala Varghese",
  "photoURL": null,
  "location": {"city": "Sydney", "country": "AU", "lat": -33.8688, "lng": 151.2093},
  "interests": ["events:onam", "food:vegetarian", "arts:kathakali"],
  "roles": {"admin": false, "moderator": false, "editor": false},
  "privacy": {"discoverable": true, "emailOptIn": true, "analyticsOptOut": false},
  "referral": {"code": "KERALA123", "referredBy": null},
  "metrics": {"saves": 0, "shares": 0},
  "createdAt": 0,
  "updatedAt": 0
}
```

**notifications/tokens/{token}**

```json
{
  "uid": "abc123",
  "token": "fcm-token",
  "platform": "web",
  "topics": ["city:sydney", "cat:onam"],
  "createdAt": 0,
  "updatedAt": 0
}
```

**points/{txId}**

```json
{
  "uid": "abc123",
  "type": "earn",
  "source": "onboarding_completed",
  "amount": 20,
  "balanceAfter": 20,
  "metadata": {"ref": null},
  "createdAt": 0
}
```

### D) State Machine (Auth & Capability)

```
UNAUTH → AUTH_UNVERIFIED → AUTH_VERIFIED → ACTIVE
  |           |                     |
  |           |                     └─ gains: submit, claim, review, deals
  |           └─ limited: browse, save (optionally), no submit/claim
  └─ can browse public content
```

### E) Security & Compliance Notes

* **Idempotency**: ensure user bootstrap via transaction with `exists()` guard.
* **Enumeration protection**: generic error on sign‑up; rate‑limit by IP/uid; CAPTCHA after N attempts.
* **Content safety**: rule‑based checks on username/photo; moderation for profile photo if flagged.
* **Data hygiene**: remind to verify at Day 1 and Day 3; disable submissions after 14 days unverified; purge dormant unverified accounts per retention policy.
* **No‑AI**: No generative systems used for verification, moderation, or summaries.

### F) Routing & Events Summary

* **Routes**: `/auth/signup` → `/auth/verify-email` → `/settings?step=profile` → `…interests` → `…notifications` → `…privacy` → `/explore`.
* **Key events**: `sign_up_started`, `sign_up_completed`, `email_verified`, `onboarding_step_completed` (profile/interests/notifications/privacy), `onboarding_completed`, `push_enabled`, `referral_applied`.

---

*End of improved spec.*