import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { theme } from '../../theme/constants';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center gap-1 mb-4 overflow-x-auto flex-nowrap pb-0">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            {isLast ? (
              <span style={{ fontSize: 13, fontWeight: 600, color: theme.textPrimary, whiteSpace: 'nowrap' }}>{item.label}</span>
            ) : (
              <Link
                to={item.path || '#'}
                style={{
                  fontSize: 13, fontWeight: 500, color: theme.textMuted,
                  textDecoration: 'none', transition: 'color 0.15s', whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = theme.primary; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = theme.textMuted; }}
              >
                {item.label}
              </Link>
            )}
            {!isLast && <ChevronRight style={{ width: 14, height: 14, color: theme.textLight, flexShrink: 0 }} />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
