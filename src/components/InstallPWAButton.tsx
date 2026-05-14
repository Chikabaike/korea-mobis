import { useEffect, useState } from "react";
import { Download } from "lucide-react";

/**
 * Floating "Install App" button.
 * - Listens for `beforeinstallprompt` (Chrome/Edge/Android)
 * - Auto-hides once installed or dismissed
 * - Respects standalone mode (already installed)
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const InstallPWAButton = () => {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Already installed -> never show
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari
      // @ts-expect-error - non-standard
      window.navigator.standalone === true;
    if (standalone) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    const onInstalled = () => {
      setVisible(false);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted" || outcome === "dismissed") {
      setVisible(false);
      setDeferred(null);
    }
  };

  if (!visible) return null;

  return (
    <button
      onClick={handleInstall}
      aria-label="Установить приложение"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-lg shadow-foreground/20 backdrop-blur transition-all duration-300 hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-bottom-4"
    >
      <Download className="h-4 w-4" />
      Установить приложение
    </button>
  );
};

export default InstallPWAButton;
