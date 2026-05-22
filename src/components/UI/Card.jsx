import React from 'react';
import { theme } from '../../theme/constants';

const Card = ({ children, className = '', style = {}, ...props }) => {
  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: theme.radiusLg,
        padding: 24,
        transition: theme.transitionSlow,
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
