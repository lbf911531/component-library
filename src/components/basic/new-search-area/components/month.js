/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-05-20 15:59:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-10-18 15:06:48
 * @Version: 1.0.0
 * @Description: 月份选择
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import React, { useState, useRef } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import { CaretDownOutlined } from '@ant-design/icons';
import { messages } from '../../../utils';
import useWidthAdaptation from '../useWidth';
import CloseSvg from '../images/close';

export default function CustomMonthPicker(props) {
  const { onChange, value, formItem, onSetDisabledDate } = props;
  const {
    disabled,
    showTime,
    placeholder,
    disabledDate,
    format = 'YYYY/MM',
  } = formItem;
  const [showClose, setShowClose] = useState(false);
  const width = useWidthAdaptation(56, value ? value.format(format) : '', 16);
  const datePicker = useRef();

  /**
   * 监听值改变
   */
  function handleChangeValue(month, ...rest) {
    if (month) {
      setShowClose(true);
    } else {
      setShowClose(false);
    }
    onChange(month, ...rest);
  }

  /**
   * 设置月份禁用范围
   * @param {object} cur moment
   * @returns boolean
   */
  function handleSetDisabledDate(cur) {
    const lowerLimit =
      cur.isBefore(moment('1970-01-01 00:00:00')) ||
      cur.isAfter(moment('2038-01-01 00:00:01'));
    if (lowerLimit) return true;
    return Object.prototype.toString.call(disabledDate) === '[object Function]'
      ? disabledDate(cur)
      : onSetDisabledDate(cur, formItem);
  }

  return (
    <>
      <span className="label">{messages(formItem.label)}</span>
      <DatePicker.MonthPicker
        disabledDate={handleSetDisabledDate}
        value={value}
        format={format}
        onChange={handleChangeValue}
        disabled={disabled}
        showTime={showTime}
        placeholder={placeholder || messages('common.please.select')}
        // getCalendarContainer={node => node.parentNode}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        className="value pickerValue"
        style={{ width }}
        ref={datePicker}
        suffixIcon={
          <div>
            <CaretDownOutlined
              style={{
                fontSize: 10,
                color: '#333333',
                margin: '10px 3px 0px -13px',
                pointerEvents: 'unset',
                position: 'absolute',
                top: -6,
                right: -23,
              }}
            />
            {showClose ? (
              <CloseSvg style={{ position: 'relative', right: -1, top: -1 }} />
            ) : (
              ''
            )}
          </div>
        }
      />
    </>
  );
}
