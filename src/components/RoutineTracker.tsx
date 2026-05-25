import { useState } from 'react';
import { RoutineTask, RoutineLog } from '../types';
import { Check, Flame, Trophy, AlertCircle } from 'lucide-react';

interface RoutineTrackerProps {
  routineTasks: RoutineTask[];
  routineLogs: RoutineLog[];
  streak: number;
  onToggleTask: (date: string, taskId: string) => void;
}

export default function RoutineTracker({
  routineTasks,
  routineLogs,
  streak,
  onToggleTask
}: RoutineTrackerProps) {
  const simulatedToday = '2026-05-25'; // Simulated current date of the app
  const [selectedDate, setSelectedDate] = useState<string>(simulatedToday);

  // Generate a beautiful 7-day strip list back from today (May 25, 2026)
  const getSimulatedWeekDays = () => {
    const days = [];
    const baseDate = new Date(simulatedToday);
    
    // Generate previous 6 days plus today
    for (let i = 6; i >= 0; i--) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      days.push({
        dateStr,
        dayNum: d.getDate(),
        dayLabel: dayNames[d.getDay()],
        isToday: dateStr === simulatedToday
      });
    }
    return days;
  };

  const weekDays = getSimulatedWeekDays();

  // Find completion record for selected day
  const selectedLog = routineLogs.find(l => l.date === selectedDate);
  const completedTaskIds = selectedLog?.completedTasks || [];

  // Calculate task completions
  const completionRate = () => {
    if (routineLogs.length === 0) return 0;
    const totalPossiblePoints = routineLogs.length * routineTasks.length;
    if (totalPossiblePoints === 0) return 0;
    
    const actualPoints = routineLogs.reduce((sum, log) => sum + log.completedTasks.length, 0);
    return Math.round((actualPoints / totalPossiblePoints) * 100);
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'wash': return '🧴';
      case 'topical': return '💦';
      case 'pill': return '💊';
      case 'serum': return '🌱';
      default: return '❇️';
    }
  };

  const isDayFullyCompleted = (dateStr: string) => {
    const log = routineLogs.find(l => l.date === dateStr);
    return log && log.completedTasks.length === routineTasks.length;
  };

  const isDayPartiallyCompleted = (dateStr: string) => {
    const log = routineLogs.find(l => l.date === dateStr);
    return log && log.completedTasks.length > 0 && log.completedTasks.length < routineTasks.length;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0A0C10] pb-8 select-none">
      
      {/* Header bar */}
      <div className="px-6 pt-5 pb-4 sticky top-0 bg-[#0A0C10]/95 backdrop-blur-md border-b border-[#11141a] z-20">
        <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 uppercase font-mono">
          <span>Lịch trình Chăm sóc</span>
          <span className="text-sm">🧴</span>
        </h2>
        <p className="text-[11px] text-slate-500 mt-0.5">Duy trì thói quen để chặn rụng tóc hiệu quả nhất</p>
      </div>

      <div className="px-5 pt-4 space-y-4">
        
        {/* Statistics Board */}
        <div className="grid grid-cols-2 gap-3.5 select-none font-mono">
          
          <div className="bg-[#11141a] border border-slate-900 p-3.5 rounded-2xl flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0">
              <Flame className="w-4 h-4 fill-orange-500/10" />
            </div>
            <div>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block leading-none">Streak chuỗi</span>
              <span className="text-xs font-bold text-slate-350 block mt-1 leading-none">{streak} ngày</span>
            </div>
          </div>

          <div className="bg-[#11141a] border border-slate-900 p-3.5 rounded-2xl flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block leading-none">Tỉ lệ hoàn tất</span>
              <span className="text-xs font-bold text-slate-350 block mt-1 leading-none">{completionRate()}%</span>
            </div>
          </div>

        </div>

        {/* 7-Day horizontal calendar strip selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Lịch tuần chụp ảnh & treatment</label>
          <div className="flex justify-between gap-1 bg-[#11141a] p-1 rounded-2xl border border-slate-900 font-mono">
            {weekDays.map((day) => {
              const selected = selectedDate === day.dateStr;
              const fullCheck = isDayFullyCompleted(day.dateStr);
              const partCheck = isDayPartiallyCompleted(day.dateStr);
              
              return (
                <button
                  key={day.dateStr}
                  id={`btn-calendar-day-${day.dateStr}`}
                  onClick={() => setSelectedDate(day.dateStr)}
                  className={`flex-1 py-2 flex flex-col items-center justify-center rounded-xl transition-all relative ${
                    selected
                      ? 'bg-blue-600 text-white font-bold scale-[1.03] shadow'
                      : 'hover:bg-[#191f2b] text-slate-500'
                  }`}
                >
                  <span className="text-[8px] font-bold uppercase block tracking-wider leading-none">
                    {day.dayLabel}
                  </span>
                  <span className="text-xs font-bold block mt-1.5 leading-none">
                    {day.dayNum}
                  </span>

                  {/* Tiny checks indicator */}
                  {fullCheck ? (
                    <span className={`w-1 h-1 rounded-full absolute bottom-1 ${selected ? 'bg-white' : 'bg-emerald-400'}`} />
                  ) : partCheck ? (
                    <span className={`w-1 h-1 rounded-full absolute bottom-1 ${selected ? 'bg-white' : 'bg-blue-450'}`} />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected date contextual subheader */}
        <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
          <span className="font-bold text-slate-400 uppercase tracking-wide text-[10px]">
            {selectedDate === simulatedToday
              ? 'Hôm nay, 25 tháng 5, 2026'
              : `Ngày ${selectedDate.split('-')[2]} tháng ${selectedDate.split('-')[1]}, 2026`}
          </span>
          <span className="text-[10px] bg-[#11141a] text-slate-400 px-2.5 py-0.5 rounded-lg border border-slate-900 font-bold uppercase">
            {completedTaskIds.length}/{routineTasks.length} XONG
          </span>
        </div>

        {/* Daily Checklist list items */}
        {routineTasks.length === 0 ? (
          <div className="p-8 border border-dashed border-slate-900 rounded-2xl text-center text-slate-500 bg-[#11141a]/40 font-mono">
            <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-semibold">Routine đang trống</p>
            <p className="text-[10px] text-slate-600 mt-1">Hãy vào Hồ Sơ để bật các phương pháp điều trị tóc.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {routineTasks.map((task) => {
              const isChecked = completedTaskIds.includes(task.id);
              return (
                <button
                  key={task.id}
                  id={`btn-toggle-task-${task.id}`}
                  onClick={() => onToggleTask(selectedDate, task.id)}
                  className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all duration-200 block relative ${
                    isChecked
                      ? 'bg-emerald-500/5 border-emerald-550/20'
                      : 'bg-[#11141a] border-slate-900 hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">
                      {getCategoryEmoji(task.category)}
                    </span>
                    <div>
                      <h4 className={`text-xs font-bold leading-normal ${isChecked ? 'text-slate-500 line-through font-medium' : 'text-slate-200'}`}>
                        {task.name}
                      </h4>
                      <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wider font-semibold font-mono">
                        Lịch: {task.frequency === 'daily' ? 'Hàng ngày' : task.frequency === 'every-two-days' ? 'Mỗi 2 ngày' : 'Mỗi tuần'} 
                        {task.timeOfDay ? ` • ${task.timeOfDay === 'morning' ? 'Buổi sáng' : 'Buổi tối'}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                    isChecked ? 'bg-emerald-500 border-emerald-550 text-white' : 'border-slate-800'
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Educational Micro-card tip */}
        <div className="bg-blue-500/5 border border-blue-500/10 p-3.5 rounded-2xl flex items-start gap-2.5 mt-2">
          <span className="text-base select-none">💡</span>
          <p className="text-[11px] text-slate-500 leading-normal font-normal">
            <span className="text-blue-400 font-bold font-mono text-[10px] uppercase block mb-1">Lời khuyên lâm sàng:</span>
            Sợi tóc sinh trưởng cực kỳ chậm. Sử dụng Minoxidil hoặc Finasteride đều đặn trong <span className="text-blue-400 font-mono">3-6 tháng</span> mới bắt đầu kích thích nang tóc mới. Hãy kiên trì!
          </p>
        </div>

      </div>
    </div>
  );
}
