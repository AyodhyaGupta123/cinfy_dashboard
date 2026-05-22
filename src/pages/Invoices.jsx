import React, { useState } from 'react';
import { Search, Download, Filter, Eye, Copy, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import DropdownMenu from '../components/UI/DropdownMenu';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import Pagination from '../components/UI/Pagination';
import Breadcrumb from '../components/UI/Breadcrumb';
import { Input, Select, FormGroup, SearchInput } from '../components/UI/FormElements';
import { useToast } from '../components/UI/Toast';
import { theme } from '../theme/constants';

const DEMO_INVOICES = [
  { id: 'INV-2026-001', date: 'Apr 01, 2026', due: 'Apr 15, 2026', amount: '$4,800.00', status: 'Paid', client: 'Acme Corp' },
  { id: 'INV-2026-002', date: 'Apr 10, 2026', due: 'Apr 25, 2026', amount: '$2,340.00', status: 'Pending', client: 'Global Tech' },
  { id: 'INV-2026-003', date: 'Mar 15, 2026', due: 'Mar 30, 2026', amount: '$3,120.00', status: 'Paid', client: 'Startup Inc' },
  { id: 'INV-2026-004', date: 'Mar 01, 2026', due: 'Mar 15, 2026', amount: '$1,890.00', status: 'Overdue', client: 'Alpha LLC' },
  { id: 'INV-2026-005', date: 'Feb 15, 2026', due: 'Mar 01, 2026', amount: '$2,100.00', status: 'Paid', client: 'Acme Corp' },
  { id: 'INV-2026-006', date: 'Feb 01, 2026', due: 'Feb 15, 2026', amount: '$1,500.00', status: 'Paid', client: 'Global Tech' },
];

const PER_PAGE = 5;

const Invoices = () => {
  const [invoices, setInvoices] = useState(DEMO_INVOICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  const toast = useToast();

  const filteredInvoices = invoices.filter(i => {
    const matchesSearch = i.id.toLowerCase().includes(searchQuery.toLowerCase()) || i.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || i.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredInvoices.length / PER_PAGE);
  const paged = filteredInvoices.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = () => {
    if (!selectedInvoice) return;
    setInvoices(invoices.filter(i => i.id !== selectedInvoice.id));
    toast.error('Invoice Deleted', `Invoice ${selectedInvoice.id} has been permanently removed.`);
    setSelectedInvoice(null);
  };

  const statusVariants = { Paid: 'success', Pending: 'warning', Overdue: 'error' };
  const statusIcons = {
    Paid: <CheckCircle style={{ width: 12, height: 12 }} />,
    Pending: <Clock style={{ width: 12, height: 12 }} />,
    Overdue: <AlertCircle style={{ width: 12, height: 12 }} />,
  };

  const columns = [
    {
      header: 'Invoice ID',
      accessor: 'id',
      render: (row) => <span style={{ fontWeight: 600, color: theme.textPrimary }}>{row.id}</span>
    },
    { header: 'Client', accessor: 'client' },
    { header: 'Date', accessor: 'date' },
    { header: 'Amount', accessor: 'amount', render: (row) => <span style={{ fontWeight: 600, color: theme.primary }}>{row.amount}</span> },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span style={{
          padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4,
          background: row.status === 'Paid' ? 'rgba(3,217,133,0.1)' : row.status === 'Pending' ? 'rgba(249,115,22,0.1)' : 'rgba(239,68,68,0.1)',
          color: row.status === 'Paid' ? '#16a34a' : row.status === 'Pending' ? '#f97316' : '#ef4444'
        }}>
          {statusIcons[row.status]}
          {row.status}
        </span>
      )
    },
    {
      header: '',
      accessor: 'actions',
      render: (row) => (
        <DropdownMenu
          items={[
            { icon: Eye, label: 'View Details', onClick: () => toast.info('View', `Viewing ${row.id}`) },
            { icon: Download, label: 'Download PDF', onClick: () => toast.success('Downloaded', `${row.id}.pdf has been saved.`) },
            { icon: Copy, label: 'Copy Link', onClick: () => { navigator.clipboard.writeText(`https://cinfy.io/invoice/${row.id}`); toast.success('Copied', 'Invoice link copied.'); } },
            { divider: true },
            { icon: Trash2, label: 'Delete', danger: true, onClick: () => { setSelectedInvoice(row); setDeleteDialog(true); } },
          ]}
        />
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Payments', path: '/payments/earnings' }, { label: 'Invoices' }]} />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
        <div>
          <h1 style={{ fontSize: theme.fontSizeH1, fontWeight: theme.fontWeightBold, color: theme.textPrimary, marginBottom: 4 }}>Invoices</h1>
          <p style={{ fontSize: theme.fontSizeBody, color: theme.textMuted }}>Track and manage your billing history.</p>
        </div>
        <Button variant="ghost" className="w-full sm:w-auto justify-center" onClick={() => toast.success('Export Started', 'All invoices are being exported.')} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Download style={{ width: 14, height: 14 }} /> Export All
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Paid', value: '$13,310.00', color: '#16a34a' },
          { label: 'Pending', value: '$2,340.00', color: '#f97316' },
          { label: 'Overdue', value: '$1,890.00', color: '#ef4444' },
        ].map((s) => (
          <Card key={s.label} style={{ padding: '16px 20px', borderLeft: `4px solid ${s.color}` }}>
            <div style={{ fontSize: theme.fontSizeMuted, color: theme.textMuted, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: theme.fontSizeH1, fontWeight: theme.fontWeightBold, color: theme.textPrimary }}>{s.value}</div>
          </Card>
        ))}
      </div>

      <Card>
        {/* Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16, alignItems: 'end' }}>
          <FormGroup label="Search">
            <SearchInput
              placeholder="Search by ID or Client..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              style={{ width: '100%' }}
            />
          </FormGroup>
          <FormGroup label="Status">
            <Select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              options={[
                { label: 'All Statuses', value: 'all' },
                { label: 'Paid', value: 'paid' },
                { label: 'Pending', value: 'pending' },
                { label: 'Overdue', value: 'overdue' },
              ]}
              style={{ width: '100%' }}
            />
          </FormGroup>
        </div>

        {/* Table */}
        <Table rowKey="id" columns={columns} data={paged} emptyMessage="No invoices found matching your filters." />

        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={setPage} 
          totalItems={filteredInvoices.length} 
          perPage={PER_PAGE} 
        />
      </Card>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        type="delete"
        title={`Delete Invoice ${selectedInvoice?.id}?`}
        message="This will permanently delete the invoice. This action cannot be undone."
      />
    </div>
  );
};

export default Invoices;
