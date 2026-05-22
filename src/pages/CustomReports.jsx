import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, Plus, Eye, Trash2, BarChart2 } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import { Select, FormGroup } from '../components/UI/FormElements';
import Badge from '../components/UI/Badge';
import DropdownMenu from '../components/UI/DropdownMenu';
import Breadcrumb from '../components/UI/Breadcrumb';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import { useToast } from '../components/UI/Toast';
import { theme } from '../theme/constants';

const DEMO_REPORTS = [
  { id: 1, name: 'Weekly Revenue Summary', type: 'Revenue', schedule: 'Weekly', lastRun: 'Apr 28, 2026', status: 'Completed', rows: 1240 },
  { id: 2, name: 'Monthly Impressions Report', type: 'Performance', schedule: 'Monthly', lastRun: 'Apr 01, 2026', status: 'Completed', rows: 8420 },
  { id: 3, name: 'CTR Analysis by Country', type: 'Analytics', schedule: 'Daily', lastRun: 'Apr 29, 2026', status: 'Running', rows: 342 },
  { id: 4, name: 'Ad Format Comparison', type: 'Ads', schedule: 'Weekly', lastRun: 'Apr 25, 2026', status: 'Completed', rows: 560 },
  { id: 5, name: 'Top Performing Apps', type: 'Performance', schedule: 'Monthly', lastRun: 'Apr 15, 2026', status: 'Completed', rows: 125 },
  { id: 6, name: 'Fill Rate Optimization', type: 'Analytics', schedule: 'Daily', lastRun: 'Apr 29, 2026', status: 'Scheduled', rows: 0 },
];

const statusStyles = {
  Completed: { bg: 'rgba(3,217,133,0.08)', color: '#16a34a' },
  Running: { bg: 'rgba(59,130,246,0.08)', color: '#3b82f6' },
  Scheduled: { bg: 'rgba(249,115,22,0.08)', color: '#f97316' },
};

const CustomReports = () => {
  const [reports, setReports] = useState(DEMO_REPORTS);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const toast = useToast();

  const columns = [
    {
      header: 'Report Name',
      accessor: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: theme.primaryLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FileText style={{ width: 16, height: 16, color: theme.primary }} />
          </div>
          <span style={{ fontWeight: 600, color: theme.textPrimary }}>{row.name}</span>
        </div>
      ),
    },
    { header: 'Type', accessor: 'type' },
    { header: 'Schedule', accessor: 'schedule' },
    { header: 'Last Run', accessor: 'lastRun' },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        const variant = row.status === 'Completed' ? 'success' : row.status === 'Running' ? 'info' : 'warning';
        return <Badge variant={variant}>{row.status}</Badge>;
      },
    },
    {
      header: 'Rows',
      accessor: 'rows',
      render: (row) => <span style={{ fontWeight: 600, color: theme.textPrimary }}>{row.rows.toLocaleString()}</span>,
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <DropdownMenu items={[
          { icon: Eye, label: 'View Report', onClick: () => toast.info('Viewing', row.name) },
          { icon: Download, label: 'Download', onClick: () => toast.success('Downloaded', `${row.name} exported.`) },
          { divider: true },
          { icon: Trash2, label: 'Delete', danger: true, onClick: () => { setSelectedReport(row); setDeleteDialog(true); } },
        ]} />
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Custom Reports' }]} />
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
        <h1 style={{ fontSize: theme.fontSizeH1, fontWeight: theme.fontWeightBold, color: theme.textPrimary }}>Custom Reports</h1>
        <Button variant="primary" className="w-full sm:w-auto justify-center" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus style={{ width: 16, height: 16 }} /> Create Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Reports', value: '6', icon: FileText, color: theme.primary },
          { label: 'Completed', value: '4', icon: BarChart2, color: '#16a34a' },
          { label: 'Running', value: '1', icon: Filter, color: '#3b82f6' },
          { label: 'Scheduled', value: '1', icon: Calendar, color: '#f97316' },
        ].map((item) => (
          <Card key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: `${item.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <item.icon style={{ width: 18, height: 18, color: item.color }} />
            </div>
            <div>
              <div style={{ fontSize: theme.fontSizeH2, fontWeight: theme.fontWeightBold, color: theme.textPrimary }}>{item.value}</div>
              <div style={{ fontSize: theme.fontSizeMuted, color: theme.textMuted }}>{item.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters + Table */}
      <Card>
        {/* Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16, alignItems: 'end' }}>
          <FormGroup label="Type">
            <Select options={[
              { label: 'All Types', value: 'all' },
              { label: 'Revenue', value: 'revenue' },
              { label: 'Performance', value: 'performance' },
              { label: 'Analytics', value: 'analytics' },
              { label: 'Ads', value: 'ads' },
            ]} style={{ width: '100%' }} />
          </FormGroup>
          <FormGroup label="Schedule">
            <Select options={[
              { label: 'All Schedules', value: 'all' },
              { label: 'Daily', value: 'daily' },
              { label: 'Weekly', value: 'weekly' },
              { label: 'Monthly', value: 'monthly' },
            ]} style={{ width: '100%' }} />
          </FormGroup>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Button variant="ghost" className="w-full justify-center" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Download style={{ width: 14, height: 14 }} /> Export All
            </Button>
          </div>
        </div>

        <Table rowKey="id" columns={columns} data={reports} emptyMessage="No reports created yet" />
      </Card>

      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={() => {
          setReports(reports.filter(r => r.id !== selectedReport?.id));
          toast.error('Deleted', `${selectedReport?.name} has been removed.`);
        }}
        type="delete"
        title={`Delete ${selectedReport?.name}?`}
        message="This report and its data will be permanently deleted."
      />
    </div>
  );
};

export default CustomReports;
