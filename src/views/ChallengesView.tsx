import { Plus } from 'lucide-react';
import { AppView } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';
import { useHabits } from '@/contexts/HabitContext';

interface ChallengesViewProps {
  setCurrentView: (view: AppView) => void;
}

export function ChallengesView({ setCurrentView }: ChallengesViewProps) {
  const { challenges } = useHabits();
  
  // Separate active and completed challenges
  const activeFilter = (challenge: { isCompleted: boolean }) => !challenge.isCompleted;
  const completedFilter = (challenge: { isCompleted: boolean }) => challenge.isCompleted;
  
  const activeCount = challenges.filter(activeFilter).length;
  const completedCount = challenges.filter(completedFilter).length;
  
  const handleAddChallenge = () => {
    setCurrentView('add-challenge');
  };
  
  return (
    <div className="container mx-auto p-4 pt-20 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Challenges</h1>
        <Button 
          onClick={handleAddChallenge}
          className="gap-1"
        >
          <Plus className="h-5 w-5" />
          <span>New Challenge</span>
        </Button>
      </div>
      
      <Tabs defaultValue="active" className="mb-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="active">
            Active ({activeCount})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedCount})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-6">
          {challenges.filter(activeFilter).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges
                .filter(activeFilter)
                .map(challenge => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No active challenges</h3>
              <p className="text-muted-foreground mb-6">
                Create a new challenge to motivate yourself
              </p>
              <Button onClick={handleAddChallenge}>
                <Plus className="h-5 w-5 mr-1" />
                Create Challenge
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          {challenges.filter(completedFilter).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges
                .filter(completedFilter)
                .map(challenge => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No completed challenges yet</h3>
              <p className="text-muted-foreground">
                Complete your active challenges to see them here
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}