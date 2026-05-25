import React, { useState, useRef } from 'react';
import { PhotoEntry, HairAngle } from '../types';
import { Sliders, Columns, Calendar, HelpCircle, ArrowRightLeft } from 'lucide-react';

interface CompareProps {
  photos: PhotoEntry[];
}

export default function Compare({ photos }: CompareProps) {
  const [selectedAngle, setSelectedAngle] = useState<HairAngle>('crown');
  const [beforePhotoId, setBeforePhotoId] = useState<string>('');
  const [afterPhotoId, setAfterPhotoId] = useState<string>('');
  const [compareMode, setCompareMode] = useState<'slider' | 'side-by-side'>('slider');
  const [sliderPos, setSliderPos] = useState<number>(50);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Filter photos by selected angle and sort by date ascending (oldest first)
  const anglePhotos = photos
    .filter((p) => p.angle === selectedAngle)
    .sort((a, b) => a.date.localeCompare(b.date));

  // Auto pre-populate before and after if not set
  const beforePhoto = anglePhotos.find((p) => p.id === beforePhotoId) || anglePhotos[0];
  const afterPhoto = anglePhotos.find((p) => p.id === afterPhotoId) || anglePhotos[anglePhotos.length - 1];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  const handleSwap = () => {
    if (beforePhoto && afterPhoto) {
      const temp = beforePhoto.id;
      setBeforePhotoId(afterPhoto.id);
      setAfterPhotoId(temp);
    }
  };

  const formatDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <div className="space-y-4 select-none">
      {/* Angle Filter Selector */}
      <div className="bg-[#11141a] border border-slate-900 rounded-2xl p-1.5 flex gap-1 justify-between select-none">
        {(['crown', 'hairline', 'left', 'right'] as HairAngle[]).map((angle) => (
          <button
            key={angle}
            id={`btn-compare-filter-${angle}`}
            onClick={() => {
              setSelectedAngle(angle);
              // Reset IDs to trigger safe defaults on angle swap
              setBeforePhotoId('');
              setAfterPhotoId('');
            }}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-all uppercase tracking-tight ${
              selectedAngle === angle
                ? 'bg-[#191f2b] text-blue-400 border border-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-350'
            }`}
          >
            {angle === 'crown' ? 'Đỉnh đầu' : angle === 'hairline' ? 'Trán' : angle === 'left' ? 'T.D Trái' : 'T.D Phải'}
          </button>
        ))}
      </div>

      {anglePhotos.length < 2 ? (
        <div className="p-8 border border-dashed border-slate-900 rounded-2xl text-center text-slate-500 bg-[#11141a]/40 font-mono">
          <HelpCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-300">Không đủ dữ liệu so sánh</p>
          <p className="text-[10px] text-slate-550 mt-1 max-w-[240px] mx-auto leading-relaxed">
            Góc chụp này cần tối thiểu <span className="text-blue-400 font-medium">2 bức ảnh</span> ở các mốc thời gian khác nhau để tiến hành phân tích đối chiếu.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Selectors for Photo A and Photo B */}
          <div className="bg-[#11141a] p-3 rounded-2xl border border-slate-900 grid grid-cols-2 gap-3.5 items-center font-mono">
            
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Ảnh Trước (Before)</span>
              <select
                id="select-before-photo"
                value={beforePhoto?.id || ''}
                onChange={(e) => setBeforePhotoId(e.target.value)}
                className="w-full bg-[#0A0C10] border border-slate-900 rounded-xl py-1.5 px-2.5 text-xs text-slate-300 outline-none"
              >
                {anglePhotos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {formatDate(p.date)} {p.isCustom ? '(Mới)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 relative">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Ảnh Sau (After)</span>
              <div className="flex gap-1.5 items-center">
                <select
                  id="select-after-photo"
                  value={afterPhoto?.id || ''}
                  onChange={(e) => setAfterPhotoId(e.target.value)}
                  className="w-full bg-[#0A0C10] border border-slate-900 rounded-xl py-1.5 px-2.5 text-xs text-slate-300 outline-none"
                >
                  {anglePhotos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {formatDate(p.date)} {p.isCustom ? '(Mới)' : ''}
                    </option>
                  ))}
                </select>
                
                <button
                  id="btn-swap-before-after"
                  type="button"
                  onClick={handleSwap}
                  className="p-1.5 bg-[#0A0C10] border border-slate-900 hover:bg-[#191f2b] rounded-xl text-slate-400 hover:text-white transition-all flex items-center justify-center shrink-0"
                  title="Thay đổi vị trí ảnh"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Mode Switcher */}
          <div className="flex justify-center select-none font-mono">
            <div className="inline-flex bg-[#11141a] p-1 rounded-xl border border-slate-900">
              <button
                id="btn-mode-slider"
                onClick={() => setCompareMode('slider')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all ${
                  compareMode === 'slider'
                    ? 'bg-[#191f2b] text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Kéo slider
              </button>
              <button
                id="btn-mode-side-by-side"
                onClick={() => setCompareMode('side-by-side')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all ${
                  compareMode === 'side-by-side'
                    ? 'bg-[#191f2b] text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                Mặt đối mặt (Side)
              </button>
            </div>
          </div>

          {/* Main Visual Arena */}
          {beforePhoto && afterPhoto && (
            <div className="space-y-3 font-mono">
              {compareMode === 'slider' ? (
                /* INTERACTIVE DIVIDER SLIDER VIEW */
                <div className="space-y-2">
                  <div
                    ref={containerRef}
                    className="relative aspect-square w-full rounded-2xl overflow-hidden border border-slate-900 bg-black select-none"
                  >
                    {/* Before Image (Background Layer) */}
                    <img
                      src={beforePhoto.imageUrl}
                      alt="Before hair scan"
                      className="absolute inset-0 w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3.5 left-4 bg-black/85 px-2.5 py-1 rounded-lg border border-slate-900 text-[9px] text-slate-400 font-bold z-10 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-550" />
                      <span>Cũ: {formatDate(beforePhoto.date)}</span>
                    </div>

                    {/* After Image (Absolute Front Overlay Clip Layer) */}
                    <div
                      className="absolute inset-0 overflow-hidden pointer-events-none"
                      style={{ width: `${sliderPos}%` }}
                    >
                      <img
                        src={afterPhoto.imageUrl}
                        alt="After hair scan"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ width: containerRef.current?.getBoundingClientRect().width || '380px', maxWidth: 'none' }}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {/* After Tag floats aligned to the right inside the frame or static */}
                    <div className="absolute top-3.5 right-4 bg-blue-950/85 px-2.5 py-1 rounded-lg border border-blue-500/20 text-[9px] text-blue-400 font-bold z-10 uppercase tracking-wider flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-blue-550" />
                      <span>Mới: {formatDate(afterPhoto.date)}</span>
                    </div>

                    {/* Vertical Divider Indicator Line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-blue-500 shadow-xl shadow-blue-500/50 z-20 pointer-events-none"
                      style={{ left: `${sliderPos}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center border border-[#0A0C10] text-[10px]">
                        ↔
                      </div>
                    </div>

                    {/* Invisible Range Input spanning the container for full width drag sensitivity */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderPos}
                      onChange={handleSliderChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                    />
                  </div>
                  <p className="text-[10px] text-center text-slate-600 leading-normal">
                    💡 Kéo rê giữ chuột/tay trên khung ảnh để điều chỉnh thanh trượt so sánh.
                  </p>
                </div>
              ) : (
                /* SIDE BY SIDE VIEW */
                <div className="grid grid-cols-2 gap-3 pb-2 select-none">
                  <div className="bg-[#11141a] border border-slate-900 rounded-2xl p-2 flex flex-col items-center">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-2 font-mono">
                       Trước • {formatDate(beforePhoto.date)}
                    </span>
                    <div className="rounded-xl overflow-hidden aspect-square w-full bg-black border border-slate-900">
                      <img
                        src={beforePhoto.imageUrl}
                        alt="Before Hair Side view"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  <div className="bg-[#11141a] border border-slate-900 rounded-2xl p-2 flex flex-col items-center">
                    <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest block mb-2 font-mono">
                       Sau • {formatDate(afterPhoto.date)}
                    </span>
                    <div className="rounded-xl overflow-hidden aspect-square w-full bg-black border border-blue-500/10">
                      <img
                        src={afterPhoto.imageUrl}
                        alt="After Hair Side view"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
