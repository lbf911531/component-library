/*
 * @Author: cong.guo@hand-china.com
 * @Date: 2021-09-10 13:11:16
 * @LastEditors: binfeng.long@hand-china.com
 * @Version: 1.0.0
 * @Description: 下拉选择 展示2个字段以上
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Input, Spin, Divider, Table, Checkbox, Tooltip } from 'antd';
import { useDebounceFn } from 'ahooks';
import SearchSvg from '../select-part-load/images/search';
import { messages } from '../../utils';

export default function TableOptionsRender(props) {
  const {
    columns: propsColumns,
    showSearch,
    onSearch,
    onChange,
    value,
    onPopupScroll,
    onSelectAllHandle,
    mode,
    open,
    options,
    valueKey,
    labelKey,
    setOpen,
    total,
    time = 250,
    handleFocusDiv,
    searchPlaceholder,
  } = props;

  const [selectedRender, setSelectedRender] = useState([]); // 已选选项
  const [noSelectedRender, setNoSelectedRender] = useState([]); // 未选选项
  const [spinning, setSpinning] = useState(false);

  const popoverContent = useRef();
  const searchInput = useRef();

  const selectedCount = useMemo(() => (value || []).length, [value]);

  const columns = useMemo(() => {
    return propsColumns.map((col) => ({
      ...col,
      title: messages(col.title, { context: this.context }),
      width: undefined,
      render:
        (['date', 'amount'].includes(col.fieldType) || !col.fieldType) &&
        col.render
          ? col.render
          : (val) => (
              <Tooltip
                title={<div onClick={(e) => e.stopPropagation()}>{val}</div>}
                getPopupContainer={() => popoverContent.current}
                overlayStyle={{
                  maxWidth: 500,
                  ...(val?.length > 200
                    ? { maxHeight: 500, overflow: 'auto' }
                    : {}),
                }}
              >
                {val}
              </Tooltip>
            ),
    }));
  }, [propsColumns]);

  const { run: onSearchHandle } = useDebounceFn(
    (val) => {
      onSearch(val);
    },
    { wait: time },
  );

  useEffect(() => {
    // 给 元素绑定滚动事件 以模拟 分页下拉事件
    popoverContent.current.addEventListener('scroll', onPopupScroll);
  }, []);

  useEffect(() => {
    if (open && value && typeof value === 'object') {
      const valRow = document.querySelector(`.row-${value[valueKey]}`);
      if (valRow) {
        setTimeout(() => {
          valRow.scrollIntoView({ block: 'center' });
        }, 0);
      }
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      let noSelectedRenderTemp = [];
      const exist =
        Array.isArray(value) &&
        value?.length &&
        value.every((val) => val[labelKey]);
      const existDataIndex =
        value && value[0] && columns?.length && hasEveryCols(columns, value[0]);

      if (mode === 'multiple' && exist && existDataIndex) {
        options.forEach((item) => {
          // 遍历后不存在于 value(下拉框已选数据) 中的，放入未选
          if (!value.find((o) => o[valueKey] === item[valueKey])) {
            noSelectedRenderTemp.push(item);
          }
        });
        setSelectedRender(value); // 下拉框传入的数据 即为 已选数据
      } else {
        noSelectedRenderTemp = options;
        setSelectedRender([]);
      }

      setTimeout(() => {
        if (searchInput.current) {
          searchInput.current.focus(); // 打开页面 下拉框中搜索框聚焦
        }
      }, 300);

      setNoSelectedRender(noSelectedRenderTemp);
    } else {
      setTimeout(() => {
        if (searchInput.current) {
          searchInput.current.state.value = null; // 打开页面 下拉框中搜索框聚焦
        }
      }, 300);
    }
  }, [open, options, columns]);

  function hasEveryCols(cols, row) {
    return cols.every((col) => row[col.dataIndex] !== undefined);
  }

  function isSelected(row) {
    if (Array.isArray(value)) {
      return value.find((val) => val[valueKey] === row);
    }
    return value && value[valueKey] === row;
  }

  function handleClearSelectedValue() {
    onChange();
  }

  function onSelectedAll(e) {
    const { checked } = e.target;
    if (checked) {
      setSpinning(true);
    }
    onSelectAllHandle(checked, () => setSpinning(false));
    e.stopPropagation();
  }

  const renderMultipleOptions = useMemo(() => {
    const hasData = [...selectedRender, ...noSelectedRender].length;
    const line =
      mode === 'multiple' && selectedRender?.length
        ? [{ [valueKey]: 'line-tr' }]
        : [];
    const allData = [...selectedRender, ...line, ...noSelectedRender];
    const selectedList = Array.isArray(value) ? value : [];
    const curColumns =
      mode === 'multiple'
        ? [
            {
              title: (
                <Checkbox
                  disabled={!hasData}
                  checked={
                    !!selectedList.length &&
                    selectedList.length === options?.length
                  }
                  indeterminate={
                    !!selectedList.length && selectedList.length !== total
                  }
                  onChange={onSelectedAll}
                />
              ),
              render: (v, record) => (
                <Checkbox
                  checked={selectedList.find(
                    (val) => val[valueKey] === record[valueKey],
                  )}
                />
              ),
              className: 'option-table-checkbox-col',
            },
            ...columns.map((col, i) => {
              return {
                ...col,
                render: (val, row, index) => {
                  let obj = {
                    children: col.render ? col.render(val, row, index) : val,
                    props: {},
                  };
                  if (
                    selectedRender.length &&
                    index === selectedRender.length
                  ) {
                    obj = {
                      children: <div className="line" />,
                      props: { colSpan: i === 0 ? columns.length + 1 : 0 },
                    };
                  }
                  return obj;
                },
              };
            }),
          ]
        : [...columns];

    return (
      <div>
        {!!columns?.length && !!hasData && (
          <Table
            rowKey={valueKey}
            columns={curColumns}
            dataSource={allData}
            pagination={false}
            size="small"
            tableLayout="auto"
            rowClassName={(record) =>
              `row-${record[valueKey]} ${
                isSelected(record[valueKey]) ? 'selected-row' : ''
              }`
            }
            onRow={(record) => ({
              onClick: (e) => onRowClick(e, record),
            })}
            style={{ width: '100%' }}
          />
        )}
        {!hasData && (
          <div className="empty-tips">
            {messages('common.no.matching.result' /* 无匹配结果 */)}
          </div>
        )}
      </div>
    );
  }, [selectedRender, noSelectedRender, value]);

  function onRowClick(e, record) {
    if (mode !== 'multiple') {
      onChange(record);
      setOpen(false);
      setTimeout(() => {
        if (handleFocusDiv) handleFocusDiv();
      }, 80);
    } else {
      const valArr = Array.isArray(value) ? [...value] : [];
      const existIndex = valArr.findIndex(
        (val) => val[valueKey] === record[valueKey],
      );
      if (existIndex > -1) {
        valArr.splice(existIndex, 1);
        onChange(valArr);
      } else {
        valArr.push(record);
        onChange(valArr);
      }
    }
  }

  return (
    <div className="custom-dropdown-wrap table-options-render">
      {showSearch && (
        <div
          className="select-dropdown-title"
          style={{
            padding: '4px 16px',
            borderBottom: '1px solid #f0f0f0',
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            prefix={<SearchSvg style={{ marginRight: 8 }} />}
            placeholder={
              searchPlaceholder || messages('common.search' /* 搜索 */)
            }
            onChange={(e) => onSearchHandle(e.target.value)}
            ref={searchInput}
            style={{
              padding: '4px 0',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              height: 32,
            }}
          />
        </div>
      )}

      {mode === 'multiple' && (
        <div className="custom-popover-subtitle">
          {messages('common.accounting.selected' /* 已选 {count} 项 */, {
            params: { count: selectedCount, total },
          })}
          {!!selectedCount && (
            <>
              <Divider type="vertical" />
              <a onClick={handleClearSelectedValue}>
                {messages('common.clear.selected' /* 清除已选 */)}
              </a>
            </>
          )}
        </div>
      )}

      <Spin spinning={spinning}>
        <div
          className={`option-table-content ${
            mode === 'multiple'
              ? `multiple ${selectedRender?.length ? 'multiple-tag' : ''}`
              : ''
          }`}
          ref={popoverContent}
        >
          {renderMultipleOptions}
        </div>
      </Spin>
    </div>
  );
}
