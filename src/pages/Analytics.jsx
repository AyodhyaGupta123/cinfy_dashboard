import React, { useState } from 'react';
import { DollarSign, Eye, MousePointerClick, Scissors, Target, Activity, Plus, FileCode, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/UI/StatCard';
import { Select } from '../components/UI/FormElements';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Breadcrumb from '../components/UI/Breadcrumb';
import { theme } from '../theme/constants';

const chartData = [
  { name: 'Mon', revenue: 4000, impressions: 2400 },
  { name: 'Tue', revenue: 3000, impressions: 1398 },
  { name: 'Wed', revenue: 2000, impressions: 9800 },
  { name: 'Thu', revenue: 2780, impressions: 3908 },
  { name: 'Fri', revenue: 1890, impressions: 4800 },
  { name: 'Sat', revenue: 2390, impressions: 3800 },
  { name: 'Sun', revenue: 3490, impressions: 4300 },
];

const Analytics = () => {
  const [chartPeriod, setChartPeriod] = useState('daily');

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Analytics' }]} />
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
        <h1 style={{ fontSize: 26, fontWeight: 700, color: theme.textPrimary }}>Analytics</h1>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileCode style={{ width: 16, height: 16 }} /> App-ads.txt
          </Button>
          <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus style={{ width: 16, height: 16 }} /> Add New App
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 flex-wrap mb-5" style={{ padding: '14px 18px' }}>
        <div className="flex items-center gap-2 px-4 py-2 w-full lg:w-auto" style={{
          background: theme.cardBg,
          border: `1px solid ${theme.inputBorder}`, borderRadius: theme.radiusSm,
          fontSize: 14, color: theme.textSecondary, cursor: 'pointer',
        }}>
          <Calendar style={{ width: 15, height: 15, color: theme.textLight }} />
          <span>{dateStr} - {dateStr}</span>
        </div>

        <div className="w-full lg:w-auto min-w-[130px]">
          <Select options={[{ label: 'Apps (All)', value: 'all' }, { label: 'App 1', value: '1' }]} />
        </div>
        <div className="w-full lg:w-auto min-w-[130px]">
          <Select options={[{ label: 'Countries', value: 'all' }, { label: 'US', value: 'us' }]} />
        </div>
        <div className="w-full lg:w-auto min-w-[130px]">
          <Select options={[{ label: 'Ad Type', value: 'all' }, { label: 'Banner', value: 'banner' }]} />
        </div>

        <div className="hidden lg:block flex-1" />
        <div className="flex items-center gap-2 w-full lg:w-auto mt-2 lg:mt-0">
          <Button variant="ghost" className="flex-1 lg:flex-none">Clear</Button>
          <Button variant="primary" className="flex-1 lg:flex-none" style={{ padding: '9px 28px' }}>Apply</Button>
        </div>
      </Card>

      {/* Stat Cards (6-column row, matching reference layout) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatCard icon={DollarSign} title="Revenue" value="$0" iconBg={theme.statIcons.revenue} />
        <StatCard icon={Eye} title="Impressions" value="0" iconBg={theme.statIcons.impressions} />
        <StatCard icon={MousePointerClick} title="Clicks" value="0" iconBg={theme.statIcons.clicks} />
        <StatCard icon={Scissors} title="CTR" value="0%" iconBg={theme.statIcons.ctr} />
        <StatCard icon={DollarSign} title="eCPM" value="$0" iconBg={theme.statIcons.ecpm} />
        <StatCard icon={Activity} title="Fill Rate" value="0%" iconBg={theme.statIcons.fillRate} />
      </div>

      {/* Performance Chart */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Activity style={{ width: 18, height: 18, color: theme.primary }} />
          <span style={{ fontSize: 16, fontWeight: 600, color: theme.textPrimary }}>Performance Measurements</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-4 sm:gap-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5" style={{
              background: theme.cardBg,
              border: `1px solid ${theme.inputBorder}`, borderRadius: theme.radiusSm,
              fontSize: 13, color: theme.textSecondary, cursor: 'pointer',
            }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: theme.primary }} />
              Revenue $
            </div>
            <button className="flex items-center justify-center w-8 h-8 rounded-md" style={{
              background: theme.cardBg, border: `1px solid ${theme.inputBorder}`,
              color: theme.textLight, cursor: 'pointer',
            }}>
              <Plus style={{ width: 14, height: 14 }} />
            </button>
          </div>

          <div style={{ display: 'flex', borderRadius: theme.radiusSm, overflow: 'hidden', border: `1px solid ${theme.inputBorder}` }}>
            {['Daily', 'Weekly', 'Monthly'].map((p) => (
              <button
                key={p}
                onClick={() => setChartPeriod(p.toLowerCase())}
                style={{
                  padding: '7px 16px', fontSize: 12, fontWeight: 500,
                  cursor: 'pointer', transition: theme.transition, border: 'none',
                  background: chartPeriod === p.toLowerCase() ? '#222' : theme.cardBg,
                  color: chartPeriod === p.toLowerCase() ? '#fff' : theme.textMuted,
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: 300, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.primary} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={theme.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#e0e0e0" tick={{ fill: '#999', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#e0e0e0" tick={{ fill: '#999', fontSize: 12 }} axisLine={false} tickLine={false} />
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <Tooltip
                contentStyle={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 8, color: theme.textPrimary, fontSize: 13, boxShadow: theme.shadowMd }}
                itemStyle={{ color: theme.primary }}
              />
              <Area type="monotone" dataKey="revenue" stroke={theme.primary} strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* No data text */}
        <div style={{ textAlign: 'center', padding: '20px 0 0', color: theme.textLight, fontSize: 15, fontWeight: 500 }}>
          No data available yet
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
