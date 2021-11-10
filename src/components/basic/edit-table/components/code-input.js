/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-06-08 10:15:32
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-11-10 14:48:53
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */
import React, { useRef, useEffect } from 'react';
import CodeInput from '../../../form/code-input';
import { messages } from '../../../utils';
import EditIcon from '../images/edit';

function CustomCodeInput(props) {
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
    afterBlur(value, cellKey);
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
    <CodeInput
      {...props}
      onClick={(e) => onClick && onClick(e, record, index)}
      onChange={(e) => onChange(e)}
      value={value}
      disabled={disabled}
      placeholder={placeholder || messages('common.please.enter')}
      onBlur={handleBlur}
      inputRef={input}
    />
  );
}

export default CustomCodeInput;
