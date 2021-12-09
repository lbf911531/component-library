/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-05-20 15:30:25
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-27 16:33:37
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import React from 'react';
import { Cascader } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { messages } from '../../../utils';
import CloseSvg from '../images/close';
import { preventOpen } from '../utils';
import useWidthAdaptation from '../useWidth';

export default function CustomCascade(props) {
  const {
    formItem: { disabled, options, label },
    value,
    onChange,
  } = props;
  const labelList = [];

  function recursiveSearchLabelByValue(ops, valueList) {
    if (valueList && !Array.isArray(valueList) && valueList.length <= 0) return;
    if (!Array.isArray(ops)) return;
    while (valueList.length) {
      ops.forEach((option) => {
        if (option.value === valueList[0]) {
          labelList.push(option.label);
          valueList.shift();
          if (option.children) {
            recursiveSearchLabelByValue(option.children, valueList);
          }
        }
      });
    }
  }

  const width = useWidthAdaptation(42, value, 20, () => {
    const tempValue = value ? [...value] : [];
    recursiveSearchLabelByValue(options, tempValue);
    return labelList.join(' / ');
  });

  function handleClear(e) {
    e.preventDefault();
    e.stopPropagation();
    if (onChange) onChange([]);
  }

  return (
    <>
      <span className="label">{messages(label)}</span>
      <Cascader
        value={value}
        placeholder={messages('common.all')}
        getPopupContainer={(node) => node.parentNode}
        onChange={onChange}
        options={options}
        style={{ width }}
        disabled={disabled}
        className="value inputValue"
        popupClassName="search-area-select ant-select-dropdown"
        allowClear={false}
        showSearch
        suffixIcon={
          <div>
            {value !== undefined && Array.isArray(value) && value.length ? (
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
        dropdownRender={(menu) => {
          return (
            <div className="search-area-select-dropdown">
              {/* <div className="select-dropdown-title">
                <Input
                  prefix={<SearchSvg />}
                  placeholder={messages('common.search')}
                  onPressEnter={handleSearch}
                />
              </div> */}
              {menu}
            </div>
          );
        }}
      />
      <div className="selectDownIcon">
        <CaretDownOutlined
          style={{
            fontSize: 10,
            color: '#333333',
            verticalAlign: 'middle',
          }}
          onMouseDown={preventOpen}
        />
      </div>
    </>
  );
}
