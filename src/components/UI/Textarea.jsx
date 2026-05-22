import React from 'react';
import { theme } from '../../theme/constants';

const Textarea = ({ label, error, style = {}, ...props }) => {
  return (
    <div>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>{label}</label>}
      <textarea
        style={{
          width: '100%', padding: '10px 16px', fontSize: 14,
          color: theme.inputText, background: theme.inputBg,
          border: `1px solid ${error ? '#ef4444' : theme.inputBorder}`,
          borderRadius: theme.radiusSm, outline: 'none',
          resize: 'vertical', fontFamily: 'inherit', minHeight: 90,
          transition: 'border-color 0.2s',
          ...style,
        }}
        onFocus={(e) => { e.target.style.borderColor = error ? '#ef4444' : theme.inputFocusBorder; }}
        onBlur={(e) => { e.target.style.borderColor = error ? '#ef4444' : theme.inputBorder; }}
        {...props}
      />
      {error && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{error}</p>}
    </div>
  );
};

export default Textarea;
