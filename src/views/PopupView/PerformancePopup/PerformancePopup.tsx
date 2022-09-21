import {PopupWindowType} from 'data/enums/PopupWindowType';
import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {APIService} from 'services/API';
import {AppState} from 'store';
import {updateActivePopupType} from 'store/general/actionCreators';
import {
    updateCommonSummary,
    updateTasks
} from 'store/performance/actionCreators';
import {CommonSummary, Task} from 'store/performance/types';
import {GenericYesNoPopupDraggable} from '../GenericYesNoPopupDraggable/GenericYesNoPopupDraggable';
import './PerformancePopup.scss';

interface IProps {
    tasks: Task[];
    commonSummary: CommonSummary;
    updateTasksDataAction: (data: Task[]) => any;
    updateActivePopupTypeAction: (popupType: PopupWindowType) => any;
    updateCommonSummaryAction: (data: CommonSummary) => any;
}

const PerformancePopup: React.FC<IProps> = ({
    tasks,
    commonSummary,
    updateTasksDataAction,
    updateActivePopupTypeAction,
    updateCommonSummaryAction
}) => {
    useEffect(() => {
        loadTasks();
        loadSummary();
    }, []);

    const loadTasks = async () => {
        try {
            const {data} = await APIService.getTasks();
            updateTasksDataAction(data.tasks);
        } catch (error) {
            console.error('failed to loadTasks: ', error);
        }
    };

    const loadSummary = async () => {
        try {
            const {data} = await APIService.getSummary();
            const {
                total_images: total,
                labeled_images: labeled,
                unchecked_images: unchecked,
                waiting_qc_images: waitingQC,
                passed_images: passed,
                rejected_images: rejected
            } = data.data;

            const commonSummary: CommonSummary = {
                images: {
                    total,
                    labeled,
                    unchecked,
                    waitingQC,
                    passed,
                    rejected
                }
            };
            updateCommonSummaryAction(commonSummary);
        } catch (error) {
            console.error('failed to loadSummary: ', error);
        }
    };

    const renderContent = () => {
        const {
            images: {total, labeled, unchecked, waitingQC, passed, rejected}
        } = commonSummary;

        return (
            <div className="PerformancePopupContent">
                <div style={{height: 600, overflow: 'auto'}}>
                    <div className="Title">Tasks</div>
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
                                <tr key={index}>
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
                    <div className="Title" style={{marginTop: 30}}>
                        Summary
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th colSpan={6}>Number of Images</th>
                            </tr>
                            <tr>
                                <th>total</th>
                                <th>labeled</th>
                                <th>unchecked</th>
                                <th>waitingQC</th>
                                <th>passed</th>
                                <th>rejected</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>{total}</th>
                                <th>{labeled}</th>
                                <th>{unchecked}</th>
                                <th>{waitingQC}</th>
                                <th>{passed}</th>
                                <th>{rejected}</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <GenericYesNoPopupDraggable
            title={'Tasks & Summary'}
            renderContent={renderContent}
            acceptLabel="Reload"
            onAccept={() => {
                loadTasks();
                loadSummary();
            }}
            rejectLabel="Close"
            onReject={() => updateActivePopupTypeAction(null)}
        />
    );
};

const mapDispatchToProps = {
    updateActivePopupTypeAction: updateActivePopupType,
    updateTasksDataAction: updateTasks,
    updateCommonSummaryAction: updateCommonSummary
};

const mapStateToProps = (state: AppState) => ({
    tasks: state.performance.tasks,
    commonSummary: state.performance.commonSummary
});

export default connect(mapStateToProps, mapDispatchToProps)(PerformancePopup);
