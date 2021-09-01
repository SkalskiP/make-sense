import {EditorData} from '../../data/EditorData';
import {MouseEventUtil} from '../../utils/MouseEventUtil';
import {EventType} from '../../data/enums/EventType';
import {LabelType} from '../../data/enums/LabelType';
import {GeneralSelector} from '../../store/selectors/GeneralSelector';
import {RenderEngineSettings} from '../../settings/RenderEngineSettings';
import {LabelName} from '../../store/labels/types';
import {LabelsSelector} from '../../store/selectors/LabelsSelector';

export abstract class BaseRenderEngine {
    protected readonly canvas: HTMLCanvasElement;
    public labelType: LabelType;

    protected constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    public update(data: EditorData): void {
        if (!!data.event) {
            switch (MouseEventUtil.getEventType(data.event)) {
                case EventType.MOUSE_MOVE:
                    this.mouseMoveHandler(data);
                    break;
                case EventType.MOUSE_UP:
                    this.mouseUpHandler(data);
                    break;
                case EventType.MOUSE_DOWN:
                    this.mouseDownHandler(data);
                    break;
                default:
                    break;
            }
        }
    }

    protected abstract mouseDownHandler(data: EditorData): void;
    protected abstract mouseMoveHandler(data: EditorData): void;
    protected abstract mouseUpHandler(data: EditorData): void;

    abstract render(data: EditorData): void;

    abstract isInProgress(): boolean;

    protected static resolveLabelLineColor(labelId: string, isActive: boolean): string {
        const perClassColor: boolean = GeneralSelector.getEnablePerClassColorationStatus();
        if (perClassColor) {
            const labelName: LabelName | null = LabelsSelector.getLabelNameById(labelId);
            return labelName ? labelName.color : RenderEngineSettings.DEFAULT_LINE_COLOR;
        } else {
            return isActive ? RenderEngineSettings.ACTIVE_LINE_COLOR : RenderEngineSettings.INACTIVE_LINE_COLOR;
        }
    }

    protected static resolveLabelAnchorColor(isActive: boolean): string {
        const perClassColor: boolean = GeneralSelector.getEnablePerClassColorationStatus();
        if (perClassColor) {
            return RenderEngineSettings.DEFAULT_ANCHOR_COLOR;
        } else {
            return isActive ? RenderEngineSettings.ACTIVE_ANCHOR_COLOR : RenderEngineSettings.INACTIVE_ANCHOR_COLOR;
        }
    }
}
