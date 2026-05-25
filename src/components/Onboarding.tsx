import { useState } from 'react';
import { OnboardingData, HairStatus, ScalpType } from '../types';
import { Check, Sparkles } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
  username: string;
}

const HAIR_STATUS_OPTIONS: { value: HairStatus; label: string; desc: string; emoji: string }[] = [
  { value: 'normal', label: 'Bình thường', desc: 'Tóc khỏe, mật độ đều, không rụng bất thường.', emoji: '❇️' },
  { value: 'thin-mild', label: 'Rụng nhẹ / Tóc mỏng', desc: 'Rụng rải rác, tóc mỏng hơn nhưng chưa lộ da đầu.', emoji: '🌱' },
  { value: 'thin-heavy', label: 'Rụng nhiều', desc: 'Rụng số lượng nhiều khi gội/vuốt, sợi tóc yếu hẳn.', emoji: '⚠️' },
  { value: 'crown-thin', label: 'Hói / Thưa đỉnh đầu', desc: 'Tóc thưa dần rõ rệt lộ mảng da đầu ở đỉnh đầu.', emoji: '⭕' },
  { value: 'm-shape', label: 'Hói chữ M (Trán)', desc: 'Hairline rút lui ở hai bên thái dương tạo hình chữ M.', emoji: '〽️' }
];

const SCALP_TYPE_OPTIONS: { value: ScalpType; label: string; desc: string; emoji: string }[] = [
  { value: 'normal', label: 'Bình thường', desc: 'Cân bằng, không quá khô hay bết dầu.', emoji: '⚖️' },
  { value: 'oily', label: 'Da đầu dầu', desc: 'Nhanh bết, nhiều gàu ẩm, sợi tóc bết dính.', emoji: '💦' },
  { value: 'dry', label: 'Da đầu khô', desc: 'Khô ngứa, dễ bong vảy gàu khô, thiếu ẩm.', emoji: '🍂' }
];

const TREATMENT_OPTIONS = [
  { id: 'Minoxidil', label: 'Thuốc xịt Minoxidil (5% / 2%)' },
  { id: 'Finasteride', label: 'Thuốc uống Finasteride' },
  { id: 'Anti-hair loss shampoo', label: 'Dầu gội trị rụng tóc / thảo dược' },
  { id: 'Oils', label: 'Serum dưỡng / Tinh dầu bưởi' },
  { id: 'Other', label: 'Thực phẩm chức năng / Khác' }
];

