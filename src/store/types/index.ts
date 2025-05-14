import { Question, Block, Person, Conference, Announcement } from '@/types/api';

export interface RootState {
  questions: QuestionsState;
  settings: SettingsState;
  conference: ConferenceState;
  presentations: PresentationsState;
  people: PeopleState;
  announcements: AnnouncementsState;
  admin: AdminState;
  toast: ToastState;
  notifications: NotificationsState;
}

export interface QuestionsState {
  likedQuestions: Set<string>;
  questions: { [key: string]: Question[] };
  currentPresentationId: string | null;
  myQuestions: Set<string>;
}

export interface SettingsState {
  userSettings: {
    name: string;
    email: string;
    phone: string;
    linkedinUrl: string;
  };
  authorToken: string | null;
}

export interface ConferenceState {
  name: string;
  description: string;
  welcomeImage: string;
  isLoggedIn: boolean;
  userId: string | null;
  loading: boolean;
  error: string | null;
}

export interface PresentationsState {
  blocks: Block[];
  presentations: any[];
  starredPresentations: Set<string>;
  loading: boolean;
  error: string | null;
}

export interface PeopleState {
  people: Person[];
  loading: boolean;
  error: string | null;
}

export interface AnnouncementsState {
  announcements: Announcement[];
  readNotifications: string[];
  loading: boolean;
  error: string | null;
}

export interface AdminState {
  isAuthenticated: boolean;
  password: string | null;
  loading: boolean;
  error: string | null;
}

export interface ToastState {
  offlineWarning: boolean;
  errorOccurred: boolean;
}

export interface NotificationPayload {
  title: string;
  options: NotificationOptions;
}

export interface NotificationState {
  permission: NotificationPermission;
  notifications: Array<NotificationPayload & { timestamp: Date }>;
  isEnabled: boolean;
}

export interface NotificationsState extends NotificationState {
  deviceToken: string | null;
  loading: boolean;
  error: string | null;
} 