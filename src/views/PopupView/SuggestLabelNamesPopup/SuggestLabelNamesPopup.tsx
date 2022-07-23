import React, {useState} from 'react'
import './SuggestLabelNamesPopup.scss'
import {AppState} from '../../../store';
import {connect} from 'react-redux';
import {updateRejectedSuggestedLabelList, updateSuggestedLabelList} from '../../../store/ai/actionCreators';
import {GenericYesNoPopup} from '../GenericYesNoPopup/GenericYesNoPopup';
import {PopupActions} from '../../../logic/actions/PopupActions';
import {AISelector} from '../../../store/selectors/AISelector';
import Scrollbars from 'react-custom-scrollbars-2';
import {LabelName} from '../../../store/labels/types';
import {updateLabelNames} from '../../../store/labels/actionCreators';
import {LabelsSelector} from '../../../store/selectors/LabelsSelector';
import { v4 as uuidv4 } from 'uuid';
import {ArrayUtil} from '../../../utils/ArrayUtil';
import {Settings} from '../../../settings/Settings';

interface SelectableName {
    name: string;
    flag: boolean;
}

interface IProps {
    updateLabelNames: (labels: LabelName[]) => any,
    updateSuggestedLabelList: (labelList: string[]) => any;
    updateRejectedSuggestedLabelList: (labelList: string[]) => any;
}

const SuggestLabelNamesPopup: React.FC<IProps> = (
    {
        updateLabelNames,
        updateSuggestedLabelList,
        updateRejectedSuggestedLabelList
    }) => {

    const mapNamesToSelectableNames = (names: string[]): SelectableName[] => {
        return names.map((name: string) => {
            return {
                name,
                flag: false
            }
        })
    };

    const [selectAllFlag, setSelectAllFlag] = useState(false);
    const [labelNames, setLabelNames] = useState(mapNamesToSelectableNames(AISelector.getSuggestedLabelList()));

    const onAccept = () => {
        updateLabelNames(extractSelectedNames().reduce((acc: LabelName[], entry: string, index: number) => {
            acc.push({
                name: entry,
                id: uuidv4(),
                color: ArrayUtil.getByInfiniteIndex(Settings.LABEL_COLORS_PALETTE, index)
            });
            return acc;
        }, LabelsSelector.getLabelNames()));
        updateRejectedSuggestedLabelList(AISelector.getRejectedSuggestedLabelList().concat(extractUnselectedNames()));
        updateSuggestedLabelList([]);
        PopupActions.close();
    };

    const onReject = () => {
        updateRejectedSuggestedLabelList(AISelector.getRejectedSuggestedLabelList().concat(extractNames()));
        updateSuggestedLabelList([]);
        PopupActions.close();
    };

    const selectAll = () => {
        setSelectAllFlag(true);
        setLabelNames(labelNames.map((entry: SelectableName) => {
            return {
                ...entry,
                flag: true
            }
        }))
    };

    const deselectAll = () => {
        setSelectAllFlag(false);
        setLabelNames(labelNames.map((entry: SelectableName) => {
            return {
                ...entry,
                flag: false
            }
        }))
    };

    const toggleSelectableNameByIndex = (index: number) => {
        const nextLabelNames: SelectableName[] = labelNames.map((entry: SelectableName, entryIndex: number) => {
            if (index === entryIndex)
                return {
                    ...entry,
                    flag: !entry.flag
                };
            else
                return entry;
        });
        setLabelNames(nextLabelNames);

        const nextSelectAllFlag: boolean = nextLabelNames.reduce((acc: boolean, entry: SelectableName) => {
            return(acc && entry.flag)
        }, true);
        setSelectAllFlag(nextSelectAllFlag);
    };

    const extractSelectedNames = (): string[] => {
        return labelNames.reduce((acc: string[], entry: SelectableName) => {
            if (entry.flag) {
                acc.push(entry.name);
            }
            return acc;
        }, [])
    };

    const extractUnselectedNames = (): string[] => {
        return labelNames.reduce((acc: string[], entry: SelectableName) => {
            if (!entry.flag) {
                acc.push(entry.name);
            }
            return acc;
        }, [])
    };

    const extractNames = (): string[] => {
        return labelNames.map((entry: SelectableName) => entry.name);
    };

    const getOptions = () => {
        return labelNames.map((entry: SelectableName, index: number) => {
            return <div
                className='OptionsItem'
                onClick={() => toggleSelectableNameByIndex(index)}
                key={index}
            >
                {entry.flag ?
                    <img
                        draggable={false}
                        src={'ico/checkbox-checked.png'}
                        alt={'checked'}
                    /> :
                    <img
                        draggable={false}
                        src={'ico/checkbox-unchecked.png'}
                        alt={'unchecked'}
                    />}
                {entry.name}
            </div>
        })
    };

    const renderContent = () => {
        return(<div className='SuggestLabelNamesPopupContent'>
            <div className='Message'>
                We found objects of classes that are not yet included in the list of labels. Select the names you
                would like to add. This will help to speed up the labeling process.
            </div>
            <div className='AllToggle'>
                <div
                    className='OptionsItem'
                    onClick={() => selectAllFlag ? deselectAll() : selectAll()}
                >
                    {selectAllFlag ?
                        <img
                            draggable={false}
                            src={'ico/checkbox-checked.png'}
                            alt={'checked'}
                        /> :
                        <img
                            draggable={false}
                            src={'ico/checkbox-unchecked.png'}
                            alt={'unchecked'}
                        />}
                    {selectAllFlag ? 'Deselect all' : 'Select all'}
                </div>
            </div>
            <div className='LabelNamesContainer'>
                <Scrollbars autoHeight={true}>
                    <div
                        className='LabelNamesContent'
                    >
                        {getOptions()}
                    </div>
                </Scrollbars>
            </div>
        </div>);
    };

    return(
        <GenericYesNoPopup
            title={'New classes found'}
            renderContent={renderContent}
            acceptLabel={'Accept'}
            onAccept={onAccept}
            rejectLabel={'Reject'}
            onReject={onReject}
        />
    );
};

const mapDispatchToProps = {
    updateLabelNames,
    updateSuggestedLabelList,
    updateRejectedSuggestedLabelList
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SuggestLabelNamesPopup);
