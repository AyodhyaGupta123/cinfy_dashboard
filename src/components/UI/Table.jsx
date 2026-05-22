import React from 'react';
import { theme } from '../../theme/constants';

const Table = ({
  columns,
  data,
  rowKey = 'id',
  emptyMessage = 'No data available',
  compact = false,
}) => {
  const cellPadding = compact ? '10px 14px' : '13px 20px';
  const minWidth = compact ? 520 : 600;
  const headerFontSize = compact ? 11 : 12;

  return (
    /* 
      Scroll wrapper = 100% of parent (Card).
      Table has NO width:100% — only minWidth.
      On mobile: table is minWidth px wide, wrapper is narrower → overflow-x triggers → scroll works.
      On desktop: table naturally expands to fill the card → no scroll needed.
    */
    <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <table style={{ width: '100%', minWidth, borderCollapse: 'collapse', textAlign: 'left', tableLayout: 'auto' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${theme.cardBorder}` }}>
            {columns.map((col, idx) => (
              <th key={idx} style={{
                padding: cellPadding, fontSize: headerFontSize, fontWeight: 600,
                color: theme.tableHeaderText, textTransform: 'uppercase',
                letterSpacing: '0.04em', background: theme.tableHeaderBg, whiteSpace: 'nowrap',
              }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={row[rowKey] ?? rowIndex} style={{
                borderBottom: `1px solid ${theme.cardBorder}`, transition: 'background 0.15s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = theme.tableRowHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = theme.tableBg; }}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} style={{ padding: cellPadding, color: theme.textSecondary, whiteSpace: 'nowrap' }}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{
                padding: '32px 20px', textAlign: 'center',
                color: theme.textLight, fontStyle: 'italic',
              }}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
