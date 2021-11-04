/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-05-20 15:39:49
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-09-10 11:04:12
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import React, { useState } from 'react';
import { Select, Space } from 'antd';
import { CaretDownOutlined, EllipsisOutlined } from '@ant-design/icons';
import { messages } from '../../../utils';
import { preventOpen, hasValue } from '../utils';

export default function CustomCheckbox(props) {
  const {
    value,
    onChange,
    formItem: { disabled, options, label },
  } = props;
  const [open, setOpen] = useState(false);

  function handleControlOpen(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpen(!open);
  }

  return (
    <>
      <span className="label">{messages(label)}</span>
      <span
        className={
          !hasValue(value)
            ? 'value lovValue single-value'
            : 'value lovValue multiple-value'
        }
      >
        <Space
          style={{
            width: '100%',
          }}
        >
          <Select
            mode="multiple"
            disabled={disabled}
            value={value}
            options={options}
            onChange={onChange}
            placeholder={messages('common.all')}
            maxTagCount={1}
            onDropdownVisibleChange={setOpen}
            style={{ width: 'auto', minWidth: 60 }}
            open={open}
            showSearch={false}
            dropdownMatchSelectWidth={200}
            className="multiple-tag"
            maxTagPlaceholder={<EllipsisOutlined />}
          />
          <span onClick={handleControlOpen} onMouseDown={preventOpen}>
            <CaretDownOutlined
              style={{
                fontSize: 10,
                color: '#333333',
              }}
              className="caret-down"
            />
          </span>
        </Space>
      </span>
    </>
  );
}
