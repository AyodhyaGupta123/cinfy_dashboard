import React from 'react';
import { Inbox } from 'lucide-react';
import { theme } from '../../theme/constants';
import Button from './Button';

const EmptyState = ({ icon: Icon = Inbox, title = 'No data found', description, actionLabel, onAction, style: extraStyle = {} }) => {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px', textAlign: 'center', ...extraStyle,
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
      }}>
        <Icon style={{ width: 32, height: 32, color: theme.textLight }} />
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: theme.textPrimary, marginBottom: 8 }}>{title}</h3>
      {description && <p style={{ fontSize: 14, color: theme.textMuted, maxWidth: 360, lineHeight: 1.6, marginBottom: actionLabel ? 20 : 0 }}>{description}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
};

export default EmptyState;
