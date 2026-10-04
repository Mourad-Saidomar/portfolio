# Portfolio — Mourad Saidomar

Portfolio professionnel avec espace d'administration : projets (études de cas), parcours, compétences, avis, profil, CV et messages se mettent à jour **sans toucher au code ni redéployer**.

- **Site public** (direction « Éditorial nuit », thème sombre unique — voir [DESIGN.md](DESIGN.md) §0) : accueil avec projet phare visible sans défiler, à propos, parcours filtrable, compétences, projets + études de cas, contact.
- **Admin** (`/admin`) : un seul administrateur, écritures protégées côté serveur et par la base (RLS).
- **Qualité** : 0 violation axe (WCAG 2.2 AA) sur les pages publiques ; 72 tests Vitest (unitaires + SQL) et tests de bout en bout Playwright. Lighthouse : desktop 100/100/100/100, mobile 94–96 en performance — **mesures de la v2, à refaire après la refonte v3**.

| Documents | |
|---|---|
| [CONTENT.md](CONTENT.md) | Contenu extrait du CV et de l'ancien site (éléments « À COMPLÉTER ») |
| [DESIGN.md](DESIGN.md) | Direction artistique, design tokens, arbitrages de performance |

## Stack

Next.js 16 (App Router, Cache Components) · TypeScript strict · Tailwind CSS 4 · Motion · lucide-react · Supabase (Postgres, Auth, Storage) · React Hook Form + Zod · Tiptap · dnd-kit · Vitest · Playwright · déploiement Vercel.

---

## 1. Installation

Prérequis : **Node.js 20.9 ou plus** (testé avec Node 24) et npm.

```bash
cd Portfolio/portfolio
npm install
cp .env.example .env.local
```

### Essayer sans Supabase (mode démo)

Pour voir le site immédiatement, avec le contenu de `supabase/seed/content.ts` :

```bash
# dans .env.local
DEMO_MODE=1
```

```bash
npm run dev          # http://localhost:3000
```

En mode démo, le site est en lecture seule : l'admin est désactivé et le formulaire de contact n'enregistre rien. **Ne jamais activer `DEMO_MODE` en production.**

---

## 2. Configuration Supabase

### 2.1 Créer le projet

1. Sur <https://supabase.com/dashboard>, créez un projet (région la plus proche de vos visiteurs, par exemple `eu-west-3` Paris).
2. **Project Settings → API**, copiez dans `.env.local` :

| Variable | Où la trouver |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clé `anon` / publishable |
| `SUPABASE_SERVICE_ROLE_KEY` | clé `service_role` / secret — **serveur uniquement, ne jamais la publier** |

3. Complétez aussi :
   - `NEXT_PUBLIC_SITE_URL` : l'URL publique du site (ex. `https://mourad-saidomar.fr`) ;
   - `CONTACT_RATE_LIMIT_SALT` : une longue chaîne aléatoire (sert à hacher les IP du formulaire) ;
   - retirez `DEMO_MODE`.

### 2.2 Créer les tables, la sécurité et le stockage

Deux migrations, **à appliquer dans l'ordre** :

1. [`20260930000000_init.sql`](supabase/migrations/20260930000000_init.sql) : tables, index, politiques RLS, buckets `media` / `documents` et leurs politiques ;
2. [`20261002000000_testimonials.sql`](supabase/migrations/20261002000000_testimonials.sql) : table des avis (`testimonials`), ses politiques RLS, et ajout de la table à la fonction de réordonnancement. **Si votre base existe déjà, seule celle-ci est à exécuter.**

**Option A — éditeur SQL (le plus simple)** : Supabase → *SQL Editor* → collez le contenu de chaque fichier → *Run*.

**Option B — CLI** :

```bash
npx supabase login
npx supabase init            # si le dossier n'a pas encore de config.toml (garde les migrations)
npx supabase link --project-ref <id-du-projet>
npx supabase db push
```

