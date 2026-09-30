/**
 * Contenu initial du portfolio — version machine de CONTENT.md.
 * Utilisé par `npm run db:seed` et par le mode démo (DEMO_MODE=1).
 * Les chemins d'images sont relatifs au bucket « media » (ex. « profile/portrait.webp »)
 * et correspondent aux fichiers de public/demo/media/.
 */
import { rt } from "../../lib/rich-text";
import type { TablesInsert } from "../../lib/supabase/database.types";

export const TODO = "À COMPLÉTER";

/** UUID déterministes : le seed est rejouable sans créer de doublons. */
const id = (group: number, n: number) =>
  `00000000-0000-4000-8000-${String(group).padStart(6, "0")}${String(n).padStart(6, "0")}`;

// ─── Profil ──────────────────────────────────────────────────────────

export const profile: TablesInsert<"profile"> = {
  id: 1,
  full_name: "Mourad Saidomar",
  headline: "Développeur web & web mobile",
  tagline: "Je conçois des interfaces web claires, rapides et accessibles — de la maquette à la base de données.",
  intro:
    "Développeur web & web mobile en formation à Mayotte, avec un socle solide en systèmes et réseaux. Je recherche un stage pour construire des produits utiles au sein d'une équipe exigeante.",
  bio: [
    "Passionné par le développement web, je suis actuellement en formation Développeur Web et Web Mobile (DWWM) chez AloAlo Mayotte Compétence. J'y travaille le front-end — HTML, CSS, JavaScript, Vue.js — et le back-end — PHP, Node.js et SQL.",
    "Avant cela, un BTS SIO option SISR m'a donné de solides bases en administration systèmes, réseaux et cybersécurité, consolidées par deux stages dans le service public, à la DGFiP et à la mairie de Mamoudzou.",
    "Rigoureux et curieux, je recherche un stage pour mettre en pratique mes acquis et progresser au sein d'une équipe professionnelle.",
  ].join("\n\n"),
  availability: `Disponible pour un stage — dates : ${TODO}`,
  location: "Mamoudzou, Mayotte",
  email: "mourad.saidomar.sio@gmail.com",
  phone: "06 39 71 25 73",
  show_phone: false,
  photo_path: "profile/portrait.webp",
  photo_alt: "Portrait de Mourad Saidomar, souriant, en polo sombre sur fond clair",
  cv_path: null,
  github_url: "https://github.com/mourad-saidomar",
  linkedin_url: null,
  website_url: null,
  core_values: [
    { title: "Rigueur", description: "Un code lisible, versionné avec Git et documenté, pour que l'équipe puisse s'en emparer." },
    { title: "Curiosité", description: "Apprendre vite et comprendre ce qui se passe sous le capot, du navigateur jusqu'au réseau." },
    { title: "Sens du service", description: "Issu du support utilisateur : comprendre le besoin réel avant d'écrire la moindre ligne." },
  ],
  differentiators: [
    {
      title: "Double culture infra + dev",
      description:
        "Je comprends ce qui se passe entre le navigateur, le serveur et le réseau : DNS, DHCP, proxy, Active Directory.",
    },
    {
      title: "Expérience terrain",
      description:
        "Support utilisateur et gestion de parc en administration publique (DGFiP, mairie de Mamoudzou).",
    },
    {
      title: "Ancrage local",
      description: "Je conçois pour les usages de Mayotte, à l'image de Covoit'May, plateforme de covoiturage local.",
    },
  ],
  languages: [
    { name: "Français", level: "Courant" },
    { name: "Mahorais (shimaoré)", level: `Intermédiaire — ${TODO} (à confirmer)` },
    { name: "Anglais", level: "Intermédiaire — test TOEIC® Listening & Reading" },
  ],
  interests: ["Musique (instrument)", "Programmation", "Lecture"],
};

// ─── Parcours ────────────────────────────────────────────────────────

