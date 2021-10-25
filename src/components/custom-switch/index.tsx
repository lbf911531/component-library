import React, { useEffect, useState, useContext } from 'react';
import { Switch } from 'antd';
import { IProps } from './interface';
import { messages } from '../utils';
import LocaleContext from '../locale-lan-provider/context';

export default function CustomSwitch(props: IProps) {
  const context = useContext(LocaleContext);
  const {
    checked,
    disabled,
    checkedDesc = messages('common.enabled', { context }),
    unCheckedDesc = messages('common.disabled', { context }),
  } = props;

  const [value, setValue] = useState(props.checked);

  useEffect(() => {
    setValue(checked);
  }, [checked]);

  function onChange(e) {
    const { onChange } = props;
    setValue(e);
    if (onChange) {
      onChange(e);
    }
  }

  return (
    <span>
      <Switch disabled={disabled} checked={value} onChange={onChange} />
      <span style={{ marginLeft: 10 }}>
        {value ? checkedDesc : unCheckedDesc}
      </span>
    </span>
  );
}
