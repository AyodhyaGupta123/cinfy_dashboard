import React, { useState } from 'react';
import { Gift, Users, DollarSign, Copy, CheckCircle, Share2, Trophy, Star } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Avatar from '../components/UI/Avatar';
import Breadcrumb from '../components/UI/Breadcrumb';
import ProgressBar from '../components/UI/ProgressBar';
import { useToast } from '../components/UI/Toast';
import { theme } from '../theme/constants';

const DEMO_REFERRALS = [
  { id: 1, name: 'Rahul Sharma', email: 'r.shar***@gmail.com', date: 'Apr 20, 2026', status: 'Active', earnings: '$45.00' },
  { id: 2, name: 'Priya Patel', email: 'p.pat***@gmail.com', date: 'Apr 15, 2026', status: 'Active', earnings: '$32.00' },
  { id: 3, name: 'Amit Kumar', email: 'a.kum***@gmail.com', date: 'Apr 10, 2026', status: 'Pending', earnings: '$0.00' },
  { id: 4, name: 'Sara Johnson', email: 's.joh***@gmail.com', date: 'Mar 28, 2026', status: 'Active', earnings: '$67.50' },
  { id: 5, name: 'Mike Chen', email: 'm.che***@gmail.com', date: 'Mar 15, 2026', status: 'Active', earnings: '$120.00' },
];

const ReferralProgram = () => {
  const [copied, setCopied] = useState(false);
  const referralCode = 'CINFY-AJ2026';
  const referralLink = `https://cinfy.io/ref/${referralCode}`;

  const toast = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Copied!', 'Referral link copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const columns = [
    { header: 'Name', accessor: 'name', render: (row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name={row.name} size="sm" />
        <span style={{ fontWeight: 600, color: theme.textPrimary }}>{row.name}</span>
      </div>
    ) },
    { header: 'Email', accessor: 'email' },
    { header: 'Date Joined', accessor: 'date' },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span style={{
          padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
          background: row.status === 'Active' ? 'rgba(3,217,133,0.08)' : 'rgba(249,115,22,0.08)',
          color: row.status === 'Active' ? '#16a34a' : '#f97316',
        }}>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Earnings',
      accessor: 'earnings',
      render: (row) => <span style={{ fontWeight: 700, color: theme.primary }}>{row.earnings}</span>,
    },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Referral Program' }]} />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
        <h1 style={{ fontSize: 26, fontWeight: 700, color: theme.textPrimary }}>Referral Program</h1>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Referrals', value: '5', icon: Users, color: '#3b82f6' },
          { label: 'Active Users', value: '4', icon: CheckCircle, color: '#16a34a' },
          { label: 'Total Earned', value: '$264.50', icon: DollarSign, color: theme.primary },
          { label: 'Your Rank', value: '#12', icon: Trophy, color: '#f97316' },
        ].map((s) => (
          <Card key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: `${s.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <s.icon style={{ width: 18, height: 18, color: s.color }} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: theme.textPrimary }}>{s.value}</div>
              <div style={{ fontSize: 12, color: theme.textMuted }}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Referral Link Card */}
      <Card style={{
        marginBottom: 24, position: 'relative', overflow: 'hidden',
        background: `linear-gradient(135deg, ${theme.cardBg} 0%, rgba(3,217,133,0.04) 100%)`,
        border: `1px solid rgba(3,217,133,0.15)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Gift style={{ width: 20, height: 20, color: theme.primary }} />
          <span style={{ fontSize: 18, fontWeight: 700, color: theme.textPrimary }}>Share & Earn</span>
        </div>
        <p style={{ fontSize: 14, color: theme.textMuted, marginBottom: 16, lineHeight: 1.6 }}>
          Earn <strong style={{ color: theme.primary }}>10% commission</strong> on every referral's earnings for the first 12 months.
          Share your unique link below.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div style={{
            flex: 1, padding: '12px 16px', background: '#fafafa',
            border: `1px solid ${theme.cardBorder}`, borderRadius: 8,
            fontSize: 14, color: theme.textSecondary, fontFamily: 'monospace',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {referralLink}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="primary" className="flex-1 sm:flex-none justify-center" onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              {copied ? <CheckCircle style={{ width: 16, height: 16 }} /> : <Copy style={{ width: 16, height: 16 }} />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none justify-center" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Share2 style={{ width: 16, height: 16 }} /> Share
            </Button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          <div style={{ fontSize: 13, color: theme.textMuted }}>
            Your Code: <strong style={{ color: theme.primary }}>{referralCode}</strong>
          </div>
        </div>
      </Card>

      {/* Rewards Tiers */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Star style={{ width: 16, height: 16, color: '#f59e0b' }} />
          <span style={{ fontSize: 15, fontWeight: 600, color: theme.textPrimary }}>Reward Tiers</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { tier: 'Bronze', refs: '1-5 referrals', reward: '10% commission', color: '#b45309', active: true },
            { tier: 'Silver', refs: '6-15 referrals', reward: '15% commission', color: '#6b7280', active: false },
            { tier: 'Gold', refs: '16+ referrals', reward: '20% commission', color: '#f59e0b', active: false },
          ].map((t) => (
            <div key={t.tier} style={{
              padding: '16px', borderRadius: 10, textAlign: 'center',
              border: `2px solid ${t.active ? t.color : theme.cardBorder}`,
              background: t.active ? `${t.color}08` : theme.cardBg,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.color, marginBottom: 4 }}>{t.tier}</div>
              <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 8 }}>{t.refs}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: theme.textPrimary }}>{t.reward}</div>
              {t.active && <div style={{ fontSize: 11, color: t.color, fontWeight: 600, marginTop: 6 }}>● Current Tier</div>}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24 }}>
          <ProgressBar value={5} max={6} label="Referrals until Silver Tier" showLabel color={theme.primary} />
        </div>
      </Card>

      {/* Referral Table */}
      <Card>
        <span style={{ fontSize: 15, fontWeight: 600, color: theme.textPrimary, marginBottom: 16, display: 'block' }}>Your Referrals</span>
        <Table rowKey="id" columns={columns} data={DEMO_REFERRALS} emptyMessage="No referrals yet. Share your link to get started!" />
      </Card>
    </div>
  );
};

export default ReferralProgram;
