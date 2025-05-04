import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Habit, Challenge, MoodType } from '../types/types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId, completeHabit } from '../lib/habitUtils';

interface HabitContextType {
  habits: Habit[];
  challenges: Challenge[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completionRecords' | 'isArchived'>) => void;
  updateHabit: (updatedHabit: Habit) => void;
  deleteHabit: (habitId: string) => void;
  archiveHabit: (habitId: string) => void;
  markHabitComplete: (habitId: string, mood?: MoodType, note?: string) => void;
  getHabit: (habitId: string) => Habit | undefined;
  addChallenge: (challenge: Omit<Challenge, 'id' | 'currentProgress' | 'isCompleted'>) => void;
  updateChallenge: (updatedChallenge: Challenge) => void;
  deleteChallenge: (challengeId: string) => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider = ({ children }: { children: ReactNode }) => {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
  const [challenges, setChallenges] = useLocalStorage<Challenge[]>('challenges', []);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
        });
      }
    }
  }, []);

  // Schedule notifications for habits with reminders
  useEffect(() => {
    const scheduleNotifications = () => {
      habits.forEach(habit => {
        if (habit.reminder && habit.reminderTime && !habit.isArchived) {
          const [hours, minutes] = habit.reminderTime.split(':').map(Number);
          
          const now = new Date();
          const scheduledTime = new Date();
          scheduledTime.setHours(hours, minutes, 0, 0);
          
          // If the time has already passed today, schedule for tomorrow
          if (scheduledTime <= now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
          }
          
          const timeUntilNotification = scheduledTime.getTime() - now.getTime();
          
          setTimeout(() => {
            if (notificationPermission === 'granted') {
              new Notification(`Time for your habit: ${habit.name}`, {
                body: `Don't forget to complete this habit today!`,
                icon: '/favicon.ico'
              });
            }
          }, timeUntilNotification);
        }
      });
    };
    
    if (notificationPermission === 'granted') {
      scheduleNotifications();
    }
  }, [habits, notificationPermission]);

  const addHabit = (habit: Omit<Habit, 'id' | 'createdAt' | 'completionRecords' | 'isArchived'>) => {
    const newHabit: Habit = {
      ...habit,
      id: generateId(),
      createdAt: new Date().toISOString(),
      completionRecords: [],
      isArchived: false,
    };
    
    setHabits(prevHabits => [...prevHabits, newHabit]);
  };

  const updateHabit = (updatedHabit: Habit) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit.id === updatedHabit.id ? updatedHabit : habit
      )
    );
  };

  const deleteHabit = (habitId: string) => {
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
    
    // Also remove this habit from any challenges
    setChallenges(prevChallenges => 
      prevChallenges.map(challenge => ({
        ...challenge,
        habitIds: challenge.habitIds.filter(id => id !== habitId)
      }))
    );
  };

  const archiveHabit = (habitId: string) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit.id === habitId ? { ...habit, isArchived: true } : habit
      )
    );
  };

  const markHabitComplete = (habitId: string, mood?: MoodType, note?: string) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit.id === habitId ? completeHabit(habit, mood, note) : habit
      )
    );
    
    // Update challenges that include this habit
    setChallenges(prevChallenges => 
      prevChallenges.map(challenge => {
        if (challenge.habitIds.includes(habitId)) {
          const newProgress = challenge.currentProgress + 1;
          const isCompleted = newProgress >= challenge.goal;
          
          return {
            ...challenge,
            currentProgress: newProgress,
            isCompleted: isCompleted
          };
        }
        return challenge;
      })
    );
  };

  const getHabit = (habitId: string) => {
    return habits.find(habit => habit.id === habitId);
  };

  const addChallenge = (challenge: Omit<Challenge, 'id' | 'currentProgress' | 'isCompleted'>) => {
    const newChallenge: Challenge = {
      ...challenge,
      id: generateId(),
      currentProgress: 0,
      isCompleted: false
    };
    
    setChallenges(prevChallenges => [...prevChallenges, newChallenge]);
  };

  const updateChallenge = (updatedChallenge: Challenge) => {
    setChallenges(prevChallenges => 
      prevChallenges.map(challenge => 
        challenge.id === updatedChallenge.id ? updatedChallenge : challenge
      )
    );
  };

  const deleteChallenge = (challengeId: string) => {
    setChallenges(prevChallenges => 
      prevChallenges.filter(challenge => challenge.id !== challengeId)
    );
  };

  const contextValue: HabitContextType = {
    habits,
    challenges,
    addHabit,
    updateHabit,
    deleteHabit,
    archiveHabit,
    markHabitComplete,
    getHabit,
    addChallenge,
    updateChallenge,
    deleteChallenge
  };

  return (
    <HabitContext.Provider value={contextValue}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = (): HabitContextType => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};