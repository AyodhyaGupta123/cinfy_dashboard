import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { theme } from '../../theme/constants';

const FileUpload = ({ accept, multiple = false, maxSizeMB = 10, onFiles, label = 'Drop files here or click to upload' }) => {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList).filter(f => f.size <= maxSizeMB * 1024 * 1024);
    setFiles(arr);
    onFiles?.(arr);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (i) => {
    const updated = files.filter((_, idx) => idx !== i);
    setFiles(updated);
    onFiles?.(updated);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragOver ? theme.primary : theme.cardBorder}`,
          borderRadius: 12, padding: '32px 20px', textAlign: 'center',
          cursor: 'pointer', transition: theme.transition,
          background: dragOver ? theme.primaryLight : '#fafafa',
        }}
      >
        <Upload style={{ width: 32, height: 32, color: dragOver ? theme.primary : theme.textLight, margin: '0 auto 12px' }} />
        <p style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 12, color: theme.textLight }}>Max {maxSizeMB}MB per file{accept ? ` · ${accept}` : ''}</p>
        <input
          ref={inputRef} type="file" accept={accept} multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>

      {files.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
          {files.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px', borderRadius: 8,
              border: `1px solid ${theme.cardBorder}`, background: theme.cardBg,
            }}>
              <File style={{ width: 16, height: 16, color: theme.primary, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: theme.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                <div style={{ fontSize: 11, color: theme.textLight }}>{formatSize(f.size)}</div>
              </div>
              <CheckCircle style={{ width: 14, height: 14, color: '#16a34a', flexShrink: 0 }} />
              <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} style={{
                padding: 2, border: 'none', background: 'transparent',
                color: theme.textLight, cursor: 'pointer',
              }}>
                <X style={{ width: 14, height: 14 }} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
