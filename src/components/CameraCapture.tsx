import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { HairAngle, PhotoEntry } from '../types';

interface CameraCaptureProps {
  onPhotoSaved: (photo: PhotoEntry) => void;
  onNavigate: (tab: string) => void;
}

export default function CameraCapture({ onPhotoSaved, onNavigate }: CameraCaptureProps) {
  const [selectedAngle, setSelectedAngle] = useState<HairAngle>('crown');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize camera when component mounts or angle changes (if not captured)
  useEffect(() => {
    if (!capturedImage) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [selectedAngle, capturedImage]);

  const startCamera = async () => {
    setCameraError('');
    stopCamera();

    try {
      const constraints = {
        video: {
          facingMode: 'user', // front camera for selfie-style hair checks
          width: { ideal: 640 },
          height: { ideal: 640 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(
        'Không thể mở webcam trực tiếp. Bạn vẫn có thể Tải ảnh lên từ thư viện để hoàn tất chụp tóc.'
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth || 480;
        canvas.height = video.videoHeight || 480;
        
        // Draw standard camera mirror effect
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Revert transform
        context.setTransform(1, 0, 0, 1, 0, 0);

        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        stopCamera();
      }
    } else {
      // Simulate snapshot fallback if camera is broken/refused (generates a beautiful simulated snapshot!)
      simulateMockSnapshot();
    }
  };

  // Create a high quality mock image with custom canvas and overlay embedded to support desktop environments
  const simulateMockSnapshot = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 390, 390);
      grad.addColorStop(0, '#0A0C10');
      grad.addColorStop(1, '#11141a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 400, 400);

      // Scalp circle mockup
      ctx.beginPath();
      ctx.arc(200, 200, 95, 0, Math.PI * 2);
      ctx.fillStyle = '#191f2b';
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 3;
      ctx.fill();
      ctx.stroke();

      // Draw stylized hair density depending on selected angle
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 12px monospace';
      
      if (selectedAngle === 'crown') {
        // Draw crown swirl
        ctx.beginPath();
        ctx.arc(200, 190, 22, 0, Math.PI * 2);
        ctx.fillStyle = '#111317';
        ctx.fill();

        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2.5;
        // swirl lines
        ctx.beginPath();ctx.arc(200, 190, 40, 0, Math.PI, true); ctx.stroke();
        ctx.beginPath();ctx.arc(200, 190, 70, 1, Math.PI * 1.5); ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.fillText('DIAGNOSTIC CROWN SCAN [OK]', 30, 355);
      } else if (selectedAngle === 'hairline') {
        // M hair
        ctx.beginPath();
        ctx.moveTo(110, 250);
        ctx.bezierCurveTo(120, 180, 150, 190, 200, 215);
        ctx.bezierCurveTo(250, 190, 280, 180, 290, 250);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.arc(140, 205, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(260, 205, 3, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#64748b';
        ctx.fillText('DIAGNOSTIC HAIRLINE SCAN [OK]', 30, 355);
      } else {
        // side temple mockup
        ctx.beginPath();
        ctx.arc(230, 210, 75, 0, Math.PI * 2);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.fillText(`DIAGNOSTIC SIDE ${selectedAngle.toUpperCase()} TEMPLE SCAN [OK]`, 30, 355);
      }

      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`ID: ${Math.floor(Math.random() * 900000 + 100000)} • SCAN DT: ${new Date().toLocaleDateString('vi-VN')}`, 30, 45);

      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  const savePhoto = () => {
    if (!capturedImage) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const newEntry: PhotoEntry = {
      id: `photo-custom-${Date.now()}`,
      date: todayStr,
      angle: selectedAngle,
      imageUrl: capturedImage,
      isCustom: true
    };

    onPhotoSaved(newEntry);
    setSaveSuccess(true);
    
    setTimeout(() => {
      setSaveSuccess(false);
      setCapturedImage(null);
      // Navigate straight to the timeline to inspect the new photo entry!
      onNavigate('timeline');
    }, 1800);
  };

  const discardCaptured = () => {
    setCapturedImage(null);
    setSaveSuccess(false);
  };

  // Get guide outline overlay path based on selected angle
  const renderAngleOverlay = () => {
    switch (selectedAngle) {
      case 'crown':
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none font-mono">
            <div className="w-52 h-52 border border-dashed border-blue-500/50 rounded-full flex items-center justify-center bg-blue-500/5 animate-pulse">
              <span className="bg-[#0A0C10]/90 text-[9px] text-blue-400 font-bold px-2 py-1 rounded border border-blue-500/20 uppercase tracking-tight">
                Ủ vị trí đỉnh đầu tại đây
              </span>
            </div>
          </div>
        );
      case 'hairline':
        return (
          <div className="absolute inset-0 flex flex-col justify-end pb-24 items-center pointer-events-none select-none font-mono">
            <svg className="w-60 h-32 stroke-blue-500 stroke-[1.5] fill-none opacity-70" viewBox="0 0 100 50">
              <path d="M 12 38 Q 25 15, 50 35 Q 75 15, 88 38" strokeDasharray="3 3"/>
              <line x1="50" y1="0" x2="50" y2="50" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="1 3" />
            </svg>
            <span className="bg-[#0A0C10]/90 text-[9px] text-blue-400 font-bold px-2 py-1 rounded border border-blue-500/20 uppercase tracking-tight">
              Căn giữa trán & chân tóc chữ M
            </span>
          </div>
        );
      case 'left':
        return (
          <div className="absolute inset-0 flex items-center justify-start pl-16 pointer-events-none select-none font-mono">
            <div className="w-44 h-60 border border-dashed border-indigo-400/50 rounded-r-full bg-indigo-500/5 flex items-center justify-center">
              <span className="bg-[#0A0C10]/95 text-[9px] text-indigo-400 font-bold px-2 py-0.5 rounded border border-indigo-500/20 rotate-90 whitespace-nowrap uppercase tracking-tight">
                Thái dương bên trái
              </span>
            </div>
          </div>
        );
      case 'right':
        return (
          <div className="absolute inset-0 flex items-center justify-end pr-16 pointer-events-none select-none font-mono">
            <div className="w-44 h-60 border border-dashed border-indigo-400/50 rounded-l-full bg-indigo-500/5 flex items-center justify-center">
              <span className="bg-[#0A0C10]/95 text-[9px] text-indigo-400 font-bold px-2 py-0.5 rounded border border-indigo-500/20 -rotate-90 whitespace-nowrap uppercase tracking-tight">
                Thái dương bên phải
              </span>
            </div>
          </div>
        );
    }
  };

  const angleOptions: { value: HairAngle; desc: string }[] = [
    { value: 'crown', desc: 'Đỉnh đầu: Thường dùng phát hiện rụng tóc androgen / hói xoáy sớm.' },
    { value: 'hairline', desc: 'Đường chân tóc: Phát hiện rút lui trán chữ M thường xảy ra ở nam giới.' },
    { value: 'left', desc: 'Thái dương trái: Kiểm tra độ thưa thớt mái chéo bên trái.' },
    { value: 'right', desc: 'Thái dương phải: Kiểm tra tóc thưa và mỏng sườn trán bên phải.' }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#0A0C10] pb-8 select-none">
      
      {/* Invisible HTML File input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        id="camera-file-picker"
      />

      {/* Header bar */}
      <div className="px-6 pt-5 pb-4 sticky top-0 bg-[#0A0C10]/95 backdrop-blur-md border-b border-[#11141a] z-20">
        <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 uppercase font-mono">
          <span>Ống kính HairTrack</span>
          <span className="text-sm">📸</span>
        </h2>
        <p className="text-[11px] text-slate-500 mt-0.5">Mô phỏng chụp quét cơ bản bằng camera/webcam</p>
      </div>

      <div className="px-5 pt-3 space-y-4">
        
        {/* Angle Select Tabs selector */}
        <div className="space-y-1 font-mono">
          <label className="text-[10px] font-bold text-slate-550 uppercase tracking-widest block font-mono">
            Chọn góc rụng
          </label>
          <div className="grid grid-cols-4 gap-1.5 pt-1 select-none">
            {(['crown', 'hairline', 'left', 'right'] as HairAngle[]).map((ang) => (
              <button
                key={ang}
                id={`btn-select-angle-${ang}`}
                onClick={() => {
                  setSelectedAngle(ang);
                  discardCaptured();
                }}
                className={`py-2 rounded-xl text-center text-[10px] font-bold border transition-all uppercase tracking-tight ${
                  selectedAngle === ang
                    ? 'bg-blue-600 text-white border-blue-500 shadow'
                    : 'bg-[#11141a] text-slate-500 border-slate-900 hover:text-slate-300'
                }`}
              >
                {ang === 'crown' ? 'Đỉnh' : ang === 'hairline' ? 'Trán' : ang === 'left' ? 'TD Trái' : 'TD Phải'}
              </button>
            ))}
          </div>
          <p className="text-[9px] text-slate-550 pt-1 leading-normal uppercase">
            🔍 {angleOptions.find(o => o.value === selectedAngle)?.desc}
          </p>
        </div>

        {/* Viewport for video/capture result */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black border border-slate-900 flex items-center justify-center">
          
          {saveSuccess && (
            <div className="absolute inset-0 bg-[#0A0C10]/95 z-30 flex flex-col items-center justify-center text-center p-6 animate-fade-in font-mono">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wide">Lưu ảnh thành công!</h3>
              <p className="text-[10.5px] text-slate-500 mt-1 max-w-[240px] leading-relaxed">
                Hình ảnh mới đã được đồng bộ vào timeline của bạn để so sánh kết quả.
              </p>
            </div>
          )}

          {capturedImage ? (
            /* Render Snapshot captured state */
            <div className="relative w-full h-full flex items-center justify-center bg-[#0A0C10]">
              <img
                src={capturedImage}
                alt="Captured hair scan layout"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-[#0A0C10]/90 px-2.5 py-1 rounded-lg border border-slate-900 text-[9px] font-bold text-blue-400 flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3" />
                <span className="uppercase tracking-wider">ẢNH ĐÃ CHỤP QUÉT</span>
              </div>
            </div>
          ) : (
            /* Render Camera streaming feed */
            <div className="relative w-full h-full flex items-center justify-center">
              {cameraError ? (
                /* Falling back message for browser permissions denial */
                <div className="p-6 text-center text-slate-500 max-w-[280px] font-mono">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2.5" />
                  <p className="text-xs font-bold text-slate-200 uppercase tracking-wide">Camera Chưa Sẵn Sàng</p>
                  <p className="text-[10px] text-slate-550 mt-1.5 leading-relaxed">
                    Trình duyệt chặn truy cập camera hoặc không tìm thấy webcam. Bạn có thể sử dụng tính năng nạp mô phỏng.
                  </p>
                  
                  {/* Mock tester snapshot preview loader trigger */}
                  <button
                    id="btn-simulate-camera-snap"
                    onClick={simulateMockSnapshot}
                    className="mt-4 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold transition-all uppercase tracking-wide"
                  >
                    🚀 Trải nghiệm giả lập chụp ảnh
                  </button>
                </div>
              ) : (
                /* Webcam Stream render */
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]" // mirror view
                />
              )}

              {/* Angle guideline overlay logic */}
              {!cameraError && renderAngleOverlay()}
            </div>
          )}
        </div>

        {/* Action button controls */}
        <div className="space-y-3 font-mono">
          {capturedImage ? (
            <div className="flex gap-3">
              <button
                id="btn-camera-discard"
                onClick={discardCaptured}
                className="flex-1 py-3 bg-[#11141a] hover:bg-[#191f2b] border border-slate-900 text-slate-400 font-bold text-[11px] uppercase tracking-wide rounded-xl"
              >
                Hủy ảnh
              </button>
              <button
                id="btn-camera-save-photo"
                onClick={savePhoto}
                className="flex-grow py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] uppercase tracking-wide rounded-xl flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Lưu vào Timeline
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                id="btn-upload-file-trigger"
                onClick={triggerUploadClick}
                className="flex-[2] py-3.5 bg-[#11141a] hover:bg-[#191f2b] border border-slate-900 text-slate-400 font-bold text-[11px] uppercase tracking-wide rounded-xl flex items-center justify-center gap-1.5"
              >
                <Upload className="w-4 h-4 text-blue-450" />
                Tải ảnh
              </button>
              
              <button
                id="btn-camera-snap"
                onClick={capturePhoto}
                className="flex-[3] py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] uppercase tracking-wide rounded-xl flex items-center justify-center gap-1.5"
              >
                <Camera className="w-4 h-4" />
                Chụp ngay
              </button>
            </div>
          )}
        </div>

        {/* Instructions list box */}
        <div className="bg-[#11141a] border border-slate-900 rounded-2xl p-4 space-y-2 select-none font-mono">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Quy tắc chụp chuẩn quốc tế</span>
          <div className="space-y-2 pt-1">
            <div className="flex items-start gap-2">
              <span className="text-[10px] text-blue-450 font-bold">1.</span>
              <p className="text-[10.5px] text-slate-500 leading-normal">
                Sử dụng <span className="text-slate-350 font-bold">ánh sáng tự nhiên</span> (gần cửa sổ hoặc phòng ánh sáng mạnh), hạn chế chụp đèn vàng gây nhiễu màu da đầu.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[10px] text-blue-450 font-bold">2.</span>
              <p className="text-[10.5px] text-slate-500 leading-normal">
                Rẽ ngôi đều/vén tóc gọn gàng để lộ rõ mật độ lỗ chân lông và biểu bì da đầu dễ so sánh nhất.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[10px] text-blue-450 font-bold">3.</span>
              <p className="text-[10.5px] text-slate-500 leading-normal">
                Cố định khoảng cách chụp <span className="text-slate-350 font-bold">khoảng 30-40cm</span> để máy ảnh lấy nét chính xác không bị mờ nhòe.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Clean canvas for canvas capture references */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
