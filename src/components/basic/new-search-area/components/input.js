/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-05-19 15:13:57
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-11-04 16:36:42
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import React from 'react';
import { Input } from 'antd';
import { messages } from '../../../utils';
import LanguageInput from '../../../form/input-language';
import useWidthAdaptation from '../useWidth';

function CustomInput(props) {
  const { formItem, eventHandle, onChange, onSearch, value } = props;
  const { disabled, isPopconfirmFlag, language, name, nameI18n, event, label } =
    formItem;

  const width = useWidthAdaptation(64, value);

  if (language) {
    return (
      <LanguageInput
        name={name}
        i18nName={nameI18n}
        nameChange={(languageValue, i18nName) =>
          eventHandle(event, { name: languageValue, i18nName })
        }
        disabled={disabled}
        onPressEnter={isPopconfirmFlag ? undefined : onSearch}
      />
    );
  }

  function dynamicChangeSize(e, ...args) {
    onChange(e, ...args);
  }

  return (
    <>
      <span className="label">{messages(label)}</span>
      {/* <div style={{ position: "absolute", zIndex: "-500", padding: "0 11px", visibility: "hidden" }}>{value}</div> */}
      <Input
        placeholder={messages('common.please.enter...' /* 请输入... */)}
        onChange={dynamicChangeSize}
        disabled={disabled}
        autoComplete="off"
        onPressEnter={isPopconfirmFlag ? undefined : onSearch}
        style={{ width }}
        title={value}
        value={value}
        className="value inputValue"
      />
    </>
  );
}

export default CustomInput;
