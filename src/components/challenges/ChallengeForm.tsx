import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppView } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Checkbox } from '@/components/ui/checkbox';
import { useHabits } from '@/contexts/HabitContext';
import { addDays, format } from 'date-fns';

const challengeSchema = z.object({
  name: z.string().min(2, { message: 'Challenge name must be at least 2 characters' }),
  description: z.string().min(5, { message: 'Please provide a short description' }),
  habitIds: z.array(z.string()).min(1, { message: 'Select at least one habit' }),
  startDate: z.string(),
  endDate: z.string(),
  goal: z.number().min(1, { message: 'Goal must be at least 1' }),
});

type FormValues = z.infer<typeof challengeSchema>;

interface ChallengeFormProps {
  setCurrentView: (view: AppView) => void;
}

export function ChallengeForm({ setCurrentView }: ChallengeFormProps) {
  const { habits, addChallenge } = useHabits();
  
  const activeHabits = habits.filter(habit => !habit.isArchived);
  
  const today = new Date();
  const twoWeeksLater = addDays(today, 14);
  
  const defaultValues: Partial<FormValues> = {
    name: '',
    description: '',
    habitIds: [],
    startDate: format(today, 'yyyy-MM-dd'),
    endDate: format(twoWeeksLater, 'yyyy-MM-dd'),
    goal: 10,
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(challengeSchema),
    defaultValues,
  });
  
  const onSubmit = (data: FormValues) => {
    addChallenge({
      name: data.name,
      description: data.description,
      habitIds: data.habitIds,
      startDate: data.startDate,
      endDate: data.endDate,
      goal: data.goal,
    });
    
    setCurrentView('challenges');
  };
  
  return (
    <div className="max-w-lg mx-auto p-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <h2 className="text-2xl font-bold mb-6">Create New Challenge</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Challenge Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter challenge name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="What is this challenge about?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="habitIds"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Select Habits</FormLabel>
                  <FormDescription>
                    Choose which habits to include in this challenge
                  </FormDescription>
                </div>
                {activeHabits.length > 0 ? (
                  <div className="space-y-2">
                    {activeHabits.map((habit) => (
                      <FormField
                        key={habit.id}
                        control={form.control}
                        name="habitIds"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={habit.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(habit.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, habit.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== habit.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {habit.name}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    You need to create habits first before creating a challenge.
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Completion Goal</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1}
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  How many times do you want to complete these habits?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex gap-4 justify-end">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setCurrentView('challenges')}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Challenge
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}