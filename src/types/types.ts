export type HabitFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';

export type HabitCategory = 
  | 'health' 
  | 'fitness' 
  | 'productivity' 
  | 'mindfulness' 
  | 'learning'
  | 'social'
  | 'finance'
  | 'custom';

export type MoodType = 'great' | 'good' | 'neutral' | 'bad' | 'terrible';

export interface CompletionRecord {
  date: string;
  completed: boolean;
  mood?: MoodType;
  note?: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  customDays?: number[];
  timeOfDay?: string;
  color?: string;
  icon?: string;
  reminder: boolean;
  reminderTime?: string;
  createdAt: string;
  completionRecords: CompletionRecord[];
  isArchived: boolean;
  tags: string[];
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  habitIds: string[];
  startDate: string;
  endDate: string;
  goal: number;
  currentProgress: number;
  isCompleted: boolean;
}

export type AppView = 
  | 'dashboard' 
  | 'habit-detail' 
  | 'add-habit' 
  | 'edit-habit'
  | 'challenges'
  | 'add-challenge'
  | 'settings';

export interface ViewProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedHabit?: Habit;
  setSelectedHabit?: (habit: Habit | undefined) => void;
}