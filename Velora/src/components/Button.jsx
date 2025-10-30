import React from 'react';

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
    'btn',                 // base
    `btn-${variant}`,      // primary / outline / danger / etc.
    `btn-${size}`,         // sm / md / lg
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {Icon && (
        <Icon
          size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18}
          className="btn-icon"
        />
      )}
      <span className="btn-text">{children}</span>
    </button>
  );
};

export default Button;
