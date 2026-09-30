export type ThemePreference = "system" | "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

/**
 * Script inline exécuté avant le premier rendu : applique le thème mémorisé
 * sans flash. « system » (ou absence de valeur) laisse `prefers-color-scheme` décider.
 */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t}}catch(e){}})();`;
