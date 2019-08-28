import React from 'react';
import './Editor.scss';
import {ISize} from "../../../interfaces/ISize";
import {ImageData} from "../../../store/editor/types";
import {FileUtil} from "../../../utils/FileUtil";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {updateImageDataById} from "../../../store/editor/actionCreators";
import {ImageRepository} from "../../../logic/imageRepository/ImageRepository";
import {PrimaryEditorRenderEngine} from "../../../logic/render/PrimaryEditorRenderEngine";
import {LabelType} from "../../../data/LabelType";
import {DrawUtil} from "../../../utils/DrawUtil";
import {PopupWindowType} from "../../../data/PopupWindowType";
import {CanvasUtil} from "../../../utils/CanvasUtil";
import {CustomCursorStyle} from "../../../data/CustomCursorStyle";
import classNames from "classnames";
import {ImageLoadManager} from "../../../logic/imageRepository/ImageLoadManager";
import {EventType} from "../../../data/EventType";
import {EditorData} from "../../../data/EditorData";
import {ContextManager} from "../../../logic/context/ContextManager";
import {Context} from "../../../data/Context";
import {EditorModel} from "../../../model/EditorModel";
import {EditorActions} from "../../../logic/actions/EditorActions";

interface IProps {
    size: ISize;
    imageData: ImageData;
    activeLabelType: LabelType;
    updateImageDataById: (id: string, newImageData: ImageData) => any;
    activePopupType: PopupWindowType;
    activeLabelId: string;
    customCursorStyle: CustomCursorStyle;
}

interface IState {
    image: HTMLImageElement;
}

