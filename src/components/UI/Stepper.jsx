import React from 'react';
import { Check } from 'lucide-react';
import { theme } from '../../theme/constants';

const Stepper = ({ steps = [], currentStep = 0 }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: '100%', marginBottom: 24 }}>
      {steps.map((step, i) => {
        const isCompleted = i < currentStep;
        const isActive = i === currentStep;

        return (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: '0 0 auto' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700,
                background: isCompleted ? theme.primary : isActive ? '#222' : '#f0f0f0',
                color: isCompleted || isActive ? '#fff' : theme.textMuted,
                border: isActive ? `2px solid ${theme.primary}` : 'none',
                transition: theme.transitionSlow,
              }}>
                {isCompleted ? <Check style={{ width: 18, height: 18 }} /> : i + 1}
              </div>
              <span style={{
                fontSize: 12, fontWeight: isActive ? 600 : 500,
                color: isActive ? theme.textPrimary : theme.textMuted,
                whiteSpace: 'nowrap',
              }}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 2, margin: '0 8px',
                background: isCompleted ? theme.primary : '#e8e8e8',
                transition: theme.transitionSlow,
                marginBottom: 22,
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
