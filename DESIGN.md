# DESIGN.md — Direction artistique et design tokens

## 0. Direction v3 — « Éditorial nuit » (octobre 2026)

Refonte de l'accueil et de l'identité globale à partir d'un moodboard de portfolios (références « AR », « Isak », « Clark Kent » ; « Pro Grow » écartée car claire). Elle **remplace** la piste A ci-dessous (§2, conservée pour l'historique) et le thème clair.

| | |
|---|---|
| Brief | Esthétique sombre, mise en page éditoriale, traitement typographique fort ; **projet phare au-dessus de la ligne de flottaison** ; section Projets (3 réalisations) ; section À propos (repères d'expérience, philosophie, avis). |
| Emprunts | **Isak** : carte portrait + grand titre éditorial aux mots en pastille. **AR** : nom en capitales condensées géantes, repères chiffrés en cartes, frise. **Clark Kent** : accent turquoise et grille d'atelier en fond, métadonnées en monospace. |
| Thème | **Sombre uniquement** (plus de bouton de thème). |
| Palette | Nuit `#0A0C0D`, surface `#111517`, encre `#EEF1F0`, **un seul accent** : lagon `#5EE0D0` (actions, pastilles, index, puces). Le corail a été retiré (audit « redesign » : une seule couleur d'accent). Couleurs de statut à part : succès, alerte (`--warning` `#F5B85B`, admin), erreur. |
| Polices | **Anton** (titres, capitales condensées, une graisse) + **Schibsted Grotesk** (texte, accroche) + **JetBrains Mono** (métadonnées). |
| Portrait | Portrait généré dans le style « studio clair-obscur » (costume sombre, contre-jour lagon), détouré : `public/demo/media/profile/portrait-hero.webp`. Toute photo **détourée** (PNG/WebP transparent) téléversée dans l'admin fonctionne (`object-contain`, posée en bas de la scène, bords latéraux estompés). |

### Accueil — ordre de lecture

1. **Hero plein écran, façon affiche de film** (`components/site/hero.tsx`) : scène `overflow: hidden` sur fond `--hero-bg`, plans empilés — z-0 le mot **PORTFOLIO** étiré verticalement, z-10 le portrait détouré ancré en bas (ce qui dépasse est coupé), z-20 un fondu vers le fond, z-30 « JE SUIS … » (machine à écrire, mots du CV, curseur clignotant piloté en JS) et icônes. **Entrée** (~1 s, CSS pur) : titre → portrait → frappe → icônes → carte du projet phare ; la frappe démarre ensuite. **Mouvement réduit** : la même séquence en fondus seuls (opacité), aucune parallaxe. **Défilement** (transform/opacity) : titre plus lent que le portrait, portrait qui monte en rétrécissant, fondu vers la carte. Le h1 (nom + métier) est masqué visuellement.
3. Bandeau défilant des compétences (un mot sur deux au contour seul).
4. **01 — Projets** : les 3 projets mis en avant, en tuiles.
5. **02 — À propos** : repères chiffrés **calculés** depuis le contenu publié (expériences, formations, projets, langues — aucun chiffre saisi à la main), frise datée (expériences + étape en cours), philosophie (valeurs du profil), avis.
6. Contact.

### En-tête

En haut de page, l'en-tête prend la couleur `--hero-bg`, sans bordure. Au-delà de ~50 px de défilement (`data-scrolled` sur <html>, posé par `components/site/scroll-state.tsx`), il reprend fond translucide, flou et bordure (transition 300 ms).

### Squelettes de chargement

Composant `Skeleton` (`components/ui/skeleton.tsx`, reflet coupé en mouvement réduit et par la pause des animations) et squelettes de section (`components/site/skeletons.tsx`), aux dimensions des composants réels. Utilisés comme fallbacks de <Suspense> (accueil, Projets, Parcours, Compétences) et dans `loading.tsx` (À propos, Contact, étude de cas). Le contenu qui les remplace apparaît en fondu (`.data-in`). Les couvertures de projet affichent un squelette jusqu'au chargement de l'image. Les données étant mises en cache, les squelettes ne s'affichent que lorsqu'un chargement réel a lieu : aucun délai artificiel.

### Mots en pastille

Dans l'admin (Profil → Proposition de valeur), les passages entre crochets sont affichés en pastille : `Je conçois des [interfaces web] claires, [rapides] et accessibles…`. Les crochets sont retirés des données structurées (`lib/highlight.ts`).

### Avis

Gérés dans l'admin (**Avis**, table `testimonials`). Un avis dont la citation, le nom ou le rôle contient « À COMPLÉTER » s'affiche comme un **emplacement en pointillés** ; le seed en crée trois.

## 1. Contraintes qui guident la DA

- **10 secondes** pour comprendre qui, quoi, pourquoi me contacter → une hiérarchie typographique très marquée, pas de décor qui concurrence le message.
- Profil **junior crédible** : la DA doit inspirer sérieux et soin, pas « démo technique ».
- **Performance** (LCP < 2 s mobile) → le hero est typographique (pas d'image LCP), polices auto-hébergées via `next/font`, 3 familles maximum.
- **Accessibilité AA** en clair et en sombre, mouvement réduit respecté.

## 2. Deux pistes (v1 — historique, remplacé par §0)

### Piste A — « Lagon éditorial »

| | |
|---|---|
| Idée | Un magazine imprimé : papier chaud, encre profonde, un seul accent bleu-vert tiré du lagon de Mayotte. Le contenu est mis en page comme un article, pas comme une app. |
| Palette | Papier `#F5F2EC`, encre `#15181B`, lagon `#0A6664`, corail `#A8421E` (détails). Sombre : nuit `#0E1113`, lagon clair `#5FCFC6`. |
| Polices | **Instrument Serif** (titres, grandes tailles, italique expressive) + **Schibsted Grotesk** (texte et UI, variable 400–900, dessinée pour la presse) + **JetBrains Mono** (métadonnées : dates, index, tags). |
| Mise en page | Grille 12 colonnes asymétrique, titres de section numérotés (`01 — Parcours`), filets fins, grands blancs, colonnes de texte limitées à ~68 caractères. |
| Mouvement | Apparitions au scroll courtes (opacité + 12 px), soulignés qui se dessinent, transitions de page en fondu-glissé via View Transitions. |
| Références | Pentagram (études de cas), Stripe Press (typographie éditoriale), Linear Changelog (rythme, métadonnées mono), Rauno Freiberg (micro-interactions sobres). |

### Piste B — « Grille technique »

| | |
|---|---|
| Idée | Esthétique « interface d'ingénieur » : lignes de grille visibles, tout en monospace, contrastes durs, accent néon. |
| Palette | Noir `#0A0A0A`, gris `#8F8F8F`, blanc `#FAFAFA`, accent vert acide `#B6F23B`. |
| Polices | **Space Grotesk** + **IBM Plex Mono**. |
| Mise en page | Cellules bordées, tableaux, numéros de ligne, blocs façon terminal. |
| Mouvement | Effets de frappe, curseurs clignotants, compteurs. |
| Références | Vercel, Teenage Engineering, Rauch.com. |

### Choix : **Piste A — Lagon éditorial**

1. **Différenciation** : la piste B est devenue l'uniforme des portfolios de développeurs ; un recruteur l'a vue cent fois. La piste A se remarque sans en faire trop.
2. **Lisibilité** : une serif éditoriale en grand + une grotesque de presse en texte donnent une hiérarchie immédiate ; la piste B, toute en mono, ralentit la lecture (mauvais pour la règle des 10 s).
3. **Récit** : l'accent « lagon » et le ton magazine racontent un profil ancré à Mayotte, cohérent avec Covoit'May — un élément de personnalité que la piste B n'offre pas.
4. **Accessibilité** : la piste B dépend d'un vert néon sur noir difficile à décliner en thème clair conforme ; la piste A passe AA dans les deux thèmes (voir §4).
5. **Performance** : Instrument Serif n'a qu'une graisse (~25 Ko), Schibsted est variable (un seul fichier) — coût typographique maîtrisé.

On emprunte à la piste B **une seule chose** : la mono pour les métadonnées (dates, index, tags), qui apporte la précision « technique » sans dominer.

## 3. Principes

- **Une idée par écran.** Chaque section ouvre sur un titre serif et une phrase qui dit l'essentiel.
- **L'accent est rare.** Le lagon sert aux actions (liens, boutons, focus) ; jamais en décor de fond massif.
- **Le mouvement confirme, il ne montre pas.** Durées 150–500 ms, courbe `--ease-out` ; rien de décoratif en boucle ; tout est coupé avec `prefers-reduced-motion`.
- **Pas de barres de pourcentage.** Les compétences sont des listes par domaine, preuves à l'appui (projets liés).
- **Focus toujours visible** : anneau lagon 2 px + décalage 3 px.

## 4. Tokens

Source unique : [`app/globals.css`](app/globals.css) (variables CSS exposées à Tailwind v4 via `@theme inline`). Les composants n'utilisent **que** ces tokens (`bg-bg`, `text-ink`, `text-muted`, `border-line`, `bg-accent`…), jamais de couleur en dur.

### Couleurs (thème unique, sombre)

| Token | Valeur | Usage | Contraste sur `bg` / `surface` |
|---|---|---|---|
| `--bg` | `#0A0C0D` | fond de page | — |
| `--surface` | `#111517` | cartes, champs, bandeaux | — |
| `--raised` | `#171C1F` | pastilles d'initiales, éléments relevés | — |
| `--sunken` | `#060808` | zones en retrait, code | — |
| `--ink` | `#EEF1F0` | texte principal | 17,2 / 16,2 |
| `--muted` | `#A3ACAA` | texte secondaire | 8,4 / 7,9 |
| `--subtle` | `#8A9492` | métadonnées | 6,3 / 5,9 |
| `--line` | `#222A2D` | filets décoratifs | décoratif |
| `--field` | `#5F6A6D` | bordures de champs, emplacements d'avis | 3,5 / 3,3 (≥ 3:1, 1.4.11) |
| `--accent` | `#5EE0D0` | liens, boutons, focus, pastilles | 12,2 / 11,4 |
| `--accent-hover` | `#93EFE4` | survol | — |
| `--on-accent` | `#03201D` | texte sur accent | 10,6 sur accent |
| `--warning` | `#F5B85B` | statut « à compléter » (admin) | — |
| `--danger` | `#F97066` | erreurs | 7,0 / 6,6 |
| `--success` | `#5BD38A` | succès, disponibilité | 10,4 / 9,7 |

### Typographie

| Token | Famille | Usage |
|---|---|---|
| `--font-display` | Anton 400, une graisse (`display: swap`) — **toujours en capitales** (`uppercase`) | nom du hero, h1, h2, titres de projets, grands chiffres |
| `--font-sans` | Schibsted Grotesk variable (`display: optional`) | texte, UI, accroche du hero (500) |
| `--font-mono` | JetBrains Mono 400, fichier statique | dates, index, tags, navigation, code |

Anton a des capitales hautes : les masques d'animation (`.mask-line`, `RevealWords`) ont une marge interne en haut pour ne pas rogner les accents (É, À), et l'interligne des h2 est de 1,02.

Échelle fluide (`clamp`, 360 px → 1440 px) :

| Token | Taille |
|---|---|
| `text-display` | `clamp(3.25rem, 1.6rem + 7vw, 8.5rem)` / 0,9 |
| `text-h1` | `clamp(2.75rem, 1.6rem + 4.6vw, 6rem)` / 0,92 |
| `text-h2` | `clamp(2.25rem, 1.5rem + 3vw, 4.25rem)` / 1,02 |
| `text-h3` | `clamp(1.375rem, 1.2rem + 0.7vw, 1.75rem)` / 1,15 |
| `text-lead` | `clamp(1.125rem, 1.05rem + 0.35vw, 1.375rem)` / 1,5 |
| `text-base` | 1rem / 1,65 |
| `text-meta` | 0,8125rem mono, 0,02em, majuscules optionnelles |
| Nom du hero | `clamp(3.75rem, min(18.5cqi, 15.5vh), 10.5rem)` / 0,86 — suit la largeur de sa colonne et la hauteur d'écran |

### Espacement, grille, formes

- Base 4 px (échelle Tailwind). Rythme vertical des sections : `--section-y: clamp(5rem, 3rem + 8vw, 10rem)`.
- Conteneur `max-w-[1320px]`, gouttières `px-5 sm:px-8 lg:px-12`. Grille 12 colonnes, gap `clamp(1rem, 0.5rem + 2vw, 2rem)`.
- Mesure de lecture : `max-w-[68ch]`.
- Rayons : `--radius-sm 6px`, `--radius 12px`, `--radius-lg 20px`, `--radius-full`.
- Ombres : quasi absentes ; `--shadow-lift` réservé aux éléments en survol et aux menus.

### Mouvement

| Token | Valeur | Usage |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | apparitions, survols |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | transitions de page |
| `--dur-fast` | 150 ms | couleurs, soulignés |
| `--dur-base` | 300 ms | survols de cartes |
| `--dur-slow` | 500 ms | apparitions au scroll |

- Apparition au scroll (Motion : `useAnimate` de `motion/react-mini` + `inView`, basés sur la Web Animations API, quelques Ko) : opacité 0→1, translation 12 px, une seule fois. Le HTML serveur reste toujours visible : seul le client masque ce qui est sous la ligne de flottaison, puis le révèle.
- Transitions de page : React `<ViewTransition>` (API native du navigateur, 0 Ko de JS en plus) — fondu + glissement de 24 px ; morphing de la couverture projet → hero de l'étude de cas.
- `prefers-reduced-motion: reduce` : toutes les translations supprimées, fondus conservés ≤ 150 ms, animations au scroll désactivées.

## 5. Composants clés

- **SectionHeading** : index mono (`01`), filet, titre en capitales Anton, chapeau. Sans action, le titre prend toute la largeur.
- **Button** : `primary` (fond accent), `secondary` (bordure encre), `ghost` ; hauteur min. 44 px (cible tactile 2.5.8).
- **ProjectCard** (page Projets) et **ProjectTile** (accueil) : couverture 16:10, titre Anton, résumé, tags mono ; toute la carte cliquable via un seul lien (pas de liens imbriqués).
- **Hero** + **FeaturedProject** : carte portrait, nom géant, accroche à pastilles, bandeau du projet phare.
- **Facts / TimelineBrief / Philosophy / Testimonials** (`components/site/home-about.tsx`) : blocs de la section À propos de l'accueil.
- **Timeline** : rail vertical fin, pastille par étape, dates en mono, filtre « Tout / Expériences / Formations » en boutons segmentés (`aria-pressed`).
- **SkillGroup** : titre de domaine + liste en « chips » non interactives.
- ~~ThemeToggle~~ : supprimé en v3 (thème sombre unique). Le script inline avant hydratation ne gère plus que la pause des animations.

## 6. Système d'animation (v2)

Trois familles, chacune avec l'outil le plus léger possible :

| Famille | Technique | Exemples |
|---|---|---|
| **Entrées au chargement** | CSS pur (`.enter`, `.mask-line`, `.curtain`, `.draw-line`, délai `--d`) : démarrent au premier rendu, sans attendre le JS | nom du hero qui monte ligne par ligne, filet qui se trace, portrait révélé en rideau, titres de page mot par mot |
| **Au défilement, une fois** | Motion (`useAnimate` de `motion/react-mini` + `inView`) | titres de section mot par mot (`RevealWords`), cartes en rideau (`Reveal variant="clip"`), compteurs (`CountUp`) |
| **Continues, liées au scroll** | Animations CSS pilotées par le défilement (`animation-timeline`), amélioration progressive | parallaxe des couvertures, rail du parcours qui se dessine, en-tête qui se densifie, barre de progression de lecture |
| **Ambiantes (boucles)** | CSS, classe `.ambient` | halos lagon qui dérivent, bandeau des compétences, pastille de disponibilité, aurore du bandeau de contact |
| **Au pointeur** | petits composants client (`PointerSurface`, `Magnetic`) | pastille « Voir » qui suit le curseur, cartes spotlight, boutons magnétiques, reflet des boutons principaux |

Garde-fous :

- **Rien n'est caché sans JS** : le HTML serveur est toujours visible ; seul le client masque ce qui est sous la ligne de flottaison, puis le révèle.
- **LCP préservé** : le paragraphe d'introduction du hero glisse sans fondu (`.enter-soft`), il est peint immédiatement.
- **Texte écrit une seule fois** : les mots animés sont séparés par de vraies espaces (lecteurs d'écran et moteurs de recherche lisent le titre normalement).
- **WCAG 2.2.2** : un bouton « Mettre en pause les animations » (bandeau et pied de page) suspend toutes les boucles ; choix mémorisé (`localStorage`, appliqué avant le premier rendu).
- **`prefers-reduced-motion`** : aucune animation ne tourne (vérifié par un test E2E).
- Effets au pointeur désactivés au tactile.
- Décor : halos en dégradés radiaux (sans `filter: blur`, peu coûteux), grille d'atelier (64 px) estompée vers les bords, grain photographique à 4,5 % d'opacité.

## 7. Arbitrages de performance (phase 7)

Mesures Lighthouse 12 en local, build de production :

| | Performance | Accessibilité | Bonnes pratiques | SEO |
|---|---|---|---|---|
| Mobile (toutes les pages) | 94 – 96 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

LCP mobile **observé** ≈ 0,24 s ; LCP **simulé** par Lighthouse (4G lent, CPU ×4) : 2,7 à 3,1 s, car la simulation place sur le chemin critique tout le JavaScript Next.js/React téléchargé avant l'affichage.

Décisions prises :

- **Italique d'Instrument Serif retirée** du site (−15 Ko) : le métier du hero est en romain, couleur lagon. L'italique reste dans les images Open Graph, générées côté serveur.
- **Texte courant en `display: optional`** : le paragraphe LCP n'est jamais repeint ; le fallback à métriques ajustées de `next/font` évite tout décalage.
- **JetBrains Mono statique 400** au lieu du fichier variable (−20 Ko).
- **Motion en API compacte** (WAAPI) au lieu du moteur complet (−31 Ko gzip).
- **`zod/mini`** pour le formulaire public au lieu de Zod complet.
- **CSS inline** (`experimental.inlineCss`) : une requête bloquante de moins.
- **Pas de squelette `loading.tsx`** sur les études de cas : le CLS passe de 0,23 à 0.
