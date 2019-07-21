import React from 'react';
import {ISize} from "../../../../interfaces/ISize";
import './LabelInputField.scss';
import classNames from "classnames";
import {ImageButton} from "../../../Common/ImageButton/ImageButton";
import {IRect} from "../../../../interfaces/IRect";
import {IPoint} from "../../../../interfaces/IPoint";
import {RectUtil} from "../../../../utils/RectUtil";
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import {updateHighlightedLabelId} from "../../../../store/editor/actionCreators";

interface IProps {
    size: ISize;
    isActive: boolean;
    id: string;
    value: string;
    options: string[];
    onDelete: (id: string) => any;
    onSelectLabel: (labelRectId: string, labelNameIndex: number) => any;
    updateHighlightedLabelId: (highlightedLabelId: string) => any;
}

interface IState {
    animate: boolean;
    isOpen: boolean;
}

class LabelInputField extends React.Component<IProps, IState> {
    private dropdownOptionHeight: number = 30;
    private dropdownLabel: HTMLDivElement;
    private dropdown: HTMLDivElement;

    public constructor(props) {
        super(props);
        this.state = {
            animate: false,
            isOpen: false
        }
    }

    public componentDidMount(): void {
        requestAnimationFrame(() => {
            this.setState({ animate: true });
        });
    }

    private getClassName() {
        return classNames(
            "LabelInputField",
            {
                "loaded": this.state.animate
            }
        );
    }

    private openDropdown = () => {
        this.setState({isOpen: true});
        window.addEventListener("mousedown", this.closeDropdown);
    };

    private closeDropdown = (event: MouseEvent) => {
        const mousePosition: IPoint = {x: event.clientX, y: event.clientY};
        const clientRect = this.dropdown.getBoundingClientRect();
        const dropDownRect: IRect = {
            x: clientRect.left,
            y: clientRect.top,
            width: clientRect.width,
            height: clientRect.height
        };

        if (!RectUtil.isPointInside(dropDownRect, mousePosition)) {
            this.setState({isOpen: false});
            window.removeEventListener("mousedown", this.closeDropdown)
        }
    };

    private getDropdownStyle = ():React.CSSProperties => {
        const clientRect = this.dropdownLabel.getBoundingClientRect();
        return {
            width: clientRect.width,
            height: this.props.options.length * this.dropdownOptionHeight,
            top: clientRect.top + clientRect.height + 4,
            left: clientRect.left
        }
    };

    private getDropdownOptions = () => {
        const onClick = (index: number) => {
            this.setState({isOpen: false});
            window.removeEventListener("mousedown", this.closeDropdown)
            this.props.onSelectLabel(this.props.id, index);
        };

        return this.props.options.map((option: string, index: number) => {
            return <div
                className="DropdownOption"
                key={option}
                style={{height: this.dropdownOptionHeight}}
                onClick={() => onClick(index)}
            >
                {option}
            </div>
        })
    };

    private mouseEnterHandler = () => {
        this.props.updateHighlightedLabelId(this.props.id);
    };

    private mouseLeaveHandler =() => {
        this.props.updateHighlightedLabelId(null);
    };

    public render() {
        const {size, id, value, onDelete} = this.props;

        return(
            <div
                className={this.getClassName()}
                style={{
                    width: size.width,
                    height: size.height,
                }}
                key={id}
                onMouseEnter={this.mouseEnterHandler}
                onMouseLeave={this.mouseLeaveHandler}
            >
                <div
                    className="LabelInputFieldWrapper"
                    style={{
                        width: size.width,
                        height: size.height,
                    }}
                >
                    <div className="Marker"/>
                    <div className="Content">
                        <div className="ContentWrapper">
                            <div className="DropdownLabel"
                                 ref={ref => this.dropdownLabel = ref}
                                 onClick={this.openDropdown}
                            >
                                {value ? value : "Select label"}
                            </div>
                            {this.state.isOpen && <div
                                className="Dropdown"
                                style={this.getDropdownStyle()}
                                ref={ref => this.dropdown = ref}
                            >
                                {this.getDropdownOptions()}
                            </div>}
                        </div>
                        <div className="ContentWrapper">
                            <ImageButton
                                image={"ico/trash.png"}
                                imageAlt={"remove_rect"}
                                size={{width: 30, height: 30}}
                                onClick={() => onDelete(id)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = {
    updateHighlightedLabelId
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LabelInputField);