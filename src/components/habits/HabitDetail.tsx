import { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Edit2,
  Trash2,
  Trophy,
  BarChart3,
  CalendarDays,
} from 'lucide-react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Habit, AppView, CompletionRecord } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { useHabits } from '@/contexts/HabitContext';
import { calculateStreak } from '@/utils/habitUtils';
import { CellCalendar } from '@/components/ui/calendar';
import { BarChart } from '@/components/ui/chart';

interface HabitDetailProps {
  habit: Habit;
  setCurrentView: (view: AppView) => void;
  setSelectedHabit: (habit: Habit | undefined) => void;
}

export function HabitDetail({ habit, setCurrentView, setSelectedHabit }: HabitDetailProps) {
  const { deleteHabit } = useHabits();
  const [activeTab, setActiveTab] = useState('overview');
  
  const streak = calculateStreak(habit);
  const completedDates = habit.completionRecords
    .filter(record => record.completed)
    .map(record => new Date(record.date));
  
  const totalCompletions = completedDates.length;
  
  const handleDelete = () => {
    deleteHabit(habit.id);
    setSelectedHabit(undefined);
    setCurrentView('dashboard');
  };
  
  const handleEdit = () => {
    setCurrentView('edit-habit');
  };
  
  const handleBack = () => {
    setSelectedHabit(undefined);
    setCurrentView('dashboard');
  };
  
  // Generate data for chart
  const generateChartData = () => {
    const today = new Date();
    const data = [];
    
    // Create data for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = addDays(today, -i);
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      const record = habit.completionRecords.find(
        r => r.date.startsWith(formattedDate)
      );
      
      data.push({
        date: format(date, 'MMM dd'),
        completed: record && record.completed ? 1 : 0,
      });
    }
    
    return data;
  };
  
  const chartData = generateChartData();
  
  // Calculate completion percentage
  const completionPercentage = chartData.filter(d => d.completed === 1).length / chartData.length * 100;
  
  return (
    <div className="max-w-3xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex items-center mb-6 gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBack}
          className="rounded-full"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-2xl font-bold flex-1">{habit.name}</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleEdit}
            className="rounded-full"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="rounded-full text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this habit and all its history. This action cannot be undone.
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
        </div>
      </div>
      
      {habit.description && (
        <p className="text-muted-foreground mb-6">{habit.description}</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-primary/5 backdrop-blur-sm">
          <CardContent className="p-6 flex flex-col items-center">
            <Trophy className="h-8 w-8 text-amber-500 mb-2" />
            <div className="text-3xl font-bold">{streak}</div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5 backdrop-blur-sm">
          <CardContent className="p-6 flex flex-col items-center">
            <CalendarDays className="h-8 w-8 text-green-500 mb-2" />
            <div className="text-3xl font-bold">{totalCompletions}</div>
            <div className="text-sm text-muted-foreground">Total Completions</div>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5 backdrop-blur-sm">
          <CardContent className="p-6 flex flex-col items-center">
            <BarChart3 className="h-8 w-8 text-blue-500 mb-2" />
            <div className="text-3xl font-bold">{Math.round(completionPercentage)}%</div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-xl font-medium">Habit Details</h3>
                </div>
                <Badge className="self-start md:self-auto mt-2 md:mt-0">
                  {habit.category}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Frequency</div>
                  <div>{habit.frequency}</div>
                </div>
                
                {habit.timeOfDay && (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Best Time</div>
                    <div>{habit.timeOfDay}</div>
                  </div>
                )}
                
                {habit.reminder && (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Reminder</div>
                    <div>{habit.reminderTime}</div>
                  </div>
                )}
                
                {habit.tags && habit.tags.length > 0 && (
                  <div className="space-y-1 col-span-1 md:col-span-2">
                    <div className="text-sm text-muted-foreground">Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {habit.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-medium mb-4">30 Day Progress</h3>
              <div className="h-64">
                <BarChart 
                  data={chartData}
                  categories={['completed']}
                  index="date"
                  colors={['hsl(var(--chart-1))']}
                  valueFormatter={(value) => value === 1 ? 'Completed' : 'Missed'}
                  yAxisWidth={30}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card>
            <CardContent className="pt-6">
              <CellCalendar 
                mode="multiple"
                selected={completedDates}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-medium mb-4">Completion History</h3>
              <ScrollArea className="h-96">
                {habit.completionRecords.length > 0 ? (
                  <div className="space-y-4">
                    {[...habit.completionRecords]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((record, index) => (
                        <div key={record.date} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="font-medium">
                              {format(new Date(record.date), 'MMMM d, yyyy')}
                            </div>
                            <Badge 
                              variant={record.completed ? "default" : "outline"}
                              className={record.completed ? "" : "text-muted-foreground"}
                            >
                              {record.completed ? "Completed" : "Missed"}
                            </Badge>
                          </div>
                          
                          {record.mood && (
                            <div className="text-sm text-muted-foreground">
                              Mood: {record.mood}
                            </div>
                          )}
                          
                          {record.note && (
                            <div className="bg-muted p-3 rounded-md text-sm">
                              {record.note}
                            </div>
                          )}
                          
                          {index < habit.completionRecords.length - 1 && (
                            <Separator className="my-2" />
                          )}
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                    No completion records yet
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}