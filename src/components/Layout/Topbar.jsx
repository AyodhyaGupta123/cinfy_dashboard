import React from 'react';
import { Bell, Search, LogOut, User, Settings as SettingsIcon, Menu } from 'lucide-react';
import { theme } from '../../theme/constants';
import { useAuth } from '../../context/AuthContext';
import DropdownMenu from '../UI/DropdownMenu';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ onMenuToggle, isMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header style={{
      height: 60, padding: isMobile ? '0 12px' : '0 28px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: theme.topbarBg, borderBottom: `1px solid ${theme.topbarBorder}`,
      position: 'sticky', top: 0, zIndex: 40, gap: 12,
    }}>
      {/* Left side: Hamburger on mobile + Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
        {isMobile && (
          <button
            onClick={onMenuToggle}
            style={{
              width: 40, height: 40, borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: `1px solid ${theme.inputBorder}`,
              cursor: 'pointer', color: theme.textSecondary, flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            <Menu style={{ width: 20, height: 20 }} />
          </button>
        )}

        <div style={{ position: 'relative', width: '100%', maxWidth: isMobile ? '100%' : 380, minWidth: 0 }}>
          <Search style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            width: 16, height: 16, color: theme.inputPlaceholder, pointerEvents: 'none',
          }} />
          <input
            type="text" placeholder="Search..."
            style={{
              width: '100%', padding: '9px 14px 9px 38px',
              fontSize: 14, color: theme.inputText, background: theme.pageBg,
              border: `1px solid ${theme.inputBorder}`, borderRadius: theme.radiusSm, outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => { e.target.style.borderColor = theme.primary; }}
            onBlur={(e) => { e.target.style.borderColor = theme.inputBorder; }}
          />
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 16, flexShrink: 0 }}>
        {/* Revenue pill - hidden on small mobile */}
        <div className="topbar-revenue-pill" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 20,
          border: `1px solid ${theme.inputBorder}`, background: theme.cardBg,
          whiteSpace: 'nowrap',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: theme.primary }} />
          <span style={{ color: theme.textMuted }}>Revenue:</span>
          <span style={{ color: theme.textPrimary }}>$12,840.60</span>
        </div>

        <button style={{
          position: 'relative', padding: 8, color: theme.textMuted,
          background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 8,
        }}
          onMouseEnter={(e) => { e.currentTarget.style.color = theme.textPrimary; e.currentTarget.style.background = '#f0f0f0'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = theme.textMuted; e.currentTarget.style.background = 'transparent'; }}
        >
          <Bell style={{ width: 20, height: 20 }} />
          <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: `2px solid ${theme.topbarBg}` }} />
        </button>

        {/* User Profile Dropdown */}
        <div className="topbar-separator" style={{ height: 32, width: 1, background: theme.topbarBorder, margin: '0 4px' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="topbar-user-info" style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: theme.textPrimary, lineHeight: 1.2 }}>{user?.name || 'Guest User'}</div>
            <div style={{ fontSize: 11, color: theme.textMuted }}>{user?.role || 'User'}</div>
          </div>
          
          <DropdownMenu
            trigger={
              <button style={{
                width: 36, height: 36, borderRadius: 10, overflow: 'hidden',
                border: `2px solid ${theme.cardBorder}`, cursor: 'pointer',
                padding: 0, background: theme.cardBg
              }}>
                <img 
                  src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Guest'}`} 
                  alt="Avatar" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </button>
            }
            items={[
              { icon: User, label: 'My Profile', onClick: () => navigate('/profile') },
              { icon: SettingsIcon, label: 'Settings', onClick: () => navigate('/settings') },
              { divider: true },
              { icon: LogOut, label: 'Sign Out', danger: true, onClick: logout },
            ]}
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
