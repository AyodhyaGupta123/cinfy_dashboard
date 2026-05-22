import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, Clock, Video, Users, MapPin, Search } from 'lucide-react';
import Breadcrumb from '../components/UI/Breadcrumb';
import Button from '../components/UI/Button';
import Avatar from '../components/UI/Avatar';
import Card from '../components/UI/Card';
import Modal from '../components/UI/Modal';
import { Input, Select } from '../components/UI/FormElements';
import { Checkbox } from '../components/UI/CheckboxRadio';
import { useToast } from '../components/UI/Toast';
import { theme } from '../theme/constants';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DEMO_EVENTS = [
  { id: 1, title: 'Product Review', date: 2, time: '10:00 AM', type: 'meeting', color: '#3b82f6' },
  { id: 2, title: 'Design Sprint', date: 2, time: '2:00 PM', type: 'workshop', color: '#a855f7' },
  { id: 3, title: 'Client Sync', date: 5, time: '11:30 AM', type: 'call', color: '#16a34a' },
  { id: 4, title: 'Q2 Planning', date: 12, time: '09:00 AM', type: 'meeting', color: '#f59e0b' },
  { id: 5, title: 'Release v2.0', date: 15, time: 'All Day', type: 'milestone', color: '#ef4444' },
  { id: 6, title: 'Team Lunch', date: 22, time: '12:30 PM', type: 'social', color: '#f43f5e' },
  { id: 7, title: 'Performance Review', date: 28, time: '3:00 PM', type: 'meeting', color: '#3b82f6' },
];

const Calendar = () => {
  const [currentDate] = useState(new Date(2026, 3, 1)); // April 2026
  const [events, setEvents] = useState(DEMO_EVENTS);
  const [addModal, setAddModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  
  const [formData, setFormData] = useState({ title: '', time: '10:00 AM', type: 'meeting' });
  const toast = useToast();

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handleAddEvent = () => {
    if (!formData.title) return;
    const colorMap = { meeting: '#3b82f6', workshop: '#a855f7', call: '#16a34a', milestone: '#ef4444' };
    const newEvent = {
      id: Date.now(),
      title: formData.title,
      time: formData.time,
      type: formData.type,
      date: selectedDay,
      color: colorMap[formData.type] || '#3b82f6'
    };
    setEvents([...events, newEvent]);
    setAddModal(false);
    setFormData({ title: '', time: '10:00 AM', type: 'meeting' });
    toast.success('Event Added', `${newEvent.title} scheduled for April ${selectedDay}.`);
  };

  const openAddModal = (day) => {
    setSelectedDay(day);
    setAddModal(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] lg:h-auto">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Calendar' }]} />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <h1 style={{ fontSize: 26, fontWeight: 700, color: theme.textPrimary, margin: 0 }}>April 2026</h1>
          <div style={{ display: 'flex', gap: 4 }}>
            <button style={{ padding: 6, borderRadius: 6, border: `1px solid ${theme.cardBorder}`, background: theme.cardBg, cursor: 'pointer' }}>
              <ChevronLeft style={{ width: 16, height: 16, color: theme.textSecondary }} />
            </button>
            <button style={{ padding: '6px 12px', borderRadius: 6, border: `1px solid ${theme.cardBorder}`, background: theme.cardBg, fontSize: 13, fontWeight: 600, color: theme.textPrimary, cursor: 'pointer' }}>
              Today
            </button>
            <button style={{ padding: 6, borderRadius: 6, border: `1px solid ${theme.cardBorder}`, background: theme.cardBg, cursor: 'pointer' }}>
              <ChevronRight style={{ width: 16, height: 16, color: theme.textSecondary }} />
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
          <Select options={[{ label: 'Month View', value: 'month' }, { label: 'Week View', value: 'week' }, { label: 'Day View', value: 'day' }]} style={{ flex: 1 }} />
          <Button variant="primary" onClick={() => openAddModal(new Date().getDate())} className="w-full sm:w-auto justify-center" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <Plus style={{ width: 16, height: 16 }} /> New Event
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 flex-1 min-h-0">
        {/* Sidebar Filters */}
        <Card className="w-full lg:w-[260px] flex-shrink-0 lg:overflow-y-auto">
          <Button variant="primary" style={{ width: '100%', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Plus style={{ width: 16, height: 16 }} /> Create Schedule
          </Button>

          <div style={{ marginBottom: 24 }}>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: theme.inputPlaceholder }} />
              <Input placeholder="Search events..." style={{ width: '100%', paddingLeft: 36, fontSize: 13 }} />
            </div>

            <h3 style={{ fontSize: 12, fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.5px' }}>My Calendars</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Checkbox label="Personal" checked />
              <Checkbox label="Work" checked />
              <Checkbox label="Team Syncs" checked />
              <Checkbox label="Client Meetings" />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.5px' }}>Upcoming</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {events.slice(0,3).map(e => (
                <div key={e.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: e.color, marginTop: 4, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: theme.textPrimary, lineHeight: 1.3 }}>{e.title}</div>
                    <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>Apr {e.date} · {e.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Calendar Grid */}
        <Card className="flex-1 flex flex-col p-0 overflow-hidden overflow-x-auto">
          <div className="min-w-[600px] flex-1 flex flex-col">
            {/* Days Header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: `1px solid ${theme.cardBorder}`, background: '#fafafa' }}>
            {DAYS.map(day => (
              <div key={day} style={{ padding: '12px 8px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '1fr', background: theme.cardBorder, gap: 1 }}>
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} style={{ background: theme.cardBg, opacity: 0.3 }}></div>
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = events.filter(e => e.date === day);
              const isToday = day === 2; // Simulated today
              
              return (
                <div key={day} 
                  onClick={() => openAddModal(day)}
                  style={{ 
                    background: isToday ? 'rgba(3,217,133,0.02)' : theme.cardBg, 
                    padding: 8, 
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#fafafa'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = isToday ? 'rgba(3,217,133,0.02)' : theme.cardBg; }}
                >
                  <div style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    width: 24, height: 24, borderRadius: '50%', marginBottom: 8,
                    fontSize: 13, fontWeight: 600,
                    background: isToday ? theme.primary : 'transparent',
                    color: isToday ? '#fff' : theme.textPrimary,
                  }}>
                    {day}
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {dayEvents.map(e => (
                      <div key={e.id} style={{ 
                        fontSize: 11, fontWeight: 600, padding: '4px 6px', borderRadius: 4,
                        background: `${e.color}15`, color: e.color,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                      }}>
                        {e.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          </div>
        </Card>
      </div>

      {/* Add Event Modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title={`Add Event on Apr ${selectedDay}`} size="sm"
        footer={<>
          <Button variant="ghost" onClick={() => setAddModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddEvent}>Save Event</Button>
        </>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Event Title</label>
            <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Weekly Sync" style={{ width: '100%' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Time</label>
              <Input type="time" value="10:00" onChange={() => {}} style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Duration</label>
              <Select options={[{ label: '30 mins', value: '30' }, { label: '1 hour', value: '60' }, { label: '2 hours', value: '120' }]} style={{ width: '100%' }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Event Type</label>
            <Select 
              value={formData.type} 
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              options={[
                { label: 'Meeting', value: 'meeting' },
                { label: 'Workshop', value: 'workshop' },
                { label: 'Call', value: 'call' },
                { label: 'Milestone', value: 'milestone' },
              ]}
              style={{ width: '100%' }} 
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Guests</label>
            <Input placeholder="Add emails..." style={{ width: '100%' }} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Calendar;
