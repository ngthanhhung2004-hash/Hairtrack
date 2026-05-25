import { PhotoEntry, RoutineTask, ReminderSetting } from '../types';

// Helper to generate elegant, clean minimal vector hairstyles
const crownThinningSVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="390" height="390" rx="32" fill="%231E293B"/><ellipse cx="200" cy="200" rx="110" ry="130" fill="%23F1F5F9" stroke="%23CBD5E1" stroke-width="4"/><circle cx="200" cy="180" r="40" fill="%23F3E8FF"/><g stroke="%23334155" stroke-width="2" opacity="0.65"><path d="M 200,90 C 160,110 160,160 160,180"/><path d="M 200,90 C 240,110 240,160 240,180"/><path d="M 120,200 C 140,200 155,180 160,180"/><path d="M 280,200 C 260,200 245,180 240,180"/><path d="M 200,310 C 200,270 200,195 200,180"/><path d="M 140,270 C 160,250 180,210 200,180"/><path d="M 260,270 C 240,250 220,210 200,180"/></g><g stroke="%233B82F6" stroke-width="2.5" opacity="0.45" stroke-linecap="round"><path d="M 195,170 Q 185,165 180,172"/><path d="M 205,185 Q 215,190 220,180"/><path d="M 190,190 Q 185,200 195,198"/><path d="M 210,165 Q 220,158 208,155"/><path d="M 200,180 A 10,10 0 1 1 199.9,180" fill="none"/></g><text x="30" y="360" font-family="Inter, sans-serif" font-size="12" fill="%2364748B" font-weight="bold">CROWN • INITIAL STAGE</text></svg>`;

const crownImprovedSVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="390" height="390" rx="32" fill="%231E293B"/><ellipse cx="200" cy="200" rx="110" ry="130" fill="%23F1F5F9" stroke="%233B82F6" stroke-width="4"/><circle cx="200" cy="180" r="15" fill="%23E0F2FE"/><g stroke="%231E293B" stroke-width="4" opacity="0.9" stroke-linecap="round"><path d="M 200,90 C 160,115 160,165 190,175"/><path d="M 200,90 C 240,115 240,165 210,175"/><path d="M 120,200 C 145,200 175,185 190,180"/><path d="M 280,200 C 255,200 225,185 210,180"/><path d="M 200,310 C 200,270 195,195 195,180"/><path d="M 140,270 C 165,250 185,210 195,180"/><path d="M 260,270 C 235,250 215,210 205,180"/><path d="M 180,130 C 195,145 195,170 197,178"/><path d="M 220,130 C 205,145 205,170 203,178"/><path d="M 150,160 C 170,165 185,175 195,179"/><path d="M 250,160 C 230,165 215,175 205,179"/></g><text x="30" y="360" font-family="Inter, sans-serif" font-size="12" fill="%2364748B" font-weight="bold">CROWN • CURRENT STAGE</text></svg>`;

const hairlineMThinningSVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="390" height="390" rx="32" fill="%231E293B"/><ellipse cx="200" cy="280" rx="95" ry="110" fill="%23F1F5F9" stroke="%23CBD5E1" stroke-width="4"/><g fill="none" stroke="%23334155" stroke-width="3" stroke-linecap="round"><path d="M 105,240 C 115,180 150,185 200,220 C 250,185 285,180 295,240"/></g><g fill="%23E2E8F0" opacity="0.5"><path d="M 105,240 Q 150,150 200,190 Q 250,150 295,240 Z"/></g><ellipse cx="160" cy="280" rx="10" ry="5" fill="%2394A3B8"/><ellipse cx="240" cy="280" rx="10" ry="5" fill="%2394A3B8"/><path d="M 180,310 Q 200,320 220,310" fill="none" stroke="%2394A3B8" stroke-width="3"/><text x="30" y="360" font-family="Inter, sans-serif" font-size="12" fill="%2364748B" font-weight="bold">HAIRLINE • M-SHAPE INITIAL</text></svg>`;

const hairlineMImprovedSVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="390" height="390" rx="32" fill="%231E293B"/><ellipse cx="200" cy="280" rx="95" ry="110" fill="%23F1F5F9" stroke="%233B82F6" stroke-width="4"/><g fill="none" stroke="%231E293B" stroke-width="5" stroke-linecap="round"><path d="M 105,240 C 112,165 145,175 200,195 C 255,175 288,165 295,240"/></g><g fill="none" stroke="%2310B981" stroke-width="2.5" stroke-linecap="round" opacity="0.75"><path d="M 112,210 Q 130,175 145,190"/><path d="M 132,192 Q 150,180 165,193"/><path d="M 288,210 Q 270,175 255,190"/><path d="M 268,192 Q 250,180 235,193"/></g><ellipse cx="160" cy="280" rx="10" ry="5" fill="%23334155"/><ellipse cx="240" cy="280" rx="10" ry="5" fill="%23334155"/><path d="M 180,310 Q 200,315 220,310" fill="none" stroke="%23334155" stroke-width="3"/><text x="30" y="360" font-family="Inter, sans-serif" font-size="12" fill="%2364748B" font-weight="bold">HAIRLINE • M-SHAPE RECOVERY</text></svg>`;

const leftTempleThinningSVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="390" height="390" rx="32" fill="%231E293B"/><ellipse cx="250" cy="220" rx="90" ry="110" fill="%23F1F5F9" stroke="%23CBD5E1" stroke-width="4"/><path d="M 160,220 C 160,170 180,150 200,140 Q 230,120 270,120" fill="none" stroke="%23475569" stroke-width="4"/><ellipse cx="190" cy="220" rx="4" ry="8" fill="%2394A3B8"/><path d="M 175,250 Q 185,255 195,250" fill="none" stroke="%2394A3B8" stroke-width="2"/><g fill="none" stroke="%23475569" stroke-width="2.5" opacity="0.6" stroke-linecap="round"><path d="M 210,135 Q 230,155 240,180"/><path d="M 225,125 Q 240,145 250,175"/><path d="M 250,120 Q 260,140 268,160"/></g><text x="30" y="360" font-family="Inter, sans-serif" font-size="12" fill="%2364748B" font-weight="bold">LEFT TEMPLE • RETREATING</text></svg>`;

const leftTempleImprovedSVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="390" height="390" rx="32" fill="%231E293B"/><ellipse cx="250" cy="220" rx="90" ry="110" fill="%23F1F5F9" stroke="%233B82F6" stroke-width="4"/><path d="M 160,220 C 160,150 180,135 200,130 Q 230,115 270,115" fill="none" stroke="%231E293B" stroke-width="5"/><ellipse cx="190" cy="220" rx="4" ry="8" fill="%23334155"/><path d="M 175,250 Q 185,255 195,250" fill="none" stroke="%23334155" stroke-width="2"/><g fill="none" stroke="%231E293B" stroke-width="3.5" opacity="0.9" stroke-linecap="round"><path d="M 200,135 Q 215,150 230,180"/><path d="M 215,130 Q 230,145 242,175"/><path d="M 230,125 Q 245,140 255,165"/><path d="M 245,120 Q 255,135 265,155"/></g><g fill="none" stroke="%2310B981" stroke-width="2" stroke-linecap="round" opacity="0.8"><path d="M 185,150 Q 195,160 210,185"/><path d="M 195,142 Q 205,152 218,175"/></g><text x="30" y="360" font-family="Inter, sans-serif" font-size="12" fill="%2364748B" font-weight="bold">LEFT TEMPLE • FILLING IN</text></svg>`;

const rightTempleThinningSVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="390" height="390" rx="32" fill="%231E293B"/><ellipse cx="150" cy="220" rx="90" ry="110" fill="%23F1F5F9" stroke="%23CBD5E1" stroke-width="4"/><path d="M 240,220 C 240,170 220,150 200,140 Q 170,120 130,120" fill="none" stroke="%23475569" stroke-width="4"/><ellipse cx="210" cy="220" rx="4" ry="8" fill="%2394A3B8"/><path d="M 205,250 Q 195,255 185,250" fill="none" stroke="%2394A3B8" stroke-width="2"/><g fill="none" stroke="%23475569" stroke-width="2.5" opacity="0.6" stroke-linecap="round"><path d="M 190,135 Q 170,155 160,180"/><path d="M 175,125 Q 160,145 150,175"/><path d="M 150,120 Q 140,140 132,160"/></g><text x="30" y="360" font-family="Inter, sans-serif" font-size="12" fill="%2364748B" font-weight="bold">RIGHT TEMPLE • RETREATING</text></svg>`;

const rightTempleImprovedSVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="390" height="390" rx="32" fill="%231E293B"/><ellipse cx="150" cy="220" rx="90" ry="110" fill="%23F1F5F9" stroke="%233B82F6" stroke-width="4"/><path d="M 240,220 C 240,150 220,135 200,130 Q 170,115 130,115" fill="none" stroke="%231E293B" stroke-width="5"/><ellipse cx="210" cy="220" rx="4" ry="8" fill="%23334155"/><path d="M 205,250 Q 195,255 185,250" fill="none" stroke="%23334155" stroke-width="2"/><g fill="none" stroke="%231E293B" stroke-width="3.5" opacity="0.9" stroke-linecap="round"><path d="M 200,135 Q 185,150 170,180"/><path d="M 185,130 Q 170,145 158,175"/><path d="M 170,125 Q 155,140 145,165"/><path d="M 155,120 Q 145,135 135,155"/></g><g fill="none" stroke="%2310B981" stroke-width="2" stroke-linecap="round" opacity="0.8"><path d="M 215,150 Q 205,160 190,185"/><path d="M 205,142 Q 195,152 182,175"/></g><text x="30" y="360" font-family="Inter, sans-serif" font-size="12" fill="%2364748B" font-weight="bold">RIGHT TEMPLE • FILLING IN</text></svg>`;


