import { useState, useEffect } from 'react';
import { User, PhotoEntry, RoutineTask, RoutineLog, ReminderSetting, OnboardingData, HairStatus } from './types';
import { initialPhotos, initialRoutineTasks, initialReminders } from './data/defaultData';
import MobileFrame from './components/MobileFrame';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import CameraCapture from './components/CameraCapture';
import Timeline from './components/Timeline';
import RoutineTracker from './components/RoutineTracker';
import ProfileSettings from './components/ProfileSettings';

const STORAGE_KEYS = {
  USER: 'hairtrack_user',
  PHOTOS: 'hairtrack_photos',
  TASKS: 'hairtrack_tasks',
  LOGS: 'hairtrack_logs',
  REMINDERS: 'hairtrack_reminders',
  STREAK: 'hairtrack_streak'
};

const TODAY_STR = '2026-05-25'; // Fixed current simulated date

// Pre-seeded routine completions to represent an active streak
const generatePreSeededLogs = (tasks: RoutineTask[]): RoutineLog[] => {
  const logs: RoutineLog[] = [];
  const taskIds = tasks.map(t => t.id);
  const baseDate = new Date(TODAY_STR);

  // Pre-seed logs for previous 6 days with 100% completion in order to construct a real 7-day streak
  for (let i = 1; i <= 6; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    logs.push({
      date: dateStr,
      completedTasks: [...taskIds]
    });
  }

  // Pre-seed today as partially completed (first task completed) to invite immediate action!
  logs.push({
    date: TODAY_STR,
    completedTasks: [taskIds[0], taskIds[1]]
  });

  return logs;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const [routineTasks, setRoutineTasks] = useState<RoutineTask[]>([]);
  const [routineLogs, setRoutineLogs] = useState<RoutineLog[]>([]);
  const [reminders, setReminders] = useState<ReminderSetting[]>([]);
  const [streak, setStreak] = useState<number>(7);
  
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [appState, setAppState] = useState<'loading' | 'auth' | 'onboarding' | 'main'>('loading');

  // Load state from local storage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const storedPhotos = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      const storedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      const storedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
      const storedReminders = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      const storedStreak = localStorage.getItem(STORAGE_KEYS.STREAK);

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        if (parsedUser.isOnboarded) {
          setAppState('main');
        } else {
          setAppState('onboarding');
        }
      } else {
        setAppState('auth');
      }

      // Photos
      if (storedPhotos) {
        setPhotos(JSON.parse(storedPhotos));
      } else {
        setPhotos(initialPhotos);
        localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(initialPhotos));
      }

      // Tasks
      if (storedTasks) {
        setRoutineTasks(JSON.parse(storedTasks));
      } else {
        setRoutineTasks(initialRoutineTasks);
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(initialRoutineTasks));
      }

      // Logs
      if (storedLogs) {
        setRoutineLogs(JSON.parse(storedLogs));
      } else {
        const seedLogs = generatePreSeededLogs(initialRoutineTasks);
        setRoutineLogs(seedLogs);
        localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(seedLogs));
      }

      // Reminders
      if (storedReminders) {
        setReminders(JSON.parse(storedReminders));
      } else {
        setReminders(initialReminders);
        localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(initialReminders));
      }

      // Streak
      if (storedStreak) {
        setStreak(Number(storedStreak));
      } else {
        setStreak(7);
        localStorage.setItem(STORAGE_KEYS.STREAK, '7');
      }

    } catch (e) {
      console.error('Failed to restore localStorage cache:', e);
      setAppState('auth');
    }
  }, []);

  const handleAuthSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loggedInUser));

    if (loggedInUser.isOnboarded) {
      setAppState('main');
      setActiveTab('dashboard');
    } else {
      setAppState('onboarding');
    }
  };

  const handleOnboardingComplete = (onboardingData: OnboardingData) => {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      isOnboarded: true,
      onboardingData
    };

    // Construct customizable routine tasks depending on selections made during Onboarding
    const filteredTasks = initialRoutineTasks.filter(task => {
      if (task.id === 'task-shampoo') return true; // always included
      
      // Map minoxidil
      if (task.id.startsWith('task-minoxidil') && onboardingData.treatments.includes('Minoxidil')) {
        return true;
      }
      // Map finasteride
      if (task.id === 'task-finasteride' && onboardingData.treatments.includes('Finasteride')) {
        return true;
      }
      // Map general serums
      if (task.id === 'task-serum' && (onboardingData.treatments.includes('Oils') || onboardingData.treatments.includes('Other'))) {
        return true;
      }
      return false;
    });

    const activeTasksList = filteredTasks.length > 0 ? filteredTasks : [initialRoutineTasks[0]];

    setUser(updatedUser);
    setRoutineTasks(activeTasksList);
    
    // Regenerate preseeded logs to map cleanly with the customized tasks list
    const seedLogs = generatePreSeededLogs(activeTasksList);
    setRoutineLogs(seedLogs);

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(activeTasksList));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(seedLogs));
    
    setAppState('main');
    setActiveTab('dashboard');
  };

  const handlePhotoSaved = (newPhoto: PhotoEntry) => {
    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(updated));
  };

  const handleDeletePhoto = (id: string) => {
    const updated = photos.filter(p => p.id !== id);
    setPhotos(updated);
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(updated));
  };

  const handleToggleTask = (date: string, taskId: string) => {
    let updatedLogs = [...routineLogs];
    const logIndex = updatedLogs.findIndex(l => l.date === date);

    if (logIndex !== -1) {
      const log = updatedLogs[logIndex];
      const isCompleted = log.completedTasks.includes(taskId);
      
      let newCompletedTasks = [];
      if (isCompleted) {
        newCompletedTasks = log.completedTasks.filter(id => id !== taskId);
      } else {
        newCompletedTasks = [...log.completedTasks, taskId];
      }
      
      updatedLogs[logIndex] = {
        ...log,
        completedTasks: newCompletedTasks
      };
    } else {
      updatedLogs.push({
        date,
        completedTasks: [taskId]
      });
    }

    setRoutineLogs(updatedLogs);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updatedLogs));

    // Dynamic Streak analysis:
    // If we ticked TODAY fully, or ticked/unticked, let's recalculate streak.
    // For simpler MVP, check logging history. If the previous 6 days are completed, and today is completed, streak = 7.
    let todayLog = updatedLogs.find(l => l.date === TODAY_STR);
    const isTodayDone = todayLog && todayLog.completedTasks.length === routineTasks.length;
    
    if (isTodayDone) {
      setStreak(7);
      localStorage.setItem(STORAGE_KEYS.STREAK, '7');
    } else {
      setStreak(6); // minor breakdown of today drops streak to 6 until they check all! This is extremely fun.
      localStorage.setItem(STORAGE_KEYS.STREAK, '6');
    }
  };

  const handleToggleReminder = (id: string) => {
    const updated = reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
    setReminders(updated);
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
  };

  const handleResetData = () => {
    localStorage.clear();
    setPhotos(initialPhotos);
    setRoutineTasks(initialRoutineTasks);
    setRoutineLogs(generatePreSeededLogs(initialRoutineTasks));
    setReminders(initialReminders);
    setStreak(7);
    
    if (user) {
      const resetUser = { ...user, isOnboarded: false, onboardingData: undefined };
      setUser(resetUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(resetUser));
      setAppState('onboarding');
    } else {
      setAppState('auth');
    }
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    setAppState('auth');
  };

  // Safe Loading view
  if (appState === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-350">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Đang đồng bộ hóa bộ nhớ...</p>
        </div>
      </div>
    );
  }

  // Routing Map
  return (
    <MobileFrame
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      showNavBar={appState === 'main'}
      userEmail={user?.email}
      onLogout={handleLogout}
    >
      {appState === 'auth' && (
        <Auth onAuthSuccess={handleAuthSuccess} />
      )}

      {appState === 'onboarding' && user && (
        <Onboarding onComplete={handleOnboardingComplete} username={user.name} />
      )}

      {appState === 'main' && user && (
        <>
          {activeTab === 'dashboard' && (
            <Dashboard
              user={user}
              photos={photos}
              routineTasks={routineTasks}
              routineLogs={routineLogs}
              streak={streak}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'timeline' && (
            <Timeline
              photos={photos}
              onDeletePhoto={handleDeletePhoto}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'camera' && (
            <CameraCapture
              onPhotoSaved={handlePhotoSaved}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'routine' && (
            <RoutineTracker
              routineTasks={routineTasks}
              routineLogs={routineLogs}
              streak={streak}
              onToggleTask={handleToggleTask}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileSettings
              user={user}
              reminders={reminders}
              onUpdateUser={handleUpdateUser}
              onToggleReminder={handleToggleReminder}
              onResetData={handleResetData}
              onLogout={handleLogout}
            />
          )}
        </>
      )}
    </MobileFrame>
  );
}
