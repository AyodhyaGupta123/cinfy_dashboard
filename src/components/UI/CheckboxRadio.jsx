import React from 'react';
import { Check } from 'lucide-react';
import { theme } from '../../theme/constants';

export const Checkbox = ({ checked, onChange, label, description, disabled = false }) => {
  return (
    <label style={{
      display: 'flex', alignItems: 'flex-start', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
    }}>
      <div
        onClick={() => !disabled && onChange?.(!checked)}
        style={{
          width: 20, height: 20, borderRadius: 5, flexShrink: 0, marginTop: 1,
          border: `2px solid ${checked ? theme.primary : theme.inputBorder}`,
          background: checked ? theme.primary : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: theme.transition, cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {checked && <Check style={{ width: 14, height: 14, color: '#fff', strokeWidth: 3 }} />}
      </div>
      {(label || description) && (
        <div>
          {label && <div style={{ fontSize: 14, fontWeight: 500, color: theme.textPrimary }}>{label}</div>}
          {description && <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{description}</div>}
        </div>
      )}
    </label>
  );
};

export const Radio = ({ checked, onChange, label, description, name, value, disabled = false }) => {
  return (
    <label style={{
      display: 'flex', alignItems: 'flex-start', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
    }}>
      <div
        onClick={() => !disabled && onChange?.(value)}
        style={{
          width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1,
          border: `2px solid ${checked ? theme.primary : theme.inputBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: theme.transition, cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {checked && (
          <div style={{
            width: 10, height: 10, borderRadius: '50%', background: theme.primary,
          }} />
        )}
      </div>
      {(label || description) && (
        <div>
          {label && <div style={{ fontSize: 14, fontWeight: 500, color: theme.textPrimary }}>{label}</div>}
          {description && <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{description}</div>}
        </div>
      )}
    </label>
  );
};
