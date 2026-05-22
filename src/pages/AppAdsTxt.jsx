import React, { useState } from 'react';
import { FileCode, Copy, Download, CheckCircle, AlertTriangle, RefreshCw, Plus, Trash2 } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Input } from '../components/UI/FormElements';
import Breadcrumb from '../components/UI/Breadcrumb';
import { useToast } from '../components/UI/Toast';
import { theme } from '../theme/constants';

const DEMO_ENTRIES = [
  { id: 1, domain: 'google.com', publisherId: 'pub-1234567890', relation: 'DIRECT', certAuthority: 'f08c47fec0942fa0', status: 'Verified' },
  { id: 2, domain: 'facebook.com', publisherId: 'pub-9876543210', relation: 'RESELLER', certAuthority: 'c3e20eee3f', status: 'Verified' },
  { id: 3, domain: 'unity3d.com', publisherId: 'pub-5555555555', relation: 'DIRECT', certAuthority: '96786f1234', status: 'Pending' },
  { id: 4, domain: 'applovin.com', publisherId: 'pub-3333333333', relation: 'RESELLER', certAuthority: 'b4d2739838', status: 'Verified' },
  { id: 5, domain: 'ironsource.com', publisherId: 'pub-7777777777', relation: 'DIRECT', certAuthority: '75b3a82041', status: 'Error' },
];

const AppAdsTxt = () => {
  const [entries] = useState(DEMO_ENTRIES);
  const [copied, setCopied] = useState(false);

  const adsTxtContent = entries.map(e => `${e.domain}, ${e.publisherId}, ${e.relation}, ${e.certAuthority}`).join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(adsTxtContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColors = {
    Verified: { bg: 'rgba(3,217,133,0.08)', color: '#16a34a' },
    Pending: { bg: 'rgba(249,115,22,0.08)', color: '#f97316' },
    Error: { bg: '#fef2f2', color: '#ef4444' },
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'App-ads.txt' }]} />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
        <h1 style={{ fontSize: 26, fontWeight: 700, color: theme.textPrimary }}>App-ads.txt</h1>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button variant="ghost" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RefreshCw style={{ width: 14, height: 14 }} /> Verify
          </Button>
          <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus style={{ width: 16, height: 16 }} /> Add Entry
          </Button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Verified', value: '3', icon: CheckCircle, color: '#16a34a' },
          { label: 'Pending', value: '1', icon: AlertTriangle, color: '#f97316' },
          { label: 'Errors', value: '1', icon: AlertTriangle, color: '#ef4444' },
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

      {/* Generated File Content */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 sm:gap-0">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileCode style={{ width: 16, height: 16, color: theme.primary }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: theme.textPrimary }}>Generated app-ads.txt</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="ghost" onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', fontSize: 13 }}>
              {copied ? <CheckCircle style={{ width: 14, height: 14, color: '#16a34a' }} /> : <Copy style={{ width: 14, height: 14 }} />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button variant="ghost" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', fontSize: 13 }}>
              <Download style={{ width: 14, height: 14 }} /> Download
            </Button>
          </div>
        </div>

        <pre style={{
          background: '#fafafa', border: `1px solid ${theme.cardBorder}`,
          borderRadius: 8, padding: 16,
          fontSize: 13, fontFamily: 'monospace', color: theme.textSecondary,
          lineHeight: 1.8, overflowX: 'auto', whiteSpace: 'pre',
        }}>
          {adsTxtContent}
        </pre>
      </Card>

      {/* Entries List */}
      <Card>
        <span style={{ fontSize: 15, fontWeight: 600, color: theme.textPrimary, marginBottom: 16, display: 'block' }}>Entries</span>

        <div className="flex flex-col gap-2">
          {entries.map((e) => {
            const sc = statusColors[e.status];
            return (
              <div key={e.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border bg-gray-50/50" style={{ borderColor: theme.cardBorder }}>
                <span className="text-sm font-semibold min-w-[140px]" style={{ color: theme.textPrimary }}>{e.domain}</span>
                <span className="text-xs font-mono flex-1 break-all" style={{ color: theme.textMuted }}>{e.publisherId}</span>
                <div className="flex flex-wrap items-center gap-2 justify-between sm:justify-end">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-gray-200" style={{ color: theme.textMuted }}>
                    {e.relation}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: sc.bg, color: sc.color }}>
                    {e.status}
                  </span>
                  <button className="p-1.5 rounded-md border-none bg-red-50 text-red-500 cursor-pointer hover:bg-red-100 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default AppAdsTxt;
