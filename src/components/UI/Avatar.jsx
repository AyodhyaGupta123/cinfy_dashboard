import React from 'react';
import { theme } from '../../theme/constants';

const sizeMap = { xs: 24, sm: 32, md: 40, lg: 56, xl: 80 };
const fontMap = { xs: 10, sm: 12, md: 14, lg: 20, xl: 28 };

const Avatar = ({ name = '', src, size = 'md', status, color, style: extraStyle = {} }) => {
  const s = sizeMap[size] || sizeMap.md;
  const fs = fontMap[size] || fontMap.md;
  const bg = color || theme.primary;

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const statusColors = { online: '#16a34a', offline: '#888', busy: '#ef4444', away: '#f59e0b' };
  const dotSize = Math.max(8, s * 0.22);

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexShrink: 0, ...extraStyle }}>
      {src ? (
        <img
          src={src}
          alt={name}
          style={{
            width: s, height: s, borderRadius: '50%',
            objectFit: 'cover', border: `2px solid ${theme.cardBorder}`,
          }}
        />
      ) : (
        <div style={{
          width: s, height: s, borderRadius: '50%',
          background: bg, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: fs, fontWeight: 700, letterSpacing: '0.02em',
          userSelect: 'none',
        }}>
          {initials || '?'}
        </div>
      )}

      {status && statusColors[status] && (
        <span style={{
          position: 'absolute', bottom: 0, right: 0,
          width: dotSize, height: dotSize, borderRadius: '50%',
          background: statusColors[status],
          border: `2px solid ${theme.cardBg}`,
          boxShadow: `0 0 0 1px ${statusColors[status]}33`,
        }} />
      )}
    </div>
  );
};

export default Avatar;
