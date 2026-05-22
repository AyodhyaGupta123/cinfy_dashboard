import React, { useState } from 'react';
import { theme } from '../../theme/constants';

const StatCard = ({ icon: Icon, title, value, trend, trendUp, iconBg = theme.primary, iconColor = '#fff' }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: theme.cardBg,
        border: `1px solid ${hovered ? theme.cardBorderHover : theme.cardBorder}`,
        borderRadius: theme.radiusLg,
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        transition: theme.transitionSlow,
        boxShadow: hovered ? theme.shadowGlow : theme.shadowSm,
        cursor: 'default',
        position: 'relative',
      }}
    >
      {/* Colored icon circle */}
      <div style={{
        width: 42, height: 42, borderRadius: 10,
        background: `${iconBg}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon style={{ width: 20, height: 20, color: iconBg }} />
      </div>

      {/* Value + Title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: theme.textPrimary, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          {value}
        </div>
        <div style={{ fontSize: 12, color: theme.textMuted, fontWeight: 500, marginTop: 2 }}>
          {title}
        </div>
      </div>

      {/* Trend badge */}
      {trend && (
        <div style={{
          position: 'absolute', top: 10, right: 12,
          fontSize: 11, fontWeight: 600,
          padding: '2px 8px', borderRadius: 12,
          background: trendUp ? 'rgba(3,217,133,0.08)' : 'rgba(239,68,68,0.08)',
          color: trendUp ? '#16a34a' : '#ef4444',
        }}>
          {trend}
        </div>
      )}
    </div>
  );
};

export default StatCard;
