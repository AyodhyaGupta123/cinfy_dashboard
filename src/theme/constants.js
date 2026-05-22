/* ═══════════════════════════════════════
   GLOBAL THEME CONSTANTS
   All colors & tokens defined here.
   Import in any component:
     import { theme } from '@/theme/constants'
   ═══════════════════════════════════════ */

export const theme = {
  // Brand
  primary: '#03D985',
  primaryHover: '#02b870',
  primaryLight: 'rgba(3,217,133,0.08)',
  primaryBorder: 'rgba(3,217,133,0.2)',
  bgBase: '#FFFFFF',
  error: '#ef4444',
  success: '#16a34a',
  warning: '#f59e0b',
  info: '#3b82f6',

  // Content Area (Light)
  pageBg: '#f5f5f5',
  cardBg: '#fff',
  cardBorder: '#e8e8e8',
  cardBorderHover: '#03D985',

  // Topbar
  topbarBg: '#fff',
  topbarBorder: '#e5e5e5',

  // Input / Form
  inputBg: '#fff',
  inputBorder: '#ddd',
  inputFocusBorder: '#03D985',
  inputText: '#333',
  inputPlaceholder: '#aaa',

  // Text (Light theme content)
  textPrimary: '#111',
  textSecondary: '#555',
  textMuted: '#888',
  textLight: '#aaa',

  // Table
  tableBg: '#fff',
  tableHeaderBg: '#fafafa',
  tableHeaderText: '#888',
  tableBorder: '#e8e8e8',
  tableRowHover: '#f9fafb',

  // Sidebar (Dark)
  sidebarBg: '#0a0a0a',
  sidebarBorder: 'rgba(255,255,255,0.06)',
  sidebarText: '#a0a0a0',
  sidebarTextActive: '#03D985',
  sidebarActiveBg: 'linear-gradient(90deg, rgba(3,217,133,0.12) 0%, transparent 100%)',

  // Stat Card Icon Colors (matching reference exactly)
  statIcons: {
    revenue: '#16a34a',      // Green
    impressions: '#f97316',  // Orange  
    clicks: '#ef4444',       // Red
    ctr: '#a855f7',          // Purple
    ecpm: '#3b82f6',         // Blue
    fillRate: '#8b5cf6',     // Violet
  },

  // Shadows
  shadowSm: '0 1px 3px rgba(0,0,0,0.04)',
  shadowMd: '0 4px 16px rgba(0,0,0,0.06)',
  shadowGlow: '0 4px 20px rgba(3,217,133,0.1)',

  // Radius
  radiusSm: 5,
  radiusMd: 5,
  radiusLg: 5,

  // Typography
  fontSizeH1: 26,
  fontSizeH2: 20,
  fontSizeH3: 16,
  fontSizeBody: 14,
  fontSizeMuted: 13,
  fontWeightBold: 700,
  fontWeightSemiBold: 600,
  fontWeightRegular: 400,

  // Transitions
  transition: 'all 0.2s ease',
  transitionSlow: 'all 0.3s ease',
};
