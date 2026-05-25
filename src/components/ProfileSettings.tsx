import React, { useState } from 'react';
import { User, ReminderSetting } from '../types';
import { ShieldAlert, Bell, LogOut, RefreshCw, User as UserIcon } from 'lucide-react';

interface ProfileSettingsProps {
  user: User;
  reminders: ReminderSetting[];
  onUpdateUser: (updated: User) => void;
  onToggleReminder: (id: string) => void;
  onResetData: () => void;
  onLogout: () => void;
}

export default function ProfileSettings({
  user,
  reminders,
  onUpdateUser,
  onToggleReminder,
  onResetData,
  onLogout
}: ProfileSettingsProps) {
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age);
  const [gender, setGender] = useState(user.gender);
  const [editSuccess, setEditSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      age: Number(age),
      gender
    });
    setEditSuccess(true);
    setTimeout(() => setEditSuccess(false), 2000);
  };

  const getHairStatusVietnamese = (status: string) => {
    switch (status) {
      case 'normal': return 'Bình thường';
      case 'thin-mild': return 'Rụng nhẹ / Thưa sợi';
      case 'thin-heavy': return 'Rụng nhiều';
      case 'crown-thin': return 'Hói xoáy đỉnh đầu';
      case 'm-shape': return 'Rút hairline chữ M';
      default: return status;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0A0C10] pb-8 select-none">
      
      {/* Header element */}
      <div className="px-6 pt-5 pb-4 sticky top-0 bg-[#0A0C10]/95 backdrop-blur-md border-[#11141a] border-b z-20">
        <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 uppercase font-[#11141a] font-mono">
          <span>Hồ sơ & Thiết lập</span>
          <span className="text-sm">👤</span>
        </h2>
        <p className="text-[11px] text-slate-500 mt-0.5">Quản lý định lượng tóc và lịch nhắc nhở</p>
      </div>

      <div className="px-5 pt-4 space-y-5">
        
        {/* Profile edit physical form */}
        <form onSubmit={handleSaveProfile} className="bg-[#11141a] border border-slate-900 p-4 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-900 font-mono">
            <UserIcon className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Thông tin cá nhân</span>
          </div>

          {editSuccess && (
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center font-bold rounded-xl font-mono">
              Danh tính chỉnh sửa thành công!
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Họ và tên</label>
            <input
              id="profile-edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0A0C10] border border-slate-900 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-650 outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Tuổi</label>
              <input
                id="profile-edit-age"
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-[#0A0C10] border border-slate-900 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none focus:border-blue-500 font-mono"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Giới tính</label>
              <select
                id="profile-edit-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-[#0A0C10] border border-slate-900 rounded-xl py-2 px-2 text-xs text-slate-200 outline-none focus:border-blue-500 font-mono"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          <button
            id="btn-save-profile"
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] rounded-xl shadow transition-all mt-1 uppercase tracking-wider font-mono"
          >
            Lưu thay đổi danh tính
          </button>
        </form>

        {/* Hair Profile read-only info from onboarding */}
        {user.onboardingData && (
          <div className="bg-[#11141a] border border-slate-900 p-4 rounded-2xl space-y-3 font-mono">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-900">
              <span className="text-sm">💇‍♂️</span>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Tình trạng tóc ban đầu</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0A0C10] p-2.5 rounded-xl border border-slate-900">
                <span className="text-[9px] text-slate-500 font-bold uppercase block tracking-wider leading-none">Độ rụng</span>
                <span className="text-[11px] font-bold text-rose-400 mt-2 block leading-none">
                  {getHairStatusVietnamese(user.onboardingData.hairStatus)}
                </span>
              </div>
              <div className="bg-[#0A0C10] p-2.5 rounded-xl border border-slate-900">
                <span className="text-[9px] text-slate-500 font-bold uppercase block tracking-wider leading-none">Kiểu da đầu</span>
                <span className="text-[11px] font-bold text-slate-300 mt-2 block leading-none">
                  {user.onboardingData.scalpType === 'oily' ? 'Da bết dầu' : user.onboardingData.scalpType === 'dry' ? 'Da khô' : 'Bình thường'}
                </span>
              </div>
            </div>

            <div className="pt-1.5">
              <span className="text-[9px] font-bold text-slate-550 uppercase tracking-wider block">Sản phẩm điều trị bắt đầu</span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {user.onboardingData.treatments.length === 0 ? (
                  <span className="text-xs text-slate-500">Chưa thiết lập điều trị nào</span>
                ) : (
                  user.onboardingData.treatments.map((tr, index) => (
                    <span key={index} className="px-2 py-0.5 rounded-md bg-[#0A0C10] border border-slate-900 text-[9px] font-bold text-blue-400 uppercase tracking-tight">
                      {tr === 'Anti-hair loss shampoo' ? 'Dầu gội trị rụng tóc' : tr === 'Oils' ? 'Serum/Tinh dầu' : tr}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reminders section with sliders */}
        <div className="bg-[#11141a] border border-slate-900 p-4 rounded-2xl space-y-4 select-none">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-900 font-mono">
            <Bell className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Nhắc nhở tự động (Push)</span>
          </div>

          <div className="space-y-3 font-mono">
            {reminders.map((rem) => (
              <div key={rem.id} className="flex justify-between items-center bg-[#0A0C10] p-3 rounded-xl border border-slate-900">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{rem.title}</h4>
                  <p className="text-[9px] text-slate-500 mt-1 uppercase font-semibold">
                    Lịch: {rem.frequency === 'daily' ? 'Hàng ngày' : 'Hàng tuần'} • Giờ: {rem.time}
                  </p>
                </div>

                <button
                  id={`btn-toggle-rem-${rem.id}`}
                  type="button"
                  onClick={() => onToggleReminder(rem.id)}
                  className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                    rem.enabled ? 'bg-blue-600' : 'bg-slate-800'
                  }`}
                >
                  <div className={`w-4.5 h-4.5 bg-white rounded-full shadow transform transition-transform duration-200 ${
                    rem.enabled ? 'translate-x-4.5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Admin and session tools */}
        <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-2xl space-y-3.5 select-none font-mono">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Cấu hình hệ thống & Reset</span>
          </div>
          
          <button
            id="btn-profile-reset-data"
            type="button"
            onClick={() => {
              if (window.confirm('Bạn có chắc chắn muốn khôi phục dữ liệu ban đầu? Mọi hình ảnh chụp thêm sụ bị xóa sạch.')) {
                onResetData();
              }
            }}
            className="w-full bg-[#0A0C10] hover:bg-red-500/10 border border-slate-900 hover:border-red-500/40 text-rose-450 hover:text-red-400 text-[10px] font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Khôi phục cấu hình mặc định
          </button>

          <button
            id="btn-profile-logout"
            type="button"
            onClick={onLogout}
            className="w-full bg-rose-950/10 hover:bg-rose-900/20 border border-slate-900 hover:border-red-500/30 text-rose-300 text-[10px] font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
          >
            <LogOut className="w-3.5 h-3.5" />
            Đăng xuất khỏi thiết bị
          </button>
        </div>

      </div>
    </div>
  );
}
