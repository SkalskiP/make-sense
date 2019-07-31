import React from 'react';
import './FeatureInProgress.scss';

export const FeatureInProgress: React.FC = () => {
    return(
        <div
            className="FeatureInProgress"
        >
            <p className="extraBold">Coming soon...</p>
            <img
                draggable={false}
                alt={"fingers_crossed"}
                src={"img/fingers_crossed.png"}
            />
            <p>Keep your fingers crossed!</p>
        </div>
    )
};