/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-05-20 11:56:40
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-11-01 11:37:21
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */
import React from 'react';
import Lov from '@/components/form/lov';
import { messages } from 'utils/utils';
import { CaretDownOutlined } from '@ant-design/icons';
import CloseSvg from '../images/close';
import { getLastKey, hasValue } from '../utils';
import useWidthAdaptation from '../useWidth';

export default function CustomLov(props) {
  const { onChange, formItem, value } = props;
  const {
    disabled,
    listTitle,
    listType,
    code,
    extraParams,
    requestBody,
    clear,
    labelKey,
    valueKey,
    listExtraParams,
    single,
    selectorItem,
    method,
    searchList,
    searchListIndex,
    hideSearchList,
    type,
    allowClear,
    paramAsBody = false,
  } = formItem;

  function preSetValue() {
    // 只考虑lov，下拉框有下拉框自己的自适应，不需要走这里的逻辑
    if (value) {
      if (single) {
        if (Array.isArray(value)) {
          return value?.[0]?.[labelKey];
        } else if (value.constructor === Object) {
          return value?.[labelKey];
        }
      } else return `已选择${value.length}条`;
    } else return '';
  }

  const width = useWidthAdaptation(42, preSetValue(), 16);

  let extra = {};
  if (type === 'list') {
    extra = {
      listTitle,
      showClear: clear,
      lovType: 'chooser',
    };
  } else if (type === 'lov') {
    extra = {
      hideSearchList,
      allowClear: allowClear === undefined ? true : allowClear,
    };
  }

  return (
    <>
      <span className="label">{messages(formItem.label)}</span>
      {/* single-value 用于区分 多选下分页下拉和单选下分页下拉的样式： 此处有三种样式： lov的，单、多选下拉的 */}
      <div
        className={
          single || !hasValue(value)
            ? 'value lovValue single-value'
            : 'value lovValue multiple-value'
        }
      >
        <Lov
          dropdownMatchSelectWidth={200}
          {...extra}
          placeholder={messages('common.all')}
          disabled={disabled}
          code={type === 'list' ? listType : code}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          requestBody={requestBody}
          onChange={onChange}
          paramAsBody={paramAsBody}
          labelKey={getLastKey(labelKey)}
          valueKey={getLastKey(valueKey)}
          listExtraParams={listExtraParams || extraParams}
          selectorItem={selectorItem}
          single={single}
          method={method}
          searchList={searchList}
          searchListIndex={searchListIndex}
          value={value}
          inputStyle={{
            width,
            height: '22px',
            lineHeight: '22px',
            padding: '0 8px',
          }}
          suffixIcon={null}
          cusSuffixIcon={
            <CaretDownOutlined
              style={{
                fontSize: 10,
                color: '#333333',
                paddingRight: 12,
              }}
              className="caret-down"
            />
          }
          cusRemoveIcon={
            <CloseSvg
              style={{
                fontSize: 12,
                background: 'transparent',
                border: 'none',
                color: 'rgba(0, 0, 0, 0.25)',
              }}
            />
          }
          isSearchArea
          allowClear={allowClear}
          showLabel={formItem.showLabel}
          renderLabel={formItem.renderLabel}
          optionLabelProp={formItem.optionLabelProp}
        />
      </div>
    </>
  );
}
