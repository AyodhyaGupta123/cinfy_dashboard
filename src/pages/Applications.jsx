import React, { useState } from 'react';
import { Plus, AppWindow, FileCode, Search, Edit3, Trash2, Eye, Copy } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import { Input, Select, FormGroup, SearchInput } from '../components/UI/FormElements';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import Avatar from '../components/UI/Avatar';
import DropdownMenu from '../components/UI/DropdownMenu';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import Pagination from '../components/UI/Pagination';
import Breadcrumb from '../components/UI/Breadcrumb';
import Tooltip from '../components/UI/Tooltip';
import Drawer from '../components/UI/Drawer';
import { useToast } from '../components/UI/Toast';
import { theme } from '../theme/constants';

const DEMO_APPS = [
  { name: 'MyApp Pro', id: 'APP-X7K29M', platform: 'Android', url: 'https://play.google.com/store/apps/details?id=com.myapp.pro', created: 'Jan 12, 2026', status: 'Active', color: '#3b82f6' },
  { name: 'GameZone', id: 'APP-P4Q81N', platform: 'iOS', url: 'https://apps.apple.com/app/gamezone/id1234567', created: 'Feb 20, 2026', status: 'Active', color: '#a855f7' },
  { name: 'FitTracker', id: 'APP-R9L52T', platform: 'Android', url: 'https://play.google.com/store/apps/details?id=com.fittracker', created: 'Mar 05, 2026', status: 'Active', color: '#f97316' },
  { name: 'PhotoEditor', id: 'APP-W3J67H', platform: 'iOS', url: 'https://apps.apple.com/app/photoeditor/id9876543', created: 'Mar 28, 2026', status: 'Inactive', color: '#ef4444' },
  { name: 'WeatherApp', id: 'APP-T5N83K', platform: 'Android', url: 'https://play.google.com/store/apps/details?id=com.weather', created: 'Apr 02, 2026', status: 'Active', color: '#16a34a' },
  { name: 'MusicStream', id: 'APP-L2M46Q', platform: 'iOS', url: 'https://apps.apple.com/app/musicstream/id5553211', created: 'Apr 10, 2026', status: 'Active', color: '#ec4899' },
];

const PER_PAGE = 4;

