import React, {useEffect, useState} from 'react';
import './LoginPopup.scss';
import {Input} from '@material-ui/core';
import {connect} from 'react-redux';
import {AppState} from '../../../store';
import {updateAuthData} from '../../../store/auth/actionCreators';
import {updateActivePopupType} from '../../../store/general/actionCreators';
import {GenericYesNoPopup} from '../GenericYesNoPopup/GenericYesNoPopup';
import {AuthData} from '../../../store/auth/types';
import {ClipLoader} from 'react-spinners';
import {CSSHelper} from '../../../logic/helpers/CSSHelper';
import {APIService} from '../../../services/API';
import {PopupWindowType} from '../../../data/enums/PopupWindowType';
import WrapperLogin from "../../../components/WrapperLogin/index"
import {CodiconAccount, Eye, MoveIcon} from "../../../assets/icons"

interface IProps {
    updateAuthDataAction: (authData: AuthData) => any;
    updateActivePopupTypeAction: (type: PopupWindowType) => any;
}

const LoginPopup: React.FC<IProps> = ({
    updateAuthDataAction,
    updateActivePopupTypeAction
}) => {
    const [isLoadingStatus, setIsLoadingStatus] = useState(false);
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [message, setMessage] = useState<string>();

    useEffect(() => {
        setMessage('');

        return () => {
            // do nothing
        };
    }, [email, password]);

    const renderContent = () => (
        <div className="LoginPopupContent">
            <div className="LoginPopupInputContainer">
                <label className='LoginPopupContent__label'>Account</label>
                <div className='LoginPopupContent__parent'>
                    <CodiconAccount className='LoginPopupContent__icon'/>
                    <Input
                        fullWidth
                        placeholder="email"
                        onChange={(e) => setEmail(e.target.value)}
                        inputProps={{style: {color: 'white'}}}
                    />
                </div>
            </div>
            <div className="LoginPopupInputContainer">
                <label className='LoginPopupContent__label'>Password</label>
                <div className='LoginPopupContent__parent'>
                    <Eye className='LoginPopupContent__icon'/> 
                    <MoveIcon className='LoginPopupContent__move'/> 
                    <Input
                        fullWidth
                        placeholder="password"
                        type="password"
                        inputProps={{style: {color: 'white'}}}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>
            <div className="LoginPopupMessage">
                {isLoadingStatus ? (
                    <ClipLoader
                        size={40}
                        color={CSSHelper.getLeadingColor()}
                        loading={true}
                    />
                ) : (
                    message
                )}
            </div>
        </div>
    );

    const doLogin = async () => {
        try {
            setIsLoadingStatus(true);
            const {data} = await APIService.login({email, password});
            // console.log('result.data', data);
            if (data.code === 200) {
                const {displayName, role, token: authToken} = data.data;
                updateAuthDataAction({
                    email,
                    displayName,
                    authToken,
                    role
                });
                window.localStorage.setItem(
                    '@@auth',
                    JSON.stringify({email, displayName, authToken, role})
                );
                setTimeout(() =>{ 
                    window.location.href = `${process.env.REACT_APP_API_ROOT || "/"}`
                }, 1000)
            } else if (data.errors) {
                setMessage(data.errors.map((error) => error.error).join('\n'));
            }
        } catch (error) {
            console.error('failed to login: ', error);
        } finally {
            setIsLoadingStatus(false);
        }
    };

    return (
        <div className='loginShowniq'>
            <WrapperLogin>
                <GenericYesNoPopup
                    title={''}
                    renderContent={renderContent}
                    acceptLabel={'Go'}
                    onAccept={doLogin}
                    rejectLabel={'Cancel'}
                    onReject={() => alert('Login required!')}
                />
            </WrapperLogin>
        </div>
    );
};

const mapDispatchToProps = {
    updateAuthDataAction: updateAuthData,
    updateActivePopupTypeAction: updateActivePopupType
};

const mapStateToProps = (state: AppState) => ({
    authData: state.auth.authData
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPopup);
