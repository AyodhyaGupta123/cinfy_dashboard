import React, { useState } from 'react';
import { Settings, CreditCard, Building2, Shield, Bell, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Input, Select } from '../components/UI/FormElements';
import Breadcrumb from '../components/UI/Breadcrumb';
import { useToast } from '../components/UI/Toast';
import { theme } from '../theme/constants';

const PaymentSettings = () => {
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [threshold, setThreshold] = useState('100');

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Payments', path: '/payments/earnings' }, { label: 'Settings' }]} />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
        <h1 style={{ fontSize: theme.fontSizeH1, fontWeight: theme.fontWeightBold, color: theme.textPrimary }}>Payment Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Payment Method */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <CreditCard style={{ width: 18, height: 18, color: theme.primary }} />
            <span style={{ fontSize: theme.fontSizeH3, fontWeight: theme.fontWeightSemiBold, color: theme.textPrimary }}>Payment Method</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { id: 'paypal', label: 'PayPal', desc: 'ankit.j***@gmail.com', icon: '💳' },
              { id: 'wire', label: 'Wire Transfer', desc: 'HDFC Bank ****4521', icon: '🏦' },
              { id: 'crypto', label: 'Crypto (USDT)', desc: '0x7a3B...8f2C', icon: '₿' },
            ].map((m) => (
              <div
                key={m.id}
                onClick={() => setPaymentMethod(m.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', borderRadius: 10, cursor: 'pointer',
                  border: `2px solid ${paymentMethod === m.id ? theme.primary : theme.cardBorder}`,
                  background: paymentMethod === m.id ? theme.primaryLight : theme.cardBg,
                  transition: theme.transition,
                }}
              >
                <span style={{ fontSize: 24 }}>{m.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: theme.fontSizeBody, fontWeight: theme.fontWeightSemiBold, color: theme.textPrimary }}>{m.label}</div>
                  <div style={{ fontSize: theme.fontSizeMuted, color: theme.textMuted }}>{m.desc}</div>
                </div>
                {paymentMethod === m.id && <CheckCircle style={{ width: 18, height: 18, color: theme.primary }} />}
              </div>
            ))}
          </div>
        </Card>

        {/* Payout Schedule */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Building2 style={{ width: 18, height: 18, color: theme.primary }} />
            <span style={{ fontSize: theme.fontSizeH3, fontWeight: theme.fontWeightSemiBold, color: theme.textPrimary }}>Payout Schedule</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Payout Frequency</label>
              <Select
                options={[
                  { label: 'Monthly (15th)', value: 'monthly' },
                  { label: 'Bi-Weekly', value: 'biweekly' },
                  { label: 'Weekly', value: 'weekly' },
                ]}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Minimum Threshold ($)</label>
              <Input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Currency</label>
              <Select
                options={[
                  { label: 'USD ($)', value: 'usd' },
                  { label: 'EUR (€)', value: 'eur' },
                  { label: 'INR (₹)', value: 'inr' },
                ]}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </Card>

        {/* Tax Info */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Shield style={{ width: 18, height: 18, color: theme.primary }} />
            <span style={{ fontSize: theme.fontSizeH3, fontWeight: theme.fontWeightSemiBold, color: theme.textPrimary }}>Tax Information</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Tax ID / PAN</label>
              <Input value="ABCDE1234F" style={{ width: '100%' }} readOnly />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>GST Number</label>
              <Input value="29ABCDE1234F1Z5" style={{ width: '100%' }} readOnly />
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px', borderRadius: 8,
              background: 'rgba(3,217,133,0.06)', border: '1px solid rgba(3,217,133,0.15)',
            }}>
              <CheckCircle style={{ width: 16, height: 16, color: '#16a34a' }} />
              <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 500 }}>Tax documents verified</span>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Bell style={{ width: 18, height: 18, color: theme.primary }} />
            <span style={{ fontSize: theme.fontSizeH3, fontWeight: theme.fontWeightSemiBold, color: theme.textPrimary }}>Payment Notifications</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Payout processed', desc: 'Get notified when payment is sent', enabled: true },
              { label: 'Threshold reached', desc: 'Alert when minimum balance is met', enabled: true },
              { label: 'Payment failed', desc: 'Notify on failed transactions', enabled: true },
              { label: 'Weekly summary', desc: 'Weekly earnings digest email', enabled: false },
            ].map((n, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px', borderRadius: 8,
                border: `1px solid ${theme.cardBorder}`,
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: theme.textPrimary }}>{n.label}</div>
                  <div style={{ fontSize: 12, color: theme.textMuted }}>{n.desc}</div>
                </div>
                <div
                  onClick={() => {}}
                  style={{
                    width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
                    background: n.enabled ? theme.primary : '#ddd',
                    position: 'relative', transition: theme.transition,
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', background: '#fff',
                    position: 'absolute', top: 3,
                    left: n.enabled ? 23 : 3,
                    transition: theme.transition, boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Save */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
        <Button variant="ghost" className="w-full sm:w-auto justify-center">Cancel</Button>
        <Button variant="primary" className="w-full sm:w-auto justify-center">Save Changes</Button>
      </div>
    </div>
  );
};

export default PaymentSettings;