const Applications = () => {
  const [apps, setApps] = useState(DEMO_APPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [page, setPage] = useState(1);
  const [filterDrawer, setFilterDrawer] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({ name: '', url: '', platform: 'Android' });
  const resetForm = () => setFormData({ name: '', url: '', platform: 'Android' });

  const handleAdd = () => {
    if (!formData.name || !formData.url) return;
    const newApp = {
      name: formData.name,
      id: `APP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      platform: formData.platform,
      url: formData.url,
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'Active',
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    };
    setApps([...apps, newApp]);
    setAddModal(false);
    resetForm();
    toast.success('App Added', `${newApp.name} has been added successfully.`);
  };

  const handleEdit = () => {
    if (!selectedApp) return;
    setApps(apps.map(a => a.id === selectedApp.id ? { ...a, name: formData.name, url: formData.url, platform: formData.platform } : a));
    setEditModal(false);
    toast.success('Updated', `${formData.name} has been updated.`);
    setSelectedApp(null);
    resetForm();
  };

  const handleDelete = () => {
    if (!selectedApp) return;
    const name = selectedApp.name;
    setApps(apps.filter(a => a.id !== selectedApp.id));
    setSelectedApp(null);
    toast.error('Deleted', `${name} has been removed.`);
  };

  const openEdit = (app) => {
    setSelectedApp(app);
    setFormData({ name: app.name, url: app.url, platform: app.platform });
    setEditModal(true);
  };

  const filteredApps = apps.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredApps.length / PER_PAGE);
  const paged = filteredApps.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const columns = [
    {
      header: 'App',
      accessor: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name={row.name} size="sm" color={row.color} />
          <div>
            <div style={{ fontWeight: 600, color: theme.textPrimary }}>{row.name}</div>
            <div style={{ fontSize: 11, color: theme.textLight, fontFamily: 'monospace' }}>{row.id}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Platform',
      accessor: 'platform',
      render: (row) => <Badge variant={row.platform === 'iOS' ? 'info' : 'default'}>{row.platform}</Badge>,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge variant={row.status === 'Active' ? 'success' : 'warning'}>{row.status}</Badge>,
    },
    { header: 'Created', accessor: 'created' },
    {
      header: '',
      accessor: 'actions',
      render: (row) => (
        <DropdownMenu
          items={[
            { icon: Eye, label: 'View Details', onClick: () => toast.info('View', `Viewing ${row.name}`) },
            { icon: Edit3, label: 'Edit App', onClick: () => openEdit(row) },
            { icon: Copy, label: 'Copy ID', onClick: () => { navigator.clipboard.writeText(row.id); toast.success('Copied', row.id); } },
            { divider: true },
            { icon: Trash2, label: 'Delete', danger: true, onClick: () => { setSelectedApp(row); setDeleteDialog(true); } },
          ]}
        />
      ),
    },
  ];

  const AppForm = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>App Name</label>
        <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter app name" style={{ width: '100%' }} />
      </div>
      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>App URL</label>
        <Input value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} placeholder="https://play.google.com/store/apps/..." style={{ width: '100%' }} />
      </div>
      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Platform</label>
        <Select
          value={formData.platform}
          onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
          options={[{ label: 'Android', value: 'Android' }, { label: 'iOS', value: 'iOS' }]}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'My Applications' }]} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
        <h1 style={{ fontSize: 26, fontWeight: 700, color: theme.textPrimary }}>My Applications</h1>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Tooltip text="Manage your app-ads.txt entries" position="bottom">
            <Button variant="outline" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileCode style={{ width: 16, height: 16 }} /> App-ads.txt
            </Button>
          </Tooltip>
          <Button variant="primary" onClick={() => { resetForm(); setAddModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus style={{ width: 16, height: 16 }} /> Add New App
          </Button>
        </div>
      </div>

      <Card>
        {/* Filters — auto-fit grid stacks naturally on mobile */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16, alignItems: 'end' }}>
          <FormGroup label="Search">
            <SearchInput
              placeholder="Search by name or ID"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              style={{ width: '100%' }}
            />
          </FormGroup>
          <div style={{ display: 'flex', gap: 8 }}>
            <FormGroup label="Platform" style={{ flex: 1 }}>
              <Select options={[{ label: 'All Platforms', value: 'all' }, { label: 'iOS', value: 'ios' }, { label: 'Android', value: 'android' }]} style={{ width: '100%' }} />
            </FormGroup>
            <FormGroup label="Status" style={{ flex: 1 }}>
              <Select options={[{ label: 'All Status', value: 'all' }, { label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]} style={{ width: '100%' }} />
            </FormGroup>
          </div>
        </div>

        <Table rowKey="id" columns={columns} data={paged} emptyMessage="No apps found. Add your first app!" />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={filteredApps.length}
          perPage={PER_PAGE}
        />
      </Card>

      {/* Add Modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add New App" size="md"
        footer={<><Button variant="ghost" onClick={() => setAddModal(false)}>Cancel</Button><Button variant="primary" onClick={handleAdd}>Add App</Button></>}>
        <AppForm />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit App" size="md"
        footer={<><Button variant="ghost" onClick={() => setEditModal(false)}>Cancel</Button><Button variant="primary" onClick={handleEdit}>Save Changes</Button></>}>
        <AppForm />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        type="delete"
        title={`Delete ${selectedApp?.name}?`}
        message="This will remove the app and all associated data. This action cannot be undone."
      />

      <Drawer isOpen={filterDrawer} onClose={() => setFilterDrawer(false)} title="Filters">
        <div className="flex flex-col gap-5">
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Platform</label>
            <Select options={[{ label: 'All Platforms', value: 'all' }, { label: 'iOS', value: 'ios' }, { label: 'Android', value: 'android' }]} style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Status</label>
            <Select options={[{ label: 'Active Apps', value: 'active' }, { label: 'Inactive', value: 'inactive' }, { label: 'All', value: 'all' }]} style={{ width: '100%' }} />
          </div>
          <button className="w-full py-2.5 rounded-lg font-semibold text-sm mt-2" style={{ background: theme.primary, color: '#000', border: 'none', cursor: 'pointer' }} onClick={() => setFilterDrawer(false)}>Apply Filters</button>
        </div>
      </Drawer>
    </div>
  );
};

export default Applications;
