---
nav:
  title: 组件
group:
  title: 表单
  path: /form
---

## 值列表选择 Lov

> 由 Select 及 ListSelector 组件组合而成，用于需要点击输入框，弹窗选择数据的场景

## 代码演示

```tsx
import React, { useState } from 'react';
import { Lov } from 'polard';

export default function LovDemo() {
  const [value, setValue] = useState(undefined);
  return (
    <Lov
      code="company"
      labelKey="name"
      valueKey="id"
      value={value}
      onChange={setValue}
    />
  );
}
```

## API

| 参数                        | 说明                                                                                                                                                               | 默认值                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| allowClear                  | boolean; 是否允许清除（为 true 时在 select 上会出现小 ×）                                                                                                          | true                      |
| placeholder                 | string; 文本提示                                                                                                                                                   | '请选择'                  |
| disabled                    | boolean;是否禁用                                                                                                                                                   | false                     |
| extraParams/listExtraParams | object, 弹框接口额外参数                                                                                                                                           | {}                        |
| single                      | boolean; 是否单选弹窗中的值                                                                                                                                        | false                     |
| onChange                    | 弹窗中确定事件，回调抛出选择的值                                                                                                                                   | value => {}               |
| labelKey                    | string; 单选时指定 select 上展示的文本从 value 中的哪个字段获取                                                                                                    | -                         |
| value                       | 值                                                                                                                                                                 | -                         |
| selectedData                | 弹窗配置                                                                                                                                                           | -                         |
| hideColumns                 | 用于隐藏列表中不需要展示的列                                                                                                                                       | []                        |
| hideSearchList              | 用于隐藏搜索区中不需要展示的搜索表单                                                                                                                               | []                        |
| valueKey                    | 指定弹窗行数据的 rowKey 取行数据中字段为 valueKey 值的值                                                                                                           | -                         |
| code                        | lov 的 Code，来自 lov 管理                                                                                                                                         | -                         |
| title                       | 弹窗的 title                                                                                                                                                       | -                         |
| showDetail                  | 弹窗中是否要以 tag 形式展示已选值                                                                                                                                  | true                      |
| twiceSearchFlag             | 弹窗搜索时是否要过滤空值                                                                                                                                           | false                     |
| lovType                     | lov 的类型是 lov 还是 chooser（chooser 并入 lov 组件，但传值需要兼容）或 listSelector                                                                              | 'lov'                     |
| cancelDoubleClick           | 取消行数据双击自动选中事件 (双击自动选中（单选情况下）)                                                                                                            | false                     |
| selectorItem                | 支持从外部定义弹窗的搜索区，列表区，url，key，调用接口的 method                                                                                                    | -                         |
| searchList                  | 支持从外部传入，该数组将与外部传入的 selectorItem 或接口获取的 selectorItem 中的 searchForm 数组合并                                                               | -                         |
| columnsList                 | 支持重写 columns 数组中的成员，原有在 columns 里的会以 columnsList 为主，覆写掉，在 columnsList 而不在原 columns 里的会添加到 columns 数组里，与 searchList 的一致 | -                         |
| hideRowSelect               | 是否隐藏行勾选(原 list-selector 组件支持的东西)                                                                                                                    | false                     |
| hideFooter                  | 是否隐藏底部按钮                                                                                                                                                   | false                     |
| diyFooter                   | 是否在隐藏底部按钮后添加一个返回按钮                                                                                                                               | false                     |
| onReturn                    | 隐藏底部按钮后添加的返回按钮绑定的事件                                                                                                                             | () => {}                  |
| onRowMouseEnter             | 鼠标移出行事件                                                                                                                                                     | (record,index,e) => {}    |
| onRowMouseEnter             | 鼠标移入行事件                                                                                                                                                     | (record,index,e) => {}    |
| isPage                      | 是否后端分页                                                                                                                                                       | true                      |
| paramAsBody                 | 搜索区参数是否放入请求体                                                                                                                                           | false                     |
| isRenderSelect              | columns 配置为两列时是否要渲染下拉组件                                                                                                                             | true                      |
| showLabel                   | 自定义下拉框展示的 label 字段                                                                                                                                      | null,可取值"code"，"name" |

