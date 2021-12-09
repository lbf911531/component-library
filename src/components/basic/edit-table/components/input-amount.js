import React, { useRef, useEffect } from 'react';
import CustomAmount from '../../../form/custom-amount';
import { messages } from '../../../utils';
import EditIcon from '../images/edit';

function CustomInputNumber(props) {
  const {
    onChange,
    value,
    record,
    disabled,
    placeholder,
    precision,
    min,
    max,
    textRender,
    formatter,
    cellStatusMap,
    cellKey,
    editWithCellFlag,
  } = props;

  const input = useRef();
  useEffect(() => {
    if (cellStatusMap[cellKey]) {
      input.current?.focus?.();
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
    let text = `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    text = textRender ? textRender(text, record) : text;
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
    <CustomAmount
      {...props}
      precision={precision ? Number.parseInt(precision, 10) : undefined}
      min={min ? Number.parseFloat(min) : undefined}
      max={max ? Number.parseFloat(max) : undefined}
      onChange={onChange}
      formatter={formatter ? (values) => `${values}${formatter}` : undefined}
      parser={formatter ? (values) => values.replace(formatter, '') : undefined}
      value={value}
      disabled={disabled}
      placeholder={placeholder || messages('common.please.enter')}
      onBlur={handleBlur}
      inputRef={input}
    />
  );
}

export default CustomInputNumber;
