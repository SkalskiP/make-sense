import React from 'react';
import {ISize} from "../../../../interfaces/ISize";
import './LabelInputField.scss';
import classNames from "classnames";
import {ImageButton} from "../../../Common/ImageButton/ImageButton";
import {IRect} from "../../../../interfaces/IRect";
import {IPoint} from "../../../../interfaces/IPoint";
import {RectUtil} from "../../../../utils/RectUtil";

interface IProps {
    size: ISize;
    isActive: boolean;
    id: string;
    value?: string;
    options?: string[];
}

interface IState {
    animate: boolean;
    isOpen: boolean;
}

export class LabelInputField extends React.Component<IProps, IState> {
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
            height: 150,
            top: clientRect.top + clientRect.height + 4,
            left: clientRect.left
        }
    };

    public render() {
        return(
            <div
                className={this.getClassName()}
                style={{
                    width: this.props.size.width,
                    height: this.props.size.height,
                }}
                key={this.props.id}
            >
                <div
                    className="LabelInputFieldWrapper"
                    style={{
                        width: this.props.size.width,
                        height: this.props.size.height,
                    }}
                >
                    <div className="Marker"/>
                    <div className="Content">
                        <div className="ContentWrapper">
                            <div className="DropdownLabel"
                                 ref={ref => this.dropdownLabel = ref}
                                 onClick={this.openDropdown}
                            >
                                {this.props.value ? this.props.value : "Select label"}
                                {this.state.isOpen && <div
                                    className="Dropdown"
                                    style={this.getDropdownStyle()}
                                    ref={ref => this.dropdown = ref}
                                />}
                            </div>
                        </div>
                        <div className="ContentWrapper">
                            <ImageButton
                                image={"ico/move.png"}
                                imageAlt={"move_rect"}
                                size={{width: 30, height: 30}}
                            />
                            <ImageButton
                                image={"ico/remove.png"}
                                imageAlt={"remove_rect"}
                                size={{width: 30, height: 30}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}