import React, { useState, useEffect } from 'react';
import { Mail, Lock, User as UserIcon, Sparkles } from 'lucide-react';
import { User } from '../types';

interface AuthProps {
  onAuthSuccess: (user: User) => void;
}

type AuthScreen = 'splash' | 'login' | 'register' | 'forgot';

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [screen, setScreen] = useState<AuthScreen>('splash');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('Nam');
  
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  // Auto transition from Splash Screen to login after 2.2 seconds
  useEffect(() => {
    if (screen === 'splash') {
      const timer = setTimeout(() => {
        setScreen('login');
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    // Simulate authentication
    const mockUser: User = {
      name: email === 'ngthanhhung2004@gmail.com' ? 'Hùng Nguyễn' : email.split('@')[0],
      email: email,
      age: 26,
      gender: 'Nam',
      isOnboarded: false
    };

    onAuthSuccess(mockUser);
  };

  const handleQuickLogin = () => {
    const mockUser: User = {
      name: 'Nguyễn Thành Hùng',
      email: 'ngthanhhung2004@gmail.com',
      age: 22,
      gender: 'Nam',
      isOnboarded: false
    };
    onAuthSuccess(mockUser);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    const mockUser: User = {
      name,
      email,
      age: Number(age) || 25,
      gender,
      isOnboarded: false
    };

    onAuthSuccess(mockUser);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMsg('');

    if (!email) {
      setError('Vui lòng nhập địa chỉ email.');
      return;
    }

    setInfoMsg('Một liên kết đặt lại mật khẩu đã được gửi đến email của bạn.');
    setTimeout(() => {
      setScreen('login');
      setInfoMsg('');
    }, 3000);
  };

  if (screen === 'splash') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0A0C10] p-8 select-none">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl scale-125 animate-pulse" />
          <div className="relative w-20 h-20 bg-[#11141a] border border-slate-900 rounded-3xl flex items-center justify-center text-white text-4xl shadow">
            💇‍♂️
          </div>
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight text-white uppercase font-mono">
          HairTrack
        </h1>
        <p className="text-[10px] text-slate-550 mt-1 font-bold tracking-widest font-mono uppercase">
          PERSONAL HAIR HEALTH DIARY
        </p>

        <div className="mt-12 flex items-center gap-1.5 h-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce"></span>
        </div>
        <span className="text-[8px] text-slate-600 mt-6 uppercase tracking-widest font-mono font-bold block">
          MVP PHASE 1 CLINICAL PROTOTYPE
        </span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-10 bg-[#0A0C10] overflow-y-auto">
      {/* Upper Logo header */}
      <div className="text-center mb-8 select-none font-mono">
        <span className="text-3xl">💇‍♂️</span>
        <h2 className="text-lg font-bold text-white mt-2 uppercase tracking-wide">HairTrack</h2>
        <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">Theo dõi & cải thiện mái tóc của bạn</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-650/5 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-mono font-bold">
          {error}
        </div>
      )}

      {infoMsg && (
        <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs text-center font-mono font-bold w-full">
          {infoMsg}
        </div>
      )}

      {screen === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4 font-mono">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ten@example.com"
                className="w-full bg-[#11141a] border border-slate-900 rounded-xl py-3 pl-11 pr-4 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-blue-500/50 transition-all font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Mật khẩu</label>
              <button
                id="btn-forgot-password-trigger"
                type="button"
                onClick={() => setScreen('forgot')}
                className="text-[10px] text-blue-400 hover:underline font-bold uppercase tracking-wider"
              >
                Quên mật khẩu?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                className="w-full bg-[#11141a] border border-slate-900 rounded-xl py-3 pl-11 pr-4 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>
          </div>

          <button
            id="btn-login"
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold py-3.5 rounded-xl shadow focus:outline-none active:scale-[0.98] transition-all uppercase tracking-wide mt-2"
          >
            Đăng nhập hệ thống
          </button>

          {/* Quick tester login connector line */}
          <div className="relative flex py-2 items-center justify-center">
            <div className="flex-grow border-t border-slate-900"></div>
            <span className="flex-shrink mx-3 text-[9px] text-slate-600 font-bold uppercase tracking-widest font-mono">Đỡ nhập liệu</span>
            <div className="flex-grow border-t border-slate-900"></div>
          </div>

          <button
            id="btn-quick-login"
            type="button"
            onClick={handleQuickLogin}
            className="w-full bg-[#11141a] hover:bg-[#191f2b] border border-slate-900 text-slate-350 text-[10px] font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all uppercase tracking-wide"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Đăng nhập nhanh (lead tester)
          </button>

          <p className="text-center text-[10px] text-slate-550 pt-3 uppercase font-bold tracking-wider">
            Chưa có tài khoản?{' '}
            <button
              id="btn-register-trigger"
              type="button"
              onClick={() => setScreen('register')}
              className="text-blue-400 font-bold hover:underline"
            >
              Đăng ký tại đây
            </button>
          </p>
        </form>
      )}

      {screen === 'register' && (
        <form onSubmit={handleRegister} className="space-y-4 font-mono max-h-[580px] overflow-y-auto no-scrollbar pr-1">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Họ và tên</label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input
                id="register-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full bg-[#11141a] border border-slate-900 rounded-xl py-2.5 pl-11 pr-3 text-xs text-slate-200 placeholder-slate-655 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ten@example.com"
                className="w-full bg-[#11141a] border border-slate-900 rounded-xl py-2.5 pl-11 pr-3 text-xs text-slate-200 placeholder-slate-655 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu bảo mật"
                className="w-full bg-[#11141a] border border-slate-900 rounded-xl py-2.5 pl-11 pr-3 text-xs text-slate-200 placeholder-slate-655 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pb-1">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Tuổi</label>
              <input
                id="register-age"
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-[#11141a] border border-slate-900 rounded-xl py-2.5 px-3.5 text-xs text-slate-200 placeholder-slate-655 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Giới tính</label>
              <select
                id="register-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-[#11141a] border border-slate-900 rounded-xl py-2.5 px-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          <button
            id="btn-register-submit"
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold py-3 rounded-xl transition-all mt-4 uppercase tracking-wide"
          >
            Đăng ký & Thiết lập hồ sơ
          </button>

          <p className="text-center text-[10px] text-slate-500 pt-2 uppercase tracking-wide font-bold">
            Đã có tài khoản?{' '}
            <button
              id="btn-login-trigger"
              type="button"
              onClick={() => setScreen('login')}
              className="text-blue-400 font-bold hover:underline"
            >
              Đăng nhập tại đây
            </button>
          </p>
        </form>
      )}

      {screen === 'forgot' && (
        <form onSubmit={handleForgotPassword} className="space-y-4 font-mono">
          <div className="text-center mb-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider leading-relaxed font-bold">
              Nhập email để nhận liên kết khôi phục mật khẩu.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Địa chỉ Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ten@example.com"
                className="w-full bg-[#11141a] border border-slate-900 rounded-xl py-3 pl-11 pr-4 text-xs text-slate-200 placeholder-slate-655 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            id="btn-forgot-submit"
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold py-3.5 rounded-xl transition-all uppercase tracking-wide"
          >
            Yêu cầu đặt lại mật khẩu
          </button>

          <button
            id="btn-back-to-login"
            type="button"
            onClick={() => setScreen('login')}
            className="w-full bg-transparent border border-slate-900 text-slate-500 hover:text-slate-300 text-[10px] py-2.5 rounded-xl font-bold transition-all uppercase tracking-wide"
          >
            Quay lại Đăng nhập
          </button>
        </form>
      )}
    </div>
  );
}
