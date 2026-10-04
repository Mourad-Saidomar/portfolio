export const MOTION_STORAGE_KEY = "motion";

/**
 * Script inline exécuté avant le premier rendu : applique la préférence
 * « animations en pause » (WCAG 2.2.2) sans attendre l'hydratation.
 */
export const MOTION_SCRIPT = `(function(){try{if(localStorage.getItem("${MOTION_STORAGE_KEY}")==="paused"){document.documentElement.dataset.motion="paused"}}catch(e){}})();`;
