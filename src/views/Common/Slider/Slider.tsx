import React from 'react';
import { Slider as MuiSlider } from '@mui/material';
import './Slider.scss';

interface IProps {
    label?: string;
    onChange?: (value: number) => any;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => any;
    style?: React.CSSProperties;
    minValue?: number;
    maxValue?: number;
    step?: number;
    value?: number;
}

export const Slider = (props: IProps) => {

    const {
        label,
        onChange,
        onFocus,
        style,
        minValue,
        maxValue,
        step,
        value,
    } = props;

    return (
        <div className='SliderWrapper'>
            <MuiSlider
            className='Slider'
            aria-label={label}
            defaultValue={value}
            valueLabelDisplay="auto"
            step={step}
            marks
            min={minValue}
            max={maxValue}
            style={style}
            onFocus={onFocus}
            onChange={(_, value) => onChange(value as number)}
            />
        </div>
    );
};
