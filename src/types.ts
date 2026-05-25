export type HairAngle = 'crown' | 'hairline' | 'left' | 'right';

export interface PhotoEntry {
  id: string;
  date: string; // YYYY-MM-DD
  angle: HairAngle;
  imageUrl: string;
  isCustom?: boolean; // added by user
}

export type HairStatus = 'normal' | 'thin-mild' | 'thin-heavy' | 'crown-thin' | 'm-shape';
export type ScalpType = 'oily' | 'dry' | 'normal';

export interface OnboardingData {
  hairStatus: HairStatus;
  scalpType: ScalpType;
  treatments: string[]; // e.g., 'Minoxidil', 'Finasteride', 'Anti-hair loss shampoo', 'Other'
}

export interface User {
  name: string;
  email: string;
  age: number;
  gender: string;
  isOnboarded: boolean;
  onboardingData?: OnboardingData;
}

export interface RoutineTask {
  id: string;
  name: string;
  category: 'wash' | 'topical' | 'pill' | 'serum' | 'other';
  frequency: 'daily' | 'weekly' | 'every-two-days';
  timeOfDay?: 'morning' | 'evening' | 'any';
}

export interface RoutineLog {
  date: string; // YYYY-MM-DD
  completedTasks: string[]; // array of RoutineTask.id
}

export interface ReminderSetting {
  id: string;
  type: 'photo' | 'treatment';
  title: string;
  frequency: 'daily' | 'weekly' | 'biweekly';
  time: string; // HH:MM
  enabled: boolean;
}
