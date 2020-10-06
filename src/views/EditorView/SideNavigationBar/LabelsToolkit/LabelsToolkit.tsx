import React from "react";
import './LabelsToolkit.scss';
import {ImageData} from "../../../../store/labels/types";
import {updateActiveLabelId, updateActiveLabelType, updateImageDataById} from "../../../../store/labels/actionCreators";
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import {LabelType} from "../../../../data/enums/LabelType";
import {ProjectType} from "../../../../data/enums/ProjectType";
import {ISize} from "../../../../interfaces/ISize";
import classNames from "classnames";
import {find} from "lodash";
import {ILabelToolkit, LabelToolkitData} from "../../../../data/info/LabelToolkitData";
import {Settings} from "../../../../settings/Settings";
import RectLabelsList from "../RectLabelsList/RectLabelsList";
import PointLabelsList from "../PointLabelsList/PointLabelsList";
import PolygonLabelsList from "../PolygonLabelsList/PolygonLabelsList";
import {ContextManager} from "../../../../logic/context/ContextManager";
import {ContextType} from "../../../../data/enums/ContextType";
import {EventType} from "../../../../data/enums/EventType";
import LineLabelsList from "../LineLabelsList/LineLabelsList";
import TagLabelsList from "../TagLabelsList/TagLabelsList";

interface IProps {
    activeImageIndex:number,
    activeLabelType: LabelType;
    imagesData: ImageData[];
    projectType: ProjectType;
    updateImageDataById: (id: string, newImageData: ImageData) => any;
    updateActiveLabelType: (activeLabelType: LabelType) => any;
    updateActiveLabelId: (highlightedLabelId: string) => any;
}

interface IState {
    size: ISize;
}

class LabelsToolkit extends React.Component<IProps, IState> {
    private labelsToolkitRef: HTMLDivElement;
    private readonly tabs: LabelType[];

    constructor(props) {
        super(props);

        this.state = {
            size: null,
        };

        this.tabs = props.projectType === ProjectType.IMAGE_RECOGNITION ?
            [
                LabelType.IMAGE_RECOGNITION
            ] :
            [
                LabelType.RECT,
                LabelType.POINT,
                LabelType.LINE,
                LabelType.POLYGON
            ];

        const activeTab: LabelType = props.activeLabelType ? props.activeLabelType : this.tabs[0];
        props.updateActiveLabelType(activeTab);
    }

    public componentDidMount(): void {
        this.updateToolkitSize();
        window.addEventListener(EventType.RESIZE, this.updateToolkitSize);
    }

    public componentWillUnmount(): void {
        window.removeEventListener(EventType.RESIZE, this.updateToolkitSize);
    }

    private updateToolkitSize = () => {
        if (!this.labelsToolkitRef)
            return;

        const listBoundingBox = this.labelsToolkitRef.getBoundingClientRect();
        this.setState({
            size: {
                width: listBoundingBox.width,
                height: listBoundingBox.height
            }
        })
    };

    private headerClickHandler = (activeTab: LabelType) => {
        this.props.updateActiveLabelType(activeTab);
        this.props.updateActiveLabelId(null);
    };

    private renderChildren = () => {
        const {size} = this.state;
        const {activeImageIndex, imagesData, activeLabelType} = this.props;
        return this.tabs.reduce((children, labelType: LabelType, index: number) => {
            const isActive: boolean = labelType === activeLabelType;
            const tabData: ILabelToolkit = find(LabelToolkitData, {labelType});
            const activeTabContentHeight: number = size.height - this.tabs.length * Settings.TOOLKIT_TAB_HEIGHT_PX;
            const getClassName = (baseClass: string) => classNames(
                baseClass,
                {
                    "active": isActive,
                }
            );

            const header =
                <div
                    key={"Header_" + index}
                    className={getClassName("Header")}
                    onClick={() => this.headerClickHandler(labelType)}
                    style={{height: Settings.TOOLKIT_TAB_HEIGHT_PX}}
                >
                    <div className="Marker"/>
                    <div className="HeaderGroupWrapper">
                        <img
                            draggable={false}
                            className="Ico"
                            src={tabData.imageSrc}
                            alt={tabData.imageAlt}
                        />
                        {tabData.headerText}
                    </div>
                    <div className="HeaderGroupWrapper">
                        <img
                            draggable={false}
                            className="Arrow"
                            src={"ico/down.png"}
                            alt={"down_arrow"}
                        />
                    </div>
                </div>;

            const content =
                <div
                    key={"Content_" + index}
                    className={getClassName("Content")}
                    style={{height: isActive ? activeTabContentHeight : 0}}
                >
                    {labelType === LabelType.RECT && <RectLabelsList
                        size={{
                            width: size.width - 20,
                            height: activeTabContentHeight - 20
                        }}
                        imageData={imagesData[activeImageIndex]}
                    />}
                    {labelType === LabelType.POINT && <PointLabelsList
                        size={{
                            width: size.width - 20,
                            height: activeTabContentHeight - 20
                        }}
                        imageData={imagesData[activeImageIndex]}
                    />}
                    {labelType === LabelType.LINE && <LineLabelsList
                        size={{
                            width: size.width - 20,
                            height: activeTabContentHeight - 20
                        }}
                        imageData={imagesData[activeImageIndex]}
                    />}
                    {labelType === LabelType.POLYGON && <PolygonLabelsList
                        size={{
                            width: size.width - 20,
                            height: activeTabContentHeight - 20
                        }}
                        imageData={imagesData[activeImageIndex]}
                    />}
                    {labelType === LabelType.IMAGE_RECOGNITION && <TagLabelsList
                        size={{
                            width: size.width - 20,
                            height: activeTabContentHeight - 20
                        }}
                        imageData={imagesData[activeImageIndex]}
                    />}
                </div>;

            children.push([header, content]);
            return children;
        }, [])
    };

    public render() {
        return(
            <div
                className="LabelsToolkit"
                ref={ref => this.labelsToolkitRef = ref}
                onClick={() => ContextManager.switchCtx(ContextType.RIGHT_NAVBAR)}
            >
                {this.state.size && this.renderChildren()}
            </div>
        )
    }
}

const mapDispatchToProps = {
    updateImageDataById,
    updateActiveLabelType,
    updateActiveLabelId
};

const mapStateToProps = (state: AppState) => ({
    activeImageIndex: state.labels.activeImageIndex,
    activeLabelType: state.labels.activeLabelType,
    imagesData: state.labels.imagesData,
    projectType: state.general.projectData.type,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LabelsToolkit);