class Editor extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = { image: null }
    }

    // =================================================================================================================
    // LIFE CYCLE
    // =================================================================================================================

    public componentDidMount(): void {
        window.addEventListener(EventType.MOUSE_MOVE, this.update);
        window.addEventListener(EventType.MOUSE_UP, this.update);
        EditorModel.canvas.addEventListener(EventType.MOUSE_DOWN, this.onMouseDown);

        const {imageData, size, activeLabelType} = this.props;

        ImageLoadManager.addAndRun(this.loadImage(imageData));

        EditorActions.resizeCanvas(size);
        EditorModel.primaryRenderingEngine = new PrimaryEditorRenderEngine(EditorModel.canvas);
        EditorActions.mountSupportRenderingEngine(activeLabelType);
        this.fullCanvasRender();
    }

    public componentWillUnmount(): void {
        window.removeEventListener(EventType.MOUSE_MOVE, this.update);
        window.removeEventListener(EventType.MOUSE_UP, this.update);
        EditorModel.canvas.removeEventListener(EventType.MOUSE_DOWN, this.onMouseDown);
    }

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
        if (prevProps.imageData.id !== this.props.imageData.id) {
            ImageLoadManager.addAndRun(this.loadImage(this.props.imageData));
        }
        if (prevProps.activeLabelType !== this.props.activeLabelType) {
            this.swapSupportRenderingEngine(this.props.activeLabelType)
        }


        EditorActions.resizeCanvas(this.props.size);
        EditorModel.imageRectOnCanvas = EditorActions.getImageRect(this.state.image);
        EditorModel.imageScale = EditorActions.getImageScale(this.state.image);
        this.fullCanvasRender();
    }

    // =================================================================================================================
    // EVENT HANDLERS
    // =================================================================================================================

    private update = (event: MouseEvent) => {
        const editorData: EditorData = EditorActions.buildEditorData(event);
        EditorModel.mousePositionOnCanvas = CanvasUtil.getMousePositionOnCanvasFromEvent(event, EditorModel.canvas);
        EditorModel.primaryRenderingEngine.update(editorData);
        EditorModel.supportRenderingEngine && EditorModel.supportRenderingEngine.update(editorData);
        !this.props.activePopupType && EditorActions.updateMousePositionIndicator(event);
        this.fullCanvasRender();
    };

    private onMouseDown = (event: MouseEvent) => {
        this.register();
        this.update(event);
    };

    // =================================================================================================================
    // LOAD IMAGE
    // =================================================================================================================

    private loadImage = async (imageData: ImageData): Promise<any> => {
        if (imageData.loadStatus) {
            this.setState({image: ImageRepository.getById(imageData.id)})
        }
        else {
            if (!EditorModel.isLoading) {
                EditorModel.isLoading = true;
                const saveLoadedImagePartial = (image: HTMLImageElement) => this.saveLoadedImage(image, imageData);
                FileUtil.loadImage(imageData.fileData, saveLoadedImagePartial, this.handleLoadImageError);
            }
        }
    };

    private saveLoadedImage = (image: HTMLImageElement, imageData: ImageData) => {
        imageData.loadStatus = true;
        this.props.updateImageDataById(imageData.id, imageData);
        ImageRepository.store(imageData.id, image);
        this.setState({image});
        EditorModel.isLoading = false;
    };

    private handleLoadImageError = () => {};

    // =================================================================================================================
    // RENDERING
    // =================================================================================================================

    private fullCanvasRender() {
        DrawUtil.clearCanvas(EditorModel.canvas);
        EditorModel.primaryRenderingEngine.drawImage(this.state.image, EditorModel.imageRectOnCanvas);
        EditorModel.primaryRenderingEngine.render(EditorActions.buildEditorData());
        EditorModel.supportRenderingEngine && EditorModel.supportRenderingEngine.render(EditorActions.buildEditorData());

    }

    // =================================================================================================================
    // RENDERING ENGINES
    // =================================================================================================================

    private swapSupportRenderingEngine = (activeLabelType: LabelType) => {
        EditorActions.mountSupportRenderingEngine(activeLabelType);
    };

    // =================================================================================================================
    // CONTEXT
    // =================================================================================================================

    private register(): void {
        const triggerAction = (event: KeyboardEvent) => {
            const editorData: EditorData = EditorActions.buildEditorData(event);
            EditorModel.primaryRenderingEngine.update(editorData);
            EditorModel.supportRenderingEngine && EditorModel.supportRenderingEngine.update(editorData);
            this.fullCanvasRender();
        };

        ContextManager.switchCtx(Context.EDITOR, [
            {
                keyCombo: ["Enter"],
                action: triggerAction
            },
            {
                keyCombo: ["Escape"],
                action: triggerAction
            }
        ])
    }

    // =================================================================================================================
    // HELPER METHODS
    // =================================================================================================================

    private updateModelAndRender = (image: HTMLImageElement) => {

    };

    private getCursorStyle = () => {
        const cursorStyle = this.props.customCursorStyle;
        return classNames(
            "Cursor", {
                "move": cursorStyle === CustomCursorStyle.MOVE,
                "add": cursorStyle === CustomCursorStyle.ADD,
                "resize": cursorStyle === CustomCursorStyle.RESIZE,
                "close": cursorStyle === CustomCursorStyle.CLOSE,
                "cancel": cursorStyle === CustomCursorStyle.CANCEL,
            }
        );
    };

    private getIndicator = (): string => {
        switch (this.props.customCursorStyle) {
            case CustomCursorStyle.ADD:
                return "ico/plus.png";
            case CustomCursorStyle.RESIZE:
                return "ico/resize.png";
            case CustomCursorStyle.CLOSE:
                return "ico/close.png";
            case CustomCursorStyle.MOVE:
                return "ico/move.png";
            case CustomCursorStyle.CANCEL:
                return "ico/cancel.png";
            default:
                return null;
        }
    };

    public render() {
        return (
            <div className="Editor">
                <canvas
                    className="ImageCanvas"
                    ref={ref => EditorModel.canvas = ref}
                    draggable={false}
                    onContextMenu={(event: React.MouseEvent<HTMLCanvasElement>) => event.preventDefault()}
                />
                <div
                    className="MousePositionIndicator"
                    ref={ref => EditorModel.mousePositionIndicator = ref}
                    draggable={false}
                />
                <div
                    className={this.getCursorStyle()}
                    ref={ref => EditorModel.cursor = ref}
                    draggable={false}
                >
                    <img
                        draggable={false}
                        alt={"indicator"}
                        src={this.getIndicator()}
                    />
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = {
    updateImageDataById
};

const mapStateToProps = (state: AppState) => ({
    activeLabelType: state.editor.activeLabelType,
    activePopupType: state.general.activePopupType,
    activeLabelId: state.editor.activeLabelId,
    customCursorStyle: state.general.customCursorStyle
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Editor);