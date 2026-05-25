import { useState } from 'react';
import { PhotoEntry } from '../types';
import { Trash2, Image as ImageIcon, Calendar, Sliders } from 'lucide-react';
import Compare from './Compare';

interface TimelineProps {
  photos: PhotoEntry[];
  onDeletePhoto: (id: string) => void;
  onNavigate: (tab: string) => void;
}

type Mode = 'photos' | 'compare';
type Timeframe = '1w' | '1m' | '3m' | '6m';

export default function Timeline({ photos, onDeletePhoto, onNavigate }: TimelineProps) {
  const [activeTab, setActiveTab] = useState<Mode>('photos');
  const [timeframe, setTimeframe] = useState<Timeframe>('6m');
  const [selectedAngleFilter, setSelectedAngleFilter] = useState<string>('all');

  // Filter photos based on Timeframe & selected Angle
  const getFilteredPhotos = () => {
    let result = [...photos];

    // Filter by angle
    if (selectedAngleFilter !== 'all') {
      result = result.filter(p => p.angle === selectedAngleFilter);
    }

    // Filter by timeframe
    const now = new Date('2026-05-25T04:49:09Z'); // Use constant fixed simulated current date
    result = result.filter((p) => {
      const entryDate = new Date(p.date);
      const diffTime = Math.abs(now.getTime() - entryDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      switch (timeframe) {
        case '1w':
          return diffDays <= 7;
        case '1m':
          return diffDays <= 30;
        case '3m':
          return diffDays <= 90;
        case '6m':
        default:
          return diffDays <= 180;
      }
    });

    // Sort descending (newest first)
    return result.sort((a, b) => b.date.localeCompare(a.date));
  };

  const filteredList = getFilteredPhotos();

  const getAngleVietnamese = (angle: string) => {
    switch (angle) {
      case 'crown': return 'Đỉnh đầu';
      case 'hairline': return 'Trước trán';
      case 'left': return 'T.Dương trái';
      case 'right': return 'T.Dương phải';
      default: return angle;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0A0C10] pb-8 select-none">
      
      {/* Timeline Toggle bar at the top */}
      <div className="px-6 pt-5 pb-3 sticky top-0 bg-[#0A0C10]/95 backdrop-blur-md border-[#11141a] border-b z-20">
        <div className="flex bg-[#11141a] p-1 rounded-xl border border-slate-900">
          <button
            id="timeline-tab-photos"
            onClick={() => setActiveTab('photos')}
            className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'photos'
                ? 'bg-[#191f2b] text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-300 font-medium'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Nhật ký ảnh
          </button>
          
          <button
            id="timeline-tab-compare"
            onClick={() => setActiveTab('compare')}
            className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'compare'
                ? 'bg-[#191f2b] text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-300 font-medium'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Đối chiếu (Slider)
          </button>
        </div>
      </div>

      <div className="px-5 pt-4 space-y-4">
        {activeTab === 'photos' ? (
          /* GENERAL TIMELINE PHOTO VIEW */
          <div className="space-y-4">
            
            {/* Timeframe Slider/Filter Selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Lọc mốc thời kỳ</span>
                <span className="text-[10px] text-blue-400 font-mono font-semibold uppercase font-mono">Mốc: {timeframe === '1w' ? '1 Tuần' : timeframe === '1m' ? '1 Tháng' : timeframe === '3m' ? '3 Tháng' : '6 Tháng'}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 font-mono">
                {(['1w', '1m', '3m', '6m'] as Timeframe[]).map((tf) => (
                  <button
                    key={tf}
                    id={`btn-timeframe-${tf}`}
                    onClick={() => setTimeframe(tf)}
                    className={`py-1 text-center text-[10px] font-bold rounded-lg transition-all border ${
                      timeframe === tf
                        ? 'bg-blue-600/10 border-blue-500/30 text-blue-400'
                        : 'bg-[#11141a] text-slate-500 border-slate-900 hover:text-slate-300'
                    }`}
                  >
                    {tf === '1w' ? '1 Tuần' : tf === '1m' ? '1 Tháng' : tf === '3m' ? '3 Tháng' : '6 Tháng'}
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Angle Dropdown Selector filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Lọc góc chụp</label>
              <select
                id="filter-timeline-angle"
                value={selectedAngleFilter}
                onChange={(e) => setSelectedAngleFilter(e.target.value)}
                className="w-full bg-[#11141a] border border-slate-900 rounded-xl py-2 px-3 text-xs text-slate-300 outline-none font-mono"
              >
                <option value="all">Tất cả các góc quan sát</option>
                <option value="crown">Đỉnh đầu (Crown)</option>
                <option value="hairline">Trước trán (Hairline)</option>
                <option value="left">Thái dương Trái (Left Temple)</option>
                <option value="right">Thái dương Phải (Right Temple)</option>
              </select>
            </div>

            {/* Count Tag */}
            <div className="flex justify-between items-center text-xs text-slate-500 font-semibold pt-1 font-mono">
              <span>Đang hiển thị {filteredList.length} ảnh</span>
              <button
                id="btn-quick-capture-timeline"
                onClick={() => onNavigate('camera')}
                className="text-blue-500 hover:underline flex items-center gap-1 text-[11px] font-bold uppercase tracking-tight"
              >
                + Chụp tóc thêm
              </button>
            </div>

            {/* List Render Grid */}
            {filteredList.length === 0 ? (
              <div className="py-12 border border-dashed border-slate-900 rounded-2xl text-center text-slate-550 bg-[#11141a]/55 font-mono">
                <p className="text-xs font-semibold">Không tìm thấy ảnh phù hợp</p>
                <p className="text-[10px] text-slate-600 mt-1">Thay đổi bộ lọc thời gian hoặc góc chụp để nạp dữ liệu lâu hơn.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredList.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-[#11141a] border border-slate-900 rounded-2xl p-2 flex flex-col justify-between h-[210px] relative group hover:border-[#1e242f] transition-all overflow-hidden"
                  >
                    {/* Visual Area */}
                    <div className="relative flex-1 rounded-xl overflow-hidden bg-black border border-slate-900">
                      <img
                        src={photo.imageUrl}
                        alt={photo.angle}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Custom tag overlay */}
                      {photo.isCustom && (
                        <span className="absolute top-1.5 left-1.5 bg-blue-600 text-white font-bold font-mono text-[8px] px-1.5 py-0.5 rounded uppercase tracking-wider shadow">
                          Tự chụp
                        </span>
                      )}

                      {/* Hover action bar */}
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-2">
                        {photo.isCustom && (
                          <button
                            id={`btn-delete-photo-${photo.id}`}
                            onClick={() => onDeletePhoto(photo.id)}
                            className="bg-red-600 hover:bg-red-500 p-2 rounded-xl text-white shadow-md transition-transform active:scale-95"
                            title="Xóa tấm ảnh này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          id={`btn-open-compare-${photo.id}`}
                          onClick={() => setActiveTab('compare')}
                          className="bg-blue-600 hover:bg-blue-500 px-2.5 py-1.5 rounded-xl text-white text-[10px] font-bold font-mono shadow-md transition-transform"
                        >
                          So sánh
                        </button>
                      </div>
                    </div>

                    {/* Meta details footer card */}
                    <div className="mt-2 flex justify-between items-center px-0.5 select-none font-mono">
                      <div>
                        <span className="text-[11px] font-bold text-slate-300 block leading-tight">
                          {getAngleVietnamese(photo.angle)}
                        </span>
                        <span className="text-[9px] text-slate-500 font-medium block mt-1.5 flex items-center gap-1 leading-none font-mono">
                          <Calendar className="w-2.5 h-2.5" />
                          {photo.date.split('-').slice(1).reverse().join('/')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* COMPLEX BEFORE & AFTER SLIDER COMPARE VIEW */
          <Compare photos={photos} />
        )}
      </div>
    </div>
  );
}
