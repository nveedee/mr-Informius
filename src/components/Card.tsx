import React from 'react';
import styles from '../styles/card.module.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

interface CardProps {
    onDoubleClick?: () => void
}

const Card: React.FC<CardProps> = ({children, className = '', onDoubleClick}) => {
    return (
        <div className={`${styles.card} ${className}`} onDoubleClick={onDoubleClick}>
            {children}
        </div>
    );
};

export default Card;