## 提示

1. lov 组件为了兼容 chooser，需要额外添加 lovType 属性，默认为`lov`，只有将 chooser 组件改为 lov 组件时，lovType 才需要设置为 `chooser`,另外 listSelector 组件也可使用本组件下的 list-selector,只需要将 lovType 设置为`listSelector`即可
2. 默认情况下需要使用`code`去调接口获取弹窗配置信息，但由于目前 弹窗搜索区只支持`输入框`,因此将 `selectorItem` 抛出，可由外部传入

## 示例

```ts
  <Lov
    code="company"
    labelKey="name"
    valueKey="id"
    value={value}
  />
  // -------------
  <Lov
    selectorItem={selectorItem}
    valueKey="id"
    labelKey="name"
    value={value}
    single
    lovType="chooser"
  />
  // ---------------------
  const selectorItem = {
      title: 'chooser.data.selectPerson',
      url: `${config.baseUrl}/api/user/search/all`,
      searchForm: [
        {
          type: 'input',
          id: 'keyword',
          label: '用户名、名称、邮箱、手机号',
        },
      ],
      columns: [
        {
          title: '用户代码',
          dataIndex: 'userCode',
          width: 100,
          tooltips: true,
        },
        {
          title: '用户名称',
          dataIndex: 'userName',
          width: 100,
          tooltips: true,
        },
      ],
      key: 'id',
    }
   <Lov
      selectorItem={selectorItem}
      labelKey="${userCode}-${userName}"
      valueKey="id"
      listExtraParams={{ ignoreUserId: user.id }}
      single
      placeholder="请选择"
      searchList={[
        {
          type: 'input',
          id: 'userName',
          label: '用户名',
        },
        {
          type: 'select',
          id: 'status',
          label: '状态',
          options: [{label: '启用', value: true},{label: '禁用', value: false}]
        }
      ]}
      columnsList={[{dataIndex: 'userCode',title: "用户代码", render: (value) => 123}]}
    />


   list-selector:

   import ListSelector from 'components/common/lov/list-selector';

   <ListSelector
    visible={addCenterVisible}
    selectorItem={addCenterItem}
    onOk={this.handleAddCenter}
    labelKey={''}
    valueKey={'id'}
    selectedData={selectedData} // 或者下方 value={selectedData}
    // value={selectedData}
    onCancel={() => this.addResponsibility(false)}
    showSelectTotal={true}
    single={false}
    lovType="listSelector"
  />

   <ListSelector
    visible={addCenterVisible}
    code="company_lov"
    onOk={this.handleAddCenter}
    labelKey='name'
    valueKey='id'
    selectedData={selectedData} // 或者下方 value={selectedData}
    // value={selectedData}
    onCancel={() => this.addResponsibility(false)}
    showSelectTotal={true}
    single={false}
    lovType="listSelector"
  />
```

```text
ps: chooser组件替换为lov组件，lov组件上添加lovType属性，值为chooser，然后如果有type的统一更换后端重订的code，code找后端要文档，如果是selectorItem，定义在本页面的可以保留，这样改动小一点。listSelector同样的修改方式，只是注意lovType值为listSelector
```

---

## ListSelector

ListSelector 组件与 Lov 组件用法基本一致；但其仅仅是一个弹窗组件，窗口的显隐完全由外部自行控制

## 更新日志

1.原 lov 渲染列表时，若列表仅两列数据，则改为渲染分页下拉框，所有与分页下拉框有关用法，可参照分页下拉组件 API，
但整体流程与使用 lov 一致，即`valueKey,labeKey,返回值,默认值`, 2.增加`isRenderSelect`，可由外界决定是否要将两列列表改为下拉框渲染模式
