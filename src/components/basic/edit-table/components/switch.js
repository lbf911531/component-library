import React, { useRef, useEffect } from 'react';
import { Switch, Badge } from 'antd';
import { messages } from '../../../utils';
import { filterProps } from '../utils';
import EditIcon from '../images/edit';

function CustomSwitch(props) {
  const {
    onChange,
    value,
    record,
    disabled,
    renderValue,
    labelname,
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
        <div className="edit-table-cell-box">
          <Badge
            status={value === true || value === 1 ? 'success' : 'error'}
            text={
              value === true || value === 1
                ? labelname
                  ? messages('common.enabled') /** 启用 */
                  : messages('request.detail.booker.yes') /** 是 */
                : labelname
                ? messages('common.disabled') /** 禁用 */
                : messages('request.detail.booker.no') /** 否 */
            }
            onClick={handleFocus}
          />
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

  return (
    <Switch
      {...filterProps(props)}
      onChange={(checked) => onChange(checked)}
      checked={value}
      disabled={disabled}
      onBlur={handleBlur}
      ref={input}
    />
  );
}

export default CustomSwitch;
