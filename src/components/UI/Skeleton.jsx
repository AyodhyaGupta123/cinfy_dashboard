import React from 'react';

const shimmerStyle = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: 6,
};

export const Skeleton = ({ width = '100%', height = 16, circle = false, style: extraStyle = {} }) => (
  <div style={{
    ...shimmerStyle,
    width: circle ? height : width,
    height,
    borderRadius: circle ? '50%' : 6,
    ...extraStyle,
  }}>
    <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
  </div>
);

export const SkeletonCard = () => (
  <div style={{ padding: 20, background: '#fff', borderRadius: 12, border: '1px solid #e8e8e8' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <Skeleton circle height={40} />
      <div style={{ flex: 1 }}>
        <Skeleton width="60%" height={14} style={{ marginBottom: 6 }} />
        <Skeleton width="40%" height={10} />
      </div>
    </div>
    <Skeleton height={12} style={{ marginBottom: 8 }} />
    <Skeleton width="80%" height={12} style={{ marginBottom: 8 }} />
    <Skeleton width="50%" height={12} />
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8e8e8', overflow: 'hidden' }}>
    <div style={{ display: 'flex', gap: 16, padding: '14px 20px', background: '#fafafa', borderBottom: '1px solid #e8e8e8' }}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} width={`${100 / cols}%`} height={12} />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, ri) => (
      <div key={ri} style={{ display: 'flex', gap: 16, padding: '14px 20px', borderBottom: '1px solid #f0f0f0' }}>
        {Array.from({ length: cols }).map((_, ci) => (
          <Skeleton key={ci} width={`${100 / cols}%`} height={12} />
        ))}
      </div>
    ))}
  </div>
);
