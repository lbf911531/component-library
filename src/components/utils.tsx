import React from 'react';
import BigNumber from 'bignumber.js';

import zhCN from './locale-language/zh_CN';
import enUS from './locale-language/en_US';

const defaultLocaleMap = {
  zh_cn: zhCN,
  en_us: enUS,
};

/**
 * 金额格式化
 * @param moneys
 * @param limit
 * @param isString
 * @param isNumber
 * @returns
 */
export function formatMoney(
  moneys,
  limit = 2,
  isString = false,
  isNumber = false,
) {
  let fixed = limit;
  let money = moneys;
  if (typeof fixed !== 'number') fixed = 2;
  money = new BigNumber(money || 0).toFixed(fixed);
  let numberString = '';
  if (money.indexOf('.') > -1) {
    const integer = money.split('.')[0];
    const decimals = money.split('.')[1];
    numberString = `${integer.replace(
      /(\d)(?=(\d{3})+(?!\d))/g,
      isNumber ? '$1' : '$1,',
    )}.${decimals}`;
  } else {
    numberString = money.replace(
      /(\d)(?=(\d{3})+(?!\d))\./g,
      isNumber ? '$1' : '$1,',
    );
  }
  numberString += numberString.indexOf('.') > -1 ? '' : '.00';
  if (isString === true) {
    return numberString;
  } else {
    return <span className="money-cell">{numberString}</span>;
  }
}

/**
 * 多语言
 * @param title
 * @param config： { params, context }
 * @returns
 */
export interface IConfig {
  params?: {
    [key: string]: any;
  };
  context: {
    locale: string;
    localeMap?: {
      [key: string]: any;
    };
  };
}

export function messages(title: string, config?: IConfig): string {
  // 从session中取，是为了兼容调用messages方法在没有params时可以不必传递config
  const locale = window.sessionStorage.getItem('cur_locale');
  if (!config && !locale) return title;

  const {
    params,
    context = {
      locale: 'zh_cn',
      localeMap: defaultLocaleMap,
    },
  } = config;
  // 合并外界传入的，
  const lastLocaleMap = {
    ...defaultLocaleMap,
    ...context.localeMap,
  };
  const lang = lastLocaleMap[locale || context.locale]?.[title];
  console.log('locale:', context.locale, locale);
  if (!lang) return title;
  if (params) {
    return lang.replace(/\{(.+?)\}/g, ($1, $2) => params[$2]);
  }
  return lang;
}
