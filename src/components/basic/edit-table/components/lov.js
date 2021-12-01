import React, { useRef, useEffect } from 'react';
import Lov from '../../../form/lov';
import { messages } from '../../../utils';
import { DownOutlined } from '@ant-design/icons';

function CustomLov(props) {
  const {
    onChange,
    value,
    record,
    labelKey,
    valueKey,
    code,
    single,
    extraParams,
    getParams,
    disabled,
    placeholder,
    allowClear,
    selectorItem,
    needCache,
    showLabel,
    renderLabel,
    searchList,
    searchListIndex,
    cellStatusMap,
    cellKey,
    editWithCellFlag,
    isRenderSelect,
    valueKeySelect,
    labelKeySelect,
    listType,
    listExtraParams,
  } = props;

  const input = useRef();
  const lock = useRef(); // 用于在渲染下拉框时，不处触发 div 的失焦事件
  // const forbidSecond = useRef(false); // 防止因渲染下拉框，导致失焦时同时出发div和下拉框的失焦事件

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

  function handleInputFocus() {
    lock.current = true;
    // forbidSecond.current = false;
  }

  function handleBlur(values, flag) {
    const { afterBlur } = props;
    const timer = setTimeout(() => {
      if (lock.current && flag) return;
      afterBlur(values || value, cellKey);
      lock.current = false;
      // forbidSecond.current = false;
      clearTimeout(timer);
    }, 0);
  }

  // eslint-disable-next-line no-underscore-dangle
  if (!['NEW', 'EDIT'].includes(record._status) && !cellStatusMap[cellKey]) {
    const result = single
      ? value && value[labelKey]
      : Array.isArray(value) && !value.length
      ? ''
      : `已选择${value.length}条`;
    const text = props.renderValue ? props.renderValue(value, record) : result;
    return (
      <div className="edit-table-cell-box">
        <span
          className="edit-table-over-range"
          onClick={handleFocus}
          style={{ minHeight: !result ? '20px' : 'unset' }}
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
      onBlur={() => {
        handleBlur(null, true);
      }}
    >
      <Lov
        code={code || listType}
        onChange={onChange}
        value={value}
        labelKey={labelKey}
        valueKey={valueKey}
        single={single}
        extraParams={{ ...(extraParams || {}), ...(getParams || {}) }}
        disabled={disabled}
        placeholder={placeholder || messages('common.please.select')}
        allowClear={allowClear}
        selectorItem={selectorItem}
        onFocus={handleInputFocus}
        afterOk={handleBlur}
        afterCancel={handleBlur}
        valueKeySelect={valueKeySelect}
        labelKeySelect={labelKeySelect}
        onBlur={(e, open) => {
          if (open) return;
          e.stopPropagation();
          // forbidSecond.current = true;
          lock.current = true;
          handleBlur(value, true);
          setTimeout(() => {
            input.current.focus();
            lock.current = false;
          }, 100);
        }} // 针对 lov渲染下拉形式
        needCache={needCache}
        showLabel={showLabel}
        renderLabel={renderLabel}
        searchList={searchList}
        searchListIndex={searchListIndex}
        isRenderSelect={isRenderSelect}
        listExtraParams={listExtraParams}
      />
    </div>
  );
}

export default CustomLov;
