import { useState } from 'react';
import { Check, AlarmClock, MoreHorizontal, Smile, Frown, Meh } from 'lucide-react';
import { Habit, MoodType, AppView } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { calculateStreak, isCompletedToday, getWeeklyCompletionRate } from '@/utils/habitUtils';
import { cn } from '@/lib/utils';
import { useHabits } from '@/contexts/HabitContext';

interface HabitCardProps {
  habit: Habit;
  setCurrentView: (view: AppView) => void;
  setSelectedHabit?: (habit: Habit) => void;
}

export function HabitCard({ habit, setCurrentView, setSelectedHabit }: HabitCardProps) {
  const { markHabitComplete, deleteHabit, archiveHabit } = useHabits();
  const [showMoodDialog, setShowMoodDialog] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodType | undefined>(undefined);
  const [note, setNote] = useState('');
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  
  const streak = calculateStreak(habit);
  const completedToday = isCompletedToday(habit);
  const weeklyRate = getWeeklyCompletionRate(habit);
  
  const getCategoryColor = () => {
    switch(habit.category) {
      case 'health': return 'bg-emerald-500';
      case 'fitness': return 'bg-blue-500';
      case 'productivity': return 'bg-amber-500';
      case 'mindfulness': return 'bg-purple-500';
      case 'learning': return 'bg-cyan-500';
      case 'social': return 'bg-pink-500';
      case 'finance': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  const handleComplete = () => {
    if (completedToday) return;
    setShowMoodDialog(true);
  };
  
  const completeWithMood = () => {
    markHabitComplete(habit.id, selectedMood, note);
    setShowMoodDialog(false);
    setSelectedMood(undefined);
    setNote('');
    
    // Show completion animation
    setShowCompletionAnimation(true);
    setTimeout(() => setShowCompletionAnimation(false), 1500);
  };
  
  const viewDetails = () => {
    if (setSelectedHabit) {
      setSelectedHabit(habit);
      setCurrentView('habit-detail');
    }
  };
  
  const editHabit = () => {
    if (setSelectedHabit) {
      setSelectedHabit(habit);
      setCurrentView('edit-habit');
    }
  };

  return (
    <>
      <div className="relative">
        <Card 
          className={cn(
            "overflow-hidden backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:shadow-lg border-2",
            completedToday ? "bg-primary/10 border-primary/50" : "bg-background/80 hover:border-primary/30"
          )}
          style={{ 
            clipPath: "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)" 
          }}
        >
          <div className="clip-hexagon p-4 flex flex-col h-full">
            <div className="flex justify-between items-start">
              <Badge variant="outline" className={`${getCategoryColor()} text-white`}>
                {habit.category}
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={viewDetails}>View Details</DropdownMenuItem>
                  <DropdownMenuItem onClick={editHabit}>Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => archiveHabit(habit.id)}>Archive</DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => deleteHabit(habit.id)}
                    className="text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex-1 my-2">
              <h3 className="font-bold text-lg mb-1">{habit.name}</h3>
              {habit.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {habit.description}
                </p>
              )}
            </div>
            
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1">
                  <div className="text-sm font-medium">Streak</div>
                  <Badge variant={streak > 0 ? "default" : "outline"}>
                    {streak} day{streak !== 1 && 's'}
                  </Badge>
                </div>
                
                {habit.reminder && (
                  <div className="flex items-center text-muted-foreground">
                    <AlarmClock className="h-4 w-4 mr-1" />
                    <span className="text-xs">{habit.reminderTime || "Set"}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="w-1/2 bg-secondary rounded-full h-2 mr-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" 
                    style={{ width: `${weeklyRate}%` }}
                  ></div>
                </div>
                
                <Button
                  onClick={handleComplete}
                  disabled={completedToday}
                  variant={completedToday ? "outline" : "default"}
                  size="sm"
                  className={cn(
                    "transition-all",
                    completedToday ? "opacity-70" : "hover:scale-105"
                  )}
                >
                  {completedToday ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Done
                    </>
                  ) : "Complete"}
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        {showCompletionAnimation && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="animate-ping text-green-500">
              <Check className="h-16 w-16" />
            </div>
          </div>
        )}
      </div>
      
      <Dialog open={showMoodDialog} onOpenChange={setShowMoodDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How do you feel?</DialogTitle>
            <DialogDescription>
              Track your mood when completing this habit
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-between py-4">
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center",
                selectedMood === "great" && "bg-primary/20"
              )}
              onClick={() => setSelectedMood("great")}
            >
              <Smile className="h-8 w-8 text-green-500" />
              <span>Great</span>
            </Button>
            
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center",
                selectedMood === "good" && "bg-primary/20"
              )}
              onClick={() => setSelectedMood("good")}
            >
              <Smile className="h-8 w-8 text-blue-500" />
              <span>Good</span>
            </Button>
            
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center",
                selectedMood === "neutral" && "bg-primary/20"
              )}
              onClick={() => setSelectedMood("neutral")}
            >
              <Meh className="h-8 w-8 text-gray-500" />
              <span>Neutral</span>
            </Button>
            
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center",
                selectedMood === "bad" && "bg-primary/20"
              )}
              onClick={() => setSelectedMood("bad")}
            >
              <Frown className="h-8 w-8 text-orange-500" />
              <span>Bad</span>
            </Button>
            
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center",
                selectedMood === "terrible" && "bg-primary/20"
              )}
              onClick={() => setSelectedMood("terrible")}
            >
              <Frown className="h-8 w-8 text-red-500" />
              <span>Terrible</span>
            </Button>
          </div>
          
          <Textarea
            placeholder="Add a note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[80px]"
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMoodDialog(false)}>
              Cancel
            </Button>
            <Button onClick={completeWithMood}>
              Complete Habit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}