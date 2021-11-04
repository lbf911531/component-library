/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-05-20 16:50:37
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-28 14:45:12
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import { messages } from '../../../utils';

export default function CustomRangePicker(props) {
  const {
    onChange,
    value,
    formItem: { disabled, label, type, noRange },
  } = props;

  const format =
    type === 'rangeDateTimePicker' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';

  return (
    <>
      <span className="label">{messages(label)}</span>
      <DatePicker.RangePicker
        value={value}
        format={format}
        onChange={onChange}
        disabled={disabled}
        // getCalendarContainer={node => node.parentNode}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        disabledDate={
          type === 'rangePicker'
            ? (date) =>
                !noRange && date && date.valueOf() > new Date().getTime()
            : undefined
        }
        showTime={
          type === 'rangeDateTimePicker'
            ? {
                hideDisabledOptions: true,
                defaultValue: [
                  moment('00:00:00', 'HH:mm:ss'),
                  moment('11:59:59', 'HH:mm:ss'),
                ],
              }
            : undefined
        }
        className="value"
      />
    </>
  );
}
