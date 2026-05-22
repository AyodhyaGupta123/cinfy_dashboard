import React, { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, Clock, CheckCircle2, Search, Filter, Trash2, MailOpen } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Avatar from '../components/UI/Avatar';
import Badge from '../components/UI/Badge';
import Breadcrumb from '../components/UI/Breadcrumb';
import { Input, Select } from '../components/UI/FormElements';
import { useToast } from '../components/UI/Toast';
import { theme } from '../theme/constants';

const DEMO_NOTIFICATIONS = [
  { id: 1, type: 'success', title: 'Payment Successful', message: 'Your payment of $2,450 has been processed.', time: '2 mins ago', unread: true, category: 'Billing' },
  { id: 2, type: 'warning', title: 'High Traffic Alert', message: 'MyApp Pro is experiencing unusual traffic spikes.', time: '1 hour ago', unread: true, category: 'System' },
  { id: 3, type: 'info', title: 'New Feature Available', message: 'Check out the new advanced charts gallery!', time: 'Yesterday', unread: false, category: 'Updates' },
  { id: 4, type: 'error', title: 'Ad Request Failed', message: 'AdMob API returned an error: rate limit exceeded.', time: 'Yesterday', unread: false, category: 'System' },
  { id: 5, type: 'success', title: 'New Team Member', message: 'Sarah Williams has joined your workspace.', time: 'Apr 25', unread: false, category: 'Team' },
  { id: 6, type: 'info', title: 'Weekly Report Ready', message: 'Your weekly performance report is ready to download.', time: 'Apr 24', unread: false, category: 'Reports' },
  { id: 7, type: 'warning', title: 'App-ads.txt Warning', message: 'Missing entries for Unity Ads detected.', time: 'Apr 20', unread: false, category: 'System' },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    toast.success('Marked as Read', 'All notifications have been marked as read.');
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.info('Deleted', 'Notification removed.');
  };

  const handleMarkRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const filtered = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'unread' && n.unread) || (filter === n.category.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle style={{ color: '#16a34a', width: 20, height: 20 }} />;
      case 'warning': return <AlertTriangle style={{ color: '#f59e0b', width: 20, height: 20 }} />;
      case 'error': return <AlertTriangle style={{ color: '#ef4444', width: 20, height: 20 }} />;
      default: return <Info style={{ color: '#3b82f6', width: 20, height: 20 }} />;
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Notifications' }]} />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: theme.textPrimary, marginBottom: 4 }}>Notifications</h1>
          <p style={{ fontSize: 14, color: theme.textMuted }}>Stay updated with alerts and system messages.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto justify-center" onClick={handleMarkAllRead} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 style={{ width: 16, height: 16 }} /> Mark all as read
          </Button>
          <Button variant="ghost" className="w-full sm:w-auto justify-center" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Trash2 style={{ width: 16, height: 16 }} /> Clear all
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Sidebar Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: theme.inputPlaceholder }} />
            <Input 
              placeholder="Search notifications..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 40, width: '100%', background: theme.cardBg }} 
            />
          </div>
          
          <Card style={{ padding: '16px 0' }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', padding: '0 20px', marginBottom: 12, letterSpacing: '0.5px' }}>Filters</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { id: 'all', label: 'All Notifications', icon: Bell },
                { id: 'unread', label: 'Unread', icon: MailOpen },
                { id: 'system', label: 'System Alerts', icon: AlertTriangle },
                { id: 'billing', label: 'Billing', icon: CheckCircle },
                { id: 'team', label: 'Team Activity', icon: Info },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px',
                    border: 'none', background: filter === f.id ? 'rgba(3,217,133,0.05)' : 'transparent',
                    color: filter === f.id ? theme.primary : theme.textSecondary,
                    cursor: 'pointer', textAlign: 'left', fontSize: 14, fontWeight: 600,
                    borderRight: `3px solid ${filter === f.id ? theme.primary : 'transparent'}`,
                    transition: theme.transition
                  }}
                >
                  <f.icon style={{ width: 16, height: 16 }} />
                  {f.label}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* List */}
        <Card className="lg:col-span-3" style={{ padding: 0, overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <Bell style={{ width: 48, height: 48, color: theme.textMuted, margin: '0 auto 16px', opacity: 0.5 }} />
              <h3 style={{ fontSize: 18, fontWeight: 600, color: theme.textPrimary, marginBottom: 8 }}>All Caught Up!</h3>
              <p style={{ color: theme.textMuted, fontSize: 14 }}>There are no notifications matching your filters.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filtered.map((n, i) => (
                <div key={n.id} style={{ 
                  display: 'flex', gap: 16, padding: '20px 24px',
                  background: n.unread ? 'rgba(3,217,133,0.02)' : 'transparent',
                  borderBottom: i < filtered.length - 1 ? `1px solid ${theme.cardBorder}` : 'none',
                  transition: 'background 0.2s',
                  cursor: 'pointer'
                }}
                onClick={() => handleMarkRead(n.id)}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#fafafa'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = n.unread ? 'rgba(3,217,133,0.02)' : 'transparent'; }}
                >
                  <div style={{ 
                    width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                    background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {getIcon(n.type)}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h3 style={{ fontSize: 15, fontWeight: n.unread ? 700 : 600, color: theme.textPrimary, margin: 0 }}>{n.title}</h3>
                        {n.unread && <span style={{ width: 8, height: 8, borderRadius: '50%', background: theme.primary }} />}
                      </div>
                      <span style={{ fontSize: 12, color: theme.textMuted, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock style={{ width: 12, height: 12 }} /> {n.time}
                      </span>
                    </div>
                    <p style={{ fontSize: 14, color: theme.textSecondary, margin: '0 0 8px 0', lineHeight: 1.5 }}>
                      {n.message}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Badge variant="default">{n.category}</Badge>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(n.id); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textMuted, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <Trash2 style={{ width: 14, height: 14 }} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
