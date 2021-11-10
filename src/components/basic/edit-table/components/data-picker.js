import React, { useRef, useEffect } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import EditIcon from '../images/edit';
import { messages } from '../../../utils';

function CustomDatePicker(props) {
  const {
    onChange,
    value,
    record,
    disabled,
    placeholder,
    format = 'YYYY-MM-DD',
    cellStatusMap,
    cellKey,
    editWithCellFlag,
  } = props;

  const input = useRef();

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

  function handleBlur(e) {
    const { afterBlur, onBlur } = props;
    if (onBlur) {
      onBlur(e);
    }
    afterBlur(e.target?.value ? moment(e.target.value) : '', cellKey);
  }

  function handleChange(values) {
    if (values === null) input.current.focus();
    onChange(values);
  }

  // eslint-disable-next-line no-underscore-dangle
  if (!['NEW', 'EDIT'].includes(record._status) && !cellStatusMap[cellKey]) {
    if (props.renderValue) {
      return (
        <span className="edit-table-over-range">
          {props.renderValue(value, record)}
        </span>
      );
    } else if (!value) {
      return (
        <div className="edit-table-cell-box">
          {disabled ? (
            ''
          ) : (
            <span
              className="edit-table-hover-status"
              style={{ position: 'relative', top: -2 }}
            >
              <EditIcon onClick={handleFocus} />
            </span>
          )}
        </div>
      );
    } else if (typeof value === 'object') {
      return <span onClick={handleFocus}>{value.format(format)}</span>;
    } else {
      return (
        <div className="edit-table-cell-box">
          <span className="edit-table-over-range" onClick={handleFocus}>
            {moment(value).format(format)}
          </span>
          {disabled ? (
            ''
          ) : (
            <span className="edit-table-hover-status">
              <EditIcon onClick={handleFocus} />
            </span>
          )}
        </div>
      );
    }
  }

  let _value = value;
  if (typeof value === 'string') {
    _value = moment(value);
  }

  return (
    <DatePicker
      {...props}
      onChange={handleChange}
      value={_value}
      disabled={disabled}
      placeholder={placeholder || messages('common.please.select')}
      onBlur={handleBlur}
      ref={input}
    />
  );
}

export default CustomDatePicker;
