/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-05-20 15:46:05
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-11-04 16:37:32
 * @Version: 1.0.0
 * @Description: 分页下拉框
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import React from 'react';
import { CaretDownOutlined } from '@ant-design/icons';
import SelectPartLoad from '../../../form/select-part-load';
import { messages } from '../../../utils';
import CloseSvg from '../images/close';

export default function CustomSelectPartLoad(props) {
  const { onChange, value, formItem } = props;
  const {
    labelInValue,
    allowClear,
    getUrl,
    getParams,
    renderOptions,
    labelKey,
    valueKey,
    searchKey,
    defaultGetList,
    forceGetList,
    disabled,
    mode,
  } = formItem;

  return (
    <>
      <span className="label">{messages(formItem.label)}</span>
      <span
        className={
          mode !== 'multiple'
            ? 'value lovValue single-value'
            : 'value lovValue multiple-value'
        }
      >
        <SelectPartLoad
          value={value}
          labelInValue={labelInValue}
          allowClear={allowClear === undefined ? true : allowClear}
          placeholder={messages('common.all')}
          url={getUrl}
          params={getParams}
          renderOptions={renderOptions}
          labelKey={labelKey}
          valueKey={valueKey}
          searchKey={searchKey}
          defaultGetList={defaultGetList}
          forceGetList={forceGetList}
          disabled={disabled === undefined ? false : disabled}
          lazyLoad
          showPagination={false} // 分页并且每次都加载下一页都数据补充到原本到option中
          onChange={onChange}
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
        />
      </span>
    </>
  );
}
