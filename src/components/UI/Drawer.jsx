import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { theme } from '../../theme/constants';

const Drawer = ({ isOpen, onClose, title, children, position = 'right', width = 420, footer }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isRight = position === 'right';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute', top: 0, [isRight ? 'right' : 'left']: 0,
          height: '100vh',
          background: theme.cardBg, display: 'flex', flexDirection: 'column',
          boxShadow: '-8px 0 30px rgba(0,0,0,0.1)',
          animation: `${isRight ? 'slideInRight' : 'slideInLeft'} 0.25s ease`,
        }}
        className="w-full sm:w-[420px]"
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', borderBottom: `1px solid ${theme.cardBorder}`,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: theme.textPrimary, margin: 0 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#f5f5f5', border: 'none', cursor: 'pointer',
              color: theme.textMuted,
            }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12,
            padding: '16px 24px', borderTop: `1px solid ${theme.cardBorder}`,
          }}>
            {footer}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes slideInRight { from { transform:translateX(100%); } to { transform:translateX(0); } }
        @keyframes slideInLeft { from { transform:translateX(-100%); } to { transform:translateX(0); } }
      `}</style>
    </div>
  );
};

export default Drawer;
