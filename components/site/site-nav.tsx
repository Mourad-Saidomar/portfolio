"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { buttonClasses } from "@/components/ui/button";
import { NAV_LINKS, isActive } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const MOBILE_LINKS = [...NAV_LINKS, { href: "/contact", label: "Contact" }] as const;

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Referme le menu après une navigation.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav aria-label="Navigation principale" className="hidden items-center md:flex">
        <ul className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative inline-flex min-h-11 items-center px-3 text-[0.9375rem] transition-colors duration-(--duration-fast)",
                    active ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {link.label}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-3 bottom-2 h-px origin-left bg-current transition-transform duration-(--duration-base) ease-(--ease-out)",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex items-center gap-1">
        <span className="hidden md:inline-flex">
          <ThemeToggle />
        </span>
        <Link
          href="/contact"
          aria-current={isActive(pathname, "/contact") ? "page" : undefined}
          className={buttonClasses("primary", "sm", "ml-1 px-4")}
        >
          <span className="md:hidden">Contact</span>
          <span className="hidden md:inline">Me contacter</span>
        </Link>
        <button
          ref={toggleRef}
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full text-ink hover:bg-sunken md:hidden"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
        </button>
      </div>

      {/* Portail : le backdrop-filter du header confinerait un enfant « fixed » à la hauteur du header. */}
      {open &&
        createPortal(
          <div
            id={panelId}
            className="fixed inset-x-0 top-(--header-h) bottom-0 z-40 overflow-y-auto bg-bg md:hidden"
          >
            <nav
              aria-label="Navigation mobile"
              className="container-page flex min-h-full flex-col pt-6 pb-10"
            >
              <ul className="border-t border-line">
                {MOBILE_LINKS.map((link, index) => (
                  <li key={link.href} className="border-b border-line">
                    <Link
                      href={link.href}
                      aria-current={isActive(pathname, link.href) ? "page" : undefined}
                      className="flex items-baseline justify-between py-4 font-display text-[2.25rem] leading-tight aria-[current=page]:text-accent"
                    >
                      {link.label}
                      <span className="font-mono text-meta text-subtle">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex items-center justify-between rounded-full border border-line bg-surface py-1 pr-1 pl-5">
                <span className="text-muted">Thème</span>
                <ThemeToggle />
              </div>
            </nav>
          </div>,
          document.body,
        )}
    </>
  );
}
