# DESIGN.md — Direction artistique et design tokens

## 1. Contraintes qui guident la DA

- **10 secondes** pour comprendre qui, quoi, pourquoi me contacter → une hiérarchie typographique très marquée, pas de décor qui concurrence le message.
- Profil **junior crédible** : la DA doit inspirer sérieux et soin, pas « démo technique ».
- **Performance** (LCP < 2 s mobile) → le hero est typographique (pas d'image LCP), polices auto-hébergées via `next/font`, 3 familles maximum.
- **Accessibilité AA** en clair et en sombre, mouvement réduit respecté.

## 2. Deux pistes

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

### Couleurs

| Token | Clair | Sombre | Usage | Contraste (sur `bg`) |
|---|---|---|---|---|
| `--bg` | `#F5F2EC` | `#0E1113` | fond de page | — |
| `--surface` | `#FBFAF7` | `#151A1D` | cartes, champs | — |
| `--sunken` | `#ECE7DF` | `#0A0C0E` | zones en retrait, code | — |
| `--ink` | `#15181B` | `#EDE9E2` | texte principal | 15,9 / 15,7 |
| `--muted` | `#565C63` | `#A2A8AE` | texte secondaire | 6,1 / 7,9 |
| `--subtle` | `#5F656C` | `#8C9298` | métadonnées | 5,3 / 6,0 |
| `--line` | `#D9D2C7` | `#272D32` | filets décoratifs | décoratif |
| `--field` | `#8A857C` | `#6A7279` | bordures de champs | ≥ 3:1 (1.4.11) |
| `--accent` | `#0A6664` | `#5FCFC6` | liens, boutons, focus | 6,1 / 10,1 |
| `--accent-hover` | `#084F4E` | `#8BE0D9` | survol | — |
| `--on-accent` | `#FFFFFF` | `#062624` | texte sur accent | 6,8 / 8,6 |
| `--coral` | `#A8421E` | `#F08A62` | détails (puces, index) | 5,4 / 7,7 |
| `--danger` | `#B42318` | `#F97066` | erreurs | 6,3 / 6,3 |
| `--success` | `#1E7A3E` | `#5BD38A` | succès | 5,2 / 9,3 |

### Typographie

| Token | Famille | Usage |
|---|---|---|
| `--font-display` | Instrument Serif 400, romain seul (`display: swap`) | h1, h2, grands chiffres |
| `--font-sans` | Schibsted Grotesk variable (`display: optional`) | texte, UI |
| `--font-mono` | JetBrains Mono 400, fichier statique | dates, index, tags, code |

Échelle fluide (`clamp`, 360 px → 1440 px) :

| Token | Taille |
|---|---|
| `text-display` | `clamp(3rem, 1.6rem + 6.2vw, 7.5rem)` / 0,95 / -0,02em |
| `text-h1` | `clamp(2.5rem, 1.7rem + 3.6vw, 5rem)` / 1 |
| `text-h2` | `clamp(2rem, 1.5rem + 2.2vw, 3.5rem)` / 1,05 |
| `text-h3` | `clamp(1.375rem, 1.2rem + 0.7vw, 1.75rem)` / 1,2 |
| `text-lead` | `clamp(1.125rem, 1.05rem + 0.35vw, 1.375rem)` / 1,5 |
| `text-base` | 1rem / 1,65 |
| `text-meta` | 0,8125rem mono, 0,02em, majuscules optionnelles |

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

- **SectionHeading** : index mono (`01`), filet, titre serif, chapeau.
- **Button** : `primary` (fond accent), `secondary` (bordure encre), `ghost` ; hauteur min. 44 px (cible tactile 2.5.8).
- **ProjectCard** : couverture 16:10, titre serif, résumé, tags mono ; toute la carte cliquable via un seul lien (pas de liens imbriqués).
- **Timeline** : rail vertical fin, pastille par étape, dates en mono, filtre « Tout / Expériences / Formations » en boutons segmentés (`aria-pressed`).
- **SkillGroup** : titre de domaine + liste en « chips » non interactives.
- **ThemeToggle** : trois états (système / clair / sombre), sans flash grâce à un script inline avant hydratation.

## 6. Arbitrages de performance (phase 7)

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
