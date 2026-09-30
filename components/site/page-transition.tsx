import { ViewTransition, type ReactNode } from "react";

/** Transition de page (API View Transitions) : fondu + légère montée ; le header reste fixe. */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      {children}
    </ViewTransition>
  );
}
