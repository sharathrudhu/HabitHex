import { Habit, CompletionRecord } from '@/types/types';
import { format, subDays, isToday, isSameDay, parseISO, differenceInDays } from 'date-fns';

// Calculate current streak for a habit
export const calculateStreak = (habit: Habit): number => {
  const sortedRecords = [...habit.completionRecords]
    .filter(record => record.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sortedRecords.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  
  // Check if completed today, if not, start checking from yesterday
  const lastCompletionDate = parseISO(sortedRecords[0].date);
  if (!isToday(lastCompletionDate)) {
    currentDate = subDays(currentDate, 1);
  }

  for (let i = 0; i < sortedRecords.length; i++) {
    const recordDate = parseISO(sortedRecords[i].date);
    
    if (isSameDay(recordDate, currentDate)) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else {
      // Check if only one day was missed
      const daysMissed = differenceInDays(currentDate, recordDate);
      if (daysMissed > 1) break;
      
      // Skip the missed day and continue counting
      streak++;
      currentDate = subDays(recordDate, 1);
    }
  }

  return streak;
};

// Check if a habit is completed for the current day
export const isCompletedToday = (habit: Habit): boolean => {
  const today = format(new Date(), 'yyyy-MM-dd');
  return habit.completionRecords.some(record => 
    record.date.startsWith(today) && record.completed
  );
};

// Mark a habit as completed for the current day
export const completeHabit = (
  habit: Habit, 
  mood?: CompletionRecord['mood'], 
  note?: string
): Habit => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const newRecord: CompletionRecord = {
    date: today,
    completed: true,
    mood,
    note
  };

  // Remove any existing record for today
  const filteredRecords = habit.completionRecords.filter(
    record => !record.date.startsWith(today)
  );

  return {
    ...habit,
    completionRecords: [...filteredRecords, newRecord]
  };
};

// Get completion percentage for last 7 days
export const getWeeklyCompletionRate = (habit: Habit): number => {
  let completedDays = 0;
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const checkDate = format(subDays(today, i), 'yyyy-MM-dd');
    const wasCompleted = habit.completionRecords.some(
      record => record.date.startsWith(checkDate) && record.completed
    );
    if (wasCompleted) completedDays++;
  }
  
  return Math.round((completedDays / 7) * 100);
};

// Generate a unique ID for new habits
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};