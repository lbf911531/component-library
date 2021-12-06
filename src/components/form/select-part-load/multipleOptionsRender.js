/*
 * @Author: your name
 * @Date: 2021-10-15 14:51:42
 * @LastEditTime: 2021-12-02 14:35:36
 * @LastEditors: binfeng.long@hand-china.com
 * @Description: In User Settings Edit
 * @FilePath: \companyCode\polaris-web-workbench\polaris-web-workbench\src\components\Widget\Template\select-part-load\multipleOptionsRender.js
 */
import React, { useState, useEffect, useRef } from 'react';
import { Spin, Input, Divider, Checkbox } from 'antd';
import { messages } from '../../utils';
import SearchSvg from './images/search';

export default function MultipleOptionsRender(props) {
  const {
    loading,
    showSearch,
    showPagination,
    options,
    extraOptions,
    valueKey,
    labelKey,
    componentType,
    optionLabelProp,
    getLabel,
    onSearch,
    onChange,
    onPopupScroll,
    selectValue,
    open,
    onSelect,
    onDeselect,
    total,
  } = props;
  const currentOptions = [...extraOptions, ...options];

  const popoverContent = useRef(); // 下拉框
  const searchInput = useRef(); // 搜索框

  const [selectedRender, setSelectedRender] = useState([]); // 已选选项
  const [noSelectedRender, setNoSelectedRender] = useState([]); // 未选选项

  useEffect(() => {
    // 给 元素绑定滚动事件 以模拟 分页下拉事件
    popoverContent.current.addEventListener('scroll', (e) => {
      onPopupScroll(e);
    });
  }, []);

  useEffect(() => {
    // 页面打开后 进行已选选项 和 未选选项 的分类
    if (open) {
      let noSelectedRenderTemp = [];

      if (!selectValue || selectValue.length === 0) {
        noSelectedRenderTemp = currentOptions;
      } else {
        currentOptions.forEach((item) => {
          // 遍历后不存在于 selectValue(下拉框已选数据) 中的，放入未选
          if (!selectValue.find((o) => o[valueKey] === item[valueKey])) {
            noSelectedRenderTemp.push(item);
          }
        });
      }

      setTimeout(() => {
        searchInput.current.focus(); // 打开页面 下拉框中搜索框聚焦
      }, 300);

      setSelectedRender(selectValue || []); // 下拉框传入的数据 即为 已选数据
      setNoSelectedRender(noSelectedRenderTemp);
    } else {
      setTimeout(() => {
        searchInput.current.state.value = null; // 打开页面 下拉框中搜索框聚焦
      }, 300);
    }
  }, [open, extraOptions, options]);

  // 多选下拉框每一项的渲染
  function renderMultipleOptions() {
    return (
      <div>
        {selectedRender.map((item) => checkBoxItemRender(item))}
        {/** 分割线 */}
        {selectedRender.length !== 0 ? (
          <div
            style={{
              height: 1,
              width: '92%',
              margin: '10px 10px',
              background: '#F0F0F0',
            }}
          />
        ) : (
          ''
        )}
        {noSelectedRender.map((item) => checkBoxItemRender(item))}
        {![...selectedRender, ...noSelectedRender].length && (
          <div className="empty-tips">
            {messages('common.no.matching.result' /* 无匹配结果 */)}
          </div>
        )}
      </div>
    );
  }

  // 清空所选
  function handleClearSelectedValue(e) {
    e.preventDefault();
    e.stopPropagation();
    onChange([]);
  }

  // 模拟 select 的 change 事件
  function handleChange(item, flag) {
    // 处理数据
    const selectedValue = {};
    selectedValue.key = item[valueKey];
    selectedValue.value = item[valueKey];
    selectedValue.label = item[labelKey];

    const selectedRest = {};
    selectedRest.key = item[valueKey];
    selectedRest.value = item[valueKey];
    selectedRest.label = item[labelKey];
    selectedRest.data = item;
    selectedRest.title = `${item.code}-${item.name}`;
    selectedRest.children = `${item.code}-${item.name}`;

    // 模拟 select 选择事件
    if (onSelect && flag) {
      onSelect(selectedValue, selectedRest);
    }

    // 模拟 select 反选事件
    if (onDeselect && !flag) {
      onDeselect(selectedValue);
    }
  }

  // 单个 checkBox 的渲染模板
  function checkBoxItemRender(item) {
    const label = getLabel(labelKey, item);
    return (
      <div
        key={item[valueKey]}
        value={item[valueKey]}
        title={label}
        data={componentType === 'select' ? item : undefined}
        label={item[optionLabelProp || labelKey]}
        className="field-item"
      >
        <Checkbox
          onChange={(e) => {
            handleChange(item, e.target.checked);
          }}
          checked={(selectValue || []).find((o) => o.key === item[valueKey])} // 在 selectValue 中就选中
        >
          {label}
        </Checkbox>
      </div>
    );
  }

  return (
    <div className="custom-dropdown-wrap">
      {showSearch && (
        <div
          className="select-dropdown-title"
          style={{
            padding: '5px 16px 4px',
            borderBottom: '1px solid #f0f0f0',
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            prefix={<SearchSvg style={{ marginRight: 8 }} />}
            placeholder={messages('common.search' /* 搜索 */)}
            onChange={(e) => onSearch(e.target.value)}
            ref={searchInput}
            style={{
              padding: '4px 0',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
            }}
          />
        </div>
      )}
      <div className="custom-popover-subtitle">
        {messages('common.accounting.selected' /* 已选 {count} 项 */, {
          params: {
            count: (selectValue || []).length,
            total: total + extraOptions.length,
          },
        })}
        {!!(selectValue || []).length && (
          <>
            <Divider type="vertical" />
            <a onClick={handleClearSelectedValue}>
              {messages('common.clear.selected' /* 清除已选 */)}
            </a>
          </>
        )}
      </div>
      <Spin spinning={!!showPagination && loading}>
        <div
          className="custom-popover-content multipleSelect"
          ref={popoverContent}
        >
          {renderMultipleOptions()}
        </div>
      </Spin>
    </div>
  );
}
