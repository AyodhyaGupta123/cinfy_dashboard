import React, { useState } from 'react';
import { theme } from '../../theme/constants';

const Tabs = ({ tabs, defaultTab = 0, onChange }) => {
  const [active, setActive] = useState(defaultTab);

  const handleChange = (i) => {
    setActive(i);
    if (onChange) onChange(i);
  };

  return (
    <div>
      {/* Tab Headers - horizontally scrollable on mobile */}
      <div style={{ borderBottom: `1px solid ${theme.cardBorder}`, marginBottom: 20 }}
           className="overflow-x-auto">
        <div className="flex gap-0 min-w-max sm:min-w-0">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => handleChange(i)}
              style={{
                padding: '10px 20px', fontSize: 14, fontWeight: active === i ? 600 : 500,
                color: active === i ? theme.primary : theme.textMuted,
                background: 'transparent', border: 'none', cursor: 'pointer',
                borderBottom: `2px solid ${active === i ? theme.primary : 'transparent'}`,
                transition: theme.transition,
                marginBottom: -1,
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>{tabs[active]?.content}</div>
    </div>
  );
};

export default Tabs;
