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
* UGC feed (photos from events), AI summaries, auto‑translation.
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
2. Automated checks (profanity, spam/dup, URL safety, image nudity).
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

**Design principles**: Clarity, Warmth, Cultural Texture, Performance, Inclusivity.

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
* i18n: English + Malayalam; RTL‑aware layouts (future Arabic); locale routes `/ml-IN/*`.
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

---

*End of improved spec.*