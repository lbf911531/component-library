---
nav:
  title: 组件
group:
  title: 基础
  path: /basic
---

## 搜索组件 SearchArea

- SearchArea 组件默认一行四列展示表单项
- 如需将 SearchArea 组件用于弹窗中，建议引用`SearchAreaLov`组件，该组件默认一行两列，且支持配置各表单项及操作按钮分别占当前行的比例（由于历史原因，后续考虑将二者合并成一个组件）

## 代码演示

### 普通页的搜索组件

```tsx
import React, { useState, useRef } from 'react';
import { SearchArea } from 'polard';

export default function SearchAreaDemo() {
  const searchRef = useRef();
  const [searchForm, setSearchForm] = useState([
    {
      type: 'input',
      id: 'code',
      label: '代码',
      event: 'CODE',
    },
    {
      type: 'input',
      id: 'name',
      label: '名称',
    },
    {
      type: 'lov',
      id: 'companyId',
      label: '公司',
      code: 'company',
      valueKey: 'id',
      labelKey: 'name',
      single: true,
      placeholder: '请选择',
    },
    {
      type: 'select',
      colSpan: 6,
      id: 'enabled',
      label: '状态',
      options: [
        { label: '启用', value: true },
        { label: '禁用', value: false },
      ],
      event: 'STATUS',
    },
  ]);

  function handleSearch(params) {
    console.log('搜索区值集：', params);
  }

  function handleClear() {
    // 无业务需求可以不声明
  }

  function listenValueChange(event, value) {
    if (event === 'CODE') {
      console.log(searchRef, 's');
      searchRef.current.setValues({
        name: value,
      });
    } else if (event === 'STATUS') {
      searchForm[0].disabled = value === 'true';
      setSearchForm([...searchForm]);
    }
  }

  return (
    <SearchArea
      searchForm={searchForm}
      submitHandle={handleSearch}
      clearHandle={handleClear}
      eventHandle={listenValueChange}
      wrappedComponentRef={searchRef}
    />
  );
}
```

### 弹窗中的搜索组件

```tsx
import React, { useState, useRef } from 'react';
import { SearchAreaLov } from 'polard';

export default function SearchAreaLovDemo() {
  const searchRef = useRef();
  const [searchForm, setSearchForm] = useState([
    {
      type: 'input',
      id: 'code',
      label: '代码',
      event: 'CODE',
      span: 6,
    },
    {
      type: 'input',
      id: 'name',
      label: '名称',
      span: 6,
    },
    {
      type: 'lov',
      id: 'companyId',
      label: '公司',
      code: 'company',
      valueKey: 'id',
      labelKey: 'name',
      single: true,
      placeholder: '请选择',
      span: 10,
    },
    {
      type: 'select',
      span: 6,
      id: 'enabled',
      label: '状态',
      options: [
        { label: '启用', value: true },
        { label: '禁用', value: false },
      ],
      event: 'STATUS',
    },
  ]);

  function handleSearch(params) {
    console.log('搜索区值集：', params);
  }

  function handleClear() {
    // 无业务需求可以不声明
  }

  function listenValueChange(event, value) {
    if (event === 'CODE') {
      console.log(searchRef, 's');
      searchRef.current.setValues({
        name: value,
      });
    } else if (event === 'STATUS') {
      searchForm[0].disabled = value === 'true';
      setSearchForm([...searchForm]);
    }
  }

  return (
    <SearchAreaLov
      searchForm={searchForm}
      submitHandle={handleSearch}
      clearHandle={handleClear}
      eventHandle={listenValueChange}
      wrappedComponentRef={searchRef}
      btnCol={10}
    />
  );
}
```

## API

