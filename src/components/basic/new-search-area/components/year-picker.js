/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-05-20 17:07:38
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-11-01 11:06:21
 * @Version: 1.0.0
 * @Description: 年份选择组件
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import React, { useState, useRef } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import { CaretDownOutlined } from '@ant-design/icons';
import { messages } from '@/components/utils';
import useWidthAdaptation from '../useWidth';
import CloseSvg from '../images/close';

export default function CustomYearPicker(props) {
  const { formItem, value, onChangeTime, onChange } = props;
  const { disabled, showTime, placeholder, label, format = 'YYYY' } = formItem;
  const [isOpen, setOpenFlag] = useState(false);
  const [showClose, setShowClose] = useState(false);
  const width = useWidthAdaptation(56, value ? value.format(format) : '', 16);
  const datePicker = useRef();

  function handleChangeOpenFlag(status) {
    setOpenFlag(!!status);
  }

  function handleChangeTime(time) {
    if (onChangeTime) {
      onChangeTime(time);
    }
  }

  function handlePanelChange(time) {
    setOpenFlag(false);
    handleChangeTime(time);
    if (onChange) {
      onChange(time);
    }
  }

  return (
    <>
      <span className="label">{messages(label)}</span>
      <DatePicker
        value={value}
        format="YYYY"
        picker="year"
        onChange={(time) => {
          if (!time && onChange) {
            onChange(time);
          }
          handleChangeTime(null);
          if (time) {
            setShowClose(true);
          } else {
            setShowClose(false);
          }
        }}
        open={isOpen}
        disabled={disabled}
        showTime={showTime}
        allowClear
        onOpenChange={handleChangeOpenFlag}
        onPanelChange={handlePanelChange}
        placeholder={placeholder || messages('common.please.select')}
        // getCalendarContainer={node => node.parentNode}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        disabledDate={(cur) => {
          const lowerLimit =
            cur.isBefore(moment('1970-01-01 00:00:00')) ||
            cur.isAfter(moment('2038-01-01 00:00:01'));
          if (lowerLimit) return true;
          return false;
        }}
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
