import React from 'react';
import './TextInput.scss';

interface IProps {
    key: string;
    label?: string;
    isPassword: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => any;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => any;
    inputStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    barStyle?: React.CSSProperties;
    value?: string;
    handlerForEnterKey?: () => void;
}

const TextInput = (props: IProps) => {

    const {
        key,
        label,
        isPassword,
        onChange,
        onFocus,
        inputStyle,
        labelStyle,
        barStyle,
        value,
        handlerForEnterKey
    } = props;

    const getInputType = () => {
        return isPassword ? "password" : "text";
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (handlerForEnterKey) {
            if (event.key === 'Enter') {
                handlerForEnterKey();
            }
        }
    }

    return (
        <div className="TextInput">
            <input
                value={!!value ? value : undefined}
                type={getInputType()}
                id={key}
                style={inputStyle}
                onChange={onChange ? onChange : undefined}
                onFocus={onFocus ? onFocus : undefined}
                autoFocus
                onKeyUp={handleKeyUp}
            />
            {!!label && <label
                htmlFor={key}
                style={labelStyle}
            >
                {label}
            </label>}
            <div
                className="Bar"
                style={barStyle}
            />
        </div>
    );
};

export default TextInput;