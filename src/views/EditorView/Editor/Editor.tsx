import React from 'react';
import './Editor.scss';
import {ISize} from "../../../interfaces/ISize";
import {ImageData} from "../../../store/editor/types";
import {FileUtil} from "../../../utils/FileUtil";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {updateImageDataById} from "../../../store/editor/actionCreators";
import {ImageRepository} from "../../../logic/imageRepository/ImageRepository";
import {LabelType} from "../../../data/enums/LabelType";
import {PopupWindowType} from "../../../data/enums/PopupWindowType";
import {CanvasUtil} from "../../../utils/CanvasUtil";
import {CustomCursorStyle} from "../../../data/enums/CustomCursorStyle";
import {ImageLoadManager} from "../../../logic/imageRepository/ImageLoadManager";
import {EventType} from "../../../data/enums/EventType";
import {EditorData} from "../../../data/EditorData";
import {EditorModel} from "../../../staticModels/EditorModel";
import {EditorActions} from "../../../logic/actions/EditorActions";
import {EditorUtil} from "../../../utils/EditorUtil";
import {ContextManager} from "../../../logic/context/ContextManager";
import {ContextType} from "../../../data/enums/ContextType";
import Scrollbars from 'react-custom-scrollbars';
import {ViewPortActions} from "../../../logic/actions/ViewPortActions";

interface IProps {
    size: ISize;
    imageData: ImageData;
    activeLabelType: LabelType;
    updateImageDataById: (id: string, newImageData: ImageData) => any;
    activePopupType: PopupWindowType;
    activeLabelId: string;
    customCursorStyle: CustomCursorStyle;
}

class Editor extends React.Component<IProps, {}> {

    // =================================================================================================================
    // LIFE CYCLE
    // =================================================================================================================

    public componentDidMount(): void {
        this.mountEventListeners();

        const {imageData, activeLabelType} = this.props;

        ContextManager.switchCtx(ContextType.EDITOR);
        EditorActions.mountRenderEngines(activeLabelType);
        ImageLoadManager.addAndRun(this.loadImage(imageData));
    }

    public componentWillUnmount(): void {
        this.unmountEventListeners();
    }

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<{}>, snapshot?: any): void {
        const {imageData, activeLabelType} = this.props;

        prevProps.imageData.id !== imageData.id && ImageLoadManager.addAndRun(this.loadImage(imageData));
        prevProps.activeLabelType !== activeLabelType && EditorActions.swapSupportRenderingEngine(activeLabelType);

        this.updateModelAndRender();
    }

    // =================================================================================================================
    // EVENT HANDLERS
    // =================================================================================================================

    private mountEventListeners() {
        window.addEventListener(EventType.MOUSE_MOVE, this.update);
        window.addEventListener(EventType.MOUSE_UP, this.update);
        EditorModel.canvas.addEventListener(EventType.MOUSE_DOWN, this.update);
    }

    private unmountEventListeners() {
        window.removeEventListener(EventType.MOUSE_MOVE, this.update);
        window.removeEventListener(EventType.MOUSE_UP, this.update);
        EditorModel.canvas.removeEventListener(EventType.MOUSE_DOWN, this.update);
    }

    // =================================================================================================================
    // LOAD IMAGE
    // =================================================================================================================

    private loadImage = async (imageData: ImageData): Promise<any> => {
        if (imageData.loadStatus) {
            EditorActions.setActiveImage(ImageRepository.getById(imageData.id));
            this.updateModelAndRender()
        }
        else {
            if (!EditorModel.isLoading) {
                EditorActions.setLoadingStatus(true);
                const saveLoadedImagePartial = (image: HTMLImageElement) => this.saveLoadedImage(image, imageData);
                FileUtil.loadImage(imageData.fileData, saveLoadedImagePartial, this.handleLoadImageError);
            }
        }
    };

    private saveLoadedImage = (image: HTMLImageElement, imageData: ImageData) => {
        imageData.loadStatus = true;
        this.props.updateImageDataById(imageData.id, imageData);
        ImageRepository.store(imageData.id, image);
        EditorActions.setActiveImage(image);
        EditorActions.setLoadingStatus(false);
        this.updateModelAndRender()
    };

    private handleLoadImageError = () => {};

    // =================================================================================================================
    // HELPER METHODS
    // =================================================================================================================

    private updateModelAndRender = () => {
        //todo: To be refactored
        EditorModel.viewPortSize = ViewPortActions.calculateViewPortSize();
        EditorModel.defaultRenderImageRect = ViewPortActions.calculateDefaultViewPortImageRect();

        ViewPortActions.resizeViewPortContent(this.props.size);
        EditorActions.calculateAllCharacteristics();
        EditorActions.fullRender();
    };

    private update = (event: MouseEvent) => {
        const editorData: EditorData = EditorActions.getEditorData(event);
        EditorModel.mousePositionOnCanvas = CanvasUtil.getMousePositionOnCanvasFromEvent(event, EditorModel.canvas);
        EditorModel.primaryRenderingEngine.update(editorData);
        EditorModel.supportRenderingEngine && EditorModel.supportRenderingEngine.update(editorData);
        !this.props.activePopupType && EditorActions.updateMousePositionIndicator(event);
        EditorActions.fullRender();
    };

    public render() {
        return (
            <div
                className="Editor"
                ref={ref => EditorModel.editor = ref}
                draggable={false}
            >
                <Scrollbars>
                    <div
                        className="ImageCanvasWrapper"
                    >
                        <canvas
                            className="ImageCanvas"
                            ref={ref => EditorModel.canvas = ref}
                            draggable={false}
                            onContextMenu={(event: React.MouseEvent<HTMLCanvasElement>) => event.preventDefault()}
                        />
                    </div>
                </Scrollbars>
                <div
                    className="MousePositionIndicator"
                    ref={ref => EditorModel.mousePositionIndicator = ref}
                    draggable={false}
                />
                <div
                    className={EditorUtil.getCursorStyle(this.props.customCursorStyle)}
                    ref={ref => EditorModel.cursor = ref}
                    draggable={false}
                >
                    <img
                        draggable={false}
                        alt={"indicator"}
                        src={EditorUtil.getIndicator(this.props.customCursorStyle)}
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