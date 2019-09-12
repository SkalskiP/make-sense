import React from "react";
import {ImageButtonDropDownData} from "../../../../data/ImageButtonDropDownData";
import {ImageButton} from "../../../Common/ImageButton/ImageButton";
import './ImageButtonDropDown.scss';
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import {updatePreventCustomCursorStatus} from "../../../../store/general/actionCreators";
import classNames from "classnames";
import {ContextType} from "../../../../data/enums/ContextType";

interface IProps {
    coverData: ImageButtonDropDownData;
    contentData?: ImageButtonDropDownData[];
    updatePreventCustomCursorStatus: (preventCustomCursor: boolean) => any;
    activeContext: ContextType;
}

interface IState {
    isOpened: boolean;
}

class ImageButtonDropDown extends React.Component<IProps, IState> {
    private coverButton;
    private contentWrapper: HTMLDivElement;

    constructor(props) {
        super(props);

        this.state = {
            isOpened: false,
        }
    }
    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
        if (!this.state.isOpened) return null;

        const coverClientRect: ClientRect | DOMRect = this.coverButton.getBoundingClientRect();
        this.contentWrapper.style.left = (coverClientRect.left + coverClientRect.width + 10) + "px";
    }

    private onCoverClickHandler = () => {
        this.setState({isOpened: !this.state.isOpened})
    };

    private onContentMouseEnter = () => {
        this.props.updatePreventCustomCursorStatus(true);
    };

    private onContentMouseLeave = () => {
        this.props.updatePreventCustomCursorStatus(false);
    };

    private getClassName = () => {
        return classNames(
            "ImageButtonDropDownContent",
            {
                "with-context": this.props.activeContext === ContextType.EDITOR
            }
        );
    };

    private getContent = () => {
        if (!this.state.isOpened) return null;

        const coverClientRect: ClientRect | DOMRect = this.coverButton.getBoundingClientRect();
        const style: React.CSSProperties = {
            top: coverClientRect.top,
            left: coverClientRect.left + coverClientRect.width + 10,
            height: coverClientRect.height
        };

        return <div
            className={this.getClassName()}
            ref={ref => this.contentWrapper = ref}
            style={style}
            onMouseEnter={this.onContentMouseEnter}
            onMouseLeave={this.onContentMouseLeave}
        >
            {this.props.contentData.map((data: ImageButtonDropDownData, index: number) => {
                return <ImageButton
                    buttonSize={{width: 36, height: 36}}
                    padding={16}
                    image={data.image}
                    imageAlt={data.imageAlt}
                    onClick={data.onClick}
                    key={index}
                />
            })}
        </div>
    };

    render() {
        return <>
            <ImageButton
                buttonSize={{width: 40, height:40}}
                padding={20}
                image={this.props.coverData.image}
                imageAlt={this.props.coverData.imageAlt}
                ref={ref => this.coverButton = ref}
                onClick={this.onCoverClickHandler}
                isActive={this.state.isOpened}
            />
            {this.getContent()}
        </>
    }
}

const mapDispatchToProps = {
    updatePreventCustomCursorStatus
};

const mapStateToProps = (state: AppState) => ({
    activeContext: state.general.activeContext
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImageButtonDropDown);