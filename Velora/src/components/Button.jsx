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
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={buttonClasses}
        >
            {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} className="btn-icon" />}
            {children}
        </button>
    );
};

export default Button;
