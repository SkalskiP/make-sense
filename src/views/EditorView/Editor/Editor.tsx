import React from 'react';
import './Editor.scss';
import {ISize} from "../../../interfaces/ISize";

interface IProps {
    size: ISize;
}

export default class Editor extends React.Component<IProps, {}> {
    private imageCanvas:HTMLCanvasElement;

    public componentDidMount(): void {
        this.resizeEditor(this.props.size);
    }

    public componentWillUpdate(nextProps: Readonly<IProps>, nextState: Readonly<{}>, nextContext: any): void {
        this.resizeEditor(nextProps.size);
    }

    private resizeEditor = (size: ISize) => {
        if (!!size && !!this.imageCanvas) {
            this.imageCanvas.width = size.width;
            this.imageCanvas.height = size.height;
        }
    };

    public render() {
        return (
            <div className="Editor">
                <canvas ref={ref => this.imageCanvas = ref}/>
            </div>
        );
    }
};