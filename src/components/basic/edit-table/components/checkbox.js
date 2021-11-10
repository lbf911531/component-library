import React, { useRef, useEffect } from 'react';
import { Checkbox } from 'antd';
import { messages } from '../../../utils';

function CustomCheckbox(props) {
  const {
    onChange,
    value,
    record,
    disabled,
    renderValue,
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
    afterBlur(e.target?.value, cellKey);
  }

  // eslint-disable-next-line no-underscore-dangle
  if (!['NEW', 'EDIT'].includes(record._status) && !cellStatusMap[cellKey]) {
    if (typeof renderValue === 'function') {
      return (
        <div
          onClick={handleFocus}
          style={{ minHeight: !value ? '20px' : 'unset' }}
        >
          {renderValue(value)}
        </div>
      );
    } else {
      return (
        <div
          onClick={handleFocus}
          style={{ minHeight: !value ? '20px' : 'unset' }}
        >
          {value === true
            ? messages('request.detail.booker.yes')
            : value === false
            ? messages('request.detail.booker.no')
            : ''}
        </div>
      );
    }
  }

  return (
    <Checkbox
      {...props}
      onChange={(e) => {
        onChange(e.target.checked);
      }}
      checked={value}
      disabled={disabled}
      ref={input}
      onBlur={handleBlur}
    />
  );
}

export default CustomCheckbox;