export const timeline: TablesInsert<"timeline_entries">[] = [
  {
    id: id(1, 1),
    kind: "education",
    title: "Titre professionnel Développeur Web et Web Mobile (DWWM)",
    organization: "AloAlo Mayotte Compétence",
    location: "Doujani, Mayotte",
    start_date: null,
    is_current: true,
    date_precision: "month",
    description: `Formation en cours — date de début : ${TODO}. Projet fil rouge : Covoit'May.`,
    highlights: [
      "Front-end : HTML, CSS, JavaScript, Vue.js",
      "Back-end : PHP, Node.js, SQL",
      "Conception : cahier des charges, modélisation Merise",
    ],
    position: 0,
  },
  {
    id: id(1, 2),
    kind: "experience",
    title: "Stage — Technicien systèmes et réseaux",
    organization: "Direction générale des Finances publiques (DGFiP) de Mayotte",
    location: "Mamoudzou",
    start_date: "2024-01-01",
    end_date: "2024-02-01",
    date_precision: "month",
    description: "Maintenance informatique et administration du réseau.",
    highlights: ["Assistance utilisateur et résolution de problèmes", "Gestion du parc informatique", "Administration du réseau"],
    position: 1,
  },
  {
    id: id(1, 3),
    kind: "education",
    title: "BTS Services informatiques aux organisations — option SISR",
    organization: "Lycée Younoussa Bamana",
    location: "Mamoudzou",
    start_date: "2023-01-01",
    end_date: "2024-01-01",
    date_precision: "year",
    description: `Solutions d'infrastructure, systèmes et réseaux. Épreuves E4 et E5. Obtention : ${TODO}.`,
    highlights: ["Administration réseau", "Administration système", "Cybersécurité"],
    position: 2,
  },
  {
    id: id(1, 4),
    kind: "education",
    title: "Certification Pix",
    organization: "Lycée Younoussa Bamana",
    location: "Mamoudzou",
    start_date: "2023-01-01",
    end_date: "2024-01-01",
    date_precision: "year",
    description: "127 points Pix — niveau 7.",
    highlights: [],
    position: 3,
  },
  {
    id: id(1, 5),
    kind: "experience",
    title: "Stage — Technicien systèmes et réseaux",
    organization: "Direction de l'E-administration et de la Modernisation des Services, Mairie de Mamoudzou",
    location: "Mamoudzou",
    start_date: "2023-05-01",
    end_date: "2023-06-01",
    date_precision: "month",
    description: "Maintenance informatique au service des agents de la mairie.",
    highlights: ["Assistance utilisateur et résolution de problèmes", "Support matériel et logiciel"],
    position: 4,
  },
  {
    id: id(1, 6),
    kind: "education",
    title: "Baccalauréat général — mention Assez bien",
    organization: "Lycée des Lumières",
    location: "Kaweni",
    start_date: "2021-01-01",
    end_date: "2022-01-01",
    date_precision: "year",
    description: "Spécialités Physique-Chimie et Numérique et Sciences Informatiques (NSI).",
    highlights: [],
    position: 5,
  },
  {
    id: id(1, 7),
    kind: "education",
    title: "Test TOEIC® Listening and Reading",
    organization: "Lycée des Lumières",
    location: "Kaweni",
    start_date: "2021-01-01",
    end_date: "2022-01-01",
    date_precision: "year",
    description: `Score : ${TODO}.`,
    highlights: [],
    position: 6,
  },
  {
    id: id(1, 8),
    kind: "experience",
    title: "Stage d'observation",
    organization: "MIS — Mahorais Informatique Service",
    location: "Kaweni",
    start_date: "2018-01-01",
    end_date: "2019-01-01",
    date_precision: "year",
    description: "Découverte des métiers de la maintenance informatique.",
    highlights: ["Remplacement de composants", "Diagnostic des problèmes de démarrage"],
    position: 7,
  },
  {
    id: id(1, 9),
    kind: "education",
    title: "Diplôme national du brevet — mention Très bien",
    organization: "Collège de Kwalé",
    location: "Tsoundzou 1",
    start_date: "2018-01-01",
    end_date: "2019-01-01",
    date_precision: "year",
    description: "",
    highlights: [],
    position: 8,
  },
  {
    id: id(1, 10),
    kind: "experience",
    title: `Stage en entreprise (DWWM) — ${TODO}`,
    organization: TODO,
    location: TODO,
    start_date: null,
    is_current: false,
    date_precision: "month",
    description: `Entreprise, dates et missions : ${TODO}. Entrée masquée tant qu'elle n'est pas complétée.`,
    highlights: [],
    published: false,
    position: 9,
  },
];

