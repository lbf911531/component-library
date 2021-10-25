import React from 'react';
import BigNumber from 'bignumber.js';
import ImageIcon from '@/assets/image.png';
import PptIcon from '@/assets/ppt.png';
import WordIcon from '@/assets/word.png';
import ExcelIcon from '@/assets/excel.png';
import PdfIcon from '@/assets/pdf.png';
import UnknownIcon from '@/assets/unknown.jpg';
import PackageIcon from '@/assets/package.jpg';

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

// @ts-ignore
React.Component.prototype.$t = messages;

/**
 * 根据文件名 后缀 判断文件类型，返回对应icon,
 * title 文件名
 * canPreviewFile: true/false  判断是否为 可预览文件
 */
export const getImgIcon = (title = '', canPreviewFile) => {
  const fileType = title.split('.').pop().toLowerCase();
  const ppt = ['ppt', 'pptx'];
  const imgs = ['png', 'jpg', 'bmp', 'jpeg', 'gif', 'svg'];
  const docs = ['doc', 'docx'];
  const excels = ['xlsx'];
  const pdf = ['pdf'];
  const packages = ['zip', 'rar'];
  if (canPreviewFile) {
    return [...ppt, ...imgs, ...docs, ...excels, ...pdf, 'zip', 'ofd'].includes(
      fileType,
    );
  }
  if (ppt.includes(fileType)) {
    return PptIcon;
  } else if (imgs.includes(fileType)) {
    return ImageIcon;
  } else if (docs.includes(fileType)) {
    return WordIcon;
  } else if (excels.includes(fileType)) {
    return ExcelIcon;
  } else if (pdf.includes(fileType)) {
    return PdfIcon;
  } else if (packages.includes(fileType)) {
    return PackageIcon;
  } else {
    return UnknownIcon;
  }
};

/**
 * 多语言
 * @param title
 * @param config： { params, context }
 * @returns
 */
export interface IConfig {
  params?: any;
  context: {
    locale: string;
    localeMap?: any;
  };
}
export function messages(title: string, config?: IConfig): string {
  if (!config) return title;

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
  const lang = lastLocaleMap[context.locale]?.[title];
  console.log('locale:', context.locale);
  if (!lang) return title;
  if (params) {
    return lang.replace(/\{(.+?)\}/g, ($1, $2) => params[$2]);
  }
  return lang;
}
