import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Habit, HabitCategory, HabitFrequency, AppView } from '@/types/types';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useHabits } from '@/contexts/HabitContext';

const habitSchema = z.object({
  name: z.string().min(2, { message: 'Habit name must be at least 2 characters' }),
  description: z.string().optional(),
  category: z.enum(['health', 'fitness', 'productivity', 'mindfulness', 'learning', 'social', 'finance', 'custom']),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'custom']),
  timeOfDay: z.string().optional(),
  reminder: z.boolean(),  // Make sure it's not optional or nullable
  reminderTime: z.string().optional(),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof habitSchema>;

interface HabitFormProps {
  editHabit?: Habit;
  setCurrentView: (view: AppView) => void;
}

export function HabitForm({ editHabit, setCurrentView }: HabitFormProps) {
  const { addHabit, updateHabit } = useHabits();
  
  const defaultValues: Partial<FormValues> = {
    name: editHabit?.name || '',
    description: editHabit?.description || '',
    category: editHabit?.category || 'health',
    frequency: editHabit?.frequency || 'daily',
    timeOfDay: editHabit?.timeOfDay || '',
    reminder: editHabit?.reminder || false,
    reminderTime: editHabit?.reminderTime || '08:00',
    tags: editHabit?.tags.join(', ') || '',
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(habitSchema) as any,
    defaultValues,
  });
  
  const onSubmit = (data: FormValues) => {
    const tags = data.tags 
      ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) 
      : [];
      
    if (editHabit) {
      updateHabit({
        ...editHabit,
        name: data.name,
        description: data.description || '',
        category: data.category as HabitCategory,
        frequency: data.frequency as HabitFrequency,
        timeOfDay: data.timeOfDay,
        reminder: data.reminder,
        reminderTime: data.reminder ? data.reminderTime : undefined,
        tags,
      });
    } else {
      addHabit({
        name: data.name,
        description: data.description || '',
        category: data.category as HabitCategory,
        frequency: data.frequency as HabitFrequency,
        timeOfDay: data.timeOfDay,
        reminder: data.reminder,
        reminderTime: data.reminder ? data.reminderTime : undefined,
        tags,
      });
    }
    
    setCurrentView('dashboard');
  };
  
  return (
    <div className="max-w-lg mx-auto pt-20 px-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <h2 className="text-2xl font-bold mb-6">
        {editHabit ? 'Edit Habit' : 'Create New Habit'}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Habit Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter habit name" {...field} />
                </FormControl>
                <FormDescription>
                  Give your habit a clear, actionable name
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Why is this habit important to you?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="fitness">Fitness</SelectItem>
                      <SelectItem value="productivity">Productivity</SelectItem>
                      <SelectItem value="mindfulness">Mindfulness</SelectItem>
                      <SelectItem value="learning">Learning</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="timeOfDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Best Time of Day (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="time" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  When do you plan to complete this habit?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="reminder"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Reminder</FormLabel>
                  <FormDescription>
                    Get notified when it's time for this habit
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          {form.watch('reminder') && (
            <FormField
              control={form.control}
              name="reminderTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reminder Time</FormLabel>
                  <FormControl>
                    <Input 
                      type="time" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter tags separated by commas" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  e.g. morning, energy, focus
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex gap-4 justify-end">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setCurrentView('dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editHabit ? 'Update Habit' : 'Create Habit'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}