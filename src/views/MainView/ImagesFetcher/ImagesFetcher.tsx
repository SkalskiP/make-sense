import React, {PropsWithChildren, useState} from 'react';
import './ImagesFetcher.scss';
import {TextButton} from '../../Common/TextButton/TextButton';
import {ImageData} from '../../../store/labels/types';
import {connect} from 'react-redux';
import {
    addImageData,
    updateActiveImageIndex
} from '../../../store/labels/actionCreators';
import {AppState} from '../../../store';
import {ProjectType} from '../../../data/enums/ProjectType';
import {PopupWindowType} from '../../../data/enums/PopupWindowType';
import {
    updateActivePopupType,
    updateProjectData
} from '../../../store/general/actionCreators';
import {ProjectData} from '../../../store/general/types';
import {ImageDataUtil} from '../../../utils/ImageDataUtil';
import {sortBy} from 'lodash';
import {APIImageData} from '../../../services/types';
import {Button, FormControl, Input, InputLabel} from '@material-ui/core';
import {APIService} from '../../../services/API';
import {ClipLoader} from 'react-spinners';
import {CSSHelper} from '../../../logic/helpers/CSSHelper';
import {Package, ChevronRightBlack, ChevronRightWhite} from "../../../assets/icons"
interface IProps {
    updateActiveImageIndexAction: (activeImageIndex: number) => any;
    addImageDataAction: (imageData: ImageData[]) => any;
    updateProjectDataAction: (projectData: ProjectData) => any;
    updateActivePopupTypeAction: (activePopupType: PopupWindowType) => any;
    projectData: ProjectData;
    goBack: () => any
}

const ImagesFetcher: React.FC<IProps> = (props: PropsWithChildren<IProps>) => {
    const [acceptedImages, setAcceptedImages] = useState<APIImageData[]>([]);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const { goBack } = props 

    const loadImages = async () => {
        try {
            setIsLoading(true);
            const {data} = await APIService.fetchImages({offset, limit});
            // console.log('data.data = ', data.data);
            setAcceptedImages(data.data.image_list);
        } catch (error) {
            console.error('Failed to loadImages: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    const startEditor = (projectType: ProjectType) => {
        if (acceptedImages.length > 0) {
            const files = acceptedImages;
            props.updateProjectDataAction({
                ...props.projectData,
                type: projectType
            });
            props.updateActiveImageIndexAction(0);
            props.addImageDataAction(
                files.map((file: APIImageData) =>
                    ImageDataUtil.createImageDataFromAPIData(file)
                )
            );
        }
    };

    const getImageFetcherContent = () => {
        if (acceptedImages.length === 0)
            return (
                <>
                    <FormControl>
                        <label className='LoginPopupContent__label'>Offset</label>
                     
                        <Input
                            value={offset}
                            id="offset"
                            type="number"
                            onChange={(e) =>
                                setOffset(parseInt(e.target.value))
                            }
                        />
                    </FormControl>
                    <FormControl>
                        <label className='LoginPopupContent__label'>Limit</label>
                        <Input
                            value={limit}
                            id="limit"
                            type="number"
                            onChange={(e) => setLimit(parseInt(e.target.value))}
                        />
                    </FormControl>
                    <Package/>
                    {isLoading ? (
                        <ClipLoader
                            size={40}
                            color={CSSHelper.getLeadingColor()}
                            loading={true}
                        />
                    ) : null}
                    {/* <Button onClick={loadImages}>
                        Load Images from Server
                    </Button> */}
                </>
            );
        else if (acceptedImages.length === 1)
            return (
                <>
                     <Package/>
                    <p className="extraBold">1 image loaded</p>
                </>
            );
        else
            return (
                <>
                  <Package/>
                    <p key={2} className="extraBold">
                        {acceptedImages.length} images loaded
                    </p>
                </>
            );
    };

    const startEditorWithObjectDetection = () =>
        startEditor(ProjectType.OBJECT_DETECTION);
    const startEditorWithImageRecognition = () =>
        startEditor(ProjectType.IMAGE_RECOGNITION);

    return (
        <div className="ImagesDropZone">
            <div className="DropZone">{getImageFetcherContent()}</div>
            <div className="DropZoneButtons">
                {
                   acceptedImages.length ? (
                        <TextButton
                                label={'Object Detection'}
                                externalClassName="DropZoneButtons__active DropZoneButtons__active__second"
                                isDisabled={!acceptedImages.length}
                                onClick={startEditorWithObjectDetection}
                                icon={<ChevronRightWhite className='ms-auto'/>}
                            />) : (
                                <TextButton
                                    externalClassName="DropZoneButtons__active"
                                    label={'Load Images from Server'}
                                    onClick={loadImages}
                                    icon={<ChevronRightWhite className='ms-auto'/>}
                        />
                    )
                }
                <TextButton
                    label={'Go back'}
                    externalClassName="DropZoneButtons__goback"
                    onClick={goBack}
                    icon={<ChevronRightBlack className='ms-auto'/>}
                />
            </div>
        </div>
    );
};

const mapDispatchToProps = {
    updateActiveImageIndexAction: updateActiveImageIndex,
    addImageDataAction: addImageData,
    updateProjectDataAction: updateProjectData,
    updateActivePopupTypeAction: updateActivePopupType
};

const mapStateToProps = (state: AppState) => ({
    projectData: state.general.projectData
});

export default connect(mapStateToProps, mapDispatchToProps)(ImagesFetcher);
