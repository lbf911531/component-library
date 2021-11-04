/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-05-20 15:30:25
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-27 16:50:58
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import React, { useState } from 'react';
import { Select } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import CloseSvg from '../images/close';
import { preventOpen } from '../utils';
import { messages } from '../../../utils';

export default function CustomSwitch(props) {
  const {
    value,
    onChange,
    formItem: { disabled, label, allowClear },
  } = props;
  const [open, setOpen] = useState(false);

  function handleControlOpen(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpen(!open);
  }

  function handleClear(e) {
    e.preventDefault();
    e.stopPropagation();
    if (onChange) onChange(undefined);
  }

  return (
    <>
      <span className="label">{messages(label)}</span>
      <Select
        onChange={onChange}
        disabled={disabled}
        value={value}
        className={value ? 'value inputValue' : 'value inputValue valueNull'}
        placeholder={messages('common.all')}
        dropdownMatchSelectWidth={200}
        allowClear={false}
        suffixIcon={
          <div>
            {allowClear !== false && value !== undefined ? (
              <CloseSvg
                onMouseDown={preventOpen}
                onClick={handleClear}
                style={{
                  position: 'relative',
                  verticalAlign: 'middle',
                  top: -2,
                }}
              />
            ) : (
              ''
            )}
          </div>
        }
        open={open}
        onDropdownVisibleChange={setOpen}
      >
        <Select.Option value>{messages('common.enabled')}</Select.Option>
        <Select.Option value={false}>
          {messages('common.disabled')}
        </Select.Option>
      </Select>
      <div className="selectDownIcon">
        <CaretDownOutlined
          style={{
            fontSize: 10,
            color: '#333333',
            verticalAlign: 'middle',
          }}
          onClick={handleControlOpen}
          onMouseDown={preventOpen}
        />
      </div>
    </>
  );
}
