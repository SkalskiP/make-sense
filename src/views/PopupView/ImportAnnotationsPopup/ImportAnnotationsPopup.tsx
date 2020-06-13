import React from 'react'
import './ImportAnnotationsPopup.scss'
import { AppState } from "../../../store";
import { connect } from "react-redux";
import { GenericYesNoPopup } from "../GenericYesNoPopup/GenericYesNoPopup";
import { useDropzone } from "react-dropzone";
import { FileUtil } from "../../../utils/FileUtil";
import { AcceptedFileType } from "../../../data/enums/AcceptedFileType";
import { PopupActions } from "../../../logic/actions/PopupActions";
import { LabelsSelector } from "../../../store/selectors/LabelsSelector";
import { LabelStatus } from "../../../data/enums/LabelStatus";
// import {ImageRepository} from "../../../logic/imageRepository/ImageRepository";

interface IProps {
}

const ImportAnnotationsPopup: React.FC<IProps> = () => {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: AcceptedFileType.CSV,
        multiple: false
    });

    const onAccept = () => {
        if (acceptedFiles.length > 0) {
            // Parse the CSV file
            FileUtil.readAnnotationsCSV(acceptedFiles[0], onLoadSuccess, onLoadFailure)

            PopupActions.close();
        }
    };

    const onLoadSuccess = (annotations: Object) => {
        console.log("File read");

        // Go through every image loaded and add the annotations to them
        let images = LabelsSelector.getImagesData();

        let labels = {};
        LabelsSelector.getLabelNames().forEach(label => {
            labels[label.name] = label.id
        });

        images.forEach(image => {
            if (annotations[image.fileData.name] !== undefined) {
                // var image_size: HTMLImageElement = ImageRepository.getById(image.id);

                // let image_width = 0;
                // let image_height = 0;

                // try {
                //     image_width = image_size.width;
                //     image_height = image_size.height;
                // } catch(e){}

                let x_multi = 1;
                let y_multi = 1;

                annotations[image.fileData.name].forEach(rect => {
                    if (labels[rect[2]] === undefined) {
                        const new_label_id = '_' + Math.random().toString(36).substr(2, 9);
                        LabelsSelector.getLabelNames().push({
                            name: rect[2],
                            id: new_label_id
                        })
                        labels[rect[2]] = new_label_id
                    }

                    // if (image_width !== rect[0]) {
                    //     x_multi = rect[0]/image_width;
                    //     // console.log('x_multi')
                    //     // console.log(rect[0])
                    //     // console.log(image_width)
                    //     // console.log('___x_multi___')
                    // }
                    // if (image_height !== rect[1]) {
                    //     y_multi = rect[1]/image_height;
                    //     // console.log('y_multi')
                    //     // console.log(rect[0])
                    //     // console.log(image_height)
                    //     // console.log('___y_multi___')
                    // }

                    image.labelRects.push(
                        {
                            id: '_' + Math.random().toString(36).substr(2, 9),
                            labelId: labels[rect[2]],
                            rect: {
                                x: rect[3] * x_multi,
                                y: rect[4] * y_multi,
                                width: rect[5] * x_multi,
                                height: rect[6] * y_multi
                            },

                            isCreatedByAI: false,
                            status: LabelStatus.ACCEPTED,
                            suggestedLabel: null
                        }
                    )
                });
            }
        });
    };
    const onLoadFailure = () => {
        console.log("Failed to read file");
    };

    const onReject = () => {
        PopupActions.close();
    };

    const getDropZoneContent = () => {
        if (acceptedFiles.length === 0)
            return <>
                <input {...getInputProps()} />
                <img
                    draggable={false}
                    alt={"upload"}
                    src={"img/box-opened.png"}
                />
                <p className="extraBold">Drag and Drop the CSV file</p>
                <p>or</p>
                <p className="extraBold">Click here to open the file browser</p>
            </>;
        else
            return <>
                <img
                    draggable={false}
                    alt={"uploaded"}
                    src={"img/box-closed.png"}
                />
                <p className="extraBold">{acceptedFiles[0].name} - CSV file selected</p>
            </>;
    };

    const renderContent = () => {
        return (<div className="ImportAnnotationsPopupContent">
            <div {...getRootProps({ className: 'DropZone' })}>
                {getDropZoneContent()}
            </div>
        </div>);
    };

    return (
        <GenericYesNoPopup
            title={"Load annotations file (CSV format)"}
            renderContent={renderContent}
            acceptLabel={"Load"}
            disableAcceptButton={acceptedFiles.length !== 1}
            onAccept={onAccept}
            rejectLabel={"Cancel"}
            onReject={onReject}
        />
    );
};


const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
)(ImportAnnotationsPopup);
