/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-05-19 15:40:43
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-10-21 10:10:07
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */
import React, { useState, useEffect, useRef } from 'react';
import { Select, Spin, Input } from 'antd';
import { messages } from 'utils/utils';
import httpFetch from '@/share/httpFetch';
import { CaretDownOutlined } from '@ant-design/icons';
import { getDataLabel, getLastKey, preventOpen } from '../utils';
import CloseSvg from '../images/close';
import SearchSvg from '../images/search';
import { debounce } from 'lodash';

export default function CustomSelect(props) {
  const { formItem, value, onChange, onResetOptions } = props;
  const {
    allowClear,
    disabled,
    entity,
    showSearch,
    options = [],
    getUrl,
    getParams,
    method,
    labelKey,
    valueKey,
    renderOption,
    onGetOptions,
    defaultGetList,
    mode,
  } = formItem;

  const [fetching, setFetching] = useState(false);
  const hasGetList = useRef(false);
  const [optionList, setOptionList] = useState([]);
  const [newGetUrl, setNewGetUrl] = useState(getUrl);
  const [newGetParams, setNewGetParams] = useState(getParams);
  const optionListBeforeSearch = useRef();
  const [open, setOpen] = useState(false);

  const searchInput = useRef();

  useEffect(() => {
    if (defaultGetList && !hasGetList.current) {
      handleGetOptions();
    }
  }, []);

  useEffect(() => {
    setOptionList(options || []);
    optionListBeforeSearch.current = [...(options || [])];
  }, [getUrl, options]);

  /**
   * 监听下拉
   * @param {boolean} visible
   */

  function handleDropdownVisible(visible) {
    if (visible && getUrl) {
      handleGetOptions();
    }
    setOpen(!open);
    if (showSearch) {
      // 有搜索框才聚焦、失焦
      setTimeout(() => {
        searchInput.current.focus();
      }, 300);
      if (open && searchInput.current.state.value !== null) {
        setTimeout(() => {
          searchInput.current.state.value = null;
        }, 300);
        setOptionList(optionListBeforeSearch.current);
      }
    }
  }

  /**
   * 获取下拉框数据
   */
  async function handleGetOptions() {
    // if (hasGetList?.current) return;
    if (
      (Array.isArray(options) && options.length === 1 && !options[0].temp) ||
      (optionList.length > 1 &&
        getUrl === newGetUrl &&
        JSON.stringify(newGetParams) === JSON.stringify(getParams))
    )
      return;
    setOptionList([]);
    try {
      setFetching(true);
      const { data } = await httpFetch[method](getUrl, getParams);
      const newOptionList = formatOptions(data);
      setOptionList(newOptionList);
      hasGetList.current = true;
      optionListBeforeSearch.current = [...newOptionList];
      if (onGetOptions instanceof Function) onGetOptions(newOptionList);
      onResetOptions(newOptionList, formItem.id);
      setFetching(false);
      setNewGetUrl(getUrl);
      setNewGetParams(getParams);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * 格式化处理 options
   * @param {array} originalArray
   * @returns array
   */
  function formatOptions(originalArray) {
    const newArray = [];
    originalArray.forEach((option) => {
      const labelValue = getDataLabel(option, labelKey);

      newArray.push({
        label: renderOption ? renderOption(option) : labelValue,
        value: option[getLastKey(valueKey)],
        data: option,
      });
    });
    return newArray;
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

  function handleClear(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!mode || mode !== 'tags' || mode !== 'multiple') {
      onChange(undefined);
    } else onChange([]);
  }

  function handleControlOpen(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpen(!open);
  }

  return (
    <>
      <span className="label">{messages(formItem.label)}</span>
      <Select
        placeholder={messages('common.all')}
        onChange={onChange}
        allowClear={false}
        disabled={disabled}
        labelInValue={!!entity}
        onDropdownVisibleChange={handleDropdownVisible}
        notFoundContent={
          fetching ? (
            <Spin size="small" />
          ) : (
            messages('agency.setting.no.result')
          )
        }
        className={
          value
            ? allowClear === undefined || allowClear !== false
              ? 'value inputValue'
              : 'value inputValue notAllowClear'
            : 'value inputValue valueNull'
        }
        dropdownMatchSelectWidth={200}
        dropdownStyle={{ maxWidth: '20vw' }}
        dropdownClassName="wrap-select-option search-area-select"
        value={value}
        getPopupContainer={(node) => node.parentNode}
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
        dropdownRender={(menu) => {
          return (
            <div className="search-area-select-dropdown">
              {showSearch && (
                <div className="select-dropdown-title">
                  <Input
                    prefix={<SearchSvg />}
                    placeholder={messages('org.search' /* 搜索 */)}
                    onChange={debounce(handleSearch, 200)}
                    ref={searchInput}
                  />
                </div>
              )}
              {menu}
            </div>
          );
        }}
        open={open}
      >
        {optionList.map((option) => {
          return (
            <Select.Option
              key={option.value}
              title={
                option.data && !!entity
                  ? JSON.stringify(option.data)
                  : option.label
              }
            >
              {option.label}
            </Select.Option>
          );
        })}
      </Select>
      <div className="selectDownIcon">
        {allowClear !== false && value ? (
          <CaretDownOutlined
            style={{
              fontSize: 10,
              color: '#333333',
              verticalAlign: 'middle',
            }}
            onClick={handleControlOpen}
            onMouseDown={preventOpen}
          />
        ) : (
          ''
        )}
      </div>
    </>
  );
}
