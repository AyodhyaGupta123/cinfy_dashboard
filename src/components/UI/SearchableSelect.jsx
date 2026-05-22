import React, { useState } from 'react';
import { theme } from '../../theme/constants';
import { Input, FormGroup } from './FormElements';

const SearchableSelect = ({
  label,
  value,
  options = [],
  placeholder = 'Search',
  onSelect,
  disabled = false,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const selectedOption = options.find((option) => option.value === value);
  const selectedLabel = selectedOption?.label || '';
  const visibleValue = isOpen ? query : (query || selectedLabel);
  const normalizedQuery = query.trim().toLowerCase();

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(normalizedQuery)
  );
  const activeIndex = filteredOptions.length > 0
    ? Math.min(highlightedIndex, filteredOptions.length - 1)
    : -1;

  const handlePick = (option) => {
    setQuery(option.label);
    setIsOpen(false);
    setHighlightedIndex(0);
    onSelect?.(option.value);
  };

  const handleKeyDown = (event) => {
    if (disabled) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((current) =>
        Math.min(current + 1, Math.max(filteredOptions.length - 1, 0))
      );
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === 'Enter') {
      if (isOpen && activeIndex >= 0) {
        event.preventDefault();
        handlePick(filteredOptions[activeIndex]);
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
      return;
    }
  };

  return (
    <FormGroup label={label}>
      <div style={{ position: 'relative' }}>
        <Input
          value={visibleValue}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => {
            setQuery(selectedLabel);
            setIsOpen(true);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            window.setTimeout(() => setIsOpen(false), 120);
          }}
          style={{ width: '100%' }}
        />

        {isOpen && !disabled && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              zIndex: 20,
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: 8,
              boxShadow: theme.shadowMd,
              maxHeight: 220,
              overflowY: 'auto',
            }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value || option.label}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handlePick(option)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    textAlign: 'left',
                    border: 0,
                    background: index === activeIndex ? theme.primaryLight : 'transparent',
                    color: theme.textPrimary,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: index === activeIndex ? 600 : 400,
                  }}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div style={{ padding: '10px 14px', fontSize: 13, color: theme.textMuted }}>
                No match found
              </div>
            )}
          </div>
        )}
      </div>
    </FormGroup>
  );
};

export default SearchableSelect;