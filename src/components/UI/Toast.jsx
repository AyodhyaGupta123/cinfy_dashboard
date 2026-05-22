import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { theme } from '../../theme/constants';

const ToastContext = createContext(null);

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a' },
  error: { bg: '#fef2f2', border: '#fecaca', color: '#ef4444' },
  warning: { bg: '#fffbeb', border: '#fde68a', color: '#f59e0b' },
  info: { bg: '#eff6ff', border: '#bfdbfe', color: '#3b82f6' },
};

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    if (duration > 0) setTimeout(() => removeToast(id), duration);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (title, message) => addToast({ type: 'success', title, message }),
    error: (title, message) => addToast({ type: 'error', title, message }),
    warning: (title, message) => addToast({ type: 'warning', title, message }),
    info: (title, message) => addToast({ type: 'info', title, message }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Container */}
      <div style={{
        position: 'fixed', top: 20, right: 20, zIndex: 99999,
        display: 'flex', flexDirection: 'column', gap: 8,
        maxWidth: 380, pointerEvents: 'none',
      }}>
        {toasts.map((t) => {
          const c = colors[t.type] || colors.info;
          const Icon = icons[t.type] || Info;
          return (
            <div key={t.id} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '12px 16px', borderRadius: 10,
              background: c.bg, border: `1px solid ${c.border}`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              animation: 'toastSlide 0.3s ease',
              pointerEvents: 'auto',
            }}>
              <Icon style={{ width: 18, height: 18, color: c.color, flexShrink: 0, marginTop: 1 }} />
              <div style={{ flex: 1 }}>
                {t.title && <div style={{ fontSize: 14, fontWeight: 600, color: theme.textPrimary, marginBottom: 2 }}>{t.title}</div>}
                {t.message && <div style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.5 }}>{t.message}</div>}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                style={{
                  padding: 2, background: 'transparent', border: 'none',
                  color: theme.textLight, cursor: 'pointer', flexShrink: 0,
                }}
              >
                <X style={{ width: 14, height: 14 }} />
              </button>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes toastSlide { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }`}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
