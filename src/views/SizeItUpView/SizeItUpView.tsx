import React from 'react';
import './SizeItUpView.scss';
import {Settings} from "../../settings/Settings";

export const SizeItUpView: React.FC = () => {
    return(<div className="SizeItUpView">
        <p className="extraBold">Ops... This window is to tight for me!</p>
        <img
            draggable={false}
            alt={"small_window"}
            src={"ico/small_window.png"}
        />
        <p className="extraBold">Please... make it at least {Settings.EDITOR_MIN_WIDTH} x {Settings.EDITOR_MIN_HEIGHT} px.</p>
    </div>)
};