import React from "react";
import {ToolBoxTabData} from "../../../../data/ToolBoxTabData";
import {ImageButton} from "../../../Common/ImageButton/ImageButton";
import './ToolBoxTab.scss';
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import {updatePreventCustomCursorStatus} from "../../../../store/general/actionCreators";

interface IProps {
    coverData: ToolBoxTabData;
    contentData?: ToolBoxTabData[];
    updatePreventCustomCursorStatus: (preventCustomCursor: boolean) => any;
}

interface IState {
    isOpened: boolean;
}

class ToolBoxTab extends React.Component<IProps, IState> {
    private coverButton;

    constructor(props) {
        super(props);

        this.state = {
            isOpened: false,
        }
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

    private getContent = () => {
        if (!this.state.isOpened) return null;

        const coverClientRect: ClientRect | DOMRect = this.coverButton.getBoundingClientRect();
        const style: React.CSSProperties = {
            top: coverClientRect.top,
            left: coverClientRect.left + coverClientRect.width + 10,
            height: coverClientRect.height
        };
        return <div
            className="ToolBoxTabContent"
            style={style}
            onMouseEnter={this.onContentMouseEnter}
            onMouseLeave={this.onContentMouseLeave}
        >
            {this.props.contentData.map((data: ToolBoxTabData, index: number) => {
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
            />
            {this.getContent()}
        </>
    }
}

const mapDispatchToProps = {
    updatePreventCustomCursorStatus
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolBoxTab);