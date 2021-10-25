/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-10-22 14:15:46
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-10-25 16:57:06
 * @Version: 1.0.0
 * @Description: 实现组件国际化，创建context，外接当前语言环境，并提供receiver组件获取环境
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */
import React from 'react';
import LocaleContext from './context';

/**
 * localeMap: {
 *  "zh_cn": {},
 *  "en_us": {},
 *  ...
 * }
 */
export interface Locale {
  locale: string;
  localeMap?: any;
}

export interface LocaleProviderProps {
  locale: Locale;
  children?: React.ReactNode;
}

export default class LocaleProvider extends React.Component<
  LocaleProviderProps,
  any
> {
  static defaultProps = {
    locale: {},
  };

  render() {
    const { locale, children } = this.props;
    if (locale?.locale)
      window.sessionStorage.setItem('cur_locale', locale.locale);
    return (
      <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
    );
  }
}