export default function Onboarding({ onComplete, username }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [hairStatus, setHairStatus] = useState<HairStatus>('thin-mild');
  const [scalpType, setScalpType] = useState<ScalpType>('normal');
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);

  const toggleTreatment = (id: string) => {
    if (selectedTreatments.includes(id)) {
      setSelectedTreatments(selectedTreatments.filter(t => t !== id));
    } else {
      setSelectedTreatments([...selectedTreatments, id]);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete({
        hairStatus,
        scalpType,
        treatments: selectedTreatments
      });
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0A0C10] px-6 py-8 justify-between">
      {/* Top Header tracking step */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest font-mono">
            Khảo sát tóc • Bước {step}/3
          </span>
          <div className="flex gap-1.5 h-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-6 rounded-full transition-all duration-300 ${
                  s === step ? 'bg-blue-500 w-10' : s < step ? 'bg-blue-900' : 'bg-slate-900'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Hair Status */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight uppercase font-mono leading-snug">
                Chào {username}, tình trạng tóc hiện tại của bạn thế nào?
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                Giúp ứng dụng đưa ra các mô phỏng và định mức chính xác cho routine của bạn.
              </p>
            </div>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto no-scrollbar pr-1">
              {HAIR_STATUS_OPTIONS.map((item) => (
                <button
                  key={item.value}
                  id={`onboard-status-${item.value}`}
                  type="button"
                  onClick={() => setHairStatus(item.value)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 block relative ${
                    hairStatus === item.value
                      ? 'bg-blue-600/5 border-blue-500 ring-1 ring-blue-500/20'
                      : 'bg-[#11141a] border-slate-900 hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl pt-0.5">{item.emoji}</span>
                    <div className="flex-1">
                      <div className="font-bold text-slate-200 text-xs font-mono">{item.label}</div>
                      <div className="text-[10px] text-slate-500 mt-1 leading-relaxed">{item.desc}</div>
                    </div>
                    {hairStatus === item.value && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Scalp Type */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight uppercase font-mono leading-snug">
                Gốc da đầu của bạn thuộc loại nào?
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                Loại da đầu quyết định tần suất sử dụng dầu gội trị liệu tốt nhất.
              </p>
            </div>

            <div className="space-y-3">
              {SCALP_TYPE_OPTIONS.map((item) => (
                <button
                  key={item.value}
                  id={`onboard-scalp-${item.value}`}
                  type="button"
                  onClick={() => setScalpType(item.value)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 block relative ${
                    scalpType === item.value
                      ? 'bg-blue-600/5 border-blue-500 ring-1 ring-blue-500/20'
                      : 'bg-[#11141a] border-slate-900 hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1">
                      <div className="font-bold text-slate-200 text-xs font-mono">{item.label}</div>
                      <div className="text-[10px] text-slate-500 mt-1 leading-relaxed">{item.desc}</div>
                    </div>
                    {scalpType === item.value && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-[#11141a] p-4 border border-slate-900 rounded-xl mt-6">
              <div className="flex gap-2.5 items-start">
                <span className="text-base">💡</span>
                <p className="text-[11px] text-slate-500 leading-normal">
                  <span className="text-slate-355 font-bold font-mono">Mẹo nhỏ: </span>
                  Nếu da đầu của bạn bị bết dầu chỉ sau nửa ngày từ khi gội, bạn thuộc nhóm <span className="text-blue-400 font-bold font-mono">Da bết dầu</span>. Nên ưu tiên dầu gội kiểm soát chất bã nhờn.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Treatments */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight uppercase font-mono leading-snug">
                Bạn có đang sử dụng biện pháp điều trị nào không?
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                HairTrack sẽ lên lịch nhắc nhở các routine này một cách khoa học nhất.
              </p>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto no-scrollbar">
              {TREATMENT_OPTIONS.map((item) => {
                const isSelected = selectedTreatments.includes(item.id);
                return (
                  <button
                    key={item.id}
                    id={`onboard-treat-${item.id}`}
                    type="button"
                    onClick={() => toggleTreatment(item.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 block relative ${
                      isSelected
                        ? 'bg-blue-600/5 border-blue-500 ring-1 ring-blue-500/20'
                        : 'bg-[#11141a] border-slate-900 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 text-xs font-mono">{item.label}</span>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-800'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-[#11141a] p-3.5 border border-slate-900 rounded-xl space-y-1.5 font-mono">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[10px] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Thiết lập Routine tự động</span>
              </div>
              <p className="text-[11px] text-slate-550 leading-relaxed">
                Hệ thống tự động thêm các mục đã chọn vào checklist hàng ngày nhằm kiểm soát lộ trình điều trị dễ dàng nhất.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-6 border-t border-slate-900 mt-4 select-none font-mono">
        {step > 1 && (
          <button
            id="btn-onboard-prev"
            type="button"
            onClick={handlePrev}
            className="flex-1 max-w-[100px] bg-[#11141a] hover:bg-[#191f2b] text-slate-400 font-bold py-3 rounded-xl border border-slate-900 transition-all text-[11px] uppercase tracking-wide"
          >
            Quay lại
          </button>
        )}
        <button
          id="btn-onboard-next"
          type="button"
          onClick={handleNext}
          className="flex-grow bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all text-[11px] flex items-center justify-center gap-2 uppercase tracking-wide"
        >
          {step === 3 ? 'Hoàn tất & Xem Dashboard' : 'Tiếp tục'}
          {step < 3 && <span className="text-xs">→</span>}
        </button>
      </div>
    </div>
  );
}
