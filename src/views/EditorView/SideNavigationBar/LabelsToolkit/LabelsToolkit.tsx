import React from "react";
import './LabelsToolkit.scss';
import {ImageData} from "../../../../store/editor/types";
import {updateActiveLabelId, updateActiveLabelType, updateImageDataById} from "../../../../store/editor/actionCreators";
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import {LabelType} from "../../../../data/LabelType";
import {ProjectType} from "../../../../data/ProjectType";
import {ISize} from "../../../../interfaces/ISize";
import classNames from "classnames";
import * as _ from "lodash";
import {ILabelToolkit, LabelToolkitData} from "../../../../data/LabelToolkitData";
import {Settings} from "../../../../settings/Settings";
import RectLabelsList from "../RectLabelsList/RectLabelsList";
import PointLabelsList from "../PointLabelsList/PointLabelsList";
import {FeatureInProgress} from "../../FeatureInProgress/FeatureInProgress";

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
    activeLabelType: LabelType;
}

class LabelsToolkit extends React.Component<IProps, IState> {
    private labelsToolkitRef: HTMLDivElement;
    private readonly tabs: LabelType[];

    constructor(props) {
        super(props);

        this.tabs = props.projectType === ProjectType.IMAGE_RECOGNITION ?
            [
                LabelType.NAME
            ] :
            [
                LabelType.RECTANGLE,
                LabelType.POINT,
                LabelType.POLYGON
            ];

        const activeTab: LabelType = props.activeLabelType ? props.activeLabelType : this.tabs[0];

        this.state = {
            size: null,
            activeLabelType: activeTab,
        };
        props.updateActiveLabelType(activeTab);
    }

    public componentDidMount(): void {
        this.updateToolkitSize();
        window.addEventListener("resize", this.updateToolkitSize);
    }

    public componentWillUnmount(): void {
        window.removeEventListener("resize", this.updateToolkitSize);
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
        this.setState({activeLabelType: activeTab});
        this.props.updateActiveLabelType(activeTab);
        this.props.updateActiveLabelId(null);
    };

    private renderChildren = () => {
        const {activeLabelType, size} = this.state;
        const {activeImageIndex, imagesData} = this.props;
        return this.tabs.reduce((children, labelType: LabelType, index: number) => {
            const isActive: boolean = labelType === activeLabelType;
            const tabData: ILabelToolkit = _.find(LabelToolkitData, {labelType});
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
                    {labelType === LabelType.RECTANGLE && <RectLabelsList
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
                    {labelType === LabelType.POLYGON && <FeatureInProgress/>}
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
    activeImageIndex: state.editor.activeImageIndex,
    activeLabelType: state.editor.activeLabelType,
    imagesData: state.editor.imagesData,
    projectType: state.editor.projectType,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LabelsToolkit);