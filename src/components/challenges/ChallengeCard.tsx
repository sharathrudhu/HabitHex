import { useState } from 'react';
import { Trophy, Calendar, Users, MoreHorizontal, Award } from 'lucide-react';
import { Challenge, Habit } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { useHabits } from '@/contexts/HabitContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ChallengeCardProps {
  challenge: Challenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const { habits, deleteChallenge } = useHabits();
  const [showCompletedAnimation, setShowCompletedAnimation] = useState(false);
  
  const relatedHabits = habits.filter(habit => 
    challenge.habitIds.includes(habit.id)
  );
  
  const progressPercentage = Math.min(
    Math.round((challenge.currentProgress / challenge.goal) * 100),
    100
  );
  
  const startDate = new Date(challenge.startDate);
  const endDate = new Date(challenge.endDate);
  
  const handleDelete = () => {
    deleteChallenge(challenge.id);
  };
  
  // Apply animation effect if challenge is completed but animation hasn't shown yet
  if (challenge.isCompleted && !showCompletedAnimation) {
    setShowCompletedAnimation(true);
  }
  
  return (
    <Card className={`overflow-hidden transition-all duration-500 ${
      challenge.isCompleted ? 'bg-primary/10 border-primary/50' : 'hover:border-primary/30'
    } ${showCompletedAnimation ? 'animate-pulse' : ''}`}>
      <CardContent className="px-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`rounded-full p-2 ${
            challenge.isCompleted ? 'bg-green-500/20' : 'bg-primary/10'
          }`}>
            {challenge.isCompleted ? (
              <Trophy className="h-6 w-6 text-green-500" />
            ) : (
              <Award className="h-6 w-6 text-primary" />
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this challenge. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <h3 className="text-xl font-medium mb-2">{challenge.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">
          {challenge.description}
        </p>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <span>
            {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Users className="h-4 w-4" />
          <span>{relatedHabits.length} habits</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{challenge.currentProgress}/{challenge.goal}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        {challenge.isCompleted && (
          <div className="mt-4 bg-green-500/10 text-green-700 dark:text-green-300 p-3 rounded-md text-center font-medium">
            Challenge Completed! 🎉
          </div>
        )}
      </CardContent>
    </Card>
  );
}