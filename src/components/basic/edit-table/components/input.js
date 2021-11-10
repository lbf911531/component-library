import React, { useRef, useEffect } from 'react';
import { Input } from 'antd';
import { messages } from '../../../utils';
import EditIcon from '../images/edit';
import { filterProps } from '../utils';

function CustomInput(props) {
  const {
    onChange,
    value,
    record,
    disabled,
    placeholder,
    onClick,
    index,
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

  return (
    <Input
      {...filterProps(props)}
      onClick={(e) => onClick && onClick(e, record, index)}
      onChange={(e) => onChange(e.target.value)}
      value={value}
      disabled={disabled}
      placeholder={placeholder || messages('common.please.enter')}
      onBlur={handleBlur}
      ref={input}
    />
  );
}

export default CustomInput;
