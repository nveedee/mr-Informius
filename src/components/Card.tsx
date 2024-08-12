import styles from '../styles/card.module.css';


type CardProps = {
    onDoubleClick?: () => void;
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({children, className = '', onDoubleClick,onClick}) => {


        return (
            <div className={`${styles.card} ${className}`} onClick={onClick} onDoubleClick={onDoubleClick}>
                {children}
            </div>
        );

};

export default Card;
