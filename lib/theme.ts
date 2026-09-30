export type ThemePreference = "system" | "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

export const MOTION_STORAGE_KEY = "motion";

/**
 * Script inline exécuté avant le premier rendu : applique le thème mémorisé sans flash,
 * et la préférence « animations en pause » (WCAG 2.2.2).
 */
export const THEME_SCRIPT = `(function(){try{var d=document.documentElement,t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark"){d.dataset.theme=t}if(localStorage.getItem("${MOTION_STORAGE_KEY}")==="paused"){d.dataset.motion="paused"}}catch(e){}})();`;
