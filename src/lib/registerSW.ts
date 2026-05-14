/**
 * Service worker registration with safety guards.
 * - Skips registration inside iframes (Lovable editor preview)
 * - Skips on lovable preview/sandbox hosts
 * - Unregisters any pre-existing SW in those contexts to avoid stale cache
 */
export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  const inIframe = (() => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  })();

  const host = window.location.hostname;
  const isPreviewHost =
    host.includes("lovableproject.com") ||
    host.includes("lovable.app") ||
    host === "localhost" ||
    host === "127.0.0.1";

  if (inIframe || isPreviewHost) {
    // Clean up any previously-registered SW in dev/preview
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((r) => r.unregister());
    });
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .catch((err) => console.warn("SW registration failed:", err));
  });
}
