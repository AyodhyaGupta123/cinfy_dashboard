import React from 'react';
import { theme } from '../../theme/constants';

const ProgressBar = ({ value = 0, max = 100, color, height = 8, showLabel = false, label, animated = false }) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const barColor = color || theme.primary;

  return (
    <div>
      {(showLabel || label) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: theme.textSecondary, fontWeight: 500 }}>{label || ''}</span>
          {showLabel && <span style={{ fontSize: 13, fontWeight: 600, color: barColor }}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div style={{
        width: '100%', height, borderRadius: height / 2,
        background: '#f0f0f0', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: height / 2,
          background: barColor,
          transition: 'width 0.5s ease',
          ...(animated ? { backgroundSize: '30px 30px', backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)`, animation: 'progressStripe 1s linear infinite' } : {}),
        }} />
      </div>
      <style>{`@keyframes progressStripe { from { background-position: 30px 0; } to { background-position: 0 0; } }`}</style>
    </div>
  );
};

export default ProgressBar;
