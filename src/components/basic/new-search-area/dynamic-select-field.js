/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-06-28 16:09:24
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-11-02 11:12:23
 * @Version: 1.0.0
 * @Description: 下拉，动态选取搜索字段
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
} from 'react';
import { messages } from '@/components/utils';
import { Popover, Input, Divider, Checkbox, Button } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';
import { useSelections, useClickAway } from 'ahooks';
import SearchSvg from './images/search';

function DynamicSelectField(props) {
  const { columns, defaultSelected = [], refInstance } = props;
  const [visible, setVisible] = useState(false);
  const [keyword, setKeyword] = useState('');
  const { selected, isSelected, toggle, setSelected } = useSelections(
    columns,
    [],
  );
  const btnRef = useRef();
  const innerRef = useRef();

  useEffect(() => {
    const temp = defaultSelected.map((field) => field?.item?.id);
    setSelected(temp);
  }, [defaultSelected]);

  useImperativeHandle(refInstance, () => ({
    setSelectedFields,
  }));

  useClickAway(() => {
    if (visible) {
      resetSelectedList();
      setVisible(false);
    }
  }, [innerRef, btnRef]);

  function resetSelectedList() {
    const temp = defaultSelected.map((field) => field?.item?.id);
    setSelected(temp);
  }

  function handleClearSelectedValue(e) {
    e.preventDefault();
    e.stopPropagation();
    setSelected([]);
  }

  function handleSearch(event) {
    setKeyword(event.target?.value);
  }

  /**
   * 1. 关闭气泡框
   * 2. 抛出勾选数据
   */
  function handleSubmit() {
    const { onResetDynamicCols } = props;
    if (onResetDynamicCols) {
      const temp = defaultSelected.map((field) => field?.item?.id);
      let refresh = false;
      if (String(temp) !== String(selected)) refresh = true;
      onResetDynamicCols(selected, refresh);
      setVisible(false);
    }
  }

  // 只关闭气泡框
  function handleCancel() {
    const { onResetDynamicCols } = props;
    if (onResetDynamicCols) {
      const temp = defaultSelected.map((field) => field?.item?.id);
      const refresh = false;
      onResetDynamicCols(temp, refresh);
      setVisible(false);
    }
  }

  // 向外抛出方法： 重设勾选的数据
  function setSelectedFields(list) {
    setSelected(list);
  }

  function renderPopContent() {
    return (
      <div>
        <div className="custom-popover-subtitle">
          {messages('common.accounting.selected', { count: selected.length })}
          {!!selected.length && (
            <>
              <Divider type="vertical" />
              <a onClick={handleClearSelectedValue}>
                {messages('common.clear.selected' /* 清除已选 */)}
              </a>
            </>
          )}
        </div>
        <div className="custom-popover-content">
          {Array.isArray(columns) &&
            columns
              .filter((col) => {
                const label = col?.label ? messages(col?.label) : '';
                return label.includes(keyword);
              })
              .map((col) => (
                <div key={col.id} className="field-item">
                  <Checkbox
                    checked={isSelected(col.id)}
                    onClick={() => {
                      toggle(col.id);
                    }}
                  >
                    <span>{messages(col.label)}</span>
                  </Checkbox>
                </div>
              ))}
        </div>
        <div className="custom-popover-footer">
          <Button
            onClick={handleSubmit}
            className="float-right"
            size="small"
            type="primary"
          >
            {messages('common.ok' /* 确定 */)}
          </Button>
          <Button
            onClick={handleCancel}
            className="float-right margin-right-8"
            size="small"
          >
            {messages('common.cancel' /* 取消 */)}
          </Button>
        </div>
      </div>
    );
  }

  function handleChangeVisible() {
    if (visible) resetSelectedList();
    setVisible((pre) => !pre);
  }

  return (
    <span ref={innerRef}>
      <Popover
        trigger="click"
        title={
          <Input
            prefix={<SearchSvg />}
            placeholder={messages('common.search' /* 搜索 */)}
            onPressEnter={handleSearch}
          />
        }
        content={renderPopContent()}
        overlayClassName="dynamic-sel-field-btn-popover"
        overlayStyle={{ padding: 0, width: 200 }}
        getPopupContainer={(node) => node.parentNode}
        visible={visible}
      >
        <span
          className="screening-button"
          onClick={handleChangeVisible}
          ref={btnRef}
          style={{ marginTop: 3 }}
        >
          <PlusCircleFilled
            className="margin-right-8"
            style={{ fontSize: 15 }}
          />
          <span className="margin-right-8">
            {/* 添加筛选条件 */}
            {messages('common.add.filter')}
            {`(${columns.length - selected.length})`}
          </span>
        </span>
      </Popover>
    </span>
  );
}
export default forwardRef((props, ref) => (
  <DynamicSelectField {...props} refInstance={ref} />
));
