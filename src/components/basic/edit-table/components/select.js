import React, { useEffect, useState, useRef } from 'react';
import { Select } from 'antd';
import { messages } from '../../../utils';
import httpFetch from 'share/httpFetch';
import { DownOutlined } from '@ant-design/icons';
import { filterProps } from '../utils';

function CustomSelect(props) {
  const {
    onChange,
    value,
    getUrl,
    valueKey,
    labelKey,
    getParams,
    options,
    record,
    disabled,
    placeholder,
    filterData,
    cellKey,
    cellStatusMap,
    editWithCellFlag,
  } = props;

  const [list, setList] = useState(options || []);
  const [loading, setLoading] = useState(false);
  const [newGetUrl, setNewGetUrl] = useState(getUrl);
  const [newGetParams, setNewGetParams] = useState(getParams);

  useEffect(() => {
    setList(options || []);
  }, [getUrl, options]);

  const input = useRef();

  useEffect(() => {
    if (cellStatusMap[cellKey]) {
      input.current.focus();
    }
  }, [cellStatusMap[cellKey]]);

  async function getData() {
    if (!getUrl && options) {
      let newOptions = options;
      if (filterData) {
        newOptions = filterData(options, record);
      }

      setList(newOptions);
      return;
    }
    if (
      (options && options.length) ||
      (list &&
        list.length &&
        getUrl === newGetUrl &&
        newGetParams === getParams)
    )
      return;

    setList([]);

    try {
      setLoading(true);
      let { data } = await httpFetch.get(getUrl, getParams);

      if (filterData) {
        data = filterData(data, record);
      }

      setList(data);
      setLoading(false);
      setNewGetUrl(getUrl);
      setNewGetParams(getParams);
    } catch (error) {
      if (error.response) {
        console.error(error);
      } else {
        console.error(error);
      }
    }
  }

  function dropdownVisibleHandle(visible) {
    if (visible) {
      getData();
    }
    if (options) {
      setLoading(false);
    }
  }

  function onChangeHandle(values) {
    const option = list.find((o) => o[valueKey] === values?.value);
    if (onChange) {
      onChange(values, option, list);
    }
  }

  function handleFocus() {
    if (disabled || !editWithCellFlag) return;
    const { onClickCell } = props;
    onClickCell(cellKey);
  }

  function handleBlur(e) {
    const { afterBlur, onBlur } = props;
    if (onBlur) {
      onBlur(e);
    }
    afterBlur(value, cellKey);
  }

  // eslint-disable-next-line no-underscore-dangle
  if (!['NEW', 'EDIT'].includes(record._status) && !cellStatusMap[cellKey]) {
    const text = props.renderText
      ? props.renderText(value, record)
      : value && value.label;
    return (
      <div className="edit-table-cell-box">
        <span className="edit-table-over-range" onClick={handleFocus}>
          {text}
        </span>
        {disabled ? (
          ''
        ) : (
          <span className="edit-table-hover-status">
            <DownOutlined onClick={handleFocus} />
          </span>
        )}
      </div>
    );
  }

  return (
    <Select
      {...filterProps(props)}
      options={(list || []).map((o) => ({
        label: o[labelKey],
        value: o[valueKey],
      }))}
      onChange={onChangeHandle}
      value={value || undefined}
      loading={loading}
      onDropdownVisibleChange={dropdownVisibleHandle}
      labelInValue
      disabled={disabled}
      placeholder={placeholder || messages('common.please.select')}
      onBlur={handleBlur}
      onClear={() => {
        input.current.focus();
      }}
      ref={input}
      style={{ width: '100%' }}
    >
      {(list || []).map((item) => (
        <Select.Option key={item[valueKey]}>{item[labelKey]}</Select.Option>
      ))}
    </Select>
  );
}

export default CustomSelect;
