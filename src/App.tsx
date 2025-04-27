import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "@/views/Dashboard";
import { ChallengesView } from "@/views/ChallengesView";
import { SettingsView } from "@/views/SettingsView";
import { HabitForm } from "@/components/habits/HabitForm";
import { HabitDetail } from "@/components/habits/HabitDetail";
import { ChallengeForm } from "@/components/challenges/ChallengeForm";
import { HabitProvider } from "@/contexts/HabitContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppView, Habit } from "@/types/types";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState<AppView>("dashboard");
  const [selectedHabit, setSelectedHabit] = useState<Habit | undefined>(
    undefined
  );

  // Update page title based on current view
  useEffect(() => {
    const titles = {
      dashboard: "HabitHex | Dashboard",
      "habit-detail": `HabitHex | ${selectedHabit?.name ?? "Habit Details"}`,
      "add-habit": "HabitHex | Add Habit",
      "edit-habit": "HabitHex | Edit Habit",
      challenges: "HabitHex | Challenges",
      "add-challenge": "HabitHex | New Challenge",
      settings: "HabitHex | Settings",
    };

    document.title = titles[currentView];
  }, [currentView, selectedHabit]);

  // Render the current view based on the state
  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <Dashboard
            setCurrentView={setCurrentView}
            setSelectedHabit={setSelectedHabit}
          />
        );
      case "habit-detail":
        return selectedHabit ? (
          <HabitDetail
            habit={selectedHabit}
            setCurrentView={setCurrentView}
            setSelectedHabit={setSelectedHabit}
          />
        ) : null;
      case "add-habit":
        return <HabitForm setCurrentView={setCurrentView} />;
      case "edit-habit":
        return selectedHabit ? (
          <HabitForm
            editHabit={selectedHabit}
            setCurrentView={setCurrentView}
          />
        ) : null;
      case "challenges":
        return <ChallengesView setCurrentView={setCurrentView} />;
      case "add-challenge":
        return <ChallengeForm setCurrentView={setCurrentView} />;
      case "settings":
        return <SettingsView setCurrentView={setCurrentView} />;
      default:
        return (
          <Dashboard
            setCurrentView={setCurrentView}
            setSelectedHabit={setSelectedHabit}
          />
        );
    }
  };

  return (
    <ThemeProvider>
      <HabitProvider>
        <div className="min-h-screen bg-background text-foreground pb-16 sm:pb-0">
          <Header currentView={currentView} setCurrentView={setCurrentView} />
          {renderView()}
        </div>
        <Toaster />
      </HabitProvider>
    </ThemeProvider>
  );
}

export default App;
