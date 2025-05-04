import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { useTheme } from '@/contexts/ThemeContext';
import { useHabits } from '@/contexts/HabitContext';

export function SettingsView() {
  const { theme, setTheme } = useTheme();
  const { habits, challenges } = useHabits();
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    if (typeof Notification !== 'undefined') {
      return Notification.permission === 'granted';
    }
    return false;
  });
  
  const handleRequestNotifications = async () => {
    if (typeof Notification !== 'undefined') {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    }
  };
  
  const handleExportData = () => {
    const data = {
      habits,
      challenges,
      exportDate: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `habittracker_export_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  return (
    <div className="container mx-auto p-4 pt-20 max-w-3xl animate-in fade-in slide-in-from-bottom-5 duration-500">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="general" className="mb-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6 space-y-6">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Theme Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="theme" className="text-sm font-medium">
                  Theme Mode
                </label>
                <Select
                  value={theme}
                  onValueChange={(value) => setTheme(value as any)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System (Time-based)</SelectItem>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                    <SelectItem value="night">Night</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders for your habits
                  </p>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={() => {
                    if (!notificationsEnabled) {
                      handleRequestNotifications();
                    }
                  }}
                />
              </div>
              
              {!notificationsEnabled && (
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  You need to allow notifications in your browser to enable this feature.
                </p>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="data" className="mt-6 space-y-6">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Data Management</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Export Data</p>
                  <p className="text-sm text-muted-foreground">
                    Download all your habits and challenges as JSON
                  </p>
                </div>
                <Button variant="outline" onClick={handleExportData}>
                  Export
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Reset All Data</p>
                  <p className="text-sm text-muted-foreground">
                    Clear all habits and challenges
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Reset</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all your
                        habits, challenges and their history data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                      }}>
                        I understand, reset everything
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Usage Statistics</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Habits</p>
                <p className="text-2xl font-bold">{habits.length}</p>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Challenges</p>
                <p className="text-2xl font-bold">{challenges.length}</p>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Active Habits</p>
                <p className="text-2xl font-bold">
                  {habits.filter(h => !h.isArchived).length}
                </p>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Completed Challenges</p>
                <p className="text-2xl font-bold">
                  {challenges.filter(c => c.isCompleted).length}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}