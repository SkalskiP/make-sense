import React from 'react'
import classNames from 'classnames'
import './UnderlineTextButton.scss'

interface IProps {
  under?: boolean
  over?: boolean
  active?: boolean
  key?: string
  label: string
  onClick?: () => any
  style?: React.CSSProperties
}

export const UnderlineTextButton = (props: IProps) => {
  const { under, over, active, key, label, onClick, style } = props;

  const getClassName = () => {
    return classNames('UnderlineTextButton', {
      under: under,
      over: over,
      active: active,
    })
  };

  return (
    <div
      className={getClassName()}
      onClick={!!onClick ? onClick : undefined}
      key={key}
      style={style}
    >
      {label}
    </div>
  )
};
