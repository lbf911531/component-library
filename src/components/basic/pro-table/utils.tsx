import React from 'react';
import { Popover } from 'antd';
import moment from 'moment';
import { isEqual } from 'lodash';

const itemFormat = (col, result) => {
  if (result[col.id]) {
    if (col.type === 'date') {
      // eslint-disable-next-line no-param-reassign
      result[col.id] = moment(result[col.id]).format(col.searchFormat);
    }
  }
};

export const formatParams = (values, columns) => {
  const result = { ...values };
  columns.forEach((col) => {
    if (Array.isArray(col.items)) {
      col.items.forEach((item) => {
        itemFormat(item, result);
      });
    } else {
      itemFormat(col, result);
    }
  });
  return result;
};

export const getColumnsAndSearchForm = (params) => {
  const columns = [];
  const searchForm = [];
  if (Array.isArray(params)) {
    params.forEach((item, index) => {
      validateFiled(item, index);
      if (!item.hideInTable) {
        const col = setColumnsRender(item);
        columns.push(col);
      }
      if (!item.hideInSearch) {
        searchForm.push({
          ...item,
          label: item.label || item.title,
          id: item.id || item.dataIndex,
        });
      }
    });
  }
  return { columns, searchForm };
};

// 必须要的属性未传时，控制台抛出错误
const validateFiled = (item, index) => {
  const field = ['title', 'dataIndex', 'type'];
  const result = field.filter((o) => !item[o]);
  if (result.length) {
    console.error(`[${index + 1}]行：${result.join('、')} 字段不可为空`);
  }
  if (!item.type) {
    // eslint-disable-next-line no-param-reassign
    item.type = 'input';
  }
  if (item.type === 'items' && !item.items) {
    // eslint-disable-next-line no-param-reassign
    item.items = [];
    console.error(`[${index + 1}]行：type为items时items字段不可为空`);
  }
  if (['select'].includes(item.type) && !item.options) {
    // eslint-disable-next-line no-param-reassign
    item.options = [];
    console.error(`[${index + 1}]行：type为select时options字段不可为空`);
  }
};

// @ts-ignore
const { filterMoney } = React.Component.prototype;

export const setColumnsRender = (column) => {
  const col = column;
  if (!col.render) {
    const valueType =
      col.type !== 'items' ? col.type : (col.items[0] || {}).type;
    if (valueType === 'date') {
      col.render = (value) => {
        return value && moment(value).format(col.showFormat || 'YYYY-MM-DD');
      };
    } else if (valueType === 'inputNumber') {
      col.render = (value) => {
        const amount = filterMoney(value, col.precision || 2);
        return <Popover content={amount}>{amount}</Popover>;
      };
    }
  }
  return col;
};

// 保留select的options
export const combineSearchForm = (newSearchForm = [], oldSearchForm = []) => {
  return newSearchForm.map((item) => {
    const newItem = item;
    if (item.getUrl && item.options && !item.options.length) {
      const oldItem =
        oldSearchForm.find((old) => old.dataIndex === newItem.dataIndex) || {};
      if (
        oldItem.getUrl === newItem.getUrl &&
        isEqual(oldItem.getParams, newItem.getParams) &&
        oldItem.options &&
        oldItem.options.length
      ) {
        newItem.options = oldItem.options;
      }
    }
    return newItem;
  });
};
