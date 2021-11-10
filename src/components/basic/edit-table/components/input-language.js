import React, { useEffect, useRef } from 'react';
import InputLanguage from '../../../form/input-language';
import { messages } from '../../../utils';
import EditIcon from '../images/edit';

function CustomInput(props) {
  const {
    onChange,
    value,
    record,
    disabled,
    placeholder,
    renderValue,
    cellKey,
    cellStatusMap,
  } = props;
  const input = useRef(null);
  const lock = useRef(false);

  useEffect(() => {
    if (cellStatusMap[cellKey]) {
      input.current?.focus();
    }
  }, [cellStatusMap[cellKey]]);
  // eslint-disable-next-line no-underscore-dangle
  if (!['NEW', 'EDIT'].includes(record._status) && !cellStatusMap[cellKey]) {
    return (
      <div className="edit-table-cell-box">
        <span className="edit-table-over-range" onClick={handleFocus}>
          {typeof renderValue === 'function'
            ? renderValue(value)
            : value?.value}
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
    if (disabled) return;
    const { onClickCell } = props;
    onClickCell(cellKey);
  }

  function handleBeforeOpen() {
    lock.current = true;
  }

  function handleInputBlur() {
    setTimeout(() => {
      if (lock.current) return;
      const { afterBlur } = props;
      afterBlur(value, cellKey);
      lock.current = false;
    }, 500);
  }

  function handleCancel() {
    const { onCancel } = props;
    if (onCancel) onCancel();
    const { afterBlur } = props;
    afterBlur(value, cellKey);
    lock.current = false;
  }

  function handleChange(result) {
    onChange(result);
    if (lock.current) {
      const { afterBlur } = props;
      afterBlur(result, cellKey);
      lock.current = false;
    }
  }

  return (
    <InputLanguage
      {...props}
      onChange={handleChange}
      value={value}
      disabled={disabled}
      placeholder={placeholder || messages('common.please.enter')}
      ref={input}
      onBlur={handleInputBlur}
      beforeOpen={handleBeforeOpen}
      onCancel={handleCancel}
    />
  );
}

export default CustomInput;