### 2.3 Sécuriser l'authentification (important)

Supabase → **Authentication** :

1. **Sign In / Providers → Email** : désactivez **« Allow new users to sign up »**. Un seul compte doit exister.
2. **URL Configuration** : `Site URL` = votre `NEXT_PUBLIC_SITE_URL`.

Même si quelqu'un créait un compte, il ne pourrait rien modifier : seules les personnes présentes dans la table `admins` ont des droits d'écriture (vérifié par la RLS et dans chaque Server Action).

### 2.4 Pré-remplir le contenu et créer le compte admin

Dans `.env.local`, renseignez `ADMIN_EMAIL` et `ADMIN_PASSWORD` (12 caractères minimum), puis :

```bash
npm run db:seed
```

Le script téléverse les visuels, insère le contenu de CONTENT.md et crée le compte administrateur. Il est **rejouable** : il n'écrase jamais ce que vous avez modifié dans l'admin (sauf avec `npm run db:seed -- --force`). Retirez ensuite `ADMIN_PASSWORD` de `.env.local`.

> Sans `ADMIN_EMAIL`/`ADMIN_PASSWORD` : créez l'utilisateur dans *Authentication → Users → Add user*, puis dans le SQL Editor :
> `insert into public.admins (user_id) select id from auth.users where email = 'votre@email.fr';`

### 2.5 Types TypeScript (après une évolution du schéma)

```bash
npx supabase gen types typescript --project-id <id> > lib/supabase/database.types.ts
```

---

## 3. Lancement

```bash
npm run dev       # développement — http://localhost:3000
npm run build     # build de production
npm run start     # serveur de production
npm run check     # lint + types + tests + build (à lancer avant chaque livraison)
```

Admin : <http://localhost:3000/admin>.

## 4. Tests

| Commande | Contenu |
|---|---|
| `npm test` | Vitest : validation, mappers, action de contact, composants, **schéma SQL et RLS** (Postgres en mémoire via PGlite) |
| `npm run test:e2e` | Playwright (Chromium desktop + mobile) : visite et audit axe de chaque page, contact, clavier, menu mobile, thème, SEO, protection de l'admin |

Les tests E2E utilisent le build de production :

```bash
npm run build && npm run test:e2e
```

Le scénario **« créer et publier un projet »** s'exécute contre un vrai Supabase (utilisez un **projet de test**, jamais la production) :

```bash
E2E_ADMIN_EMAIL=admin-test@example.com E2E_ADMIN_PASSWORD=… npm run test:e2e
```

Sans ces variables, ces tests sont ignorés (« skipped »).

Audit Lighthouse (serveur de production lancé sur le port 3100) :

```bash
PORT=3100 npm run start
node scripts/lighthouse.mjs / /projets /contact           # mobile
node scripts/lighthouse.mjs --desktop /                    # desktop
```

---

## 5. Déploiement sur Vercel

