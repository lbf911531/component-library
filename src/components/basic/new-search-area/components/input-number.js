/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-05-21 10:25:43
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-11-04 16:36:10
 * @Version: 1.0.0
 * @Description: 数字输入框
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import React from 'react';
import InputNumber from '../../../form/input-number';
import { messages } from '../../../utils';
import useWidthAdaptation from '../useWidth';

export default function CustomInputNumber(props) {
  const { formItem, value, onChange, onSearch, onBlur } = props;
  const {
    min,
    precision,
    step,
    formatter,
    parser,
    disabled,
    isPopconfirmFlag,
  } = formItem;
  const minAttr = min ? {} : { min: 0 };

  const width = useWidthAdaptation(64, value, 13);

  function handleBlur(e) {
    if (onBlur) {
      onBlur(e, formItem);
    }
  }

  return (
    <>
      <span className="label">{messages(formItem.label)}</span>
      <InputNumber
        value={value}
        className="value inputValue"
        style={{ width }}
        precision={precision === undefined ? 2 : precision}
        {...minAttr}
        step={step || 0.01}
        formatter={formatter || undefined}
        parser={parser || undefined}
        placeholder={messages('common.please.enter...' /* 请输入... */)}
        onChange={onChange}
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            if (!isPopconfirmFlag) onSearch();
          }
        }}
        title={value}
        onBlur={handleBlur}
      />
    </>
  );
}
