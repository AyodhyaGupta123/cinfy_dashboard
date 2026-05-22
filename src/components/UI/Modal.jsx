import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { theme } from '../../theme/constants';

const Modal = ({ isOpen, onClose, title, children, size = 'md', footer }) => {
  // Close on Escape key
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

  const widths = { sm: 420, md: 540, lg: 720, xl: 900 };
  const w = widths[size] || widths.md;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        animation: 'fadeIn 0.2s ease',
      }}
      className="sm:items-center sm:p-5 p-0"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: w, maxHeight: '92vh',
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: '0 24px 80px rgba(0,0,0,0.15)',
          display: 'flex', flexDirection: 'column',
          animation: 'slideUp 0.25s ease',
          overflow: 'hidden',
        }}
        className="rounded-t-2xl sm:rounded-2xl"
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
              color: theme.textMuted, transition: theme.transition,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#eee'; e.currentTarget.style.color = theme.textPrimary; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = theme.textMuted; }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
          {children}
        </div>

        {/* Footer (optional) */}
        {footer && (
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 p-5 sm:p-6"
               style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
            {footer}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
};

export default Modal;
