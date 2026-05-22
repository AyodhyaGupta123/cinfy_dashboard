import React, { useState } from 'react';
import { ArrowRightLeft, ArrowUpRight, ArrowDownRight, Search, Download, Filter } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import { Input, Select, FormGroup, SearchInput } from '../components/UI/FormElements';
import Breadcrumb from '../components/UI/Breadcrumb';
import { useToast } from '../components/UI/Toast';
import Drawer from '../components/UI/Drawer';
import { theme } from '../theme/constants';

const DEMO_TRANSACTIONS = [
  { id: 'TXN-78291', date: 'Apr 29, 2026', description: 'Ad Revenue - MyApp Pro', amount: '+$245.50', type: 'Credit', status: 'Completed', app: 'MyApp Pro' },
  { id: 'TXN-78290', date: 'Apr 28, 2026', description: 'Payout to PayPal', amount: '-$2,450.00', type: 'Debit', status: 'Completed', app: 'All Apps' },
  { id: 'TXN-78289', date: 'Apr 28, 2026', description: 'Ad Revenue - GameZone', amount: '+$189.30', type: 'Credit', status: 'Completed', app: 'GameZone' },
  { id: 'TXN-78288', date: 'Apr 27, 2026', description: 'Referral Bonus', amount: '+$50.00', type: 'Credit', status: 'Completed', app: 'Referral' },
  { id: 'TXN-78287', date: 'Apr 27, 2026', description: 'Ad Revenue - FitTracker', amount: '+$312.80', type: 'Credit', status: 'Pending', app: 'FitTracker' },
  { id: 'TXN-78286', date: 'Apr 26, 2026', description: 'Ad Revenue - MyApp Pro', amount: '+$178.20', type: 'Credit', status: 'Completed', app: 'MyApp Pro' },
  { id: 'TXN-78285', date: 'Apr 25, 2026', description: 'Payout to Wire Transfer', amount: '-$3,120.00', type: 'Debit', status: 'Completed', app: 'All Apps' },
  { id: 'TXN-78284', date: 'Apr 25, 2026', description: 'Ad Revenue - GameZone', amount: '+$425.60', type: 'Credit', status: 'Completed', app: 'GameZone' },
];

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDrawer, setFilterDrawer] = useState(false);
  const toast = useToast();

  const columns = [
    {
      header: 'Transaction ID',
      accessor: 'id',
      render: (row) => <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600, color: theme.textPrimary }}>{row.id}</span>,
    },
    { header: 'Date', accessor: 'date' },
    { header: 'Description', accessor: 'description' },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {row.type === 'Credit'
            ? <ArrowUpRight style={{ width: 14, height: 14, color: '#16a34a' }} />
            : <ArrowDownRight style={{ width: 14, height: 14, color: '#ef4444' }} />
          }
          <span style={{
            fontWeight: 700, fontSize: 14,
            color: row.type === 'Credit' ? '#16a34a' : '#ef4444',
          }}>
            {row.amount}
          </span>
        </div>
      ),
    },
    { header: 'App', accessor: 'app' },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span style={{
          padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
          background: row.status === 'Completed' ? 'rgba(3,217,133,0.08)' : 'rgba(249,115,22,0.08)',
          color: row.status === 'Completed' ? '#16a34a' : '#f97316',
        }}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Payments', path: '/payments/earnings' }, { label: 'Transactions' }]} />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
        <h1 style={{ fontSize: theme.fontSizeH1, fontWeight: theme.fontWeightBold, color: theme.textPrimary }}>Transactions</h1>
        <Button variant="ghost" className="w-full sm:w-auto justify-center" onClick={() => toast.success('Exported', 'Transactions CSV downloaded.')} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Download style={{ width: 14, height: 14 }} /> Export CSV
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Credits', value: '$1,401.40', color: '#16a34a' },
          { label: 'Total Debits', value: '$5,570.00', color: '#ef4444' },
          { label: 'Net Balance', value: '$12,840.60', color: theme.primary },
        ].map((item) => (
          <Card key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: `${item.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ArrowRightLeft style={{ width: 18, height: 18, color: item.color }} />
            </div>
            <div>
              <div style={{ fontSize: theme.fontSizeH2, fontWeight: theme.fontWeightBold, color: theme.textPrimary }}>{item.value}</div>
              <div style={{ fontSize: theme.fontSizeMuted, color: theme.textMuted }}>{item.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        {/* Filters — auto-fit grid stacks naturally on mobile */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16, alignItems: 'end' }}>
          <FormGroup label="Search">
            <SearchInput
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%' }}
            />
          </FormGroup>
          <div style={{ display: 'flex', gap: 8 }}>
            <FormGroup label="Type" style={{ flex: 1 }}>
              <Select options={[
                { label: 'All Types', value: 'all' },
                { label: 'Credits', value: 'credit' },
                { label: 'Debits', value: 'debit' },
              ]} style={{ width: '100%' }} />
            </FormGroup>
            <FormGroup label="Status" style={{ flex: 1 }}>
              <Select options={[
                { label: 'All Status', value: 'all' },
                { label: 'Completed', value: 'completed' },
                { label: 'Pending', value: 'pending' },
              ]} style={{ width: '100%' }} />
            </FormGroup>
          </div>
        </div>

        <Table rowKey="id" columns={columns} data={DEMO_TRANSACTIONS} emptyMessage="No transactions found" />
      </Card>

      <Drawer isOpen={filterDrawer} onClose={() => setFilterDrawer(false)} title="Filters">
        <div className="flex flex-col gap-4">
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Type</label>
            <Select options={[
              { label: 'All Types', value: 'all' },
              { label: 'Credits', value: 'credit' },
              { label: 'Debits', value: 'debit' },
            ]} style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Status</label>
            <Select options={[
              { label: 'All Status', value: 'all' },
              { label: 'Completed', value: 'completed' },
              { label: 'Pending', value: 'pending' },
            ]} style={{ width: '100%' }} />
          </div>
          <Button variant="primary" className="w-full justify-center mt-2" onClick={() => setFilterDrawer(false)}>Apply Filters</Button>
        </div>
      </Drawer>
    </div>
  );
};

export default Transactions;
