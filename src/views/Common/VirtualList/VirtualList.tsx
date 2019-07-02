import React from 'react';
import {ISize} from "../../../interfaces/ISize";
import {IRect} from "../../../interfaces/IRect";
import Scrollbars from 'react-custom-scrollbars';
import {VirtualListUtil} from "../../../utils/VirtualListUtil";

interface IProps {
    size: ISize;
    childCount: number;
    childSize: ISize;
    childRender?: (index: number, isScrolling: boolean, style: React.CSSProperties) => any;
    onScroll?: (scrollPosition: number) => any;
    renderExtensionHeight?: number;
}

interface IState {
    viewportRect: IRect;
}

export class VirtualList extends React.Component<IProps, IState> {
    private gridSize: ISize;
    private contentSize: ISize;

    constructor(props) {
        super(props);
        this.state = null;
    }

    public componentDidMount(): void {
        const {size, childSize, childCount} = this.props;
        this.gridSize = VirtualListUtil.calculateGridSize(size, childSize, childCount);
        this.contentSize = VirtualListUtil.calculateContentSize(size, childSize, this.gridSize);
        this.setState({
            viewportRect: {
                x: 0,
                y: 0,
                width: this.props.size.width,
                height: this.props.size.height
            }
        });
    }

    private getVirtualListStyle = ():React.CSSProperties => {
        return {
            position: "relative",
            width: this.props.size.width,
            height: this.props.size.height,
        }
    };

    private getVirtualListContentStyle = ():React.CSSProperties => {
        return {
            width: this.contentSize.width,
            height: this.contentSize.height,
            backgroundColor: "red"
        }
    };

    private onScroll = (values) => {
        this.setState({
            viewportRect: {
                x: values.scrollLeft,
                y: values.scrollTop,
                width: this.props.size.width,
                height: this.props.size.height
            }
        });
    };

    public render() {
        const displayContent = !!this.props.size && !!this.props.childSize && !!this.gridSize;

        return(
            <div
                className="VirtualList"
                style={this.getVirtualListStyle()}
            >
                <Scrollbars
                    onScrollFrame={this.onScroll}
                >
                    {displayContent && <div
                        className="VirtualListContent"
                        style={this.getVirtualListContentStyle()}
                    />}
                </Scrollbars>
            </div>
        )
    }
}