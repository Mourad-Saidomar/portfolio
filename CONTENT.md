# CONTENT.md — Contenu structuré du portfolio

Sources analysées (30/09/2026) :

- **CV actuel** (`CV_Mourad_SAIDOMAR.pdf`, fourni) — source prioritaire.
- **Ancien portfolio** <https://mourad-saidomar.github.io/portfolio/> (BTS SIO, 2024) — contenu repris, design abandonné.
- **Ancien CV** en ligne (`file/CV_SAIDOMAR-Mourad.pdf`) — obsolète, utilisé uniquement pour compléter (niveaux de langue, compétences système).
- **Dossiers de travail DWWM** sur le poste (`MOURAD/EVALUATION`, `PROJET-FIL-ROUGE`, `BACK-END`) — pour documenter des projets réels.

Convention : tout ce qui n'est pas vérifiable dans ces sources est marqué **À COMPLÉTER**. Rien n'est inventé.
Ce fichier est la version lisible ; la version machine utilisée par le seed est [`supabase/seed/content.ts`](supabase/seed/content.ts).

---

## 1. Identité

| Champ | Valeur | Source |
|---|---|---|
| Nom | Mourad SAIDOMAR | CV |
| Métier affiché | Développeur web & web mobile | CV (formation DWWM) |
| Statut | En formation DWWM — recherche de stage | CV |
| Âge | 21 ans (non affiché publiquement) | CV |
| Localisation | Tsoundzou 1, Mamoudzou — Mayotte (976) | CV |
| E-mail | mourad.saidomar.sio@gmail.com | CV |
| Téléphone | 06 39 71 25 73 (stocké, **non affiché** par défaut — à activer dans l'admin si souhaité) | CV |
| Ancien portfolio | https://mourad-saidomar.github.io/portfolio/ | CV |
| GitHub | https://github.com/mourad-saidomar — **À COMPLÉTER : vérifier** (déduit du domaine GitHub Pages) | ancien site |
| LinkedIn | **À COMPLÉTER** | — |
| Instagram | https://www.instagram.com/mourad.saidomar/ (non mis en avant : peu pertinent pour un recruteur) | ancien site |
| Photo | `public/demo/media/profile/portrait.webp` (portrait fond blanc, 447×559) ; portrait du hero utilisé par le seed : `portrait-hero.webp` (costume, détouré, fond transparent) | ancien site |
| CV PDF | **À COMPLÉTER : téléverser le CV actuel depuis l'admin** (le PDF de l'ancien site date du BTS et n'est pas repris) | — |

> Note sur le titre : le brief propose « ingénieur logiciel / développeur web ». Le CV correspond à une formation DWWM en cours ; le titre retenu est **« Développeur web & web mobile »**, plus juste pour un recruteur. Modifiable dans l'admin (Profil → Métier).

## 2. Accroche et proposition de valeur

- **Proposition de valeur (hero)** : « Je conçois des interfaces web claires, rapides et accessibles — de la maquette à la base de données. » Dans l'admin, les mots entre crochets s'affichent en pastille : `Je conçois des [interfaces web] claires, [rapides] et accessibles…`.
- **Sous-titre** : « Développeur web & web mobile en formation à Mayotte, avec un socle solide en systèmes et réseaux. Je recherche un stage pour construire des produits utiles au sein d'une équipe exigeante. »
- **Disponibilité stage** : **À COMPLÉTER** (dates et durée de la période de stage).

## 3. À propos

**Présentation (reformulée depuis le CV)**
Passionné par le développement web, je suis actuellement en formation Développeur Web et Web Mobile (DWWM) chez AloAlo Mayotte Compétence. J'y travaille le front-end (HTML, CSS, JavaScript, Vue.js) et le back-end (PHP, Node.js, SQL). Avant cela, un BTS SIO option SISR m'a donné de solides bases en administration systèmes, réseaux et cybersécurité, consolidées par deux stages en entreprise publique. Rigoureux et curieux, je recherche un stage pour mettre en pratique mes acquis et progresser au sein d'une équipe professionnelle.

**Valeurs** (déduites du CV : « rigoureux et curieux »)
1. **Rigueur** — un code lisible, versionné et documenté.
2. **Curiosité** — apprendre vite, aller voir comment ça marche sous le capot.
3. **Sens du service** — issu du support utilisateur : comprendre le besoin avant d'écrire du code.

**Ce qui me distingue**
- Double culture **infrastructure + développement** : je comprends ce qui se passe entre le navigateur, le serveur et le réseau (DNS, DHCP, proxy, Active Directory).
- **Expérience terrain** du support utilisateur en administration publique (DGFiP, mairie de Mamoudzou).
- **Ancrage local** : je conçois pour les usages de Mayotte (ex. Covoit'May, covoiturage local).

**Centres d'intérêt** : musique (instrument), programmation (Python, HTML, CSS, JavaScript), lecture.

**Langues**
| Langue | Niveau | Source |
|---|---|---|
| Français | Courant | CV + ancien CV |
| Mahorais (shimaoré) | Intermédiaire (**À COMPLÉTER : à confirmer**, probablement langue maternelle) | ancien CV |
| Anglais | Intermédiaire — Test TOEIC® Listening & Reading passé (score **À COMPLÉTER**) | CV |

## 4. Parcours

### Formations

| Intitulé | Structure | Lieu | Dates | Détails |
|---|---|---|---|---|
| Titre professionnel Développeur Web et Web Mobile (DWWM) | AloAlo Mayotte Compétence | Doujani, Mayotte | **En cours** — date de début **À COMPLÉTER** | Front-end (HTML, CSS, JavaScript, Vue.js) ; back-end (PHP, Node.js, SQL). Projet fil rouge : Covoit'May. |
| BTS Services informatiques aux organisations (SIO), option SISR | Lycée Younoussa Bamana | Mamoudzou | 2023 – 2024 (obtention **À COMPLÉTER**) | Administration réseau, administration système, cybersécurité. Épreuves E4/E5. |
| Certification Pix | Lycée Younoussa Bamana | Mamoudzou | 2023 – 2024 | 127 points Pix, niveau 7. |
| Baccalauréat général — mention Assez bien | Lycée des Lumières | Kaweni | 2021 – 2022 | Spécialités Physique-Chimie et Numérique et Sciences Informatiques (NSI). |
| Test TOEIC® Listening and Reading | Lycée des Lumières | Kaweni | 2021 – 2022 | Score **À COMPLÉTER**. |
| Diplôme national du brevet — mention Très bien | Collège de Kwalé | Tsoundzou 1 | 2018 – 2019 | — |

### Expériences

| Intitulé | Structure | Lieu | Dates | Missions |
|---|---|---|---|---|
| Stage — Technicien systèmes et réseaux | Direction générale des Finances publiques (DGFiP) de Mayotte | Mamoudzou | janv. 2024 – févr. 2024 | Maintenance informatique : assistance utilisateur, résolution de problèmes ; gestion du parc informatique ; administration du réseau. |
| Stage — Technicien systèmes et réseaux | Direction de l'E-administration et de la Modernisation des Services (DEASM), Mairie de Mamoudzou | Mamoudzou | mai 2023 – juin 2023 | Maintenance informatique : assistance utilisateur, résolution de problèmes ; support matériel et logiciel. |
| Stage d'observation | MIS — Mahorais Informatique Service | Kaweni | 2018 – 2019 | Maintenance sur postes : remplacement de composants, diagnostic de démarrage ; découverte des métiers de l'entreprise. |
| Stage en entreprise (DWWM) | **À COMPLÉTER** | **À COMPLÉTER** | **À COMPLÉTER** | Convention « Back-end – 2e période » présente sur le poste : entreprise et missions **À COMPLÉTER**. |

Documents de l'ancien site (non repris automatiquement, à téléverser si souhaité) : rapports de stage 1re et 2e année, tableau de synthèse BTS SIO.

## 5. Compétences (sans pourcentage)

**Front-end** — HTML5 sémantique, CSS3 / responsive, JavaScript (manipulation du DOM, interactions), Vue.js 3 (Vue Router, Pinia), Bootstrap, intégration de maquettes.
**Back-end & données** — Node.js / Express, PHP (en cours de formation), SQL / MySQL (vues, transactions), modélisation Merise (MCD, MLD, MPD), API REST.
**Outils & méthodes** — Git / GitHub, Visual Studio Code, Vite, WordPress, cahier des charges et règles de gestion.
**Systèmes & réseaux** — Windows Server (AD DS, DNS, DHCP, GPO), Linux (Debian, Ubuntu, CentOS), VirtualBox, Cisco Packet Tracer (VLAN, routage statique IPv4), proxy Squid / SquidGuard / ClamAV, GLPI, OCS Inventory, PuTTY / SSH, PowerShell, supervision (EyesOfNetwork), Python.
**Savoir-être** — Rigueur, curiosité, autonomie et travail en équipe, sens du service (support utilisateur), communication avec des utilisateurs non techniques.

## 6. Projets

Chaque projet suit la trame « étude de cas » : contexte, problème, rôle, solution, stack, résultats, captures, liens.

### 6.1 Covoit'May — plateforme de covoiturage local (projet fil rouge DWWM) ★ mis en avant
- **Contexte** : Mayotte dispose d'un réseau de transport en commun limité et d'un fort tissu social de proximité ; les plateformes existantes visent les longues distances métropolitaines.
- **Problème** : difficile de trouver un covoitureur sur un trajet précis ; manque de confiance envers les inconnus ; coordination des horaires compliquée ; coûts de transport élevés.
- **Rôle** : conception complète — cahier des charges (v2.1, sept. 2026), expression des besoins par profil (visiteur, passager, conducteur, administrateur), règles de gestion, modèle de données.
- **Solution** : plateforme de mise en relation pour trajets courts et récurrents, avec profils vérifiés, avis, réservation, paiement intégré (carte et mobile money), messagerie, gestion des litiges.
- **Stack** : Merise (MCD/MPD), SQL, **stack de développement À COMPLÉTER**.
- **Résultats** : **À COMPLÉTER** (état d'avancement, démo).
- **Liens** : démo **À COMPLÉTER** ; code **À COMPLÉTER**.

### 6.2 DWWM Academy — catalogue de formations (Vue.js) ★ mis en avant
- **Contexte** : évaluation front-end de la formation DWWM.
- **Problème** : présenter un catalogue de formations consultable, avec fiche détaillée, favoris et contact.
- **Rôle** : développement front-end complet.
- **Solution** : SPA Vue 3 avec routage (accueil, liste, détail, favoris, contact), store Pinia pour les favoris, composants réutilisables (cartes, barre de navigation, pied de page).
- **Stack** : Vue 3, Vite, Vue Router, Pinia, Bootstrap.
- **Résultats** : application déployée sur GitHub Pages. Indicateurs **À COMPLÉTER**.
- **Liens** : démo https://mourad-saidomar.github.io/dwwm-academy/ ; code **À COMPLÉTER**.

### 6.3 Move&Go — base de données de location de véhicules ★ mis en avant
- **Contexte** : évaluation « bases de données » de la formation DWWM.
- **Problème** : modéliser et exploiter les données d'un loueur multi-agences (clients, véhicules, réservations, options, paiements, entretiens).
- **Rôle** : analyse et réalisation complètes.
- **Solution** : règles de gestion et dictionnaire de données, MCD/MLD/MPD, base MySQL de 9 tables (agence, client, catégorie, véhicule, réservation, options, paiement, entretien), jeu d'insertions, requêtes, 3 vues métier (réservations détaillées, suivi des paiements, véhicules par agence) et transactions.
- **Stack** : Merise, MySQL (SQL), vues, transactions.
- **Résultats** : **À COMPLÉTER**.
- **Liens** : code **À COMPLÉTER**.

### 6.4 Accès Internet sécurisé via proxy dans un domaine AD DS (BTS SIO, épreuve E5)
- Proxy Squid, filtrage d'URL via SquidGuard, antivirus centralisé ClamAV, authentification LDAP (AD DS), GPO Windows Server pour configurer le proxy des postes clients.
- Documents : procédure et fiche descriptive (ancien site) — **À COMPLÉTER : téléverser si souhaité**.

### 6.5 Administration d'un domaine Active Directory (BTS SIO, épreuve E5)
- Stratégies de mots de passe et de verrouillage des comptes, réplication, profils par défaut et itinérants, GPO, dossiers de travail, sauvegarde et restauration.

### 6.6 Autres travaux (non publiés par défaut)
Scénario Hôtel (MCD, Access), exercices JavaScript (chronomètre, classes `User`, consommation d'API), API Node.js/Express « adhérents » avec front Vue — à publier depuis l'admin si pertinent.

## 7. Contact
- Formulaire (nom, e-mail, message) → table `messages`, consultable dans l'admin.
- Liens : e-mail, GitHub, LinkedIn (**À COMPLÉTER**), téléchargement du CV.

## 8. Avis d'anciens collègues

Aucun avis dans le CV ni sur l'ancien site : **rien n'est inventé**. Le seed crée trois emplacements, affichés en pointillés sur l'accueil jusqu'à leur remplacement (admin → **Avis**).

| # | Citation | Nom | Rôle | Structure |
|---|---|---|---|---|
| 1 | **À COMPLÉTER** | **À COMPLÉTER** | **À COMPLÉTER** | — |
| 2 | **À COMPLÉTER** | **À COMPLÉTER** | **À COMPLÉTER** | — |
| 3 | **À COMPLÉTER** | **À COMPLÉTER** | **À COMPLÉTER** | — |

Pistes : tuteurs de stage (DGFiP de Mayotte, mairie de Mamoudzou), formateurs AloAlo Mayotte Compétence, coéquipiers de projet. Demander leur accord avant publication.

## 9. Mentions légales et confidentialité

Page `/mentions-legales` (lien dans le pied de page), rédigée d'après le fonctionnement réel du site. À compléter dans `app/(site)/mentions-legales/page.tsx` :

- **Adresse de l'hébergeur** (Vercel Inc.) : **À COMPLÉTER** au déploiement.
- **Région d'hébergement Supabase** (Project Settings → General) : **À COMPLÉTER**.
- **Durée de conservation des messages de contact** : **À COMPLÉTER** (ex. 12 mois, puis suppression depuis l'admin).
