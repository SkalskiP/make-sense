import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import './ToolPalette.scss';
import {AppState} from '../../../store';
import {LabelType} from '../../../data/enums/LabelType';
import {updateActiveLabelType} from '../../../store/labels/actionCreators';
import {updateImageDragModeStatus} from '../../../store/general/actionCreators';
import {GeneralSelector} from '../../../store/selectors/GeneralSelector';
import {ViewPointSettings} from '../../../settings/ViewPointSettings';
import {CANVAS_TOOLS, CanvasToolId, resolveTool} from '../../../logic/tools';

interface IProps {
    activeLabelType: LabelType;
    imageDragMode: boolean;
    updateActiveLabelTypeAction: (labelType: LabelType) => any;
    updateImageDragModeStatusAction: (imageDragMode: boolean) => any;
}

const GLYPHS: Record<CanvasToolId, string> = {
    select: '↖',
    box: '□',
    polygon: '⬡',
    line: '／',
    pan: '✋',
};

const ToolPalette: React.FC<IProps> = ({
    activeLabelType,
    imageDragMode,
    updateActiveLabelTypeAction,
    updateImageDragModeStatusAction,
}) => {
    const active = resolveTool(activeLabelType, imageDragMode);

    const choose = (id: CanvasToolId) => {
        if (id === 'pan') {
            if (imageDragMode || GeneralSelector.getZoom() !== ViewPointSettings.MIN_ZOOM) {
                updateImageDragModeStatusAction(!imageDragMode);
            }
            return;
        }
        updateImageDragModeStatusAction(false);
        const def = CANVAS_TOOLS.find(tool => tool.id === id);
        if (def && def.labelType !== null) updateActiveLabelTypeAction(def.labelType);
    };

    return (
        <div className="ToolPalette" role="toolbar" aria-label="Canvas tools">
            {CANVAS_TOOLS.map(tool => (
                <button
                    key={tool.id}
                    aria-label={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}`}
                    title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}`}
                    className={classNames('ToolButton', {active: active === tool.id})}
                    onClick={() => choose(tool.id)}
                >
                    {GLYPHS[tool.id]}
                </button>
            ))}
        </div>
    );
};

const mapDispatchToProps = {
    updateActiveLabelTypeAction: updateActiveLabelType,
    updateImageDragModeStatusAction: updateImageDragModeStatus,
};

const mapStateToProps = (state: AppState) => ({
    activeLabelType: state.labels.activeLabelType,
    imageDragMode: state.general.imageDragMode,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolPalette);
