import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { theme } from '../../theme/constants';

const inputBase = {
  width: '100%',
  padding: '10px 16px',
  fontSize: 14,
  color: theme.inputText,
  background: theme.inputBg,
  border: `1px solid ${theme.inputBorder}`,
  borderRadius: theme.radiusSm,
  outline: 'none',
  transition: 'border-color 0.2s',
};

export const Input = ({ style = {}, ...props }) => (
  <input
    style={{ ...inputBase, ...style }}
    onFocus={(e) => { e.target.style.borderColor = theme.inputFocusBorder; }}
    onBlur={(e) => { e.target.style.borderColor = theme.inputBorder; }}
    {...props}
  />
);

export const SearchInput = ({ style = {}, ...props }) => (
  <div style={{ position: 'relative', ...style }}>
    <Search style={{
      position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
      width: 16, height: 16, color: theme.inputPlaceholder, pointerEvents: 'none',
    }} />
    <Input style={{ paddingLeft: 40, width: '100%' }} {...props} />
  </div>
);

export const FormGroup = ({ label, error, children, style = {} }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
    {label && (
      <label style={{ 
        fontSize: 13, 
        fontWeight: 600, 
        color: theme.textSecondary,
        display: 'block'
      }}>
        {label}
      </label>
    )}
    <div style={{ position: 'relative' }}>
      {children}
    </div>
    {error && (
      <p style={{ 
        fontSize: 12, 
        color: theme.error, 
        marginTop: 4, 
        fontWeight: 500,
        margin: 0 
      }}>
        {error}
      </p>
    )}
  </div>
);

export const Select = ({ options = [], style = {}, className = '', ...props }) => (
  <div style={{ position: 'relative', display: 'block', ...style }} className={className}>
    <select
      style={{
        ...inputBase,
        appearance: 'none',
        paddingRight: 36,
        cursor: 'pointer',
        width: '100%',
      }}
      onFocus={(e) => { e.target.style.borderColor = theme.inputFocusBorder; }}
      onBlur={(e) => { e.target.style.borderColor = theme.inputBorder; }}
      {...props}
    >
      {options.map((opt, i) => (
        <option key={i} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <ChevronDown style={{
      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
      width: 14, height: 14, color: theme.textLight, pointerEvents: 'none',
    }} />
  </div>
);
