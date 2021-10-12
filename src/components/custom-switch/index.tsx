import React, { useEffect, useState } from 'react';
import { Switch } from 'antd';
import { IProps } from './interface';

export default function CustomSwitch(props: IProps) {
  const {
    checked,
    disabled,
    checkedDesc = '启用',
    unCheckedDesc = '禁用',
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
