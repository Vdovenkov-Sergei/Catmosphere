import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'regular' | 'transparent';
    visible: 'visible' | 'invisible';
};

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = 'regular',
    visible = "visible"
}) => {
    const buttonClass = `${styles.button} ${styles[variant]} ${styles[visible]}`

    return (
        <button
            className={buttonClass}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;