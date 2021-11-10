/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-07-27 15:53:12
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-11-09 14:51:20
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

/**
 * 过滤掉 组件不支持的属性，避免控制台的warning
 * @param {*} props
 * @returns
 */
export function filterProps(props) {
  const {
    onSelectDataLoaded,
    onClickCell,
    afterBlur,
    cellStatusMap,
    cellKey,
    editWithCellFlag,
    dataIndex,
    labelKey,
    valueKey,
    valueMap,
    initialValue,
    getParams,
    getUrl,
    searchKey,
    filterData,
    ...rest
  } = props;
  return rest;
}

export function validation(rules, value) {
  if (!rules) return;
  if (!Array.isArray(rules)) return;
  if (Array.isArray(rules) && rules.length === 0) return;
  let message;
  /**
   * 针对rules中每个成员可能存在配置了多条校验规则的情况下：
   * 存在 所有的校验规则都需要执行一遍的可能，为避免不必要的方法执行
   * 判断如果 error为true了，则直接return，
   */
  rules.some((rule) => {
    let error = false;
    if ('required' in rule) {
      ({ error, message } = verifyValueIsRequired(rule, value));
      if (error) return true;
    }
    if ('pattern' in rule) {
      ({ error, message } = verifyValueByPattern(rule, value));
      if (error) return true;
    }
    if ('max' in rule) {
      ({ error, message } = verifyValueByMax(rule, value));
      if (error) return true;
    }
    if ('min' in rule) {
      ({ error, message } = verifyValueByMin(rule, value));
      if (error) return true;
    }
    if ('validator' in rule) {
      ({ error, message } = verifyValueByUserDefined(rule, value));
      if (error) return true;
    }
    if ('whitespace' in rule) {
      ({ error, message } = verifyValueByWhitespace(rule, value));
      if (error) return true;
    }
    return error;
  });
  return message;
}

/**
 * 判断是否有 transform
 */
function isExistTransform(rule, value) {
  return rule.transform && typeof rule.transform === 'function'
    ? rule.transform(value)
    : value;
}

/**
 * 必输校验
 * @param {*} rule
 * @param {*} value
 * @returns
 */
function verifyValueIsRequired(rule, value) {
  const target = isExistTransform(rule, value);
  if (
    rule.required &&
    (target === null || target === undefined || target === '')
  ) {
    return {
      error: true,
      message: rule.message,
    };
  }
  return { error: false };
}

/**
 * 正则校验
 * @param {*} rule
 * @param {*} value
 * @returns
 */
function verifyValueByPattern(rule, value) {
  const target = isExistTransform(rule, value);
  if (!(rule.pattern instanceof RegExp)) return { error: false };
  if (rule.pattern.test(target)) {
    return { error: false };
  } else
    return {
      error: true,
      message: rule.message,
    };
}

function isString(value) {
  return typeof value === 'string';
}

function isNumber(value) {
  return typeof value === 'number';
}

function isArray(value) {
  return Array.isArray(value);
}

/**
 * 最大长度校验
 * string 类型为字符串最大长度；number 类型时为最大值；array 类型时为数组最大长度
 * @param {*} rule
 * @param {*} value
 */
function verifyValueByMax(rule, value) {
  const target = isExistTransform(rule, value);
  const max = Number(rule.max);
  if (isString(target) || isArray(target)) {
    const error = target.length > max;
    return { error, message: error ? rule.message : undefined };
  } else if (isNumber(target)) {
    const error = target > max;
    return { error, message: error ? rule.message : undefined };
  } else {
    return { error: false, message: undefined };
  }
}

/**
 * 最小长度校验
 * string 类型为字符串最小长度；number 类型时为最小值；array 类型时为数组最小长度
 * @param {*} rule
 * @param {*} value
 */
function verifyValueByMin(rule, value) {
  const target = isExistTransform(rule, value);
  const min = Number(rule.min);
  if (isString(target) || isArray(target)) {
    const error = target.length < min;
    return { error, message: error ? rule.message : undefined };
  } else if (isNumber(target)) {
    const error = target < min;
    return { error, message: error ? rule.message : undefined };
  } else {
    return { error: false, message: undefined };
  }
}

/**
 * 空格校验
 * 如果字段仅包含空格则校验不通过，只在 type: 'string' 时生效
 * @param {*} rule
 * @param {*} value
 * @returns
 */
function verifyValueByWhitespace(rule, value) {
  const target = isExistTransform(rule, value);
  if (isString(target) && /^\s*$/.test(target)) {
    return { error: true, message: rule.message };
  }
  return { error: false };
}

function verifyValueByUserDefined(rule, value) {
  const errorMsg = { error: false };
  rule.validator(rule, value, (msg) => {
    errorMsg.error = !!msg;
    errorMsg.message = msg;
  });
  return errorMsg;
}
