import React, { useState } from 'react';
import { theme } from '../../theme/constants';

const Button = ({ children, variant = 'primary', disabled = false, style: extraStyle = {}, className = '', ...props }) => {
  const [hovered, setHovered] = useState(false);

  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '9px 20px', borderRadius: theme.radiusSm, fontWeight: 600, fontSize: 14,
    cursor: disabled ? 'not-allowed' : 'pointer', transition: theme.transition,
    opacity: disabled ? 0.5 : 1, textDecoration: 'none', whiteSpace: 'nowrap',
  };

  const styles = {
    primary: {
      ...base,
      background: hovered ? theme.primaryHover : theme.primary,
      color: '#000', border: 'none',
      transform: hovered ? 'translateY(-1px)' : 'none',
      boxShadow: hovered ? '0 4px 14px rgba(3,217,133,0.25)' : 'none',
    },
    outline: {
      ...base,
      background: hovered ? theme.primaryLight : 'transparent',
      color: theme.primary,
      border: `1px solid ${theme.primary}`,
    },
    ghost: {
      ...base,
      background: hovered ? '#f0f0f0' : 'transparent',
      color: theme.textSecondary,
      border: `1px solid ${theme.inputBorder}`,
    },
  };

  return (
    <button
      className={className}
      style={{ ...(styles[variant] || styles.primary), ...extraStyle }}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
