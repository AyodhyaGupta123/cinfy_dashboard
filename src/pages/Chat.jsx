import React, { useState, useRef, useEffect } from 'react';
import { Search, MoreVertical, Phone, Video, Paperclip, Send, Smile, Info, Settings, Trash2 } from 'lucide-react';
import Breadcrumb from '../components/UI/Breadcrumb';
import Button from '../components/UI/Button';
import Avatar from '../components/UI/Avatar';
import Card from '../components/UI/Card';
import DropdownMenu from '../components/UI/DropdownMenu';
import { Input } from '../components/UI/FormElements';
import { theme } from '../theme/constants';

const DEMO_CONTACTS = [
  { id: 1, name: 'Support Team', lastMessage: 'We will look into this issue immediately.', time: '10:42 AM', unread: 2, online: true, type: 'group' },
  { id: 2, name: 'Sarah Williams', lastMessage: 'Can you send over the latest AdMob reports?', time: 'Yesterday', unread: 0, online: true },
  { id: 3, name: 'Alex Johnson', lastMessage: 'The new dashboard looks great! Thanks.', time: 'Monday', unread: 0, online: false },
  { id: 4, name: 'Billing Dept', lastMessage: 'Your invoice #INV-2026-001 has been paid.', time: 'Apr 15', unread: 0, online: true, type: 'group' },
  { id: 5, name: 'Michael Brown', lastMessage: 'Let\'s sync up tomorrow at 10 AM.', time: 'Apr 12', unread: 0, online: false },
];

const INITIAL_MESSAGES = [
  { id: 1, sender: 'Support Team', text: 'Hi Ankit, how can we help you today?', time: '10:30 AM', isMe: false },
  { id: 2, sender: 'Me', text: 'I noticed a discrepancy in yesterday\'s eCPM numbers.', time: '10:35 AM', isMe: true },
  { id: 3, sender: 'Support Team', text: 'Let me check that for you. Which app are you looking at?', time: '10:38 AM', isMe: false },
  { id: 4, sender: 'Me', text: 'MyApp Pro on Android.', time: '10:40 AM', isMe: true },
  { id: 5, sender: 'Support Team', text: 'We will look into this issue immediately.', time: '10:42 AM', isMe: false },
];

const Chat = () => {
  const [contacts] = useState(DEMO_CONTACTS);
  const [activeContact, setActiveContact] = useState(DEMO_CONTACTS[0]);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const msg = {
      id: Date.now(),
      sender: 'Me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    
    setMessages([...messages, msg]);
    setNewMessage('');
    
    // Simulate reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: activeContact.name,
        text: 'Thanks for the details. We are investigating and will get back to you shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Chat & Messages' }]} />
      
      <div className="flex flex-col md:flex-row gap-5 flex-1 min-h-0 mt-4">
        {/* Sidebar / Contact List */}
        <Card className="w-full md:w-[320px] h-[280px] md:h-auto flex-shrink-0 flex flex-col p-0 overflow-hidden">
          <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${theme.cardBorder}` }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: theme.textPrimary, margin: '0 0 16px 0' }}>Messages</h2>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: theme.inputPlaceholder }} />
              <Input placeholder="Search messages..." style={{ width: '100%', paddingLeft: 36, fontSize: 13, background: '#f5f5f5', border: 'none' }} />
            </div>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {contacts.map(contact => (
              <div 
                key={contact.id} 
                onClick={() => setActiveContact(contact)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', 
                  cursor: 'pointer', transition: 'background 0.2s',
                  background: activeContact.id === contact.id ? 'rgba(3,217,133,0.05)' : 'transparent',
                  borderLeft: `3px solid ${activeContact.id === contact.id ? theme.primary : 'transparent'}`,
                  borderBottom: `1px solid ${theme.cardBorder}`
                }}
                onMouseEnter={(e) => { if (activeContact.id !== contact.id) e.currentTarget.style.background = '#fafafa'; }}
                onMouseLeave={(e) => { if (activeContact.id !== contact.id) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ position: 'relative' }}>
                  <Avatar name={contact.name} size="md" />
                  {contact.online && (
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, background: '#16a34a', borderRadius: '50%', border: '2px solid white' }} />
                  )}
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: theme.textPrimary, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {contact.name}
                    </h3>
                    <span style={{ fontSize: 11, color: theme.textMuted }}>{contact.time}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: 13, color: contact.unread > 0 ? theme.textPrimary : theme.textSecondary, fontWeight: contact.unread > 0 ? 600 : 400, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: 8 }}>
                      {contact.lastMessage}
                    </p>
                    {contact.unread > 0 && (
                      <span style={{ background: theme.primary, color: 'white', fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 10 }}>
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col p-0 overflow-hidden min-h-[400px] md:min-h-0">
          {/* Chat Header */}
          <div className="px-4 py-3 sm:px-6 md:py-4 border-b flex flex-wrap gap-3 items-center justify-between bg-[#fafafa]" style={{ borderColor: theme.cardBorder }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative' }}>
                <Avatar name={activeContact.name} size="sm" />
                {activeContact.online && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 8, height: 8, background: '#16a34a', borderRadius: '50%', border: '2px solid white' }} />}
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: theme.textPrimary, margin: 0 }}>{activeContact.name}</h3>
                <span style={{ fontSize: 12, color: theme.textMuted }}>{activeContact.online ? 'Online' : 'Offline'}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary }}><Phone style={{ width: 18, height: 18 }} /></button>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary }}><Video style={{ width: 18, height: 18 }} /></button>
              <div style={{ width: 1, height: 20, background: theme.cardBorder, margin: '0 4px' }} />
              <DropdownMenu items={[
                { icon: Info, label: 'View Profile' },
                { icon: Settings, label: 'Settings' },
                { divider: true },
                { icon: Trash2, label: 'Clear Chat', danger: true },
              ]}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary }}><MoreVertical style={{ width: 18, height: 18 }} /></button>
              </DropdownMenu>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: msg.isMe ? 'row-reverse' : 'row', gap: 12, alignItems: 'flex-end' }}>
                {!msg.isMe && <Avatar name={msg.sender} size="sm" style={{ width: 28, height: 28 }} />}
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isMe ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                  <div style={{ 
                    padding: '10px 14px', 
                    background: msg.isMe ? theme.primary : '#f1f5f9', 
                    color: msg.isMe ? 'white' : theme.textPrimary,
                    borderRadius: 16, 
                    borderBottomRightRadius: msg.isMe ? 4 : 16,
                    borderBottomLeftRadius: !msg.isMe ? 4 : 16,
                    fontSize: 14, lineHeight: 1.5,
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>{msg.time}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: '16px 24px', borderTop: `1px solid ${theme.cardBorder}` }}>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: 12 }}>
              <button type="button" style={{ background: '#f5f5f5', border: 'none', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: theme.textSecondary, flexShrink: 0 }}>
                <Paperclip style={{ width: 18, height: 18 }} />
              </button>
              
              <div style={{ position: 'relative', flex: 1 }}>
                <Input 
                  value={newMessage} 
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..." 
                  style={{ width: '100%', paddingRight: 40, borderRadius: 20, background: '#f5f5f5', border: 'none' }} 
                />
                <button type="button" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: theme.textMuted }}>
                  <Smile style={{ width: 18, height: 18 }} />
                </button>
              </div>
              
              <Button type="submit" variant="primary" style={{ width: 40, height: 40, borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} disabled={!newMessage.trim()}>
                <Send style={{ width: 18, height: 18, marginLeft: -2 }} />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
