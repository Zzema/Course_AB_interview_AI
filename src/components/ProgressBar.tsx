import React from 'react';

interface ProgressBarProps {
    value: number;
    color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, color = 'var(--primary-color)' }) => {
    return (
        <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            overflow: 'hidden',
        }}>
            <div className="progress-bar-inner" style={{
                width: `${value}%`,
                height: '100%',
                backgroundColor: color,
                transition: 'width 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
            }} />
        </div>
    );
};

export default ProgressBar;