// ─── Compétences ─────────────────────────────────────────────────────

type SeedCategory = TablesInsert<"skill_categories"> & { id: string; skills: string[] };

export const skillCategories: SeedCategory[] = [
  {
    id: id(2, 1),
    name: "Front-end",
    description: "Interfaces responsives, accessibles et dynamiques.",
    skills: ["HTML5 sémantique", "CSS3 & responsive", "JavaScript (DOM, interactions)", "Vue.js 3", "Vue Router & Pinia", "Bootstrap", "Intégration de maquettes"],
  },
  {
    id: id(2, 2),
    name: "Back-end & données",
    description: "API, bases de données relationnelles et modélisation.",
    skills: ["Node.js & Express", "PHP (en formation)", "SQL / MySQL", "Vues & transactions SQL", "Merise (MCD, MLD, MPD)", "API REST"],
  },
  {
    id: id(2, 3),
    name: "Outils & méthodes",
    description: "Travailler proprement, en équipe, de la spécification à la livraison.",
    skills: ["Git & GitHub", "Visual Studio Code", "Vite", "WordPress", "Cahier des charges", "Règles de gestion"],
  },
  {
    id: id(2, 4),
    name: "Systèmes & réseaux",
    description: "Le socle BTS SIO SISR : comprendre l'infrastructure qui fait tourner le web.",
    skills: ["Windows Server (AD DS, DNS, DHCP, GPO)", "Linux (Debian, Ubuntu, CentOS)", "Cisco Packet Tracer (VLAN, routage)", "Proxy Squid, SquidGuard, ClamAV", "GLPI & OCS Inventory", "VirtualBox", "SSH / PuTTY", "PowerShell", "Python"],
  },
  {
    id: id(2, 5),
    name: "Savoir-être",
    description: "Ce que mes stages ont confirmé.",
    skills: ["Rigueur", "Curiosité", "Autonomie", "Travail en équipe", "Sens du service", "Pédagogie avec les utilisateurs"],
  },
];

// ─── Projets ─────────────────────────────────────────────────────────

type SeedProject = TablesInsert<"projects"> & {
  id: string;
  images: Omit<TablesInsert<"project_images">, "project_id">[];
};

