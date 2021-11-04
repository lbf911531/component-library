/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-05-21 10:43:40
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-28 14:38:41
 * @Version: 1.0.0
 * @Description: 日期组件
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import React, { useRef } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import { CaretDownOutlined } from '@ant-design/icons';
import { messages } from '../../../utils';
import useWidthAdaptation from '../useWidth';
import CloseSvg from '../images/close';

const unique = new Date().getTime();
export default function CustomDatePicker(props) {
  const { value, onChange, formItem, onSetDisabledDate, onBlur } = props;
  const {
    showTime,
    disabledDate,
    picker,
    disabled,
    placeholder,
    id,
    allowClear,
  } = formItem;
  const formatValue = showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
  const width = useWidthAdaptation(
    56,
    value ? value.format(formatValue) : '',
    16,
  );
  const datePicker = useRef();

  function handleFocus() {
    if (showTime && document.querySelector(`.item${unique}-${id} input`)) {
      document
        .querySelector(`.item${unique}-${id} input`)
        .setAttribute(
          'style',
          'text-overflow: ellipsis;white-space: nowrap;overflow: hidden;',
        );
    }
  }

  /**
   * 设置日期禁用范围
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

  /**
   * 监听值改变
   * @param {moment object} date
   * @param  {...any} rest
   */
  function handleChangeValue(date, ...rest) {
    onChange(date, ...rest);
    document
      .querySelector(`.item${unique}-${id}`)
      .setAttribute('title', value ? value.format(formatValue) : '');
  }

  // 失焦事件
  function handleBlur(e) {
    if (onBlur) {
      onBlur(e, formItem);
    }
  }

  return (
    <>
      <span className="label">{messages(formItem.label)}</span>
      <DatePicker
        value={value}
        disabledDate={handleSetDisabledDate}
        format={formatValue}
        disabled={disabled}
        showTime={showTime}
        placeholder={placeholder || messages('common.please.select')}
        // getCalendarContainer={node => node.parentNode}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        className={`item${unique}-${id} value pickerValue`}
        onChange={handleChangeValue}
        onBlur={handleBlur}
        // style={showTime ? { minWidth: '100%' } : {}}
        onFocus={handleFocus}
        picker={picker}
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
                right: -25,
              }}
            />
            {allowClear !== false && value ? (
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