| 参数             | 说明                                                                                        | 类型                                                         | 默认值 |
| ---------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------ |
| searchForm       | 传入的表单列表                                                                              | 必输，Array<[searchFormItem](#search-area-form-item-config)> | []     |
| submitHandle     | 搜索事件                                                                                    | function(values)                                             | -      |
| eventHandle      | 表单项值改变事件，一般用于联动                                                              | function(eventType, value)                                   | -      |
| clearHandle      | 重置事件                                                                                    | function()                                                   | -      |
| okText           | 左侧 ok 按钮的文本                                                                          | string                                                       | -      |
| clearText        | 右侧重置按钮的文本                                                                          | string                                                       | -      |
| defaultLength    | 搜索区域默认展示的最大表单数量                                                              | number                                                       | 3      |
| defaultSpan      | 默认搜索项对应 Col 的 span                                                                  | number                                                       | 6      |
| formLayout       | 同表单 formLayout                                                                           | object { labelCol: { span: 6 }, wrapperCol: { span: 15 } }   |
| loading          | 用于 base-info 组件的保存按钮                                                               | boolean                                                      | -      |
| isExtraFields    | 是否添加额外的自定义搜索参数                                                                | boolean                                                      | -      |
| extraFields      | 额外的搜索配置:自己传入节点，不过加了额外的搜索，主要在外面的 submitHandle 函数里面进行接收 | array                                                        | -      |
| isHideClearText  | 是否隐藏清空按钮                                                                            | boolean                                                      | -      |
| isHideOkTextText | 是否隐藏搜索按钮                                                                            | boolean                                                      | -      |
| onRef            | ref 调用子组件函数或者值                                                                    | function(this)                                               | -      |
| isReturnLabel    | 用于数据缓存                                                                                | boolean                                                      | -      |
| searchCodeKey    | 搜索区数据以对象形式存放到 redux 中,codeKey 表示对象的属性,建议用页面代码，具唯一性         | string                                                       | -      |
| btnCol           | 设置操作栏栅格布局所占栅格数                                                                | number                                                       | -      |

### <a id="search-area-form-item-config">searchFormItem</a>

| 参数                | 类型                    | 说明                                                                                                                                           |
| ------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| type                | string                  | 必填，类型,为 input、inputNumber、select、cascader、 date、radio、big_radio、checkbox、combobox、multiple、 list、 items、 value_list 中的一种 |
| id                  | string                  | 必填，表单 id，搜索后返回的数据 key                                                                                                            |
| placeholder         | string                  | 可选，表单 placeholder                                                                                                                         |
| label               | string                  | 必填，界面显示名称 label                                                                                                                       |
| listType            | string                  | 可选，当 type 为 list、selput，listSelector 的 type 类型                                                                                       |
| listExtraParams     | string                  | 可选，当 type 为 list、selput 时有效，listSelector 的 extraParams                                                                              |
| disabled            | false                   | 可选，是否可用                                                                                                                                 |
| isRequired          | false                   | 可选，是否必填                                                                                                                                 |
| options             | [{label '', value: ''}] | 可选，如果不为 input、date 时必填，为该表单选项数组，因为不能下拉刷新，所以如果可以搜索 type 请选择 combobox 或 multiple，否则一次性传入所有值 |
| selectorItem        | {}                      | 可选，当 type 为 list、selput 时有效，当 listType 满足不了一些需求时，可以使用次参数传入 listSelector 的配置项                                 |
| event               | string                  | 可选，自定的 onChange 事件 ID，将会在 eventHandle 回调内返回                                                                                   |
| defaultValue        | string                  | 可选，默认值，如果 type 为 select 且 options 为空时，可传入 string 或 object({label, key})的初始值                                             |
| searchUrl           | string                  | 可选，当类型为 combobox 和 multiple 有效，搜索需要的接口                                                                                       |
| getUrl              | string                  | 可选，初始显示的值需要的接口,适用与 select、multiple、combobox                                                                                 |
| method              | string                  | 可选，getUrl 接口所需要的接口类型 get/post                                                                                                     |
| searchKey           | string                  | 可选，搜索参数名                                                                                                                               |
| labelKey            | string                  | 可选，接口返回或 list 返回的数据内所需要页面 options 显示名称 label 的参数名                                                                   |
| valueKey            | string                  | 可选，接口返回或 list 返回的数据内所需要 options 值 key 的参数名, 或 selput 内回填的参数名                                                     |
| items               | searchFormItem 的数组   | 可选，当 type 为 items 时必填，type 为 items 时代表在一个单元格内显示多个表单项，数组元素属性与以上一致                                        |
| entity              | false                   | 已禁用，select、combobox、multiple、list 选项下是否返回实体类，如果为 true 则返回整个选项的对象，否则返回 valueKey 对应的值                    |
| getParams           | {}                      | 可选,getUrl 所需要的参数                                                                                                                       |
| single              | false                   | 可选,当 type 为 list 时是否为单选                                                                                                              |
| valueListCode       | string                  | 可选，当 type 为 value_list 时的值列表 code                                                                                                    |
| colSpan             | string                  | 可选，自定义搜索项的宽度                                                                                                                       |
| renderOption        | (option) => {}          | 可选，当类型为 select、coombobox、multiple、value_list 时选项 option 的渲染规则                                                                |
| listKey             | string                  | 可选，getUrl 接口返回值内的变量名，如果接口直接返回数组则置空                                                                                  |
| childrenMultipleKey | string                  | 可选，是否递归遍历子对象                                                                                                                       |
| showTime            | boolean                 | 可选，当 type 为 date 时，控制是否需要选择时间 ,默认 false                                                                                     |
| allowClear          | boolean                 | 可选，是否允许清除,默认为 true                                                                                                                 |
| span                | number                  | 设置表单项栅格布局所占栅格数,仅用于`SearchAreaLov`组件,默认值为 8                                                                              |

## SearchAreaLov

- 属性同 SearchArea，一些属性的默认值不同
  | 属性 | 默认值 |
  | ---- | ----- |
  | defaultSpan | 8 |
  | maxLength(同 defaultLength) | 2 |
  | formLayout | { labelCol: { span: 5 }, wrapperCol: { span: 17 } } |