export const projects: SeedProject[] = [
  {
    id: id(3, 1),
    slug: "covoit-may",
    title: "Covoit'May",
    summary: "Plateforme de covoiturage pensée pour les trajets courts et récurrents de Mayotte — projet fil rouge du titre DWWM.",
    period: "2026 — en cours",
    cover_path: "projects/covoit-may/cover.webp",
    cover_alt: "Logo de Covoit'May : les lettres C et M avec une voiture",
    context: rt.doc(
      rt.p("Mayotte dispose d'un réseau de transport en commun limité et d'un fort tissu social de proximité. Les plateformes de covoiturage existantes sont pensées pour les longues distances de métropole, pas pour les trajets domicile-travail, marché ou école de l'île."),
    ),
    problem: rt.doc(
      rt.ul([
        "Il est difficile de trouver un covoitureur sur un trajet précis.",
        "Le manque de confiance envers les inconnus freine l'usage.",
        "Aucune visibilité sur la ponctualité ou la fiabilité des conducteurs.",
        "La coordination des horaires reste compliquée et le coût du transport élevé.",
      ]),
    ),
    role: rt.doc(
      rt.p("Conception complète du projet : rédaction du cahier des charges (version 2.1, septembre 2026), identification des profils — visiteur, passager, conducteur, administrateur —, expression des besoins fonctionnels et non fonctionnels, règles de gestion et modèle de données."),
    ),
    solution: rt.doc(
      rt.p("Une plateforme de mise en relation pour les trajets courts, organisée en blocs fonctionnels :"),
      rt.ul([
        "Comptes et authentification, profils vérifiés par l'administrateur.",
        "Recherche de trajets par départ, arrivée, date et filtres (heure, prix, places, détour).",
        "Publication de trajets par les conducteurs.",
        "Réservation et paiement en ligne (carte et mobile money).",
        "Messagerie, avis, alertes et gestion des litiges.",
      ]),
      rt.p(`Stack de développement : ${TODO}.`),
    ),
    results: rt.doc(rt.p(`${TODO} : état d'avancement, démo et premiers retours utilisateurs.`)),
    stack: ["Merise", "SQL", "Cahier des charges"],
    demo_url: null,
    repo_url: null,
    status: "published",
    featured: true,
    position: 0,
    images: [
      {
        path: "projects/covoit-may/mcd.webp",
        alt: "Modèle conceptuel de données de Covoit'May : utilisateur, véhicule, trajet, réservation, paiement, avis, administrateur",
        caption: "MCD — les entités au cœur de la plateforme.",
        width: 741,
        height: 445,
        position: 0,
      },
    ],
  },
  {
    id: id(3, 2),
    slug: "dwwm-academy",
    title: "DWWM Academy",
    summary: "Catalogue de formations en Vue 3 : fiches détaillées, favoris persistants et formulaire de contact.",
    period: "2026",
    cover_path: "projects/dwwm-academy/accueil.webp",
    cover_alt: "Page d'accueil de DWWM Academy : titre « Apprends à coder, lance ta carrière » et grille de technologies",
    context: rt.doc(rt.p("Évaluation front-end de la formation DWWM : réaliser une application monopage complète pour un centre de formation fictif.")),
    problem: rt.doc(rt.p("Présenter un catalogue de formations facile à parcourir, permettre de consulter le détail d'une formation, de la garder en favori et de contacter le centre.")),
    role: rt.doc(rt.p("Développement front-end complet, de l'architecture des composants au déploiement.")),
    solution: rt.doc(
      rt.ul([
        "Application monopage Vue 3 construite avec Vite.",
        "Routage Vue Router : accueil, catalogue, fiche détaillée, favoris et contact.",
        "Store Pinia pour les favoris, partagé entre les vues.",
        "Composants réutilisables : cartes de formation, barre de navigation, pied de page.",
      ]),
    ),
    results: rt.doc(
      rt.p("Application déployée et consultable en ligne sur GitHub Pages."),
      rt.p(`Indicateurs (performance, retours) : ${TODO}.`),
    ),
    stack: ["Vue 3", "Vite", "Vue Router", "Pinia", "Bootstrap"],
    demo_url: "https://mourad-saidomar.github.io/dwwm-academy/",
    repo_url: null,
    status: "published",
    featured: true,
    position: 1,
    images: [
      {
        path: "projects/dwwm-academy/catalogue.webp",
        alt: "Page catalogue de DWWM Academy listant les formations sous forme de cartes",
        caption: "Le catalogue des formations.",
        width: 1440,
        height: 900,
        position: 0,
      },
    ],
  },
  {
    id: id(3, 3),
    slug: "move-and-go",
    title: "Move&Go",
    summary: "Base de données d'un loueur de véhicules multi-agences : modélisation Merise et exploitation MySQL.",
    period: "2026",
    cover_path: "projects/move-and-go/mcd.webp",
    cover_alt: "Modèle conceptuel de données Move&Go : agence, véhicule, client, réservation, option, paiement, entretien",
    context: rt.doc(rt.p("Évaluation « bases de données » de la formation DWWM.")),
    problem: rt.doc(rt.p("Modéliser et exploiter les données d'un loueur de véhicules présent dans plusieurs agences : clients, véhicules, réservations, options, paiements et entretiens.")),
    role: rt.doc(rt.p("Analyse et réalisation complètes, de l'expression des règles de gestion aux requêtes de production.")),
    solution: rt.doc(
      rt.ul([
        "Règles de gestion et dictionnaire de données.",
        "Modèles conceptuel, logique et physique (MCD, MLD, MPD).",
        "Base MySQL de 9 tables avec contraintes d'intégrité et jeu d'insertions.",
        "Requêtes d'exploitation, 3 vues métier (réservations détaillées, suivi des paiements, véhicules par agence) et transactions.",
      ]),
    ),
    results: rt.doc(rt.p(`${TODO} : note, retours du jury ou enseignements.`)),
    stack: ["Merise", "MySQL", "SQL"],
    demo_url: null,
    repo_url: null,
    status: "published",
    featured: true,
    position: 2,
    images: [
      { path: "projects/move-and-go/mld.webp", alt: "Modèle logique de données Move&Go", caption: "MLD.", width: 1350, height: 641, position: 0 },
      { path: "projects/move-and-go/mpd.webp", alt: "Modèle physique de données Move&Go", caption: "MPD — schéma MySQL.", width: 1015, height: 847, position: 1 },
    ],
  },
  {
    id: id(3, 4),
    slug: "proxy-squid-ad-ds",
    title: "Accès Internet sécurisé par proxy",
    summary: "Proxy Squid avec filtrage d'URL, antivirus centralisé et authentification Active Directory — épreuve E5 du BTS SIO.",
    period: "2023 – 2024",
    cover_path: null,
    cover_alt: "",
    context: rt.doc(rt.p("Épreuve E5 du BTS SIO SISR : mettre en œuvre un accès à Internet sécurisé au sein d'un domaine AD DS.")),
    problem: rt.doc(rt.p("Contrôler et sécuriser l'accès au web des postes d'un domaine, sans configuration manuelle poste par poste.")),
    role: rt.doc(rt.p("Conception, installation, configuration et rédaction de la procédure.")),
    solution: rt.doc(
      rt.ul([
        "Proxy Squid : interfaces, ACL, port d'écoute.",
        "Filtrage d'URL avec SquidGuard.",
        "Antivirus centralisé avec ClamAV.",
        "Authentification des utilisateurs via LDAP (AD DS).",
        "GPO Windows Server pour configurer le proxy des postes clients.",
      ]),
    ),
    results: rt.doc(rt.p(`Procédure et fiche descriptive : ${TODO} (à téléverser).`)),
    stack: ["Squid", "SquidGuard", "ClamAV", "Active Directory", "GPO", "Linux"],
    status: "published",
    featured: false,
    position: 3,
    images: [],
  },
  {
    id: id(3, 5),
    slug: "administration-active-directory",
    title: "Administration d'un domaine Active Directory",
    summary: "Stratégies de sécurité, réplication, profils itinérants, GPO et sauvegarde — épreuve E5 du BTS SIO.",
    period: "2023 – 2024",
    cover_path: null,
    cover_alt: "",
    context: rt.doc(rt.p("Épreuve E5 du BTS SIO SISR : administrer un domaine Windows Server.")),
    problem: rt.doc(rt.p("Garantir la sécurité des comptes, la continuité de service et une expérience cohérente pour les utilisateurs du domaine.")),
    role: rt.doc(rt.p("Mise en œuvre complète et rédaction de la procédure.")),
    solution: rt.doc(
      rt.ul([
        "Stratégies de mots de passe et de verrouillage des comptes.",
        "Réplication entre contrôleurs de domaine.",
        "Profils par défaut et itinérants.",
        "Création de GPO et gestion des dossiers de travail.",
        "Sauvegarde et restauration.",
      ]),
    ),
    results: rt.doc(rt.p(`Procédure et fiche descriptive : ${TODO} (à téléverser).`)),
    stack: ["Windows Server", "AD DS", "GPO"],
    status: "published",
    featured: false,
    position: 4,
    images: [],
  },
];