1. Poussez le dépôt sur GitHub.
2. Sur <https://vercel.com/new>, importez le dépôt.
3. **Root Directory** : `Portfolio/portfolio` (le dépôt contient d'autres dossiers de formation).
4. **Environment Variables** (Production et Preview) : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `CONTACT_RATE_LIMIT_SALT`. **Pas** de `DEMO_MODE`, **pas** de `ADMIN_PASSWORD`.
5. *Deploy*.
6. **Domaine** : *Project → Settings → Domains* → ajoutez votre domaine et suivez les instructions DNS. Mettez ensuite à jour `NEXT_PUBLIC_SITE_URL` (Vercel) et la *Site URL* (Supabase), puis redéployez une fois.

Les pages publiques sont statiques et servies depuis le CDN. Chaque enregistrement dans l'admin invalide le cache concerné : la page est régénérée à la visite suivante, **sans redéploiement**.

---

## 6. Ajouter un projet depuis l'admin (≈ 5 minutes)

1. `/admin` → **Nouveau projet**.
2. **L'essentiel** : titre (le slug se remplit tout seul), résumé en une ou deux phrases, période, stack (Entrée après chaque techno), liens démo et code, « Mettre en avant » pour l'afficher sur l'accueil.
3. **Couverture** : *Choisir une image* (optimisée automatiquement en WebP), puis une phrase de texte alternatif.
4. **Étude de cas** : Contexte, Problème, Mon rôle, Solution, Résultats. Une section vide est simplement masquée.
5. **Captures** (facultatif) : ajoutez plusieurs images, décrivez-les, glissez-déposez pour les ordonner.
6. **Enregistrer le brouillon** → **Aperçu** pour relire la page telle qu'elle apparaîtra.
7. **Publier** : le projet est en ligne immédiatement. Pour changer l'ordre sur le site : liste des projets → glisser-déposer (souris, doigt ou clavier : Espace, flèches, Espace).

Mettre à jour le CV : **Profil & CV → Remplacer le CV**. Le lien public `/cv` pointe toujours vers la dernière version (pratique sur un CV papier ou LinkedIn).

Autres réglages de l'accueil :

- **Projet phare** : c'est le premier projet mis en avant (étoile) dans l'ordre de **Projets**.
- **Mots en pastille** de l'accroche : dans **Profil → Proposition de valeur**, entourez-les de crochets (`des [interfaces web] claires`).
- **Avis** : **Avis → Nouvel avis**, ou modifiez les trois emplacements « À COMPLÉTER » créés par le seed (glisser-déposer pour l'ordre).
- **Photo** : une photo détourée (fond transparent, PNG ou WebP) s'intègre au fond sombre ; celle du site est `public/demo/media/profile/portrait-hero.webp`.

---

## 7. Architecture

```
app/
  (site)/            pages publiques (statiques, données en cache taguées)
  admin/             connexion + espace protégé admin/(espace)/
  cv/route.ts        lien stable vers le CV à jour
  sitemap.ts, robots.ts, opengraph-image.tsx
components/
  site/  admin/  ui/ composants (design system : tokens dans app/globals.css)
lib/
  data/public.ts     lectures publiques ('use cache' + cacheTag)
  data/admin.ts      lectures admin (session, jamais en cache)
  actions/           Server Actions (contact, admin) — validation Zod + updateTag
  validation/        schémas Zod partagés client/serveur
  supabase/          clients (public, session, navigateur, service) + types
proxy.ts             session Supabase et redirection /admin → connexion
supabase/
  migrations/        schéma, RLS, Storage
  seed/              contenu initial (content.ts) et script de seed
tests/  unit/  db/  e2e/
```

### Sécurité

- **RLS** : le public ne lit que le contenu publié ; toute écriture exige `is_admin()`.
- **Server Actions** : chaque action revérifie la session (JWT validé) et le rôle admin avant d'écrire.
- **Formulaire de contact** : validation serveur, honeypot, délai minimal de saisie, limitation de débit par IP **hachée** (jamais stockée en clair) ; insertion uniquement côté serveur.
- **Storage** : téléversements réservés à l'admin, types MIME et tailles limités par bucket.
- En-têtes : HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` ; `/admin` en `noindex`.

### Limites connues

- Les images d'un projet en **brouillon** sont stockées dans un bucket public : invisibles sur le site, mais accessibles à qui connaîtrait leur URL (aléatoire).
- Pas de notification e-mail à la réception d'un message (consultez l'onglet Messages ; un webhook Supabase peut être ajouté).
- Pas de Content-Security-Policy stricte : elle imposerait des nonces, donc un rendu dynamique de toutes les pages.
- Le score Lighthouse mobile est une **simulation** (4G lente, CPU ×4) : LCP simulé 2,7–3,1 s, LCP observé ≈ 0,24 s (voir DESIGN.md §6).
