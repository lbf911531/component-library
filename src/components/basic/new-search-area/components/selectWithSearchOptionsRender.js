/*
 * @Author: your name
 * @Date: 2021-10-15 14:51:42
 * @LastEditTime: 2021-12-17 21:07:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \companyCode\polaris-web-workbench\polaris-web-workbench\src\components\Widget\Template\select-part-load\multipleOptionsRender.js
 */
import React, { useState, useEffect, useRef } from 'react'
import { Spin, Input, Divider, Checkbox } from "antd";
import { messages } from 'utils/utils';
import SearchSvg from '../images/search';

export default function SelectWithSearchOptionsRender(props) {

  const { loading, showSearch, showPagination, options, componentType, onChange, selectValue, open, onSelect, onDeselect, total } = props
  const [filterOptions, setFilterOptions] = useState('')  // 这里初始值给 '' 是因为要与初始状态区分开，这样下面做判断的时候，只需要判断 filterOptions 是不是数组就行，不是数组就用 options，是数组就用 filterOptions; 设置 total 值的时候同理

  console.log(options, 'options')

  const popoverContent = useRef()   // 下拉框
  const searchInput = useRef()  // 搜索框

  const [selectedRender, setSelectedRender] = useState([])  // 已选选项
  const [noSelectedRender, setNoSelectedRender] = useState([])  // 未选选项

  useEffect(() => {
    // 页面打开后 进行已选选项 和 未选选项 的分类
    const currentOptions = Array.isArray(filterOptions) ? [...filterOptions] : [...options];

    if (open) {
      let noSelectedRenderTemp = []

      if (!selectValue || selectValue.length === 0) {
        noSelectedRenderTemp = currentOptions;
      } else {
        currentOptions.forEach(item => {
          // 遍历后不存在于 selectValue(下拉框已选数据) 中的，放入未选
          if (!selectValue.find(curr => curr === item.value)) {
            noSelectedRenderTemp.push(item);
          };
        })
      }

      setTimeout(() => {
        searchInput.current.focus()   // 打开页面 下拉框中搜索框聚焦
      }, 300)

      setSelectedRender(selectValue || [])  // 下拉框传入的数据 即为 已选数据
      setNoSelectedRender(noSelectedRenderTemp)
    } else {
      setTimeout(() => {
        searchInput.current.state.value = null   // 关闭页面 下拉框中搜索框失焦
        setFilterOptions('')
      }, 300)
    }
  }, [open, options, filterOptions])

  // 多选下拉框每一项的渲染
  function renderMultipleOptions() {
    return (
      <div>
        {selectedRender.map(item => checkBoxItemRender(item))}
        {/** 分割线 */}
        {selectedRender.length !== 0 ? <div style={{ height: 1, width: '92%', margin: '10px 10px', background: '#F0F0F0' }} /> : ''}
        {noSelectedRender.map(item => checkBoxItemRender(item))}
        {![...selectedRender, ...noSelectedRender].length &&(
          <div className="empty-tips">{messages('my.contract.no.result' /* 无匹配结果 */)}</div>
        )}
      </div>
    );
  }

  // 清空所选
  function handleClearSelectedValue(e) {
    e.preventDefault();
    e.stopPropagation();
    onChange([])
  }

  // 模拟 select 的 change 事件
  function handleChange(item, flag) {
    const selectedValue = [...(selectValue || []), item.value]

    // 模拟 select 选择事件
    if (onSelect && flag) {
      onSelect(selectedValue);
    }

    // 模拟 select 反选事件
    if (onDeselect && !flag) {
      onDeselect(item.value || item)
    }
  }

  // 通过 optionList 来获取 item 的 label
  function getLabel(item) {
    let label
    options.forEach(curr => {
      const { label: currLabel } = curr
      if (curr.value === (item.value || item)) {
        label = currLabel
      }
    })
    return label
  }

  // 单个 checkBox 的渲染模板
  function checkBoxItemRender(item) {
    const label = getLabel(item);
    return (
      <div
        key={item.value || item}
        value={item.value || item}
        title={label}
        data={componentType === "select" ? item : undefined}
        label={label}
        className="field-item"
      >
        <Checkbox
          onChange={(e) => { handleChange(item, e.target.checked) }}
          checked={(selectValue || []).find(curr => curr === (item.value || item))}   // 在 selectValue 中就选中
        >
          {label}
        </Checkbox>
      </div>
    );
  }

  // 根据 输入值 筛选选项
  function handleFilterOptions(input) {
    const tempOptions = []
    options.forEach(item => {
      if(item.label.toLowerCase().indexOf(input.toLowerCase()) >= 0) {
        tempOptions.push(item)
      }
    })
    setFilterOptions(tempOptions)
  }

  return (
    <div className="custom-dropdown-wrap">
      {
        showSearch && (
          <div
            className="select-dropdown-title"
            style={{
              padding: "5px 16px 4px",
              borderBottom: "1px solid #f0f0f0",
            }}
            onKeyDown={e => e.stopPropagation()}
          >
            <Input
              prefix={<SearchSvg style={{ marginRight: 8 }} />}
              placeholder={messages('org.search' /* 搜索 */)}
              onChange={(e) => handleFilterOptions(e.target.value)}
              ref={searchInput}
              style={{
                padding: "4px 0",
                border: "none",
                outline: "none",
                boxShadow: "none",
              }}
            />
          </div>
        )
      }
      <div className="custom-popover-subtitle" style={{ color: "rgba(0, 0, 0, 0.25)" }}>
        {messages("base.count.items.selected" /* 已选 {count} 项 */, { count: (selectValue || []).length, total: Array.isArray(filterOptions) ? filterOptions.length : total})}
        {!!(selectValue || []).length && (
          <>
            <Divider type="vertical" />
            <a onClick={handleClearSelectedValue}>
              {messages('base.clear.selected' /* 清除已选 */)}
            </a>
          </>
        )}
      </div>  
      <Spin spinning={!!showPagination && loading}>
        <div className="custom-popover-content multipleSelect" ref={popoverContent}>
          {renderMultipleOptions()}
        </div>
      </Spin>
    </div>
  );
}
