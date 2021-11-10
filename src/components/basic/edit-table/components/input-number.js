import React, { useRef, useEffect } from 'react';
import { InputNumber } from 'antd';
import { messages } from '../../../utils';
import EditIcon from '../images/edit';

function CustomInputNumber(props) {
  const {
    onChange,
    value,
    record,
    disabled,
    placeholder,
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

  // eslint-disable-next-line no-underscore-dangle
  if (!['NEW', 'EDIT'].includes(record._status) && !cellStatusMap[cellKey]) {
    const text = props.renderValue ? props.renderValue(value, record) : value;
    return (
      <div className="edit-table-cell-box">
        <span className="edit-table-over-range" onClick={handleFocus}>
          {text}
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
    afterBlur(e.target?.value, cellKey);
  }

  return (
    <div style={{ textAlign: 'left' }}>
      <InputNumber
        {...props}
        onChange={onChange}
        value={value}
        disabled={disabled}
        placeholder={placeholder || messages('common.please.enter')}
        onBlur={handleBlur}
        ref={input}
      />
    </div>
  );
}

export default CustomInputNumber;
