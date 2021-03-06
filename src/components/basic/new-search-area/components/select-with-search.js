/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-05-21 11:51:49
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-12-22 11:09:53
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import React, { useEffect, useState } from 'react';
import { Select, Tooltip, Tag } from 'antd';
import httpFetch from 'share/httpFetch';
import { CaretDownOutlined } from '@ant-design/icons';
import { getDataLabel, getLastKey } from '../utils';
import { messages } from '../../../utils';
import CloseSvg from '../images/close';
import SelectWithSearchOptionsRender from './selectWithSearchOptionsRender';

export default function CustomSelectWithSearch(props) {
  const { formItem, value, onChange, onResetOptions } = props;
  const {
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
  const [optionsTotal, setOptionsTotal] = useState(0);
  const [dropDownOpen, setDropDownOpen] = useState(false);

  useEffect(() => {
    setOptionList(options || []);
  }, [options, getUrl]);

  /**
   * ηε¬δΈζ
   * @param {boolean} visible
   */
  function handleDropdownVisible(visible) {
    if (visible) {
      setDropDownOpen(true);
      if (getUrl) {
        if (
          optionList.length &&
          getUrl === newGetUrl &&
          JSON.stringify(newGetParams) === JSON.stringify(getParams)
        ) {
          return;
        }
        handleGetOptions(getUrl, null, 'getUrl');
      } else if (Array.isArray(options) && options.length !== 0) {
        setOptionsTotal(options.length);
      }
    } else {
      setDropDownOpen(false);
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
      const total = Number(res.headers['x-total-count'] || 0);
      const tempOptions = [];
      const optionValue = handleFormatOptions(res.data, tempOptions);
      setOptionList(optionValue);
      setOptionsTotal(total);
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
            {`${op.label}${index === omittedValues.length - 1 ? '' : 'γ'}`}
          </span>
        ))}
        overlayStyle={{ maxWidth: 300, maxHeight: 300, overflowY: 'unset' }}
        visible={omittedValues.length ? undefined : false}
      >
        {messages('base.count.options' /* {count}δΈͺιι‘Ή */, {
          params: { count: omittedValues.length },
        })}
        ...
      </Tooltip>
    );
  }

  // ι»ζ­’ι»θ?€δΊδ»Άδ»₯εεζ³‘
  function preventDefault(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  /**
   * lovζ¨‘εΌδΈζΈ²ζηselectη»δ»ΆεεΌοΌ
   * handleSelectValueγhandleDesSelectValueζ¨‘ζonChange
   * @param {*} value
   * @param {*} option
   * @returns
   */
  function handleSelectValue(selectValue) {
    if (onChange) onChange([...selectValue]);
  }

  // ει
  function handleDesSelectValue(deSelectValue) {
    const index = value.findIndex((selected) => selected === deSelectValue);
    if (~index && onChange) {
      const temp = [...value];
      temp.splice(index, 1);
      onChange(temp);
    }
  }

  // ζ η­ΎζΈ²ζ
  function tagRender(item) {
    const { label, closable, onClose } = item;
    return (
      <Tag
        closable={closable}
        onClose={onClose}
        className="ant-select-selection-item"
        title={label}
        closeIcon={<CloseSvg onMouseDown={preventDefault} />}
      >
        <span className="ant-select-selection-item-content">{label}</span>
      </Tag>
    );
  }

  // ζΏζ’δΈζζ‘δΈ­ηζ ·εΌζΈ²ζ
  function dropDownMultipleRender() {
    return (
      <SelectWithSearchOptionsRender
        selectValue={value}
        loading={loading}
        showSearch
        showPagination
        options={optionList}
        valueKey={valueKey}
        labelKey={labelKey}
        componentType="select"
        onChange={onChange}
        onSelect={handleSelectValue}
        onDeselect={handleDesSelectValue}
        open={dropDownOpen}
        total={optionsTotal}
      />
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
        placeholder={messages('common.all')}
        dropdownRender={dropDownMultipleRender}
        onChange={onChange}
        onDropdownVisibleChange={handleDropdownVisible}
        onSearch={handleSearchOption}
        disabled={disabled}
        optionFilterProp="children"
        filterOption={handleFilterOption}
        getPopupContainer={(node) => node.parentNode}
        className={
          Array.isArray(value) && value.length !== 0
            ? 'value inputValue multipleSelectValue valueNotNull'
            : 'value inputValue multipleSelectValue valueNull'
        }
        dropdownMatchSelectWidth={260}
        tagRender={tagRender}
        open={dropDownOpen}
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
              value={option.value}
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
