import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#contenu"
        className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-full bg-ink px-5 py-3 text-bg transition-transform focus:translate-y-0"
      >
        Aller au contenu
      </a>
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main id="contenu" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
