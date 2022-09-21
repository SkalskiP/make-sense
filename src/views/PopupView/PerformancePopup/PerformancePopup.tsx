import {PopupWindowType} from 'data/enums/PopupWindowType';
import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {APIService} from 'services/API';
import {AppState} from 'store';
import {updateActivePopupType} from 'store/general/actionCreators';
import {updateTasks} from 'store/performance/actionCreators';
import {Task} from 'store/performance/types';
import {GenericYesNoPopupDraggable} from '../GenericYesNoPopupDraggable/GenericYesNoPopupDraggable';
import './PerformancePopup.scss';

interface IProps {
    tasks: Task[];
    updateTasksDataAction: (data: Task[]) => any;
    updateActivePopupTypeAction: (popupType: PopupWindowType) => any;
}

const PerformancePopup: React.FC<IProps> = ({
    tasks,
    updateTasksDataAction,
    updateActivePopupTypeAction
}) => {
    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const {data} = await APIService.getTasks();
            updateTasksDataAction(data.tasks);
        } catch (error) {}
    };

    const renderContent = () => (
        <div className="PerformancePopupContent">
            <div style={{height: 600, overflow: 'auto'}}>
                <table>
                    <thead>
                        <tr>
                            <th rowSpan={2}>Display Name</th>
                            <th colSpan={3}>Images</th>
                            <th colSpan={3}>Labels</th>
                        </tr>
                        <tr>
                            <th>8H</th>
                            <th>1H</th>
                            <th>Min</th>
                            <th>8H</th>
                            <th>1H</th>
                            <th>Min</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task, index) => (
                            <tr>
                                <td>{task.name}</td>
                                <td>{task.imagesTPD}</td>
                                <td>{task.imagesTPH}</td>
                                <td>{task.averageTimePerImage}</td>
                                <td>{task.labeledTPD}</td>
                                <td>{task.labeledTPH}</td>
                                <td>{task.averageTimePerLabeled}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    console.log('tasks = ', tasks);
    return (
        <GenericYesNoPopupDraggable
            title={'Tasks'}
            renderContent={renderContent}
            acceptLabel="Reload"
            onAccept={() => loadTasks()}
            rejectLabel="Close"
            onReject={() => updateActivePopupTypeAction(null)}
        />
    );
};

const mapDispatchToProps = {
    updateActivePopupTypeAction: updateActivePopupType,
    updateTasksDataAction: updateTasks
};

const mapStateToProps = (state: AppState) => ({
    tasks: state.performance.tasks
});

export default connect(mapStateToProps, mapDispatchToProps)(PerformancePopup);
