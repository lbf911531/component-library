/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-05-20 15:51:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-27 16:53:17
 * @Version: 1.0.0
 * @Description:树形选择
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */
import React, { useState } from 'react';
import { TreeSelect } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import CloseSvg from '../images/close';
import { preventOpen } from '../utils';
import { messages } from '../../../utils';

export default function CustomTreeSelect(props) {
  const {
    onChange,
    value,
    formItem: { treeData, allowClear, disabled, label },
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
    onChange(undefined);
  }

  return (
    <>
      <span className="search-form-item-label label">{messages(label)}</span>
      <TreeSelect
        value={value}
        style={{ width: '100%' }}
        dropdownMatchSelectWidth={200}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={treeData}
        onChange={onChange}
        placeholder={messages('common.all')}
        allowClear={false}
        disabled={disabled}
        className={value ? 'value inputValue' : 'value inputValue valueNull'}
        dropdownClassName="search-area-tree-select-dropdown"
        onDropdownVisibleChange={setOpen}
        open={open}
        suffixIcon={
          <div>
            {allowClear !== false && value ? (
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
      />
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
