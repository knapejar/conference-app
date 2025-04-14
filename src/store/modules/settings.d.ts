declare module './settings' {
  interface UserSettings {
    name: string;
    email: string;
    phone: string;
    linkedinUrl: string;
  }

  interface SettingsState {
    userSettings: UserSettings;
  }

  interface SettingsModule {
    namespaced: boolean;
    state: SettingsState;
    mutations: {
      SET_USER_SETTINGS(state: SettingsState, settings: UserSettings): void;
      UPDATE_USER_SETTING(state: SettingsState, { key, value }: { key: keyof UserSettings; value: string }): void;
    };
    actions: {
      updateUserSettings({ commit }: { commit: Function }, settings: UserSettings): void;
      updateUserSetting({ commit, state }: { commit: Function; state: SettingsState }, { key, value }: { key: keyof UserSettings; value: string }): void;
      loadUserSettings({ commit }: { commit: Function }): void;
    };
    getters: {
      getUserSettings: (state: SettingsState) => UserSettings;
    };
  }

  const settings: SettingsModule;
  export default settings;
} 