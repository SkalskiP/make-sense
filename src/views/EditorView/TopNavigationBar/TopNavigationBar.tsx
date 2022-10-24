import React, {useState} from 'react';
import './TopNavigationBar.scss';
import StateBar from '../StateBar/StateBar';
import {PopupWindowType} from '../../../data/enums/PopupWindowType';
import {AppState} from '../../../store';
import {connect, RootStateOrAny, useSelector} from 'react-redux';
import {
    updateActivePopupType,
    updateProjectData
} from '../../../store/general/actionCreators';
import {ImageDataUtil} from '../../../utils/ImageDataUtil';
import {ImageButton} from '../../Common/ImageButton/ImageButton';
import {ProjectData} from '../../../store/general/types';
import DropDownMenu from './DropDownMenu/DropDownMenu';
import {LabelsSelector} from '../../../store/selectors/LabelsSelector';
import {RectLabelsExporter} from '../../../logic/export/RectLabelsExporter';
import {ImageData} from '../../../store/labels/types';
import {APIService} from '../../../services/API';
import {ClipLoader} from 'react-spinners';
import {CSSHelper} from '../../../logic/helpers/CSSHelper';
import {JSONUploadStatus} from '../../../data/enums/JSONUploadStatus';
import {updateImageDataById} from '../../../store/labels/actionCreators';
import PerformanceProgress from 'views/Common/PerformanceProgress/PerformanceProgress';
import {updateTaskStatus} from 'store/performance/actionCreators';
import {TaskStatus} from 'store/performance/types';

interface IProps {
    updateActivePopupTypeAction: (activePopupType: PopupWindowType) => any;
    updateProjectDataAction: (projectData: ProjectData) => any;
    updateImageDataByIdAction: (id: string, newImageData: ImageData) => any;
    updateTaskStatusAction: (taskStatus: TaskStatus) => any;
    projectData: ProjectData;
}

const TopNavigationBar: React.FC<IProps> = (props) => {
    const { updateImageDataByIdAction } = props
    const {authData} = useSelector((state: RootStateOrAny) => state.auth);
    const [isLoading, setIsLoading] = useState(false);
    const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        event.target.setSelectionRange(0, event.target.value.length);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase().replace(' ', '-');

        props.updateProjectDataAction({
            ...props.projectData,
            name: value
        });
    };

    const closePopup = () =>
        props.updateActivePopupTypeAction(PopupWindowType.EXIT_PROJECT);

    const updateImageFormApi = async (imageData, json) =>{
        const { data: dataRes } =   await APIService.updateImage({
            imageId: imageData.id,
            json
        });
        let newImageData = imageData
        if(dataRes['data'] && dataRes['code'] === 200){
         const imageMapData = ImageDataUtil.createImageDataFromAPIData(dataRes['data'])
         newImageData = {...imageData, ...imageMapData}
        }
        return newImageData
    }    

    const uploadJson = async () => {
      
        const itemsNeedToUpload = LabelsSelector.getImagesData().filter(
            (imageData) =>
                imageData.uploadStatus === JSONUploadStatus.NEED_UPLOAD
        );
            
        try {
            setIsLoading(true);
            for await (const imageData of itemsNeedToUpload) {
                try {
                  
                    updateImageDataByIdAction(imageData.id, {
                        ...imageData,
                        uploadStatus: JSONUploadStatus.UPLOADING
                    });
                    const content =
                        RectLabelsExporter.wrapRectLabelsIntoJSON(imageData);
                    const json = content ? JSON.stringify(content) : null;
                    const newImageData = await updateImageFormApi(imageData, json)
                    
                    updateImageDataByIdAction(newImageData.id, {                     
                        ...newImageData,
                        uploadStatus: JSONUploadStatus.UPLOADED
                    });
                    const {data} = await APIService.getTaskStatus();
                   
                    setTimeout(
                        () => props.updateTaskStatusAction(data.data),
                        1000
                    );
                } catch (error) {
                    updateImageDataByIdAction(imageData.id, {
                        ...imageData,
                        uploadStatus: JSONUploadStatus.FAILED
                    });
                }
            }
        } catch (error) {
            console.error('Failed to updateImage: ', error);
            alert('Failed to upload');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="TopNavigationBar">
            <StateBar />
            <div className="TopNavigationBarWrapper">
                <div className="NavigationBarGroupWrapper">
                    <div className="Header" onClick={closePopup}>
                        <img
                            draggable={false}
                            alt={'showniq icon'}
                            src={'/showniq-icon.png'}
                        />
                    </div>
                </div>
                <div className="NavigationBarGroupWrapper">
                    <DropDownMenu />
                </div>
                <div className="NavigationBarGroupWrapper middle">
                    {/* <div className="ProjectName">{authData.email}</div> */}
                    <PerformanceProgress />
                </div>
                <div className="NavigationBarGroupWrapper">
                    {isLoading ? (
                        <ClipLoader
                            size={30}
                            color={CSSHelper.getLeadingColor()}
                            loading={true}
                        />
                    ) : (
                        <ImageButton
                            image={'ico/cloud-upload.png'}
                            imageAlt={'cloud-upload.png'}
                            buttonSize={{width: 50, height: 50}}
                            onClick={uploadJson}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const mapDispatchToProps = {
    updateActivePopupTypeAction: updateActivePopupType,
    updateProjectDataAction: updateProjectData,
    updateImageDataByIdAction: updateImageDataById,
    updateTaskStatusAction: updateTaskStatus
};

const mapStateToProps = (state: AppState) => ({
    projectData: state.general.projectData
});

export default connect(mapStateToProps, mapDispatchToProps)(TopNavigationBar);
