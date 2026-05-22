import React from 'react';

const presets = {
  success: { bg: 'rgba(3,217,133,0.08)', color: '#16a34a' },
  warning: { bg: 'rgba(249,115,22,0.08)', color: '#f97316' },
  error: { bg: '#fef2f2', color: '#ef4444' },
  info: { bg: 'rgba(59,130,246,0.08)', color: '#3b82f6' },
  default: { bg: '#f5f5f5', color: '#888' },
};

const Badge = ({ children, variant = 'default', style: extraStyle = {} }) => {
  const s = presets[variant] || presets.default;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '4px 12px', borderRadius: 20,
      fontSize: 12, fontWeight: 600,
      background: s.bg, color: s.color,
      whiteSpace: 'nowrap',
      ...extraStyle,
    }}>
      {children}
    </span>
  );
};

export default Badge;
