import React from 'react';
import './FeatureInProgress.scss';

export const FeatureInProgress: React.FC = () => {
    return(
        <div
            className="FeatureInProgress"
        >
            <img
                draggable={false}
                alt={"take_off"}
                src={"ico/take-off.png"}
            />
            <p className="extraBold">new feature <br/> coming soon...</p>
        </div>
    )
};