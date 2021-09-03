import React from 'react';
import './ColorSelectorView.scss'

interface IProps {
    color: string;
    onClick: () => any;
}

export const ColorSelectorView: React.FC<IProps> = ({color, onClick}) => {
    return <div
        className={'ColorSelectorView'}
        style={{
            backgroundColor: color
        }}
        onClick={onClick}
    >
        <img
            draggable={false}
            alt={'refresh'}
            src={'ico/refresh.png'}
        />
    </div>
}
