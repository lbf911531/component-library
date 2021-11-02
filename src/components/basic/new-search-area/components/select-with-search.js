/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-05-21 11:51:49
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-01 15:58:17
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import React, { useEffect, useState } from 'react';
import { Select, Tooltip } from 'antd';
import { messages } from 'utils/utils';
import httpFetch from '@/share/httpFetch';
import { CaretDownOutlined } from '@ant-design/icons';
import { getDataLabel, getLastKey } from '../utils';

export default function CustomSelectWithSearch(props) {
  const { formItem, value, onChange, onResetOptions } = props;
  const {
    allowClear,
    entity,
    getUrl,
    searchUrl,
    disabled,
    options,
    getParams,
    searchKey,
    method,
    listKey,
    renderOption,
    childrenMultipleKey,
    valueKey,
    labelKey,
    type,
    maxTagCount,
  } = formItem;

  const [optionList, setOptionList] = useState([]);
  const [newGetUrl, setNewGetUrl] = useState(getUrl);
  const [newGetParams, setNewGetParams] = useState(getParams);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOptionList(options || []);
  }, [options, getUrl]);

  /**
   * 监听下拉
   * @param {boolean} visible
   */
  function handleDropdownVisible(visible) {
    if (visible && getUrl) {
      if (
        optionList.length &&
        getUrl === newGetUrl &&
        JSON.stringify(newGetParams) === JSON.stringify(getParams)
      ) {
        return;
      }
      handleGetOptions(getUrl, null, 'getUrl');
    }
  }

  function handleGetOptions(url, key, flag) {
    setOptionList([]);
    setNewGetParams(getParams);
    const params = getParams || {};
    if (key) {
      params[searchKey] = key;
    }
    setLoading(true);
    httpFetch[method](url, params).then((res) => {
      const tempOptions = [];
      const optionValue = handleFormatOptions(res.data, tempOptions);
      setOptionList(optionValue);
      onResetOptions(options, formItem.id);
      setLoading(false);
      if (flag === 'getUrl') {
        setNewGetUrl(url);
      }
    });
  }

  function handleFormatOptions(list, targetArray) {
    let dataList = list;
    if (listKey) {
      listKey.split('.').forEach((key) => {
        dataList = dataList[key];
      });
    }
    dataList.forEach((data) => {
      const label = getDataLabel(data, labelKey);
      targetArray.push({
        label: renderOption ? renderOption(data) : label,
        value: data[getLastKey(valueKey)],
        data,
      });
      // eslint-disable-next-line no-prototype-builtins
      if (data.hasOwnProperty(childrenMultipleKey)) {
        handleFormatOptions(data[childrenMultipleKey]);
      }
    });
    return targetArray;
  }

  function handleSearchOption(key) {
    if (searchUrl) {
      handleGetOptions(searchUrl, key, 'searchUrl');
    }
  }

  function handleFilterOption(input, option) {
    return (
      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    );
  }

  function renderMaxTagPlaceholder(omittedValues) {
    return (
      <Tooltip
        placement="top"
        title={omittedValues.map((op, index) => (
          <span key={op.value}>
            {`${op.label}${index === omittedValues.length - 1 ? '' : '、'}`}
          </span>
        ))}
        overlayStyle={{ maxWidth: 300, maxHeight: 300, overflowY: 'auto' }}
        visible={omittedValues.length ? undefined : false}
      >
        +{omittedValues.length}...
      </Tooltip>
    );
  }

  return (
    <>
      <span className="label">{messages(formItem.label)}</span>
      <Select
        value={value}
        loading={loading}
        mode={type === 'multiple' ? 'multiple' : undefined}
        maxTagPlaceholder={
          type === 'multiple' ? renderMaxTagPlaceholder : undefined
        }
        maxTagCount={maxTagCount || 1}
        labelInValue={!!entity}
        showSearch
        allowClear={allowClear !== false}
        placeholder={messages('common.all')}
        onChange={onChange}
        onDropdownVisibleChange={handleDropdownVisible}
        onSearch={handleSearchOption}
        disabled={disabled}
        optionFilterProp="children"
        filterOption={handleFilterOption}
        getPopupContainer={(node) => node.parentNode}
        className="value"
        dropdownMatchSelectWidth={200}
        showArrow
        suffixIcon={
          <CaretDownOutlined
            style={{
              fontSize: 10,
              pointerEvents: 'unset',
              marginTop: 1,
              marginLeft: type === 'multiple' ? 6 : 0,
              color: '#333333',
            }}
          />
        }
      >
        {optionList.map((option) => {
          return (
            <Select.Option
              key={option.value}
              title={option.data && !!entity ? JSON.stringify(option.data) : ''}
            >
              {option.label}
            </Select.Option>
          );
        })}
      </Select>
    </>
  );
}
