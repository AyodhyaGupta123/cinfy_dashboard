import React, { useState } from 'react';
import { theme } from '../../theme/constants';

const Tooltip = ({ children, text, position = 'top' }) => {
  const [show, setShow] = useState(false);

  const posStyles = {
    top: { bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
    bottom: { top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
    left: { right: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' },
    right: { left: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' },
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && text && (
        <div style={{
          position: 'absolute', ...posStyles[position],
          padding: '6px 12px', borderRadius: 6,
          background: '#222', color: '#fff',
          fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap',
          zIndex: 9999, pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          animation: 'tooltipFade 0.15s ease',
        }}>
          {text}
        </div>
      )}
      <style>{`@keyframes tooltipFade { from { opacity:0; } to { opacity:1; } }`}</style>
    </div>
  );
};

export default Tooltip;
