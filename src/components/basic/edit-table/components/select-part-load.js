/*
 * @Author: your name
 * @Date: 2021-09-06 19:30:22
 * @LastEditTime: 2021-12-01 10:47:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \companyCode\polaris-web-mdata\polaris-web-mdata\src\components\Widget\Template\edit-table\components\select-part-load.js
 */
import React, { useRef, useEffect } from 'react';
import SelectPartLoad from '../../../form/select-part-load';
import { messages } from '../../../utils';
import { DownOutlined } from '@ant-design/icons';

function CustomSelectPartLoad(props) {
  const {
    onChange,
    value,
    record,
    disabled,
    placeholder,
    params,
    getParams,
    cellStatusMap,
    cellKey,
    editWithCellFlag,
  } = props;

  const input = useRef();
  const lock = useRef(false);

  useEffect(() => {
    if (cellStatusMap[cellKey] && input.current?.selectRef) {
      input.current?.selectRef.focus();
    }
  }, [cellStatusMap[cellKey]]);

  function handleBeforeOpen() {
    lock.current = true;
  }

  function handleFocus() {
    if (disabled || !editWithCellFlag) return;
    const { onClickCell } = props;
    onClickCell(cellKey);
  }

  function handleBlur(e, open) {
    const { afterBlur, onBlur } = props;
    if (!open) {
      if (lock.current) return;
      if (onBlur) {
        onBlur(e);
      }
      afterBlur(value, cellKey);
    }
  }

  function handleChange(result) {
    onChange(result);
    if (lock.current) {
      input.current.handleFocus();
      lock.current = false;
    }
  }

  // eslint-disable-next-line no-underscore-dangle
  if (!['NEW', 'EDIT'].includes(record._status) && !cellStatusMap[cellKey]) {
    const result = value instanceof Object ? value.label : value;
    const text = props.renderValue ? props.renderValue(value, record) : result;
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
    <SelectPartLoad
      {...props}
      params={{ ...(params || {}), ...(getParams || {}) }}
      onChange={handleChange}
      value={value || undefined}
      disabled={disabled}
      placeholder={placeholder || messages('common.please.select')}
      ref={input}
      onBlur={handleBlur}
      beforeOpen={handleBeforeOpen}
    />
  );
}

export default CustomSelectPartLoad;
