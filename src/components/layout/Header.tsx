import { useState, useEffect } from 'react';
import { Moon, Sun, Settings, Home, Award, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/contexts/ThemeContext';
import { AppView } from '@/types';

interface HeaderProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

export function Header({ currentView, setCurrentView }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const getTabValue = () => {
    if (currentView === 'dashboard') return 'dashboard';
    if (currentView === 'challenges' || currentView === 'add-challenge') return 'challenges';
    if (currentView === 'settings') return 'settings';
    return 'dashboard';
  };

  const handleTabChange = (value: string) => {
    switch(value) {
      case 'dashboard':
        setCurrentView('dashboard');
        break;
      case 'challenges':
        setCurrentView('challenges');
        break;
      case 'settings':
        setCurrentView('settings');
        break;
      default:
        setCurrentView('dashboard');
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-background/95 backdrop-blur-sm shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            HabitHex
          </h1>
        </div>
        
        <Tabs 
          value={getTabValue()} 
          onValueChange={handleTabChange} 
          className="hidden sm:block"
        >
          <TabsList className="grid grid-cols-3 w-[300px]">
            <TabsTrigger value="dashboard" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              <span>Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full"
        >
          {theme === 'dark' ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
      
      {/* Mobile Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-2">
        <Tabs value={getTabValue()} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="dashboard">
              <Home className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger value="challenges">
              <Award className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-5 w-5" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </header>
  );
}