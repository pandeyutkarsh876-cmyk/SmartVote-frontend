import React from 'react';

const StatusBadge = ({ status }) => {
  const styles = {
    upcoming: { bg: '#FEF3C7', color: '#92400E' },
    active: { bg: '#D1FAE5', color: '#065F46' },
    ended: { bg: '#FEE2E2', color: '#991B1B' } // slightly red for ended
  };
  
  const currentStyle = styles[status] || { bg: '#F3F4F6', color: '#374151' };

  return (
    <span style={{
      backgroundColor: currentStyle.bg,
      color: currentStyle.color,
      padding: '4px 10px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      display: 'inline-block'
    }}>
      {status}
    </span>
  );
};

export default StatusBadge;
