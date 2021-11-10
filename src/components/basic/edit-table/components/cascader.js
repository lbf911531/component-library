import React, { useEffect, useState, useRef } from 'react';
import { Cascader } from 'antd';
import { messages } from '../../../utils';
import httpFetch from 'share/httpFetch';
import { DownOutlined } from '@ant-design/icons';

function CustomCascader(props) {
  const {
    onChange,
    value,
    getUrl,
    valueKey,
    labelKey,
    childrenLabelKey,
    childrenValueKey,
    getParams,
    options,
    record,
    disabled,
    placeholder,
    filterData,
    cellStatusMap,
    cellKey,
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
  const lock = useRef();

  useEffect(() => {
    if (cellStatusMap[cellKey]) {
      input.current.focus();
    }
  }, [cellStatusMap[cellKey]]);

  function handleFocus() {
    if (disabled || !editWithCellFlag) return;
    const { onClickCell } = props;
    onClickCell(cellKey);
  }

  function handleBlur(e, flag) {
    const { afterBlur, onBlur } = props;
    if (onBlur) {
      onBlur(e);
    }
    setTimeout(() => {
      if (lock.current && flag) return;
      afterBlur(value, cellKey);
      lock.current = false;
    }, 0);
  }

  function handleInputFocus(e) {
    if (props.onFocus) {
      props.onFocus(e);
    }
    lock.current = true;
  }

  async function getData() {
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
        data = filterData(data);
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
  }

  function onChangeHandle(values) {
    const option = list.find((o) => o[valueKey] === values?.value);
    if (onChange) {
      onChange(values, option, list);
    }
  }

  // eslint-disable-next-line no-underscore-dangle
  if (!['NEW', 'EDIT'].includes(record._status) && !cellStatusMap[cellKey]) {
    const text = props.renderValue ? props.renderValue(value, record) : value;
    return (
      <div className="edit-table-cell-box">
        <span
          className="edit-table-over-range"
          onClick={handleFocus}
          style={{ minHeight: !value ? '20px' : 'unset' }}
        >
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
    <div
      role="article"
      tabIndex="-1"
      outline="0"
      hideFocus="true"
      ref={input}
      onBlur={(e) => {
        handleBlur(e, true);
      }}
    >
      <Cascader
        {...props}
        value={Array.isArray(value) ? value : []}
        options={(list || []).map((o) => ({
          label: o[labelKey],
          value: o[valueKey],
          children: o.children.map((i) => ({
            label: i[childrenLabelKey],
            value: i[childrenValueKey],
          })),
        }))}
        onChange={onChangeHandle}
        onPopupVisibleChange={dropdownVisibleHandle}
        loading={loading}
        disabled={disabled}
        placeholder={placeholder || messages('common.please.select')}
        onBlur={handleBlur}
        onFocus={handleInputFocus}
      />
    </div>
  );
}

export default CustomCascader;
