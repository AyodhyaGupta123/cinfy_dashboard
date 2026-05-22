import React, { useState } from 'react';
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Calendar, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Select } from '../components/UI/FormElements';
import Breadcrumb from '../components/UI/Breadcrumb';
import Badge from '../components/UI/Badge';
import ProgressBar from '../components/UI/ProgressBar';
import { useToast } from '../components/UI/Toast';
import { theme } from '../theme/constants';

const earningsData = [
  { month: 'Jan', earnings: 1240 },
  { month: 'Feb', earnings: 1890 },
  { month: 'Mar', earnings: 2450 },
  { month: 'Apr', earnings: 2100 },
  { month: 'May', earnings: 3200 },
  { month: 'Jun', earnings: 2800 },
  { month: 'Jul', earnings: 3600 },
  { month: 'Aug', earnings: 4100 },
  { month: 'Sep', earnings: 3800 },
  { month: 'Oct', earnings: 4500 },
  { month: 'Nov', earnings: 5200 },
  { month: 'Dec', earnings: 4800 },
];

const dailyData = [
  { day: 'Mon', amt: 180 }, { day: 'Tue', amt: 220 },
  { day: 'Wed', amt: 195 }, { day: 'Thu', amt: 310 },
  { day: 'Fri', amt: 275 }, { day: 'Sat', amt: 140 },
  { day: 'Sun', amt: 95 },
];

const Earnings = () => {
  const [period, setPeriod] = useState('yearly');
  const toast = useToast();

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Payments', path: '/payments/earnings' }, { label: 'Earnings' }]} />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
        <h1 style={{ fontSize: 26, fontWeight: 700, color: theme.textPrimary }}>Earnings</h1>
        <Button variant="ghost" className="w-full sm:w-auto justify-center" onClick={() => toast.success('Exported', 'Earnings report downloaded.')} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Download style={{ width: 14, height: 14 }} /> Export
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Earnings', value: '$38,760', change: '+18.2%', up: true },
          { label: 'This Month', value: '$4,800', change: '+12.5%', up: true },
          { label: 'Avg. Daily', value: '$156', change: '+5.1%', up: true },
          { label: 'Pending Payout', value: '$2,340', change: '-3.2%', up: false },
        ].map((item) => (
          <Card key={item.label} style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: theme.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <DollarSign style={{ width: 16, height: 16, color: theme.primary }} />
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 12, fontWeight: 600,
                color: item.up ? '#16a34a' : '#ef4444',
              }}>
                {item.up ? <ArrowUpRight style={{ width: 14, height: 14 }} /> : <ArrowDownRight style={{ width: 14, height: 14 }} />}
                {item.change}
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: theme.textPrimary }}>{item.value}</div>
            <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{item.label}</div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Yearly Earnings Chart */}
        <Card className="lg:col-span-2">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: theme.textPrimary }}>Earnings Overview</span>
            <Select options={[
              { label: 'This Year', value: 'yearly' },
              { label: 'Last 6 Months', value: '6m' },
            ]} />
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.primary} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={theme.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: '#999', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#999', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <RTooltip contentStyle={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 8, boxShadow: theme.shadowMd }} />
                <Area type="monotone" dataKey="earnings" stroke={theme.primary} strokeWidth={2.5} fill="url(#earningsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Daily Breakdown */}
        <Card>
          <span style={{ fontSize: 16, fontWeight: 600, color: theme.textPrimary, marginBottom: 16, display: 'block' }}>This Week</span>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <XAxis dataKey="day" tick={{ fill: '#999', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#999', fontSize: 12 }} axisLine={false} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <RTooltip contentStyle={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 8 }} />
                <Bar dataKey="amt" fill={theme.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Payouts */}
      <Card>
        <span style={{ fontSize: 16, fontWeight: 600, color: theme.textPrimary, marginBottom: 16, display: 'block' }}>Recent Payouts</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { date: 'Apr 15, 2026', amount: '$2,450.00', method: 'Wire Transfer', status: 'Completed' },
            { date: 'Mar 15, 2026', amount: '$3,120.00', method: 'PayPal', status: 'Completed' },
            { date: 'Feb 15, 2026', amount: '$1,890.00', method: 'Wire Transfer', status: 'Completed' },
            { date: 'Jan 15, 2026', amount: '$2,100.00', method: 'PayPal', status: 'Completed' },
          ].map((p, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg gap-2 sm:gap-0" style={{
              background: i % 2 === 0 ? '#fafafa' : theme.cardBg,
              border: `1px solid #f0f0f0`,
            }}>
              <span className="text-sm sm:min-w-[120px]" style={{ color: theme.textSecondary }}>{p.date}</span>
              <span className="text-sm font-bold" style={{ color: theme.textPrimary }}>{p.amount}</span>
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-1 sm:mt-0">
                <span className="text-sm" style={{ color: theme.textMuted }}>{p.method}</span>
                <Badge variant="success">{p.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Earnings Goal */}
      <Card style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: theme.textPrimary }}>Monthly Goal</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: theme.primary }}>$4,800 / $6,000</span>
        </div>
        <ProgressBar value={4800} max={6000} showLabel color={theme.primary} height={10} animated />
      </Card>
    </div>
  );
};

export default Earnings;
