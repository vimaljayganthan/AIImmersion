import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AiPreferences {
  responseStyle: 'concise' | 'balanced' | 'detailed';
  askFollowUp: boolean;
  showEvidence: boolean;
  showConfidence: boolean;
  considerServiceHistory: boolean;
  considerMileage: boolean;
  safetyWarnings: boolean;
}

export interface NotificationPreferences {
  serviceReminders: boolean;
  diagnosisAlerts: boolean;
  bookingUpdates: boolean;
  maintenanceAlerts: boolean;
  systemNotifications: boolean;
}

export interface AppearancePreferences {
  theme: 'light' | 'system' | 'dark';
  accentColor: 'blue' | 'cyan' | 'teal' | 'indigo';
  density: 'comfortable' | 'compact';
}

export interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  language: string;
  workshopName?: string;
  specialization?: string;
  experienceYears?: number;
}

export interface SettingsState {
  profile: UserProfileData;
  aiPreferences: AiPreferences;
  notifications: NotificationPreferences;
  appearance: AppearancePreferences;
  updateProfile: (data: Partial<UserProfileData>) => void;
  updateAiPreferences: (data: Partial<AiPreferences>) => void;
  updateNotifications: (data: Partial<NotificationPreferences>) => void;
  updateAppearance: (data: Partial<AppearancePreferences>) => void;
  resetDefaults: () => void;
}

const DEFAULT_PROFILE: UserProfileData = {
  name: 'Alex Sharma',
  email: 'alex.sharma@driveiq.ai',
  phone: '+91 98765 43210',
  location: 'Indiranagar, Bengaluru, KA',
  language: 'English (India)',
  workshopName: 'Kumar Motors Workshop',
  specialization: 'Multi-brand Two-Wheelers & Hybrid Powertrains',
  experienceYears: 12,
};

const DEFAULT_AI_PREFERENCES: AiPreferences = {
  responseStyle: 'balanced',
  askFollowUp: true,
  showEvidence: true,
  showConfidence: true,
  considerServiceHistory: true,
  considerMileage: true,
  safetyWarnings: true,
};

const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
  serviceReminders: true,
  diagnosisAlerts: true,
  bookingUpdates: true,
  maintenanceAlerts: true,
  systemNotifications: false,
};

const DEFAULT_APPEARANCE: AppearancePreferences = {
  theme: 'light',
  accentColor: 'blue',
  density: 'comfortable',
};

const SettingsContext = createContext<SettingsState | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfileData>(() => {
    try {
      const saved = localStorage.getItem('autosense_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [aiPreferences, setAiPreferences] = useState<AiPreferences>(() => {
    try {
      const saved = localStorage.getItem('autosense_ai_prefs');
      return saved ? JSON.parse(saved) : DEFAULT_AI_PREFERENCES;
    } catch {
      return DEFAULT_AI_PREFERENCES;
    }
  });

  const [notifications, setNotifications] = useState<NotificationPreferences>(() => {
    try {
      const saved = localStorage.getItem('autosense_notif_prefs');
      return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  const [appearance, setAppearance] = useState<AppearancePreferences>(() => {
    try {
      const saved = localStorage.getItem('autosense_appearance');
      return saved ? JSON.parse(saved) : DEFAULT_APPEARANCE;
    } catch {
      return DEFAULT_APPEARANCE;
    }
  });

  useEffect(() => {
    localStorage.setItem('autosense_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('autosense_ai_prefs', JSON.stringify(aiPreferences));
  }, [aiPreferences]);

  useEffect(() => {
    localStorage.setItem('autosense_notif_prefs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('autosense_appearance', JSON.stringify(appearance));
  }, [appearance]);

  const updateProfile = (data: Partial<UserProfileData>) => {
    setProfile((prev) => ({ ...prev, ...data }));
  };

  const updateAiPreferences = (data: Partial<AiPreferences>) => {
    setAiPreferences((prev) => ({ ...prev, ...data }));
  };

  const updateNotifications = (data: Partial<NotificationPreferences>) => {
    setNotifications((prev) => ({ ...prev, ...data }));
  };

  const updateAppearance = (data: Partial<AppearancePreferences>) => {
    setAppearance((prev) => ({ ...prev, ...data }));
  };

  const resetDefaults = () => {
    setProfile(DEFAULT_PROFILE);
    setAiPreferences(DEFAULT_AI_PREFERENCES);
    setNotifications(DEFAULT_NOTIFICATIONS);
    setAppearance(DEFAULT_APPEARANCE);
  };

  return (
    <SettingsContext.Provider
      value={{
        profile,
        aiPreferences,
        notifications,
        appearance,
        updateProfile,
        updateAiPreferences,
        updateNotifications,
        updateAppearance,
        resetDefaults,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsState => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
};
