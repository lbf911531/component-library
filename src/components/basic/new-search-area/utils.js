/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-05-20 12:00:42
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-11-01 14:19:15
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

export const getLastKey = (key) => {
  return key.split('.')[key.split('.').length - 1];
};
/**
 * 根据labelKey 从data 组合获取需要渲染的label值
 * @param {object} data
 * @param {string} keys
 * @returns string
 */
export function getDataLabel(data, keys) {
  let keyTemp = keys;
  let isMatch = false;
  keyTemp = keyTemp.replace(/\$\{(.*?)\}/g, ($1, $2) => {
    isMatch = true;
    return getValue(data, $2) || '';
  });

  if (isMatch) {
    return keyTemp;
  } else {
    return getValue(data, keyTemp) || '';
  }
}

/**
 * 获取data[key];
 * @param {object} data
 * @param {string} key
 * @returns string
 */
function getValue(data, key) {
  const result = JSON.stringify(data);
  // eslint-disable-next-line no-new-func
  return new Function(`try {return ${result}.${key} } catch(e) {}`)();
}

/**
 * 过滤空值
 * @param {object} values
 * @returns object
 */
export function handleFilterNullValue(values) {
  if (values) {
    const temp = {};
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        temp[key] = values[key];
      }
    });
    return temp;
  }
  return values;
}

/**
 * 0,false 算有值，undefined，null则返回false
 * @param {*} value
 * @returns
 */
export function haveAValue(value) {
  if (value) {
    return true;
  } else if (value === 0 || value === false) {
    return true;
  }
  return false;
}

/**
 * 校验value是否是数字
 * @param {string} value
 * @returns
 */
export function isNumber(value) {
  return /^-?[0-9]+(\.[0-9]+)?$/.test(value);
}

/**
 * 根据key从缓存中取key-value
 * @param {string} key
 * @returns ({
 *  defaultFlag = false, 判断是否有缓存值
 *  defaultSearchValue = {}, searchParams被处理后的 缓存的值（记录了下拉等特殊情况下的label和value）
 *  searchParams = {}, 缓存值，通过form.validateFieldsAndScroll获取的values
 *  fixedFieldIds = [], 固定字段
 *  lastSize, 缓存 table 单页展示量
 *  lastPage, 缓存 table 页码
 * })
 */
export function getCacheValueFromRedux(key) {
  if (!window.g_app) return {};
  const searchData = window.g_app._store.getState()?.search?.data || {};
  const { defaultSearchValue } = searchData[key] || {};
  const defaultFlag =
    defaultSearchValue && !!Object.keys(defaultSearchValue).length;
  return {
    defaultFlag,
    ...(searchData[key] || {}),
  };
}

export function convertUndefined(target) {
  const temp = {};
  Object.keys(target).forEach((key) => {
    if (target[key] === 'undefined') temp[key] = undefined;
    temp[key] = target[key];
  });
  return temp;
}

// 保留值为undefined的字段，转换
export function customStringify(target) {
  return JSON.stringify(target, (key, value) => {
    if (value === undefined) return null;
    return value;
  });
}

export function preventOpen(e) {
  e.preventDefault();
  e.stopPropagation();
}

export function hasValue(value) {
  if (Array.isArray(value) && value.length === 0) return false;
  if (value && value.constructor === Object && Object.keys(value).length === 0)
    return false;
  return !!value;
}
