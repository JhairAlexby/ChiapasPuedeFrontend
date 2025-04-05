import { ReactNode } from 'react';
import './Card.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  title?: string;
}

export const Card = ({ children, className, onClick, title }: CardProps) => {
  return (
    <div className={`card ${className || ''}`} onClick={onClick}>
      {title && <h2 className="card-title">{title}</h2>}
      {children}
    </div>
  );
};