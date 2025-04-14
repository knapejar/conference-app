declare module './announcements' {
  interface Announcement {
    id: number;
    title: string;
    message: string;
    date: string;
    category: string;
    type: string;
    read: boolean;
  }

  interface AnnouncementsState {
    announcements: Announcement[];
    loading: boolean;
    error: string | null;
  }

  interface AnnouncementsModule {
    namespaced: boolean;
    state: AnnouncementsState;
    mutations: {
      setAnnouncements(state: AnnouncementsState, announcements: Announcement[]): void;
      setLoading(state: AnnouncementsState, loading: boolean): void;
      setError(state: AnnouncementsState, error: string | null): void;
      markAnnouncementAsRead(state: AnnouncementsState, announcementId: number): void;
    };
    actions: {
      fetchAnnouncements({ commit }: { commit: Function }): Promise<void>;
      markAsRead({ commit }: { commit: Function }, announcementId: number): void;
    };
    getters: {
      getAnnouncements: (state: AnnouncementsState) => Announcement[];
      getUnreadAnnouncements: (state: AnnouncementsState) => Announcement[];
      isLoading: (state: AnnouncementsState) => boolean;
      getError: (state: AnnouncementsState) => string | null;
    };
  }

  const announcements: AnnouncementsModule;
  export default announcements;
} 