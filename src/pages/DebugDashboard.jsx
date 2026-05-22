import React, { useState } from 'react';
import { Bug, AlertTriangle, CheckCircle, Clock, Activity, Server, Wifi, Database, RefreshCw } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Breadcrumb from '../components/UI/Breadcrumb';
import ProgressBar from '../components/UI/ProgressBar';
import { theme } from '../theme/constants';

const DEMO_LOGS = [
  { id: 1, time: '14:32:05', level: 'ERROR', message: 'Ad request failed: timeout after 5000ms', source: 'AdMob SDK', app: 'MyApp Pro' },
  { id: 2, time: '14:31:58', level: 'WARN', message: 'Low fill rate detected for banner placement', source: 'Mediation', app: 'GameZone' },
  { id: 3, time: '14:31:45', level: 'INFO', message: 'Interstitial ad loaded successfully', source: 'Unity Ads', app: 'MyApp Pro' },
  { id: 4, time: '14:31:30', level: 'ERROR', message: 'CORS policy blocked ad creative fetch', source: 'AdMob SDK', app: 'FitTracker' },
  { id: 5, time: '14:31:12', level: 'INFO', message: 'Rewarded video completed — reward granted', source: 'AppLovin', app: 'GameZone' },
  { id: 6, time: '14:30:55', level: 'WARN', message: 'Ad unit ID mismatch detected', source: 'Mediation', app: 'MyApp Pro' },
  { id: 7, time: '14:30:40', level: 'INFO', message: 'Banner refresh cycle completed (30s)', source: 'AdMob SDK', app: 'FitTracker' },
  { id: 8, time: '14:30:22', level: 'ERROR', message: 'Network request failed: ERR_CONNECTION_RESET', source: 'Fetch API', app: 'GameZone' },
];

const levelStyles = {
  ERROR: { bg: '#fef2f2', color: '#ef4444', border: '#fecaca' },
  WARN: { bg: '#fffbeb', color: '#f59e0b', border: '#fde68a' },
  INFO: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
};

const DebugDashboard = () => {
  const [filter, setFilter] = useState('ALL');

  const filtered = filter === 'ALL' ? DEMO_LOGS : DEMO_LOGS.filter(l => l.level === filter);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Debug Dashboard' }]} />
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
        <h1 style={{ fontSize: 26, fontWeight: 700, color: theme.textPrimary }}>Debug Dashboard</h1>
        <Button variant="ghost" className="w-full sm:w-auto justify-center" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RefreshCw style={{ width: 14, height: 14 }} /> Refresh
        </Button>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'API Status', value: 'Healthy', icon: Server, color: '#16a34a' },
          { label: 'SDK Connection', value: 'Connected', icon: Wifi, color: '#3b82f6' },
          { label: 'DB Latency', value: '12ms', icon: Database, color: '#a855f7' },
          { label: 'Errors (24h)', value: '23', icon: AlertTriangle, color: '#ef4444' },
        ].map((item) => (
          <Card key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: `${item.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <item.icon style={{ width: 18, height: 18, color: item.color }} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: theme.textPrimary }}>{item.value}</div>
              <div style={{ fontSize: 12, color: theme.textMuted }}>{item.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Uptime Bar */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity style={{ width: 16, height: 16, color: theme.primary }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: theme.textPrimary }}>Service Uptime (Last 30 Days)</span>
          </div>
          <span style={{ fontSize: 24, fontWeight: 700, color: '#16a34a' }}>99.97%</span>
        </div>
        <div style={{ display: 'flex', gap: 2, height: 28, borderRadius: 6, overflow: 'hidden' }}>
          {Array.from({ length: 30 }, (_, i) => {
            const isDown = i === 12 || i === 23;
            return (
              <div key={i} style={{
                flex: 1, background: isDown ? '#ef4444' : '#16a34a',
                opacity: isDown ? 1 : (0.5 + Math.random() * 0.5),
                borderRadius: 2, transition: 'all 0.2s',
              }}
                title={`Day ${i + 1}: ${isDown ? 'Partial outage' : '100% uptime'}`}
              />
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 11, color: theme.textLight }}>30 days ago</span>
          <span style={{ fontSize: 11, color: theme.textLight }}>Today</span>
        </div>
      </Card>

      {/* Log Stream */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 sm:gap-0">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bug style={{ width: 16, height: 16, color: theme.primary }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: theme.textPrimary }}>Live Log Stream</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['ALL', 'ERROR', 'WARN', 'INFO'].map((l) => (
              <button
                key={l}
                onClick={() => setFilter(l)}
                style={{
                  padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                  border: 'none', cursor: 'pointer', transition: theme.transition,
                  background: filter === l ? '#222' : '#f5f5f5',
                  color: filter === l ? '#fff' : theme.textMuted,
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {filtered.map((log) => {
            const s = levelStyles[log.level];
            return (
              <div key={log.id} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 p-3 rounded-lg" style={{
                background: s.bg, border: `1px solid ${s.border}`,
                fontSize: 13,
              }}>
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: 'monospace', color: theme.textLight, fontSize: 12, whiteSpace: 'nowrap' }}>{log.time}</span>
                  <span style={{
                    padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                    color: s.color, background: `${s.color}18`,
                    minWidth: 48, textAlign: 'center',
                  }}>
                    {log.level}
                  </span>
                </div>
                <span className="flex-1" style={{ color: theme.textSecondary }}>{log.message}</span>
                <div className="flex items-center gap-2 mt-1 md:mt-0">
                  <span style={{ fontSize: 11, color: theme.textLight, whiteSpace: 'nowrap' }}>{log.source}</span>
                  <span style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 4,
                    background: '#f5f5f5', color: theme.textMuted,
                  }}>
                    {log.app}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default DebugDashboard;
