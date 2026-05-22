import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { theme } from '../../theme/constants';

const Pagination = ({ currentPage, totalPages, onPageChange, showInfo = true, totalItems = 0, perPage = 10 }) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const delta = 1;
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);
    if (left > 2) pages.push('...');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  const btnStyle = (active) => ({
    width: 34, height: 34, borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: 'none', cursor: active ? 'default' : 'pointer',
    fontSize: 13, fontWeight: active ? 700 : 500,
    background: active ? theme.primary : 'transparent',
    color: active ? '#000' : theme.textMuted,
    transition: theme.transition,
  });

  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
      {showInfo && totalItems > 0 && (
        <span style={{ fontSize: 13, color: theme.textMuted }}>
          Showing {start}–{end} of {totalItems}
        </span>
      )}
      <div className="flex items-center gap-1 sm:ml-auto">
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ ...btnStyle(false), opacity: currentPage === 1 ? 0.3 : 1 }}
        >
          <ChevronLeft style={{ width: 16, height: 16 }} />
        </button>

        {getPages().map((p, i) =>
          p === '...' ? (
            <span key={i} style={{ padding: '0 4px', color: theme.textLight, fontSize: 13 }}>…</span>
          ) : (
            <button key={i} onClick={() => onPageChange(p)} style={btnStyle(p === currentPage)}>
              {p}
            </button>
          )
        )}

        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{ ...btnStyle(false), opacity: currentPage === totalPages ? 0.3 : 1 }}
        >
          <ChevronRight style={{ width: 16, height: 16 }} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