export const initialPhotos: PhotoEntry[] = [
  // 3 months ago (Midpoint)
  {
    id: 'photo-crown-3m',
    date: '2026-02-25',
    angle: 'crown',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="390" height="390" rx="32" fill="%231E293B"/><ellipse cx="200" cy="200" rx="110" ry="130" fill="%23F1F5F9" stroke="%2394A3B8" stroke-width="4"/><circle cx="200" cy="180" r="28" fill="%23FAE8FF"/><g stroke="%231E293B" stroke-width="2.5" opacity="0.8"><path d="M 200,90 C 160,112 160,162 170,178"/><path d="M 200,90 C 240,112 240,162 230,178"/><path d="M 120,200 C 142,200 162,182 170,178"/><path d="M 280,200 C 258,200 238,182 230,178"/><path d="M 200,310 C 200,270 200,195 200,180"/><path d="M 140,270 C 162,250 182,210 200,180"/><path d="M 260,270 C 238,250 218,210 200,180"/></g><g stroke="%233B82F6" stroke-width="2" opacity="0.5" stroke-linecap="round"><path d="M 195,170 Q 188,165 185,172"/><path d="M 205,185 Q 212,190 215,182"/><path d="M 190,190 Q 187,196 195,194"/></g><text x="30" y="360" font-family="Inter, sans-serif" font-size="12" fill="%2364748B" font-weight="bold">CROWN • 3 MONTHS AGO</text></svg>'
  },
  {
    id: 'photo-hairline-3m',
    date: '2026-02-25',
    angle: 'hairline',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="390" height="390" rx="32" fill="%231E293B"/><ellipse cx="200" cy="280" rx="95" ry="110" fill="%23F1F5F9" stroke="%2394A3B8" stroke-width="4"/><g fill="none" stroke="%23334155" stroke-width="4" stroke-linecap="round"><path d="M 105,240 C 109,172 147,180 200,208 C 253,180 291,172 295,240"/></g><g fill="none" stroke="%2310B981" stroke-width="1.5" stroke-linecap="round" opacity="0.4"><path d="M 110,225 Q 125,185 138,198"/><path d="M 290,225 Q 275,185 262,198"/></g><ellipse cx="160" cy="280" rx="10" ry="5" fill="%2364748B"/><ellipse cx="240" cy="280" rx="10" ry="5" fill="%2364748B"/><path d="M 180,310 Q 200,317 220,310" fill="none" stroke="%2364748B" stroke-width="3"/><text x="30" y="360" font-family="Inter, sans-serif" font-size="12" fill="%2364748B" font-weight="bold">HAIRLINE • 3 MONTHS AGO</text></svg>'
  },

  // 6 months ago (Initial state)
  {
    id: 'photo-crown-6m',
    date: '2025-11-25',
    angle: 'crown',
    imageUrl: crownThinningSVG
  },
  {
    id: 'photo-hairline-6m',
    date: '2025-11-25',
    angle: 'hairline',
    imageUrl: hairlineMThinningSVG
  },
  {
    id: 'photo-left-6m',
    date: '2025-11-25',
    angle: 'left',
    imageUrl: leftTempleThinningSVG
  },
  {
    id: 'photo-right-6m',
    date: '2025-11-25',
    angle: 'right',
    imageUrl: rightTempleThinningSVG
  },

  // Current (Today / Recovered state)
  {
    id: 'photo-crown-now',
    date: '2026-05-25',
    angle: 'crown',
    imageUrl: crownImprovedSVG
  },
  {
    id: 'photo-hairline-now',
    date: '2026-05-25',
    angle: 'hairline',
    imageUrl: hairlineMImprovedSVG
  },
  {
    id: 'photo-left-now',
    date: '2026-05-25',
    angle: 'left',
    imageUrl: leftTempleImprovedSVG
  },
  {
    id: 'photo-right-now',
    date: '2026-05-25',
    angle: 'right',
    imageUrl: rightTempleImprovedSVG
  }
];

export const initialRoutineTasks: RoutineTask[] = [
  { id: 'task-shampoo', name: 'Gội đầu với dầu gội trị rụng tóc', category: 'wash', frequency: 'every-two-days' },
  { id: 'task-minoxidil-m', name: 'Xịt Minoxidil 5% (Sáng)', category: 'topical', frequency: 'daily', timeOfDay: 'morning' },
  { id: 'task-minoxidil-e', name: 'Xịt Minoxidil 5% (Tối)', category: 'topical', frequency: 'daily', timeOfDay: 'evening' },
  { id: 'task-finasteride', name: 'Uống Finasteride 1mg', category: 'pill', frequency: 'daily', timeOfDay: 'morning' },
  { id: 'task-serum', name: 'Thoa Tinh dầu Bưởi/Serum dưỡng', category: 'serum', frequency: 'daily', timeOfDay: 'evening' }
];

export const initialReminders: ReminderSetting[] = [
  {
    id: 'rem-m-trt',
    type: 'treatment',
    title: 'Nhắc treatment sáng (Minoxidil / Finasteride)',
    frequency: 'daily',
    time: '08:00',
    enabled: true
  },
  {
    id: 'rem-e-trt',
    type: 'treatment',
    title: 'Nhắc treatment tối (Minoxidil / Serum)',
    frequency: 'daily',
    time: '21:00',
    enabled: true
  },
  {
    id: 'rem-photo',
    type: 'photo',
    title: 'Khung giờ chụp ảnh tóc hàng tuần',
    frequency: 'weekly',
    time: '10:00',
    enabled: true
  }
];
