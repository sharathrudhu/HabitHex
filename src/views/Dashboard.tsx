import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Habit, AppView } from '@/types/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HabitCard } from '@/components/habits/HabitCard';
import { useHabits } from '@/contexts/HabitContext';

interface DashboardProps {
  setCurrentView: (view: AppView) => void;
  setSelectedHabit: (habit: Habit | undefined) => void;
}

export function Dashboard({ setCurrentView, setSelectedHabit }: DashboardProps) {
  const { habits } = useHabits();
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Filter active (non-archived) habits
  const activeHabits = habits.filter(habit => !habit.isArchived);
  
  // Filter by category if a category tab is selected
  const filteredHabits = activeTab === 'all' 
    ? activeHabits 
    : activeHabits.filter(habit => habit.category === activeTab);
  
  // Get unique categories from habits
  const categories = Array.from(
    new Set(activeHabits.map(habit => habit.category))
  );
  
  const handleAddHabit = () => {
    setCurrentView('add-habit');
  };
  
  return (
    <div className="container mx-auto p-4 pt-20 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button 
          onClick={handleAddHabit}
          className="gap-1 pulse-animation"
        >
          <Plus className="h-5 w-5" />
          <span>Add Habit</span>
        </Button>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <ScrollArea className="w-full">
          <div className="flex p-1">
            <TabsList className="flex flex-nowrap min-w-max overflow-visible">
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </ScrollArea>
        
        {activeTab === 'all' && (
          <TabsContent value="all">
            {filteredHabits.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHabits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    setCurrentView={setCurrentView}
                    setSelectedHabit={setSelectedHabit}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No habits yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start tracking your habits by adding your first one
                </p>
                <Button onClick={handleAddHabit}>
                  <Plus className="h-5 w-5 mr-1" />
                  Add Your First Habit
                </Button>
              </div>
            )}
          </TabsContent>
        )}
        
        {categories.map(category => (
          <TabsContent key={category} value={category}>
            {filteredHabits.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHabits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    setCurrentView={setCurrentView}
                    setSelectedHabit={setSelectedHabit}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No {category} habits</h3>
                <p className="text-muted-foreground mb-6">
                  Create a new habit in this category
                </p>
                <Button onClick={handleAddHabit}>
                  <Plus className="h-5 w-5 mr-1" />
                  Add Habit
                </Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}