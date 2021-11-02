/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-05-19 14:55:22
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-09-26 17:31:50
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */
import React from 'react';
import {
  Input,
  Select,
  Lov,
  Radio,
  Cascade,
  Switch,
  Checkbox,
  SelectPartLoad,
  TreeSelect,
  Month,
  RangePicker,
  YearPicker,
  ValueList,
  InputNumber,
  DatePicker,
  SelectWithSearch,
  TreeSelectModel,
} from './components';

function SearchFormItem(props) {
  const {
    formItem: { type },
  } = props;
  const componentMap = {
    input: Input,
    select: Select,
    inputNumber: InputNumber,
    cascader: Cascade,
    value_list: ValueList,
    month: Month,
    date: DatePicker,
    datePicker: RangePicker,
    rangePicker: RangePicker,
    rangeDateTimePicker: RangePicker,
    yearPicker: YearPicker,
    radio: Radio,
    big_radio: Radio,
    checkbox: Checkbox,
    combobox: SelectWithSearch,
    select_part_load: SelectPartLoad,
    list: Lov,
    lov: Lov,
    treeSelect: TreeSelect,
    switch: Switch,
    multiple: SelectWithSearch,
    tree_select_model: TreeSelectModel,
  };

  const Component = componentMap[type];
  if (Component) return <Component {...props} />;
  else return null;
}

export default SearchFormItem;
