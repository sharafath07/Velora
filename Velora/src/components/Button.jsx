import React from 'react';
import { Video as LucideIcon } from 'lucide-react';

const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
}) => {
  const buttonClasses = [
    'btn',                // base button
    `btn-${variant}`,     // variant style (primary, secondary, etc.)
    `btn-${size}`,        // size style (sm, md, lg)
    className             // any extra custom classes
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {Icon && (
        <Icon
          size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18}
          className="btn-icon"
        />
      )}
      <span className="btn-text">{children}</span>
    </button>
  );
};

export default Button;
