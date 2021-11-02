/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-05-20 15:12:14
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-27 16:28:43
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import React, { useState } from 'react';
import { Select } from 'antd';
import { messages } from 'utils/utils';
import { CaretDownOutlined } from '@ant-design/icons';
import CloseSvg from '../images/close';
import { preventOpen } from '../utils';

export default function CustomRadio(props) {
  const {
    formItem: { disabled, options, label, allowClear },
    onChange,
    value,
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
        dropdownMatchSelectWidth={200}
        placeholder={messages('common.all')}
        suffixIcon={
          <div>
            {allowClear !== false && value !== undefined ? (
              <CloseSvg
                onMouseDown={preventOpen}
                onClick={handleClear}
                style={{ position: 'relative', verticalAlign: 'middle' }}
              />
            ) : (
              ''
            )}
          </div>
        }
        open={open}
        onDropdownVisibleChange={setOpen}
      >
        {options.map((option) => {
          return (
            <Select.Option value={option.value} key={option.value}>
              {option.label}
            </Select.Option>
          );
        })}
      </Select>
      <div>
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
