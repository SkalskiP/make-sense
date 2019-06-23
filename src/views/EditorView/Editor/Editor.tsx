import React from 'react';
import './Editor.scss';
import {ISize} from "../../../interfaces/ISize";

interface IProps {
    size: ISize;
}

export default class Editor extends React.Component<IProps, {}> {
    private editorContainer:HTMLDivElement;

    public componentWillUpdate(nextProps: Readonly<IProps>, nextState: Readonly<{}>, nextContext: any): void {
        console.log(nextProps);
    }

    public render() {
        return (
            <div className="Editor" ref={ref => this.editorContainer = ref}>
                <canvas/>
            </div>
        );
    }
};