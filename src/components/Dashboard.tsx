import { PhotoEntry, OnboardingData, RoutineLog, RoutineTask } from '../types';
import { Sparkles, ArrowRight, Camera, Calendar, ShieldCheck, Flame, ChevronRight, Bell } from 'lucide-react';

interface DashboardProps {
  user: { name: string; email: string; onboardingData?: OnboardingData };
  photos: PhotoEntry[];
  routineTasks: RoutineTask[];
  routineLogs: RoutineLog[];
  streak: number;
  onNavigate: (tab: string) => void;
}

export default function Dashboard({
  user,
  photos,
  routineTasks,
  routineLogs,
  streak,
  onNavigate
}: DashboardProps) {
  // Calculate dynamic hair health score
  const getHairHealthScore = () => {
    let score = 50; // base score for mild thinning
    
    if (user.onboardingData) {
      switch (user.onboardingData.hairStatus) {
        case 'normal':
          score = 88;
          break;
        case 'thin-mild':
          score = 68;
          break;
        case 'thin-heavy':
          score = 42;
          break;
        case 'crown-thin':
          score = 48;
          break;
        case 'm-shape':
          score = 52;
          break;
      }
    }

    // Add bonus for treatment adoption
    const treatmentsCount = user.onboardingData?.treatments?.length || 0;
    score += Math.min(treatmentsCount * 3, 10);

    // Add bonus for photo count (having logs implies consistency)
    const uniquePhotoDates = new Set(photos.map(p => p.date)).size;
    score += Math.min(uniquePhotoDates * 2, 10);

    // Add bonus for active routine streak
    score += Math.min(streak * 1.5, 12);

    return Math.min(Math.round(score), 100);
  };

  const getTrendTextAndColor = (score: number) => {
    if (score >= 80) return { text: 'Cải thiện • Tốt', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: '📈' };
    if (score >= 60) return { text: 'Duy trì • Ổn định', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: '➡️' };
    return { text: 'Cần cải thiện', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: '⚠️' };
  };

  const hairScore = getHairHealthScore();
  const trend = getTrendTextAndColor(hairScore);

  // Group latest photos by angle for fast preview cards
  const angles: { id: string; name: string; label: string }[] = [
    { id: 'crown', name: 'Đỉnh đầu', label: 'Crown' },
    { id: 'hairline', name: 'Trán / M', label: 'Hairline' },
    { id: 'left', name: 'Bên trái', label: 'L Temple' },
    { id: 'right', name: 'Bên phải', label: 'R Temple' }
  ];

  const getLatestPhotoForAngle = (angle: string) => {
    const anglePhotos = photos.filter(p => p.angle === angle);
    if (anglePhotos.length === 0) return null;
    // Sort descending by date
    return anglePhotos.sort((a, b) => b.date.localeCompare(a.date))[0];
  };

  // Check today's routine tasks completion
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = routineLogs.find(l => l.date === todayStr);
  const completedTodayCount = todayLog?.completedTasks?.length || 0;
  const activeTasksCount = routineTasks.length;

  return (
    <div className="flex-1 flex flex-col bg-[#0A0C10] pb-8 select-none">
      
      {/* Dashboard Top Header user block */}
      <div className="px-6 pt-5 pb-5 flex justify-between items-center bg-[#0A0C10]/90 sticky top-0 backdrop-blur-md z-10 border-b border-slate-900">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/10">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider text-white uppercase font-sans leading-none">HAIRTRACK</h1>
            <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mt-0.5">Clinical Health Monitor</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-xs font-semibold text-white tracking-tight">{user.name}</p>
          <p className="text-[9px] text-blue-500 font-mono uppercase tracking-tight font-bold">VIP Premium</p>
        </div>
      </div>

      <div className="px-5 pt-4 space-y-4">
        
        {/* Core Hair Health Score Circular Gauge - Extracted cleanly from Clinical Health Monitor design layout */}
        <div className="bg-[#11141a] border border-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">MỨC ĐỘ SỨC KHỎE TÓC</span>
          
          <div className="relative w-36 h-36 flex items-center justify-center mb-3">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="72" cy="72" r="62" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-900" />
              <circle
                cx="72"
                cy="72"
                r="62"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-blue-500"
                strokeDasharray="390"
                strokeDashoffset={390 - (390 * hairScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-light text-white font-mono">{hairScore}</span>
              <span className="text-[9px] text-blue-400 font-bold uppercase tracking-tighter italic font-mono">+4.2% Trend</span>
            </div>
          </div>
          
          <p className="text-xs text-slate-350 font-mono">
            Tình trạng gốc: <span className="text-blue-400 font-semibold">{hairScore > 80 ? 'KHỎE MẠNH' : hairScore > 60 ? 'ỔN ĐỊNH' : 'CẦN CẢI THIỆN'}</span>
          </p>
        </div>

        {/* Streak status panel */}
        <div className="bg-[#11141a] border border-slate-900 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-600/15 flex items-center justify-center text-sm">🔥</div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Chuỗi tích lũy</p>
              <h4 className="text-xs font-bold text-slate-200">{streak} ngày liên tục</h4>
            </div>
          </div>
          <span className="text-[10px] font-mono text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-md font-bold uppercase tracking-tight">Active Streak</span>
        </div>

        {/* Routine Quick Info & Progress Card */}
        <div className="bg-[#11141a] border border-slate-900 rounded-2xl p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
              completedTodayCount === activeTasksCount ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#181d26] text-slate-400'
            }`}>
              {completedTodayCount === activeTasksCount ? '✅' : '💊'}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Routine hôm nay</h4>
              <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                Hoàn thành: {completedTodayCount}/{activeTasksCount} mục điều trị
              </p>
            </div>
          </div>
          
          <button
            id="btn-navigate-check-log"
            onClick={() => onNavigate('routine')}
            className="w-7 h-7 rounded-lg bg-[#181d26] hover:bg-[#1f2531] border border-slate-800 flex items-center justify-center text-slate-400"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Compare Panel Link */}
        <div 
          onClick={() => onNavigate('timeline')}
          className="bg-[#11141a]/60 hover:bg-[#11141a] border border-slate-900 p-4 rounded-2xl flex justify-between items-center cursor-pointer transition-all active:scale-[0.99]"
        >
          <div className="flex gap-3 items-center">
            <span className="text-lg">⚖️</span>
            <div>
              <h4 className="text-xs font-semibold text-slate-200">So sánh ảnh Before & After</h4>
              <p className="text-[9px] text-slate-550">Hỗ trợ đối chiếu side-by-side và trượt ngang visual</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-blue-400 flex items-center gap-0.5 uppercase tracking-wide">
            Xem ngay <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        {/* Active Angle Gallery & Quick Camera */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              NHẬT KÝ ẢNH ĐỊNH KỲ
            </h3>
            <span className="text-[9px] font-mono bg-[#181d26] text-slate-400 font-bold px-2 py-0.5 rounded border border-slate-800">
              MỤC TIÊU: 1 LẦN/TUẦN
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {angles.map((angle) => {
              const lastPhoto = getLatestPhotoForAngle(angle.id);
              return (
                <div
                  key={angle.id}
                  className="bg-[#11141a] rounded-2xl p-3 border border-slate-900 flex flex-col justify-between h-[180px] relative group overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-1.5 z-10">
                    <span className="text-xs font-semibold text-slate-300 tracking-tight">{angle.name}</span>
                    <span className="text-[9px] font-mono text-slate-650">{angle.label}</span>
                  </div>

                  {lastPhoto ? (
                    <div className="relative flex-1 rounded-xl overflow-hidden bg-[#181d26] border border-slate-900 group-hover:border-slate-850 transition-all flex items-center justify-center">
                      <img
                        src={lastPhoto.imageUrl}
                        alt={angle.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-1 right-1 bg-slate-950/80 px-1.5 py-0.5 rounded text-[8px] font-semibold text-slate-400 font-mono">
                        {lastPhoto.date.split('-').slice(1).reverse().join('/')}
                      </div>

                      {/* Snap replacement trigger overlays */}
                      <button
                        id={`btn-snap-overlay-${angle.id}`}
                        onClick={() => onNavigate('camera')}
                        className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white shadow shadow-blue-500/10">
                          <Camera className="w-3 h-3" />
                        </div>
                      </button>
                    </div>
                  ) : (
                    <button
                      id={`btn-snap-empty-${angle.id}`}
                      onClick={() => onNavigate('camera')}
                      className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/30 rounded-xl hover:bg-slate-950/10 transition-all text-slate-400 group"
                    >
                      <Camera className="w-4 h-4 mb-1 group-hover:scale-105 transition-transform text-slate-500" />
                      <span className="text-[10px] font-mono text-slate-500">No Image</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Notification Reminder Board */}
        <div className="bg-blue-950/10 border border-blue-500/10 rounded-xl p-4">
          <div className="flex items-start gap-2.5">
            <span className="text-base">📅</span>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-300">Lịch chụp ảnh tiếp theo</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
                Mỗi Chủ Nhật • 10:00 AM. Duy trì chụp cùng điều kiện ánh sáng để kết quả chuỗi đối chiếu chính xác nhất.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
