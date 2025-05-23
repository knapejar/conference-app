declare global {
    interface WindowEventMap {
      beforeinstallprompt: BeforeInstallPromptEvent;
    }
  }
  
  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: Array<string>;
    readonly userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;
    prompt(): Promise<void>;
  }