/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-05-21 10:09:51
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-11-04 16:37:52
 * @Version: 1.0.0
 * @Description: 值列表选择
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */
import React, { useState, useEffect, useRef } from 'react';
import { Select, Tooltip, Input } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { messages, getSystemValueList } from '../../../utils';
import { preventOpen } from '../utils';
import SearchSvg from '../images/search';
import CloseSvg from '../images/close';

export default function CustomValueListSelector(props) {
  const { formItem, onChange, value, onResetOptions } = props;
  const {
    clear,
    disabled,
    entity,
    options,
    renderOption,
    valueListCode,
    all,
    label,
    showSearch,
  } = formItem;

  const [optionList, setOptionList] = useState([]);
  const [open, setOpen] = useState(false);
  const optionListBeforeSearch = useRef();

  useEffect(() => {
    setOptionList(options || []);
    optionListBeforeSearch.current = [...(options || [])];
  }, [options]);

  // 得到值列表的值增加options
  function handleGetValueListOptions(isOpen) {
    setOpen(isOpen);
    if (!isOpen) return;
    if (options.length === 0 || (options.length === 1 && options[0].temp)) {
      getSystemValueList(valueListCode, all).then((res) => {
        const tempOptions = [];
        res.data.values.forEach((data) => {
          tempOptions.push({
            label: renderOption ? renderOption(data) : data.name,
            value: data.value || data.code,
            data,
          });
        });
        optionListBeforeSearch.current = [...(tempOptions || [])];
        setOptionList(tempOptions);
        onResetOptions(tempOptions, formItem.id);
      });
    }
  }

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

  function handleSearch(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.value) {
      const temps = optionListBeforeSearch.current.filter((option) =>
        option?.label?.includes(e.target.value),
      );
      setOptionList(temps);
    } else setOptionList([...optionListBeforeSearch.current]);
  }

  return (
    <>
      <span className="label">{messages(label)}</span>
      <Select
        placeholder={messages('common.all')}
        onChange={onChange}
        disabled={disabled}
        labelInValue={!!entity}
        onDropdownVisibleChange={handleGetValueListOptions}
        getPopupContainer={(node) => node.parentNode}
        dropdownMatchSelectWidth={200}
        dropdownStyle={{ maxWidth: '20vw' }}
        dropdownClassName="wrap-select-option search-area-select"
        value={value}
        className={value ? 'value inputValue' : 'value inputValue valueNull'}
        allowClear={false}
        suffixIcon={
          <div>
            {clear !== false && value ? (
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
        dropdownRender={(menu) => {
          return (
            <div className="search-area-select-dropdown">
              {showSearch && (
                <div className="select-dropdown-title">
                  <Input
                    prefix={<SearchSvg />}
                    placeholder={messages('org.search' /* 搜索 */)}
                    onPressEnter={handleSearch}
                  />
                </div>
              )}
              {menu}
            </div>
          );
        }}
      >
        {optionList.map((option) => {
          return (
            <Select.Option
              key={option.value}
              title={option.data && !!entity ? JSON.stringify(option.data) : ''}
            >
              <Tooltip placement="topLeft" title={option.label}>
                {option.label}
              </Tooltip>
            </Select.Option>
          );
        })}
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
