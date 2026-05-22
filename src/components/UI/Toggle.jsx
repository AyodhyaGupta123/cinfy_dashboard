import React from 'react';
import { theme } from '../../theme/constants';

const Toggle = ({ checked, onChange, label, description }) => {
  return (
    <div
      onClick={() => onChange && onChange(!checked)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 14px', borderRadius: 8,
        border: `1px solid ${theme.cardBorder}`, cursor: 'pointer',
        transition: theme.transition,
      }}
    >
      {(label || description) && (
        <div>
          {label && <div style={{ fontSize: 14, fontWeight: 600, color: theme.textPrimary }}>{label}</div>}
          {description && <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{description}</div>}
        </div>
      )}
      <div style={{
        width: 44, height: 24, borderRadius: 12, flexShrink: 0,
        background: checked ? theme.primary : '#ddd',
        position: 'relative', transition: theme.transition,
      }}>
        <div style={{
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          position: 'absolute', top: 3,
          left: checked ? 23 : 3,
          transition: theme.transition,
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        }} />
      </div>
    </div>
  );
};

export default Toggle;
