import React, { useState } from 'react';
import { Plus, Search, Filter, Edit3, Trash2, Mail, Shield, ShieldAlert, Key } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import Avatar from '../components/UI/Avatar';
import DropdownMenu from '../components/UI/DropdownMenu';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import Pagination from '../components/UI/Pagination';
import Breadcrumb from '../components/UI/Breadcrumb';
import { Input, Select, FormGroup, SearchInput } from '../components/UI/FormElements';
import { useToast } from '../components/UI/Toast';
import Drawer from '../components/UI/Drawer';
import { theme } from '../theme/constants';

const DEMO_USERS = [
  { id: 'USR-001', name: 'Alex Johnson', email: 'alex.j@example.com', role: 'Admin', status: 'Active', lastLogin: '2 mins ago' },
  { id: 'USR-002', name: 'Sarah Williams', email: 'sarah.w@example.com', role: 'Editor', status: 'Active', lastLogin: '1 hour ago' },
  { id: 'USR-003', name: 'Michael Brown', email: 'mike.b@example.com', role: 'Viewer', status: 'Invited', lastLogin: 'Never' },
  { id: 'USR-004', name: 'Emily Davis', email: 'emily.d@example.com', role: 'Editor', status: 'Active', lastLogin: 'Yesterday' },
  { id: 'USR-005', name: 'James Wilson', email: 'james.w@example.com', role: 'Viewer', status: 'Inactive', lastLogin: '2 weeks ago' },
];

const PER_PAGE = 5;

const Users = () => {
  const [users, setUsers] = useState(DEMO_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [filterDrawer, setFilterDrawer] = useState(false);
  
  const [addModal, setAddModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Viewer' });
  const toast = useToast();

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / PER_PAGE);
  const paged = filteredUsers.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleAddUser = () => {
    if (!formData.name || !formData.email) return;
    const newUser = {
      id: `USR-00${users.length + 1}`,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: 'Invited',
      lastLogin: 'Never',
    };
    setUsers([...users, newUser]);
    setAddModal(false);
    setFormData({ name: '', email: '', role: 'Viewer' });
    toast.success('Invite Sent', `An invitation email has been sent to ${newUser.email}.`);
  };

  const handleDelete = () => {
    if (!selectedUser) return;
    setUsers(users.filter(u => u.id !== selectedUser.id));
    toast.error('User Removed', `${selectedUser.name} has been removed from the team.`);
    setSelectedUser(null);
  };

  const roleStyles = {
    Admin: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
    Editor: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
    Viewer: { bg: 'rgba(107,114,128,0.1)', color: '#6b7280' },
  };

  const statusVariants = { Active: 'success', Invited: 'warning', Inactive: 'default' };

  const columns = [
    {
      header: 'User',
      accessor: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name={row.name} size="md" />
          <div>
            <div style={{ fontWeight: 600, color: theme.textPrimary }}>{row.name}</div>
            <div style={{ fontSize: 13, color: theme.textMuted }}>{row.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (row) => {
        const style = roleStyles[row.role];
        return (
          <span style={{
            padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
            background: style?.bg, color: style?.color, display: 'inline-flex', alignItems: 'center', gap: 4
          }}>
            {row.role === 'Admin' ? <ShieldAlert style={{ width: 12, height: 12 }} /> : <Shield style={{ width: 12, height: 12 }} />}
            {row.role}
          </span>
        );
      }
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge variant={statusVariants[row.status]}>{row.status}</Badge>
    },
    { header: 'Last Login', accessor: 'lastLogin' },
    {
      header: '',
      accessor: 'actions',
      render: (row) => (
        <DropdownMenu
          items={[
            { icon: Edit3, label: 'Edit Role', onClick: () => toast.info('Edit', 'Edit role clicked') },
            { icon: Key, label: 'Reset Password', onClick: () => toast.success('Sent', 'Password reset email sent.') },
            { divider: true },
            { icon: Trash2, label: 'Remove User', danger: true, onClick: () => { setSelectedUser(row); setDeleteDialog(true); } },
          ]}
        />
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Team Members' }]} />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: theme.textPrimary, marginBottom: 4 }}>Team Members</h1>
          <p style={{ fontSize: 14, color: theme.textMuted }}>Manage your team's access and roles.</p>
        </div>
        <Button variant="primary" className="w-full sm:w-auto justify-center" onClick={() => setAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus style={{ width: 16, height: 16 }} /> Invite Member
        </Button>
      </div>

      <Card>
        {/* Filters — auto-fit grid stacks naturally on mobile */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16, alignItems: 'end' }}>
          <FormGroup label="Search">
            <SearchInput
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              style={{ width: '100%' }}
            />
          </FormGroup>
          <FormGroup label="Role">
            <Select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              options={[
                { label: 'All Roles', value: 'all' },
                { label: 'Admins', value: 'admin' },
                { label: 'Editors', value: 'editor' },
                { label: 'Viewers', value: 'viewer' },
              ]}
              style={{ width: '100%' }}
            />
          </FormGroup>
        </div>

        {/* Table */}
        <Table rowKey="id" columns={columns} data={paged} emptyMessage="No team members found." />

        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={setPage} 
          totalItems={filteredUsers.length} 
          perPage={PER_PAGE} 
        />
      </Card>

      {/* Invite Modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Invite Team Member" size="sm"
        footer={<>
          <Button variant="ghost" onClick={() => setAddModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddUser} disabled={!formData.name || !formData.email}>Send Invite</Button>
        </>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Full Name</label>
            <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Doe" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Email Address</label>
            <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Role</label>
            <Select 
              value={formData.role} 
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              options={[
                { label: 'Admin (Full Access)', value: 'Admin' },
                { label: 'Editor (Can modify content)', value: 'Editor' },
                { label: 'Viewer (Read only)', value: 'Viewer' },
              ]}
              style={{ width: '100%' }} 
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        type="delete"
        title={`Remove ${selectedUser?.name}?`}
        message="This user will lose access to the platform immediately. Are you sure?"
        confirmLabel="Remove User"
      />

      <Drawer isOpen={filterDrawer} onClose={() => setFilterDrawer(false)} title="Filters">
        <div className="flex flex-col gap-4">
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Role</label>
            <Select 
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              options={[
                { label: 'All Roles', value: 'all' },
                { label: 'Admins', value: 'admin' },
                { label: 'Editors', value: 'editor' },
                { label: 'Viewers', value: 'viewer' },
              ]} 
              style={{ width: '100%' }}
            />
          </div>
          <Button variant="primary" className="w-full justify-center mt-2" onClick={() => setFilterDrawer(false)}>Apply Filters</Button>
        </div>
      </Drawer>
    </div>
  );
};

export default Users;
