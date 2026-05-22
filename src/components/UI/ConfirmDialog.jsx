import React from 'react';
import { AlertTriangle, Trash2, CheckCircle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import { theme } from '../../theme/constants';

const presets = {
  delete: { icon: Trash2, color: '#ef4444', confirmLabel: 'Delete', confirmBg: '#ef4444' },
  warning: { icon: AlertTriangle, color: '#f59e0b', confirmLabel: 'Continue', confirmBg: '#f59e0b' },
  confirm: { icon: CheckCircle, color: theme.primary, confirmLabel: 'Confirm', confirmBg: theme.primary },
};

const ConfirmDialog = ({
  isOpen, onClose, onConfirm,
  type = 'confirm', title = 'Are you sure?', message = '',
  confirmLabel, cancelLabel = 'Cancel',
}) => {
  const preset = presets[type] || presets.confirm;
  const Icon = preset.icon;
  const label = confirmLabel || preset.confirmLabel;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>{cancelLabel}</Button>
          <Button
            variant="primary"
            onClick={() => { onConfirm?.(); onClose(); }}
            style={{ background: preset.confirmBg }}
          >
            {label}
          </Button>
        </>
      }
    >
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <Icon style={{ width: 44, height: 44, color: preset.color, margin: '0 auto 14px' }} />
        {message && <p style={{ fontSize: 14, color: theme.textMuted, lineHeight: 1.6 }}>{message}</p>}
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
