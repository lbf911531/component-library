import React from 'react';
import BigNumber from 'bignumber.js';

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
 * @returns
 */
export function messages(title) {
  return title;
}
